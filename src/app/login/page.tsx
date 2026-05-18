'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type Mode = 'login' | 'register' | 'reset';

export default function LoginPage() {
  const { signIn, register, resetPassword, loading, error, setError, user } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetDone, setResetDone] = useState(false);

  if (user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">
          Du bist bereits angemeldet als <strong>{user.name}</strong>.
        </p>
      </div>
    );
  }

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setPassword('');
    setConfirmPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setResetDone(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    await signIn(username.trim(), password || undefined);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setError(null);
    if (password && password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }
    await register(username.trim(), password || undefined);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !newPassword) return;
    setError(null);
    if (newPassword !== confirmNewPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }
    const ok = await resetPassword(username.trim(), newPassword);
    if (ok) setResetDone(true);
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <span className="text-4xl">🥦</span>
          <h1 className="mt-2 text-xl font-bold text-gray-900">
            {mode === 'login' && 'Anmelden'}
            {mode === 'register' && 'Konto erstellen'}
            {mode === 'reset' && 'Passwort zurücksetzen'}
          </h1>
        </div>

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              label="Benutzername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Dein Name"
              autoFocus
              required
            />
            <div className="flex flex-col gap-1">
              <Input
                label="Passwort"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passwort eingeben"
              />
              <button
                type="button"
                onClick={() => switchMode('reset')}
                className="self-end text-xs text-brand-600 hover:underline"
              >
                Passwort vergessen?
              </button>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <Button type="submit" loading={loading} disabled={!username.trim()} size="lg">
              Anmelden
            </Button>

            <p className="text-center text-sm text-gray-500">
              Noch kein Konto?{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="font-medium text-brand-600 hover:underline"
              >
                Registrieren
              </button>
            </p>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <Input
              label="Benutzername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Deinen Namen wählen"
              autoFocus
              required
            />
            <Input
              label="Passwort (optional)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leer lassen für kein Passwort"
            />
            {password && (
              <Input
                label="Passwort bestätigen"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Passwort wiederholen"
                required
              />
            )}

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <Button type="submit" loading={loading} disabled={!username.trim()} size="lg">
              Konto erstellen
            </Button>

            <p className="text-center text-sm text-gray-500">
              Bereits ein Konto?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="font-medium text-brand-600 hover:underline"
              >
                Anmelden
              </button>
            </p>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            {resetDone ? (
              <div className="flex flex-col gap-4">
                <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                  Passwort wurde erfolgreich zurückgesetzt. Du kannst dich jetzt anmelden.
                </p>
                <Button type="button" onClick={() => switchMode('login')} size="lg">
                  Zur Anmeldung
                </Button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500">
                  Gib deinen Benutzernamen ein und setze ein neues Passwort.
                </p>
                <Input
                  label="Benutzername"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Dein Name"
                  autoFocus
                  required
                />
                <Input
                  label="Neues Passwort"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Neues Passwort"
                  required
                />
                <Input
                  label="Passwort bestätigen"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Passwort wiederholen"
                  required
                />

                {error && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
                )}

                <Button
                  type="submit"
                  loading={loading}
                  disabled={!username.trim() || !newPassword}
                  size="lg"
                >
                  Passwort zurücksetzen
                </Button>

                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-center text-sm text-brand-600 hover:underline"
                >
                  ← Zurück zur Anmeldung
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
