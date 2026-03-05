import type { AppData, StorageProvider } from './types';
import { getMasterKey, encrypt, decrypt, isCryptoAvailable } from '../security/crypto';

const DATA_FILENAME = 'complianceos-data.enc';

export class GoogleDriveStorage implements StorageProvider {
  private getAccessToken: () => string | null;

  constructor(getAccessToken: () => string | null) {
    this.getAccessToken = getAccessToken;
  }

  async isAvailable(): Promise<boolean> {
    return !!this.getAccessToken();
  }

  async load(): Promise<AppData | null> {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const listRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${DATA_FILENAME}'&fields=files(id,name)`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const list = await listRes.json();
      if (!list.files?.length) return null;

      const fileId = list.files[0].id;
      const contentRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await contentRes.text();

      // Decrypt if crypto is available and payload looks encrypted (contains a dot separator)
      if (isCryptoAvailable() && payload.includes('.') && !payload.startsWith('{')) {
        const key = await getMasterKey();
        const json = await decrypt(payload, key);
        return JSON.parse(json);
      }

      // Legacy unencrypted JSON
      return JSON.parse(payload);
    } catch {
      // Silent failure — caller handles null
      return null;
    }
  }

  async save(data: AppData): Promise<void> {
    const token = this.getAccessToken();
    if (!token) throw new Error('Not authenticated');

    try {
      // Encrypt data before upload
      let body: string;
      let contentType: string;
      if (isCryptoAvailable()) {
        const key = await getMasterKey();
        body = await encrypt(JSON.stringify(data), key);
        contentType = 'application/octet-stream';
      } else {
        body = JSON.stringify(data);
        contentType = 'application/json';
      }

      const listRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${DATA_FILENAME}'&fields=files(id)`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const list = await listRes.json();

      if (list.files?.length) {
        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${list.files[0].id}?uploadType=media`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': contentType },
          body,
        });
      } else {
        const metadata = { name: DATA_FILENAME, parents: ['appDataFolder'] };
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', new Blob([body], { type: contentType }));
        await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
      }
    } catch {
      throw new Error('Google Drive save failed');
    }
  }
}
