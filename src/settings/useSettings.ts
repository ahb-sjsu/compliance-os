import { useContext } from 'react';
import { SettingsCtx } from './context';

export function useSettings() {
  const ctx = useContext(SettingsCtx);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
