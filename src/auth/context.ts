import { createContext } from 'react';

export interface AuthUser {
  name: string;
  email: string;
  picture: string;
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  setAuth: (token: string, user: AuthUser, expiresIn?: number) => void;
  signOut: () => void;
}

export const AuthCtx = createContext<AuthContextValue | null>(null);
