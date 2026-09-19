'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNo: string;
  password: string; // stored in plaintext — frontend prototype only, no backend
}

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface AuthContextValue {
  user: User | null;
  ready: boolean; // true once the persisted session has been read
  signIn: (email: string, password: string) => AuthResult;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    licenseNo: string;
    password: string;
  }) => AuthResult;
  signOut: () => void;
}

const SESSION_KEY = 'motorent.session.v1';
const USERS_KEY = 'motorent.users.v1';

const DEMO_USER: User = {
  id: 'u-demo',
  name: 'Juan Dela Cruz',
  email: 'juan.dela.cruz@example.com',
  phone: '+63 917 555 0142',
  licenseNo: 'PH-B 09171-2231-456',
  password: 'moto2026',
};

export const DEMO_CREDENTIALS = {
  email: DEMO_USER.email,
  password: DEMO_USER.password,
};

function loadUsers(): User[] {
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    const parsed = raw ? (JSON.parse(raw) as User[]) : [];
    const list = Array.isArray(parsed) ? parsed : [];
    return [DEMO_USER, ...list.filter((u) => u.email.toLowerCase() !== DEMO_USER.email)];
  } catch {
    return [DEMO_USER];
  }
}

function saveUsers(users: User[]) {
  try {
    const others = users.filter((u) => u.id !== 'u-demo');
    window.localStorage.setItem(USERS_KEY, JSON.stringify(others));
  } catch {
    /* storage unavailable */
  }
}

function persistSession(u: User | null) {
  try {
    if (u) window.localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable */
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as User;
        if (parsed && parsed.email) setUser(parsed);
      }
    } catch {
      /* ignore corrupted session */
    }
    setReady(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      signIn: (email, password) => {
        const normalized = email.trim().toLowerCase();
        const found = loadUsers().find((u) => u.email.toLowerCase() === normalized);
        if (!found) {
          return {
            ok: false,
            error: 'No account found for that email. Try the demo account or register a new one.',
          };
        }
        if (found.password !== password) {
          return { ok: false, error: 'Incorrect password. Please try again.' };
        }
        setUser(found);
        persistSession(found);
        return { ok: true };
      },
      register: (data) => {
        const email = data.email.trim().toLowerCase();
        const all = loadUsers();
        if (all.some((u) => u.email.toLowerCase() === email)) {
          return {
            ok: false,
            error: 'An account with that email already exists. Try signing in instead.',
          };
        }
        const newUser: User = {
          id: `u-${Date.now()}`,
          name: data.name.trim(),
          email: data.email.trim(),
          phone: data.phone.trim(),
          licenseNo: data.licenseNo.trim(),
          password: data.password,
        };
        // Account is saved; the rider still needs to sign in (verification flow).
        saveUsers([...all, newUser]);
        return { ok: true };
      },
      signOut: () => {
        setUser(null);
        persistSession(null);
      },
    }),
    [user, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
