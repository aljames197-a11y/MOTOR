'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, type ProfileRow } from './supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNo: string;
}

interface AuthResult {
  ok: boolean;
  error?: string;
  /** true when Supabase requires email confirmation before the session is active */
  needsConfirmation?: boolean;
}

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    licenseNo: string;
    password: string;
  }) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function profileToUser(session: Session, profile: ProfileRow | null): User {
  return {
    id: session.user.id,
    name: profile?.name ?? session.user.user_metadata?.name ?? session.user.email ?? '',
    email: session.user.email ?? '',
    phone: profile?.phone ?? session.user.user_metadata?.phone ?? '',
    licenseNo: profile?.license_no ?? session.user.user_metadata?.license_no ?? '',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  async function fetchAndSetUser(session: Session | null) {
    if (!session) { setUser(null); return; }
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    setUser(profileToUser(session, profile as ProfileRow | null));
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchAndSetUser(session).finally(() => setReady(true));
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchAndSetUser(session);
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,

      signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data.session) {
          // Friendly message for unconfirmed accounts
          if (error?.message?.toLowerCase().includes('email not confirmed')) {
            return {
              ok: false,
              error: 'Please confirm your email first, then sign in. Check your inbox (and spam).',
            };
          }
          return { ok: false, error: error?.message ?? 'Unable to sign in.' };
        }
        await fetchAndSetUser(data.session);
        return { ok: true };
      },

      register: async ({ name, email, phone, licenseNo, password }) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, phone, license_no: licenseNo } },
        });

        if (error) {
          // Rate-limit hit — give a clear explanation instead of a raw error
          if (
            error.message?.toLowerCase().includes('rate limit') ||
            error.message?.toLowerCase().includes('too many') ||
            error.status === 429
          ) {
            return {
              ok: false,
              error:
                'Too many sign-up attempts. Please wait a few minutes and try again, ' +
                'or use a different email address.',
            };
          }
          return { ok: false, error: error.message };
        }

        // ── Case 1: email confirmation DISABLED (session returned immediately) ──
        if (data.session) {
          // Upsert profile in case the trigger hasn't fired yet
          await supabase.from('profiles').upsert({
            id: data.session.user.id,
            name,
            phone,
            license_no: licenseNo,
          });
          await fetchAndSetUser(data.session);
          return { ok: true };
        }

        // ── Case 2: email confirmation ENABLED (no session yet) ──
        // Store the name in the profile row so it's ready once the user confirms
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            name,
            phone,
            license_no: licenseNo,
          });
        }
        return { ok: true, needsConfirmation: true };
      },

      signOut: async () => {
        await supabase.auth.signOut();
        setUser(null);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
