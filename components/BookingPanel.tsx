'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { Moto } from '@/lib/data';
import { calcPrice, daysBetween, peso, todayISO } from '@/lib/format';
import { useAuth } from '@/lib/auth-context';

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 ' +
  'focus:border-gold-500 focus:outline-none [color-scheme:light]';

export function BookingPanel({ moto }: { moto: Moto }) {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const price = useMemo(() => {
    if (!from || !to || to < from) return null;
    return calcPrice(moto, daysBetween(from, to));
  }, [from, to, moto]);

  if (!moto.available) {
    return (
      <div className="rounded-2xl border border-navy-600/50 bg-navy-850 p-5">
        <p className="text-sm font-bold text-red-400">This bike is currently booked.</p>
        <p className="mt-1 text-xs text-steel">
          Check back soon, or pick another machine from the fleet.
        </p>
        <Link
          href="/motorcycles"
          className="mt-4 inline-block rounded-lg border border-gold-500/60 px-4 py-2 text-sm font-bold text-gold-400 transition hover:bg-gold-500 hover:text-navy-950"
        >
          Browse available bikes
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gold-400/50 bg-slate-50 p-5">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gold-600">
        Book this bike
      </h3>

      {/* Date pickers */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Pickup date</label>
          <input
            type="date"
            min={todayISO()}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Return date</label>
          <input
            type="date"
            min={from || todayISO()}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {/* Price breakdown or placeholder text */}
      {price ? (
          <div className="mt-4 space-y-1.5 border-t border-slate-200 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">
              {moto.name} × {price.days} day{price.days > 1 ? 's' : ''}
            </span>
            <span className="font-semibold text-slate-800">{peso(price.subtotal)}</span>
          </div>
          {price.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-500">Long-stay discount (10%)</span>
              <span className="font-semibold text-gold-600">− {peso(price.discount)}</span>
            </div>
          )}
          <div className="flex justify-between pt-1 text-base font-extrabold">
            <span>Total</span>
            <span className="text-gold-600">{peso(price.total)}</span>
          </div>
          <p className="pt-1 text-[11px] text-slate-400">
            Refundable {peso(moto.deposit)} security deposit collected at pickup. 10% off for 7+
            day rentals.
          </p>
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-400">
          Select your pickup and return dates to see the total.
        </p>
      )}

      {/* CTA — logged in: checkout button; logged out: sign-in prompt */}
      {!ready || user ? (
        <button
          type="button"
          disabled={!price}
          onClick={() =>
            router.push(`/checkout?moto=${moto.slug}&from=${from}&to=${to}`)
          }
          className="mt-4 w-full rounded-xl bg-gold-500 py-3 text-sm font-extrabold text-navy-950 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue to Checkout
        </button>
      ) : (
        <div className="mt-4 rounded-xl border border-gold-400/40 bg-slate-100 px-4 py-5 text-center">
          <p className="text-sm font-bold text-slate-800">Sign in to book this bike</p>
          <p className="mt-1 text-xs text-slate-500">
            Log in or create an account first — your dates and total will be waiting.
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              href={`/signin?next=${encodeURIComponent(
                `/checkout?moto=${moto.slug}&from=${from}&to=${to}`,
              )}`}
              className="flex-1 rounded-lg bg-gold-500 py-2.5 text-xs font-extrabold text-navy-950 text-center transition hover:bg-gold-400"
            >
              Login
            </Link>
            <Link
              href={`/register?next=${encodeURIComponent(
                `/checkout?moto=${moto.slug}&from=${from}&to=${to}`,
              )}`}
              className="flex-1 rounded-lg border border-gold-500/60 py-2.5 text-xs font-bold text-gold-400 text-center transition hover:bg-gold-500/10"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
