import { useContext } from 'react';
import { UsersCtx } from './context';

export function useUsers() {
  const ctx = useContext(UsersCtx);
  if (!ctx) throw new Error('useUsers must be used within UsersProvider');
  return ctx;
}
