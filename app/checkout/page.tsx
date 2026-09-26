'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { PICKUP_LOCATIONS, getMoto, type Moto } from '@/lib/data';
import { addDaysISO, calcPrice, daysBetween, peso, todayISO } from '@/lib/format';
import { bookingCode, useBookings, type Booking } from '@/lib/booking-context';
import { useAuth } from '@/lib/auth-context';

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[60vh] place-items-center text-sm text-steel">Loading checkout…</div>
      }
    >
      <CheckoutForm />
    </Suspense>
  );
}

const fieldCls =
  'mt-1.5 w-full rounded-lg border border-navy-600 bg-navy-900 px-3.5 py-2.5 text-sm text-cream placeholder:text-steel/50 focus:border-gold-500 focus:outline-none';

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm">
      <span className="text-xs font-semibold text-steel">{label}</span>
      <input {...props} className={fieldCls} />
    </label>
  );
}

function CheckoutForm() {
  const sp = useSearchParams();
  const router = useRouter();
  const { addBooking } = useBookings();
  const { user, ready } = useAuth();

  const moto = getMoto(sp.get('moto') ?? '');
  const from = sp.get('from') || todayISO();
  const to = sp.get('to') || addDaysISO(3, todayISO());
  const valid = !!moto && to >= from;

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    licenseNo: '',
    location: PICKUP_LOCATIONS[0],
    notes: '',
  });
  // Pre-fill rider details from the signed-in account.
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      name: f.name || user.name,
      phone: f.phone || user.phone,
      email: f.email || user.email,
      licenseNo: f.licenseNo || user.licenseNo,
    }));
  }, [user]);

  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');

  const price = useMemo(() => (moto ? calcPrice(moto, daysBetween(from, to)) : null), [moto, from, to]);

  if (!moto || !valid || !price) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold">No bike selected</h1>
        <p className="mt-2 text-sm text-steel">
          Pick a motorcycle and your rental dates first, then come back to checkout.
        </p>
        <Link
          href="/motorcycles"
          className="mt-6 inline-block rounded-xl bg-gold-500 px-6 py-3 text-sm font-extrabold text-navy-950 hover:bg-gold-400"
        >
          Browse Motorcycles
        </Link>
      </div>
    );
  }

  // Wait for the persisted session to load so signed-in users don't see the gate flash.
  if (!ready) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-sm text-steel">Loading checkout…</div>
    );
  }

  // Auth gate: an account is required before checkout.
  if (!user) {
    const qs = sp.toString();
    const checkoutUrl = `/checkout${qs ? `?${qs}` : ''}`;
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold-500/15">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7 text-gold-400"
            aria-hidden
          >
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        </div>
        <h1 className="mt-5 text-2xl font-extrabold">Sign in to continue</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-steel">
          You need an account to complete your rental. Log in or register first — then we
          &apos;ll bring you right back to this checkout.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={`/signin?next=${encodeURIComponent(checkoutUrl)}`}
            className="rounded-xl bg-gold-500 px-8 py-3 text-sm font-extrabold text-navy-950 transition hover:bg-gold-400"
          >
            Login
          </Link>
          <Link
            href={`/register?next=${encodeURIComponent(checkoutUrl)}`}
            className="rounded-xl border border-gold-500/60 px-8 py-3 text-sm font-bold text-gold-400 transition hover:bg-gold-500/10"
          >
            Register
          </Link>
        </div>
        <p className="mt-4 text-xs text-steel">
          Already have an account? Your rider details fill in automatically at checkout.
        </p>
      </div>
    );
  }

  // Non-nullable references for the submit closure (narrowing above doesn't propagate into closures).
  const bike: Moto = moto;
  const breakdown = price;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.licenseNo.trim()) {
      setError('Please fill in your name, phone number, and driver’s license number.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!terms) {
      setError('Please accept the rental terms to continue.');
      return;
    }
    setError('');
    const booking: Booking = {
      id: bookingCode(),
      motoId: bike.id,
      motoSlug: bike.slug,
      motoName: bike.name,
      brand: bike.brand,
      image: bike.image,
      pickup: from,
      dropoff: to,
      days: breakdown.days,
      rate: bike.pricePerDay,
      subtotal: breakdown.subtotal,
      discount: breakdown.discount,
      total: breakdown.total,
      deposit: bike.deposit,
      location: form.location,
      notes: form.notes,
      status: 'upcoming',
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        licenseNo: form.licenseNo.trim(),
      },
      createdAt: new Date().toISOString(),
    };
    await addBooking(booking);
    router.push(`/success?b=${booking.id}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">Step 2 of 2</p>
      <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Checkout</h1>
      <p className="mt-2 text-sm text-steel">
        Confirm your rider details and we&apos;ll lock in your booking.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <form
          onSubmit={submit}
          className="space-y-4 rounded-2xl border border-navy-600/40 bg-navy-850 p-6"
          noValidate
        >
          <h2 className="text-sm font-bold uppercase tracking-wider text-gold-400">Rider details</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Full name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Juan Dela Cruz"
            />
            <Field
              label="Phone number *"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+63 917 000 0000"
            />
            <Field
              label="Email address *"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
            <Field
              label="Driver’s license number *"
              value={form.licenseNo}
              onChange={(e) => setForm({ ...form, licenseNo: e.target.value })}
              placeholder="PH-B 00000-0000-000"
            />
          </div>

          <label className="block text-sm">
            <span className="text-xs font-semibold text-steel">Pickup location</span>
            <select
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className={fieldCls}
            >
              {PICKUP_LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-xs font-semibold text-steel">Notes for the shop (optional)</span>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              placeholder="Route plans, extra helmet, child seat…"
              className={fieldCls}
            />
          </label>

          <label className="flex items-start gap-3 text-sm text-steel">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#D9A83F]"
            />
            <span>
              I have a valid Philippine driver&apos;s license, I&apos;ll return the bike with the same
              fuel level, and I accept the rental terms.
            </span>
          </label>

          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-gold-500 py-3.5 text-sm font-extrabold text-navy-950 transition hover:bg-gold-400"
          >
            Confirm Booking — {peso(price.total)}
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-gold-500/30 bg-navy-850 p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gold-400">Order summary</h2>

          <div className="mt-4 flex items-center gap-4">
            <img
              src={moto.image}
              alt={moto.name}
              className="h-16 w-24 rounded-lg border border-navy-600/40 object-cover"
            />
            <div>
              <p className="font-bold">{moto.name}</p>
              <p className="text-xs text-steel">
                {moto.brand} • {moto.cc} cc
              </p>
            </div>
          </div>

          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-steel">Pickup</dt>
              <dd className="font-semibold">{new Date(from + 'T00:00:00').toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-steel">Return</dt>
              <dd className="font-semibold">{new Date(to + 'T00:00:00').toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-steel">Duration</dt>
              <dd className="font-semibold">
                {price.days} day{price.days > 1 ? 's' : ''}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-steel">
                {peso(moto.pricePerDay)}/day × {price.days}
              </dt>
              <dd className="font-semibold">{peso(price.subtotal)}</dd>
            </div>
            {price.discount > 0 && (
              <div className="flex justify-between text-gold-400">
                <dt>Long-stay discount (10%)</dt>
                <dd className="font-semibold">− {peso(price.discount)}</dd>
              </div>
            )}
          </dl>

          <div className="mt-4 flex items-baseline justify-between border-t border-navy-600/50 pt-4">
            <span className="text-base font-extrabold">Total due</span>
            <span className="text-2xl font-black text-gold-400">{peso(price.total)}</span>
          </div>
          <p className="mt-2 text-[11px] text-steel">
            A refundable {peso(moto.deposit)} security deposit is collected at pickup and returned when
            the bike is checked in.
          </p>

          <Link
            href={`/motorcycles/${moto.slug}`}
            className="mt-5 inline-block text-sm font-semibold text-gold-400 hover:text-gold-300"
          >
            ← Back to motorcycle details
          </Link>
        </aside>
      </div>
    </div>
  );
}
