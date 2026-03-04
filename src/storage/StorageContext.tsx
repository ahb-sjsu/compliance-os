import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import type { AppData, StorageProvider } from './types';
import { LocalStorageProvider } from './LocalStorageProvider';
import { StorageCtx } from './storageCtx';

const DEBOUNCE_MS = 2000;
const LS_FLUSH_KEY = 'complianceos_v2_data';

export function StorageContextProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<StorageProvider>(() => new LocalStorageProvider());
  const timerRef = useRef<number | null>(null);
  const pendingRef = useRef<AppData | null>(null);

  const flushSave = useCallback(async () => {
    if (pendingRef.current) {
      try {
        await provider.save(pendingRef.current);
      } catch (err) {
        console.error('Storage save failed:', err);
      }
      pendingRef.current = null;
    }
  }, [provider]);

  const save = useCallback(
    (data: AppData) => {
      pendingRef.current = data;
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(flushSave, DEBOUNCE_MS);
    },
    [flushSave],
  );

  // Flush on page unload
  useEffect(() => {
    const onBeforeUnload = () => {
      if (pendingRef.current) {
        try {
          localStorage.setItem(LS_FLUSH_KEY, JSON.stringify(pendingRef.current));
        } catch {
          /* noop */
        }
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  const load = useCallback(async () => {
    return provider.load();
  }, [provider]);

  return <StorageCtx.Provider value={{ provider, save, load, setProvider }}>{children}</StorageCtx.Provider>;
}
