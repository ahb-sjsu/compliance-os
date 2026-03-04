import type { AppData, StorageProvider } from './types';

const DATA_FILENAME = 'complianceos-data.json';

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
      return contentRes.json();
    } catch (err) {
      console.error('Google Drive load failed:', err);
      return null;
    }
  }

  async save(data: AppData): Promise<void> {
    const token = this.getAccessToken();
    if (!token) throw new Error('Not authenticated');

    try {
      const listRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${DATA_FILENAME}'&fields=files(id)`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const list = await listRes.json();
      const body = JSON.stringify(data);

      if (list.files?.length) {
        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${list.files[0].id}?uploadType=media`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body,
        });
      } else {
        const metadata = { name: DATA_FILENAME, parents: ['appDataFolder'] };
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', new Blob([body], { type: 'application/json' }));
        await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
      }
    } catch (err) {
      console.error('Google Drive save failed:', err);
      throw err;
    }
  }
}
