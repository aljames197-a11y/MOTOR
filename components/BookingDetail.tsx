'use client';

import Link from 'next/link';
import { useBookings } from '@/lib/booking-context';
import { fmtDate, peso, todayISO } from '@/lib/format';

type StepState = 'done' | 'current' | 'todo' | 'cancelled';

function StepCircle({ state, index }: { state: StepState; index: number }) {
  if (state === 'done') {
    return (
      <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-500 text-navy-950">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden
        >
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
    );
  }
  if (state === 'current') {
    return (
      <span className="grid h-9 w-9 animate-pulse place-items-center rounded-full border-2 border-gold-400 bg-navy-900 text-sm font-black text-gold-400">
        {index + 1}
      </span>
    );
  }
  if (state === 'cancelled') {
    return (
      <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-red-500 bg-red-500/10 text-red-500">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="h-4 w-4" aria-hidden>
          <path d="M7 7l10 10M17 7L7 17" />
        </svg>
      </span>
    );
  }
  return (
    <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-navy-600 bg-navy-900 text-sm font-black text-steel">
      {index + 1}
    </span>
  );
}

export function BookingDetail({ id }: { id: string }) {
  const { getBooking } = useBookings();
  const b = getBooking(id);

  if (!b) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold">Booking not found.</h1>
        <p className="mt-2 text-sm text-steel">
          Double-check the link, or head back to your booking history.
        </p>
        <Link
          href="/profile"
          className="mt-6 inline-block rounded-xl bg-gold-500 px-6 py-3 text-sm font-extrabold text-navy-950 hover:bg-gold-400"
        >
          View My Bookings
        </Link>
      </div>
    );
  }

  const today = todayISO();
  const states: StepState[] = (() => {
    if (b.status === 'cancelled') return ['done', 'cancelled', 'todo', 'todo'];
    if (today < b.pickup) return ['done', 'current', 'todo', 'todo'];
    if (today <= b.dropoff) return ['done', 'done', 'current', 'todo'];
    return ['done', 'done', 'done', 'done'];
  })();

  const steps = [
    { label: 'Booking confirmed', sub: fmtDate(b.createdAt.slice(0, 10)) },
    { label: 'Pickup', sub: fmtDate(b.pickup) },
    { label: 'On the road', sub: '' },
    { label: 'Return', sub: fmtDate(b.dropoff) },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <nav className="text-xs text-steel" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gold-400">
          Home
        </Link>{' '}
        /{' '}
        <Link href="/profile" className="hover:text-gold-400">
          My Bookings
        </Link>{' '}
        / <span className="font-semibold text-cream">{b.id}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-black tracking-tight">Booking Confirmation</h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            b.status === 'upcoming'
              ? 'bg-gold-500/15 text-gold-400'
              : b.status === 'completed'
                ? 'bg-emerald-400/10 text-emerald-400'
                : 'bg-red-500/10 text-red-400'
          }`}
        >
          {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
        </span>
      </div>
      <p className="mt-1 text-sm text-steel">
        Booking code <span className="font-bold text-gold-400">{b.id}</span>
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Left: bike + timeline */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-navy-600/40 bg-navy-850">
            <img src={b.image} alt={b.motoName} className="h-44 w-full object-cover" />
            <div className="p-5">
              <h2 className="text-lg font-extrabold">{b.motoName}</h2>
              <p className="mt-0.5 text-xs text-steel">
                {b.brand} • {b.days} day{b.days > 1 ? 's' : ''} rental
              </p>
              <Link
                href={`/motorcycles/${b.motoSlug}`}
                className="mt-3 inline-block text-sm font-semibold text-gold-400 hover:text-gold-300"
              >
                View this motorcycle →
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-navy-600/40 bg-navy-850 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold-400">Rental timeline</h3>
            <ol className="mt-4 space-y-5">
              {steps.map((s, i) => (
                <li key={s.label} className="flex items-center gap-3">
                  <StepCircle state={states[i]} index={i} />
                  <div>
                    <p
                      className={`text-sm font-bold ${
                        states[i] === 'todo' ? 'text-steel' : 'text-cream'
                      }`}
                    >
                      {s.label}
                    </p>
                    {s.sub && <p className="text-xs text-steel">{s.sub}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right: payment + rider */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gold-500/30 bg-navy-850 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold-400">
              Payment summary
            </h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-steel">
                  {peso(b.rate)}/day × {b.days} day{b.days > 1 ? 's' : ''}
                </dt>
                <dd className="font-semibold">{peso(b.subtotal)}</dd>
              </div>
              {b.discount > 0 && (
                <div className="flex justify-between text-gold-400">
                  <dt>Long-stay discount (10%)</dt>
                  <dd className="font-semibold">− {peso(b.discount)}</dd>
                </div>
              )}
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t border-navy-600/50 pt-4">
              <span className="text-base font-extrabold">Total</span>
              <span className="text-2xl font-black text-gold-400">{peso(b.total)}</span>
            </div>
            <p className="mt-2 text-[11px] text-steel">
              Refundable security deposit of {peso(b.deposit)} collected at pickup.
            </p>
          </div>

          <div className="rounded-2xl border border-navy-600/40 bg-navy-850 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold-400">Rider details</h3>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-steel">Name</dt>
                <dd className="text-right font-semibold">{b.customer.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-steel">Phone</dt>
                <dd className="text-right font-semibold">{b.customer.phone}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-steel">Email</dt>
                <dd className="break-all text-right font-semibold">{b.customer.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-steel">Driver&apos;s license</dt>
                <dd className="text-right font-semibold">{b.customer.licenseNo}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-steel">Pickup location</dt>
                <dd className="text-right font-semibold">{b.location}</dd>
              </div>
              {b.notes && (
                <div>
                  <dt className="text-steel">Notes</dt>
                  <dd className="mt-1 rounded-lg bg-navy-900 p-3 text-steel">{b.notes}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/profile"
              className="rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-extrabold text-navy-950 hover:bg-gold-400"
            >
              Back to My Bookings
            </Link>
            <Link
              href="/motorcycles"
              className="rounded-xl border border-cream/25 px-5 py-2.5 text-sm font-bold text-cream hover:border-gold-400 hover:text-gold-300"
            >
              Browse More Bikes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
