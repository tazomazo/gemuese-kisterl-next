import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export const AUTH_COOKIE_NAME = 'gk-auth';

export interface CookieUser {
  id: string;
  name: string;
  is_admin: boolean;
}

export function serializeCookieUser(user: CookieUser): string {
  return JSON.stringify(user);
}

export function parseCookieUser(value: string): CookieUser | null {
  try {
    return JSON.parse(value) as CookieUser;
  } catch {
    return null;
  }
}
