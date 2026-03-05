import { createContext } from 'react';
import type { Role } from '../constants/roles';
import type { UserRecord } from '../types/user';

export interface UsersContextValue {
  /** All registered users */
  users: UserRecord[];
  /** Current user's role (null if not registered) */
  currentRole: Role | null;
  /** Current user's record */
  currentUser: UserRecord | null;
  /** Add or update a user (admin only) */
  setUserRole: (email: string, role: Role) => void;
  /** Remove a user (admin only) */
  removeUser: (email: string) => void;
  /** Whether the current user is registered */
  isRegistered: boolean;
}

export const UsersCtx = createContext<UsersContextValue | null>(null);
