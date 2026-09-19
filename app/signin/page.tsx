'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { DEMO_CREDENTIALS, useAuth } from '@/lib/auth-context';
import { AuthShell } from '@/components/AuthShell';
import { ErrorNote, GoldPill, PasswordField, UnderlineField } from '@/components/AuthField';

function safeNext(raw: string | null): string {
  return raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/profile';
}

function SignInInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const { user, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const nextRaw = sp.get('next');
  const hasNext = !!nextRaw;
  const dest = safeNext(nextRaw);
  const registerHref = hasNext ? `/register?next=${encodeURIComponent(nextRaw!)}` : '/register';

  // Already signed in but bounced here with a destination (e.g. a gated checkout) — send them on.
  useEffect(() => {
    if (user && hasNext) router.replace(dest);
  }, [user, hasNext, dest, router]);

  if (user) {
    return (
      <AuthShell>
        <div className="mx-auto max-w-sm lg:max-w-md">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7 text-emerald-600"
              aria-hidden
            >
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">You&apos;re signed in</h1>
          <p className="mt-2 text-[15px] text-slate-600">
            Signed in as <span className="font-semibold text-slate-900">{user.name}</span>.
          </p>
          <GoldPill className="mt-8" onClick={() => router.push(dest)}>
            {hasNext ? 'Continue to Checkout' : 'Go to My Profile'}
          </GoldPill>
          <p className="mt-4 text-center text-sm text-slate-600">
            or{' '}
            <Link href="/motorcycles" className="font-medium text-gold-600 hover:underline">
              browse motorcycles
            </Link>
          </p>
        </div>
      </AuthShell>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    const res = signIn(email, password);
    if (!res.ok) {
      setError(res.error ?? 'Unable to sign in.');
      return;
    }
    router.push(dest);
  }

  return (
    <AuthShell>
      <div className="mx-auto max-w-sm lg:max-w-md">
        <h1 className="text-2xl font-bold text-slate-900">Login</h1>
        {hasNext && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Sign in or register to continue with your booking — we&apos;ll bring you right back.
          </p>
        )}
        <p className="mt-1.5 text-sm text-slate-600">
          New visitor?{' '}
          <Link href={registerHref} className="font-medium text-gold-600 hover:underline">
            Create your account here
          </Link>
        </p>

        <form onSubmit={submit} className="mt-9 space-y-6" noValidate>
          <UnderlineField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
          />

          <div>
            <PasswordField
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="Password"
              autoComplete="current-password"
            />
            <p className="mt-1.5 text-[11px] text-slate-500">
              Click{' '}
              <button
                type="button"
                onClick={() => setShowForgot((v) => !v)}
                className="font-medium text-gold-600 hover:underline"
              >
                here
              </button>{' '}
              in case you forget your password
            </p>
            {showForgot && (
              <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                Password reset isn&apos;t available in this prototype — use the demo account below.
              </p>
            )}
          </div>

          {error && <ErrorNote>{error}</ErrorNote>}

          <GoldPill type="submit">Login</GoldPill>
        </form>

        <div className="mt-9 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700">Demo account</p>
          <p className="mt-1">
            {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
          </p>
          <button
            type="button"
            onClick={() => {
              setEmail(DEMO_CREDENTIALS.email);
              setPassword(DEMO_CREDENTIALS.password);
              setError('');
            }}
            className="mt-1.5 font-bold text-gold-600 hover:underline"
          >
            Fill demo credentials →
          </button>
        </div>
      </div>
    </AuthShell>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={<div className="grid min-h-screen place-items-center text-sm text-slate-500">Loading…</div>}
    >
      <SignInInner />
    </Suspense>
  );
}
