import type { AppData, StorageProvider } from './types';
import { getMasterKey, encrypt, decrypt, isCryptoAvailable } from '../security/crypto';

const LS_KEY = 'complianceos_v2_enc';
const LS_KEY_LEGACY = 'complianceos_v2_data';

export class LocalStorageProvider implements StorageProvider {
  async isAvailable(): Promise<boolean> {
    try {
      localStorage.setItem('__test', '1');
      localStorage.removeItem('__test');
      return true;
    } catch {
      return false;
    }
  }

  async load(): Promise<AppData | null> {
    try {
      // Try encrypted data first
      if (isCryptoAvailable()) {
        const enc = localStorage.getItem(LS_KEY);
        if (enc) {
          const key = await getMasterKey();
          const json = await decrypt(enc, key);
          return JSON.parse(json);
        }
      }

      // Fall back to legacy unencrypted data (migrate on next save)
      const raw = localStorage.getItem(LS_KEY_LEGACY);
      if (raw) {
        const data = JSON.parse(raw) as AppData;
        // Migrate: encrypt and save, then remove legacy key
        if (isCryptoAvailable()) {
          await this.save(data);
          localStorage.removeItem(LS_KEY_LEGACY);
        }
        return data;
      }

      return null;
    } catch {
      return null;
    }
  }

  async save(data: AppData): Promise<void> {
    try {
      if (isCryptoAvailable()) {
        const key = await getMasterKey();
        const payload = await encrypt(JSON.stringify(data), key);
        localStorage.setItem(LS_KEY, payload);
      } else {
        // Fallback for environments without SubtleCrypto (e.g., HTTP, not HTTPS)
        localStorage.setItem(LS_KEY_LEGACY, JSON.stringify(data));
      }
    } catch {
      // Storage full or crypto failure — silent
    }
  }
}
