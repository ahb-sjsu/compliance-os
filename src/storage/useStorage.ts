import { useContext } from 'react';
import { StorageCtx } from './storageCtx';

export function useStorage() {
  const ctx = useContext(StorageCtx);
  if (!ctx) throw new Error('useStorage must be used within StorageContextProvider');
  return ctx;
}
