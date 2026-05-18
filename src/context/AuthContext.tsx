'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser } from '@/types';

const STORAGE_KEY = 'gk-user';

interface AuthContextValue {
  user: AuthUser | null;
  login: (_user: AuthUser) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: () => {},
  logout: () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = (authUser: AuthUser) => {
    setUser(authUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    await fetch('/api/auth/logout', { method: 'POST' });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.is_admin ?? false }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
