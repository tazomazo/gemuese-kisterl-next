'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const { signIn, loading, error, setError, user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedName, setSelectedName] = useState('');
  const [customName, setCustomName] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { fetchUsers } = useAuth();

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, [fetchUsers]);

  // If already logged in, redirect handled by header
  if (user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Du bist bereits angemeldet als <strong>{user.name}</strong>.</p>
      </div>
    );
  }

  const activeName = useCustom ? customName : selectedName;

  const selectedUser = users.find(
    (u) => u.name.toLowerCase() === activeName.toLowerCase()
  );
  const hasPassword = !!selectedUser; // show password field for existing users

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeName.trim()) return;
    setError(null);
    await signIn(activeName.trim(), password || undefined);
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <span className="text-4xl">🥦</span>
          <h1 className="mt-2 text-xl font-bold text-gray-900">Willkommen!</h1>
          <p className="mt-1 text-sm text-gray-500">Melde dich an oder erstelle ein neues Konto</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name selection */}
          {!useCustom ? (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Name auswählen</label>
              <select
                value={selectedName}
                onChange={(e) => { setSelectedName(e.target.value); setPassword(''); }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">— Name auswählen —</option>
                {users.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => { setUseCustom(true); setSelectedName(''); }}
                className="mt-1 self-start text-xs text-brand-600 hover:underline"
              >
                + Neuen Namen eingeben
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Input
                label="Neuer Name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Dein Name"
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => { setUseCustom(false); setCustomName(''); }}
                className="mt-1 self-start text-xs text-brand-600 hover:underline"
              >
                ← Aus Liste wählen
              </button>
            </div>
          )}

          {/* Password */}
          {(activeName.trim() || hasPassword) && (
            <div className="relative">
              <Input
                label={hasPassword ? 'Passwort' : 'Passwort (optional)'}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={hasPassword ? 'Dein Passwort' : 'Leer lassen, falls kein Passwort'}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-8 text-xs text-gray-400 hover:text-gray-600"
              >
                {showPassword ? 'Verbergen' : 'Zeigen'}
              </button>
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <Button
            type="submit"
            loading={loading}
            disabled={!activeName.trim()}
            size="lg"
            className="mt-1"
          >
            Anmelden
          </Button>
        </form>
      </div>
    </div>
  );
}
