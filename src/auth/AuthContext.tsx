import { useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { AuthCtx, type AuthUser } from './context';

export type { AuthUser } from './context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const expiresAtRef = useRef<number>(0);

  const setAuth = useCallback((token: string, authUser: AuthUser, expiresIn?: number) => {
    setAccessToken(token);
    setUser(authUser);
    expiresAtRef.current = Date.now() + (expiresIn || 3600) * 1000;
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(() => {
    // Revoke Google OAuth token before clearing local state
    if (accessToken) {
      fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }).catch(() => {});
    }
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    expiresAtRef.current = 0;
  }, [accessToken]);

  // Check token expiry periodically
  useEffect(() => {
    if (!accessToken) return;
    const check = () => {
      if (Date.now() >= expiresAtRef.current) {
        setAccessToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    const id = setInterval(check, 30_000);
    return () => clearInterval(id);
  }, [accessToken]);

  return (
    <AuthCtx.Provider
      value={{
        isAuthenticated,
        user: isAuthenticated ? user : null,
        accessToken: isAuthenticated ? accessToken : null,
        setAuth,
        signOut,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}
