'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { Moto } from '@/lib/data';
import { calcPrice, daysBetween, peso, todayISO } from '@/lib/format';
import { useAuth } from '@/lib/auth-context';

function Row({ k, v, gold }: { k: string; v: string; gold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-steel">{k}</span>
      <span className={gold ? 'font-semibold text-gold-400' : 'font-semibold text-cream'}>{v}</span>
    </div>
  );
}

const inputCls =
  'mt-1 w-full rounded-lg border border-navy-600 bg-navy-900 px-3 py-2 text-sm text-cream focus:border-gold-500 focus:outline-none';

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
    <div className="rounded-2xl border border-gold-500/30 bg-navy-850 p-5">
      <h3 className="text-sm font-bold uppercase tracking-wider text-gold-400">Book this bike</h3>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="text-xs font-semibold text-steel">
          Pickup date
          <input
            type="date"
            min={todayISO()}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={inputCls}
          />
        </label>
        <label className="text-xs font-semibold text-steel">
          Return date
          <input
            type="date"
            min={from || todayISO()}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={inputCls}
          />
        </label>
      </div>

      {price ? (
        <div className="mt-4 space-y-1.5 border-t border-navy-600/50 pt-4 text-sm">
          <Row k={`${moto.name} × ${price.days} day${price.days > 1 ? 's' : ''}`} v={peso(price.subtotal)} />
          {price.discount > 0 && <Row k="Long-stay discount (10%)" v={`− ${peso(price.discount)}`} gold />}
          <div className="flex justify-between pt-1 text-base font-extrabold">
            <span>Total</span>
            <span className="text-gold-400">{peso(price.total)}</span>
          </div>
          <p className="pt-1 text-[11px] text-steel">
            Refundable {peso(moto.deposit)} security deposit collected at pickup. 10% off for 7+ day rentals.
          </p>
        </div>
      ) : (
        <p className="mt-4 text-xs text-steel">Select your pickup and return dates to see the total.</p>
      )}

      {!ready || user ? (
        <button
          type="button"
          disabled={!price}
          onClick={() => router.push(`/checkout?moto=${moto.slug}&from=${from}&to=${to}`)}
          className="mt-4 w-full rounded-xl bg-gold-500 py-3 text-sm font-extrabold text-navy-950 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue to Checkout
        </button>
      ) : (
        <div className="mt-4 rounded-xl border border-gold-500/30 bg-navy-900/60 p-4 text-center">
          <p className="text-sm font-bold text-cream">Sign in to book this bike</p>
          <p className="mt-1 text-xs text-steel">
            Log in or create an account first — your dates and total will be waiting.
          </p>
          <div className="mt-3 flex gap-2">
            <Link
              href={`/signin?next=${encodeURIComponent(`/checkout?moto=${moto.slug}&from=${from}&to=${to}`)}`}
              className="flex-1 rounded-lg bg-gold-500 px-3 py-2 text-xs font-extrabold text-navy-950 transition hover:bg-gold-400"
            >
              Login
            </Link>
            <Link
              href={`/register?next=${encodeURIComponent(`/checkout?moto=${moto.slug}&from=${from}&to=${to}`)}`}
              className="flex-1 rounded-lg border border-gold-500/60 px-3 py-2 text-xs font-bold text-gold-400 transition hover:bg-gold-500/10"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
