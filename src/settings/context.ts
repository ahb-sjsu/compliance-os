import { createContext } from 'react';
import type { AppSettings } from '../types/settings';

export interface SettingsContextValue {
  settings: AppSettings;
  update: (patch: Partial<AppSettings>) => void;
  reset: () => void;
}

export const SettingsCtx = createContext<SettingsContextValue | null>(null);
