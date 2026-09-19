'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AuthShell } from '@/components/AuthShell';
import { ErrorNote, GoldPill, PasswordField, UnderlineField } from '@/components/AuthField';

const REDIRECT_SECONDS = 8;

function safeNext(raw: string | null): string {
  return raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/profile';
}

function RegisterInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const { user, register } = useAuth();
  const [stage, setStage] = useState<'form' | 'success'>('form');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);

  const nextRaw = sp.get('next');
  const hasNext = !!nextRaw;
  const signinHref = hasNext ? `/signin?next=${encodeURIComponent(nextRaw!)}` : '/signin';
  const dest = safeNext(nextRaw);

  useEffect(() => {
    if (stage !== 'success') return;
    setCountdown(REDIRECT_SECONDS);
    const iv = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          window.clearInterval(iv);
          router.push(signinHref);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => window.clearInterval(iv);
  }, [stage, router, signinHref]);

  // Already signed in with a pending destination — send them on.
  useEffect(() => {
    if (user && hasNext && stage === 'form') router.replace(dest);
  }, [user, hasNext, dest, stage, router]);

  if (user && stage === 'form') {
    return (
      <AuthShell>
        <div className="mx-auto max-w-sm lg:max-w-md">
          <h1 className="text-2xl font-bold text-slate-900">You&apos;re already registered</h1>
          <p className="mt-2 text-[15px] text-slate-600">
            Signed in as <span className="font-semibold text-slate-900">{user.name}</span>.
          </p>
          <GoldPill className="mt-8" onClick={() => router.push(dest)}>
            {hasNext ? 'Continue to Checkout' : 'Go to My Profile'}
          </GoldPill>
        </div>
      </AuthShell>
    );
  }

  if (stage === 'success') {
    return (
      <AuthShell>
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-bold text-slate-900">Registration success!</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
            We sent you an email to verify your account, please check in your inbox or spam.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            You will be automatically directed to the login page after completing verification.
          </p>
          <p className="mt-4 text-xs text-slate-500">
            Click{' '}
            <button type="button" className="font-medium text-gold-600 hover:underline">
              here
            </button>{' '}
            to resend verification
          </p>
          <GoldPill className="mt-8" onClick={() => router.push(signinHref)}>
            Done
          </GoldPill>
          {countdown > 0 && (
            <p className="mt-3 text-center text-xs text-slate-400">
              Redirecting to sign in in {countdown}s…
            </p>
          )}
        </div>
      </AuthShell>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!terms) {
      setError('Please agree to the Terms and Conditions to continue.');
      return;
    }
    const res = register({
      name: form.name,
      email: form.email,
      phone: '',
      licenseNo: '',
      password: form.password,
    });
    if (!res.ok) {
      setError(res.error ?? 'Unable to create your account.');
      return;
    }
    setStage('success');
  }

  return (
    <AuthShell>
      <div className="mx-auto max-w-sm lg:max-w-md">
        <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
        {hasNext && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
            An account is required to complete your rental booking.
          </p>
        )}
        <p className="mt-1.5 text-sm text-slate-600">
          Already have an account?{' '}
          <Link href={signinHref} className="font-medium text-gold-600 hover:underline">
            Login here
          </Link>
        </p>

        <form onSubmit={submit} className="mt-9 space-y-6" noValidate>
          <UnderlineField
            label="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="John Smith"
            autoComplete="name"
          />
          <UnderlineField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="john@smith.com"
            autoComplete="email"
          />
          <PasswordField
            label="Password"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
            placeholder="Password"
            autoComplete="new-password"
          />
          <PasswordField
            label="Confirm Password"
            value={form.confirm}
            onChange={(v) => setForm({ ...form, confirm: v })}
            placeholder="Confirm Password"
            autoComplete="new-password"
          />

          <label className="flex items-start gap-2.5 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#22C55E]"
            />
            <span>
              I agree to store&apos;s{' '}
              <a href="#terms" className="font-medium text-gold-600 hover:underline">
                Terms and Conditions
              </a>
            </span>
          </label>

          {error && <ErrorNote>{error}</ErrorNote>}

          <GoldPill type="submit">Register Account</GoldPill>
        </form>
      </div>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={<div className="grid min-h-screen place-items-center text-sm text-slate-500">Loading…</div>}
    >
      <RegisterInner />
    </Suspense>
  );
}
