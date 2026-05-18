'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { AuthUser } from '@/types';

export function useAuth() {
  const { user, login, logout, isAdmin } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  const register = async (name: string, password?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Registrierung fehlgeschlagen');
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

  const resetPassword = async (name: string, newPassword: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Zurücksetzen fehlgeschlagen');
        return false;
      }
      return true;
    } catch {
      setError('Netzwerkfehler');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { user, isAdmin, loading, error, setError, signIn, signOut, register, resetPassword, updateProfile };
}
