'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { AuthUser, User } from '@/types';

export function useAuth() {
  const { user, login, logout, isAdmin } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUsers = async (): Promise<User[]> => {
    const res = await fetch('/api/users');
    if (!res.ok) return [];
    return res.json();
  };

  const signIn = async (name: string, password?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Anmeldung fehlgeschlagen');
        return false;
      }
      const authUser: AuthUser = await res.json();
      login(authUser);
      router.push('/');
      return true;
    } catch {
      setError('Netzwerkfehler');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await logout();
    router.push('/login');
  };

  const updateProfile = async (
    userId: string,
    data: { name?: string; password?: string; currentPassword?: string }
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json();
        setError(body.error || 'Aktualisierung fehlgeschlagen');
        return false;
      }
      const updated: AuthUser = await res.json();
      login(updated);
      return true;
    } catch {
      setError('Netzwerkfehler');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { user, isAdmin, loading, error, setError, signIn, signOut, fetchUsers, updateProfile };
}
