import type { AppData, StorageProvider } from './types';

const LS_KEY = 'complianceos_v2_data';

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
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  async save(data: AppData): Promise<void> {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {
      console.warn('LocalStorage save failed — storage may be full');
    }
  }
}
