import { useState, useCallback, type ReactNode } from 'react';
import { UsersCtx } from './context';
import { useAuth } from '../auth/useAuth';
import { nowTs } from '../helpers/dates';
import type { Role } from '../constants/roles';
import type { UserRecord } from '../types/user';

const LS_KEY = 'complianceos_users';

function loadUsers(): UserRecord[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as UserRecord[];
  } catch {
    // Corrupted data — start fresh
  }
  return [];
}

function persistUsers(users: UserRecord[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(users));
}

export function UsersProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth();

  // Initialize users synchronously — handles first-user auto-ADMIN and profile updates
  const [users, setUsers] = useState<UserRecord[]>(() => {
    const stored = loadUsers();
    if (!authUser) return stored;

    const existing = stored.find((u) => u.email === authUser.email);

    // First user ever → auto-ADMIN
    if (!existing && stored.length === 0) {
      const users = [
        { email: authUser.email, name: authUser.name, picture: authUser.picture, role: 'ADMIN' as Role, addedAt: nowTs() },
      ];
      persistUsers(users);
      return users;
    }

    // Update profile info if changed
    if (existing && (existing.name !== authUser.name || existing.picture !== authUser.picture)) {
      const users = stored.map((u) =>
        u.email === authUser.email ? { ...u, name: authUser.name, picture: authUser.picture } : u,
      );
      persistUsers(users);
      return users;
    }

    return stored;
  });

  const currentUser = authUser ? users.find((u) => u.email === authUser.email) ?? null : null;
  const currentRole = currentUser?.role ?? null;
  const isRegistered = currentUser !== null;

  const setUserRole = useCallback(
    (email: string, role: Role) => {
      setUsers((prev) => {
        const idx = prev.findIndex((u) => u.email === email);
        let updated: UserRecord[];
        if (idx >= 0) {
          updated = prev.map((u, i) => (i === idx ? { ...u, role } : u));
        } else {
          updated = [...prev, { email, name: email, picture: '', role, addedAt: nowTs() }];
        }
        persistUsers(updated);
        return updated;
      });
    },
    [],
  );

  const removeUser = useCallback((email: string) => {
    setUsers((prev) => {
      const updated = prev.filter((u) => u.email !== email);
      persistUsers(updated);
      return updated;
    });
  }, []);

  return (
    <UsersCtx.Provider value={{ users, currentRole, currentUser, setUserRole, removeUser, isRegistered }}>
      {children}
    </UsersCtx.Provider>
  );
}
