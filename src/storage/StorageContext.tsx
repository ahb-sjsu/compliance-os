import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import type { AppData, StorageProvider } from './types';
import { LocalStorageProvider } from './LocalStorageProvider';
import { StorageCtx } from './storageCtx';

const DEBOUNCE_MS = 2000;

export function StorageContextProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<StorageProvider>(() => new LocalStorageProvider());
  const timerRef = useRef<number | null>(null);
  const pendingRef = useRef<AppData | null>(null);

  const flushSave = useCallback(async () => {
    if (pendingRef.current) {
      try {
        await provider.save(pendingRef.current);
      } catch {
        // Storage save failed silently — data stays in memory
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

  // Flush on page unload — use synchronous encrypted save via navigator.sendBeacon
  // as a best-effort. The debounced save will have already written most data.
  useEffect(() => {
    const onBeforeUnload = () => {
      if (pendingRef.current && timerRef.current !== null) {
        clearTimeout(timerRef.current);
        // Trigger an immediate async save — browser gives us ~2 seconds
        provider.save(pendingRef.current).catch(() => {});
        pendingRef.current = null;
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [provider]);

  const load = useCallback(async () => {
    return provider.load();
  }, [provider]);

  return <StorageCtx.Provider value={{ provider, save, load, setProvider }}>{children}</StorageCtx.Provider>;
}
