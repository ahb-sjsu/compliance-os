import { useState, useCallback, type ReactNode } from 'react';
import { AuthCtx, type AuthUser } from './context';

export type { AuthUser } from './context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const setAuth = useCallback((token: string, authUser: AuthUser) => {
    setAccessToken(token);
    setUser(authUser);
  }, []);

  const signOut = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, []);

  return (
    <AuthCtx.Provider value={{ isAuthenticated: !!accessToken, user, accessToken, setAuth, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}
