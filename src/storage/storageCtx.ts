import { createContext } from 'react';
import type { AppData, StorageProvider } from './types';

export interface StorageContextValue {
  provider: StorageProvider;
  save: (data: AppData) => void;
  load: () => Promise<AppData | null>;
  setProvider: (p: StorageProvider) => void;
}

export const StorageCtx = createContext<StorageContextValue | null>(null);
