'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AuthShell } from '@/components/AuthShell';
import { ErrorNote, GoldPill, PasswordField, UnderlineField } from '@/components/AuthField';

function safeNext(raw: string | null): string {
  return raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/profile';
}

type Stage = 'form' | 'confirm' | 'done';

function RegisterInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const { user, register } = useAuth();
  const [stage, setStage] = useState<Stage>('form');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const nextRaw = sp.get('next');
  const hasNext = !!nextRaw;
  const signinHref = hasNext ? `/signin?next=${encodeURIComponent(nextRaw!)}` : '/signin';
  const dest = safeNext(nextRaw);

  // If already logged in (e.g. confirmation was disabled and they got a session)
  useEffect(() => {
    if (user && stage === 'form') router.replace(dest);
    if (user && stage === 'done') router.replace(dest);
  }, [user, stage, dest, router]);

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

  // Email confirmation required
  if (stage === 'confirm') {
    return (
      <AuthShell>
        <div className="mx-auto max-w-md">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold-500/10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-gold-600" aria-hidden>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Check your inbox</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            We sent a confirmation link to <span className="font-semibold">{form.email}</span>.
            Click it to activate your account, then sign in.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Didn&apos;t get it? Check your spam folder, or{' '}
            <button type="button" onClick={() => setStage('form')}
              className="font-medium text-gold-600 hover:underline">
              try a different email
            </button>.
          </p>
          <GoldPill className="mt-8" onClick={() => router.push(signinHref)}>
            Go to Login
          </GoldPill>
        </div>
      </AuthShell>
    );
  }

  // Registered + immediately signed in (no email confirmation)
  if (stage === 'done') {
    return (
      <AuthShell>
        <div className="mx-auto max-w-md">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-emerald-600" aria-hidden>
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Account created!</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            You&apos;re signed in and ready to book.
          </p>
          <GoldPill className="mt-8" onClick={() => router.push(dest)}>
            {hasNext ? 'Continue to Checkout' : 'Go to My Profile'}
          </GoldPill>
        </div>
      </AuthShell>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.name.trim().length < 2) { setError('Please enter your full name.'); return; }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) { setError('Please enter a valid email address.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (!terms) { setError('Please agree to the Terms and Conditions to continue.'); return; }

    setLoading(true);
    setError('');
    const res = await register({
      name: form.name,
      email: form.email,
      phone: '',
      licenseNo: '',
      password: form.password,
    });
    setLoading(false);

    if (!res.ok) { setError(res.error ?? 'Unable to create your account.'); return; }

    // If Supabase returned a session immediately (email confirm disabled) → go to done
    // Otherwise show the "check your inbox" screen
    if (res.needsConfirmation) {
      setStage('confirm');
    } else {
      setStage('done');
    }
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
          <UnderlineField label="Full name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Juan Dela Cruz" autoComplete="name" />
          <UnderlineField label="Email" type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="juan@example.com" autoComplete="email" />
          <PasswordField label="Password" value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
            placeholder="Password (min 6 characters)" autoComplete="new-password" />
          <PasswordField label="Confirm Password" value={form.confirm}
            onChange={(v) => setForm({ ...form, confirm: v })}
            placeholder="Confirm Password" autoComplete="new-password" />

          <label className="flex items-start gap-2.5 text-sm text-slate-600">
            <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#22C55E]" />
            <span>
              I agree to the{' '}
              <a href="#terms" className="font-medium text-gold-600 hover:underline">
                Terms and Conditions
              </a>
            </span>
          </label>

          {error && <ErrorNote>{error}</ErrorNote>}

          <GoldPill type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Register Account'}
          </GoldPill>
        </form>
      </div>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center text-sm text-slate-500">Loading…</div>}>
      <RegisterInner />
    </Suspense>
  );
}
