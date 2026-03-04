import type { Vendor, AuditEntry } from '../types/vendor';
import type { AppSettings } from '../types/settings';
import type { FrameworkNotes } from '../types/framework';

export interface AppData {
  vendors: Vendor[];
  globalAudit: AuditEntry[];
  fwNotes: Record<string, FrameworkNotes>;
  settings: AppSettings;
  version: number;
}

export interface StorageProvider {
  save(data: AppData): Promise<void>;
  load(): Promise<AppData | null>;
  isAvailable(): Promise<boolean>;
}
