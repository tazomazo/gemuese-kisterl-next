'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
  const { user, updateProfile, loading, error, setError, signOut } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword && newPassword !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    const ok = await updateProfile(user.id, {
      name: name !== user.name ? name : undefined,
      password: newPassword || undefined,
      currentPassword: currentPassword || undefined,
    });

    if (ok) {
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Einstellungen</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border bg-white p-6 shadow-sm">
        {/* Name */}
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <hr className="border-gray-100" />
        <p className="text-sm font-medium text-gray-700">Passwort ändern</p>

        <Input
          label="Aktuelles Passwort"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Nur erforderlich wenn bereits gesetzt"
        />
        <Input
          label="Neues Passwort"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Leer lassen um nicht zu ändern"
        />
        <Input
          label="Passwort bestätigen"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Neues Passwort wiederholen"
        />

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
        {success && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            Profil aktualisiert!
          </p>
        )}

        <div className="flex gap-2">
          <Button type="submit" loading={loading} className="flex-1">
            Speichern
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push('/')}>
            Abbrechen
          </Button>
        </div>
      </form>

      <button
        onClick={signOut}
        className="mt-4 w-full text-center text-sm text-red-500 hover:underline"
      >
        Abmelden
      </button>
    </div>
  );
}
