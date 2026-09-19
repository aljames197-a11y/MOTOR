'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useBookings } from '@/lib/booking-context';
import { fmtDate, peso } from '@/lib/format';

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[60vh] place-items-center bg-[#F7F5F0] text-sm text-slate-600">
          Loading…
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const sp = useSearchParams();
  const { getBooking } = useBookings();
  const booking = getBooking(sp.get('b') ?? '');

  if (!booking) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#F7F5F0] px-4 py-24 text-center text-navy-950">
        <h1 className="text-2xl font-extrabold">We couldn&apos;t find that booking.</h1>
        <p className="mt-2 text-sm text-slate-600">
          It may have been created in a different browser. Check your booking history instead.
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

  const firstName = booking.customer.name.split(' ')[0];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F7F5F0] px-4 py-16 text-center text-navy-950 sm:px-6">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border-4 border-emerald-400/60 bg-emerald-400/10">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-9 w-9 text-emerald-500"
          aria-hidden
        >
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>

      <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-emerald-600">
        Booking confirmed
      </p>
      <h1 className="mt-2 text-3xl font-black sm:text-4xl">You&apos;re all set, {firstName}!</h1>
      <p className="mt-3 text-sm text-slate-600">
        Booking code <span className="font-bold text-navy-950">{booking.id}</span> — present this at
        pickup together with your driver&apos;s license.
      </p>

      <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm">
        <div className="flex items-center gap-4 border-b border-slate-200 p-5">
          <img
            src={booking.image}
            alt={booking.motoName}
            className="h-16 w-24 rounded-lg border border-slate-200 object-cover"
          />
          <div>
            <p className="font-bold">{booking.motoName}</p>
            <p className="text-xs text-slate-500">
              {booking.brand} • {booking.days} day{booking.days > 1 ? 's' : ''}
            </p>
          </div>
          <span className="ml-auto rounded-full bg-gold-500/15 px-3 py-1 text-xs font-bold text-gold-600">
            Upcoming
          </span>
        </div>

        <dl className="grid gap-4 p-5 text-sm">
          <div>
            <dt className="text-xs text-slate-500">Pickup</dt>
            <dd className="mt-0.5 font-semibold">{fmtDate(booking.pickup)}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Return</dt>
            <dd className="mt-0.5 font-semibold">{fmtDate(booking.dropoff)}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Pickup location</dt>
            <dd className="mt-0.5 font-semibold">{booking.location}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Rider</dt>
            <dd className="mt-0.5 font-semibold">{booking.customer.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Total due on pickup</dt>
            <dd className="mt-0.5 text-lg font-black text-gold-600">{peso(booking.total)}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Refundable deposit</dt>
            <dd className="mt-0.5 font-semibold">{peso(booking.deposit)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/profile"
          className="rounded-xl bg-gold-500 px-6 py-3 text-sm font-extrabold text-navy-950 hover:bg-gold-400"
        >
          View My Bookings
        </Link>
        <Link
          href="/motorcycles"
          className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-navy-950 hover:border-gold-500"
        >
          Book Another Bike
        </Link>
      </div>
    </div>
  );
}
