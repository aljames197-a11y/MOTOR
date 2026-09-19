import type { Moto } from './data';

const PESO = '\u20B1'; // ₱

export function peso(n: number): string {
  return PESO + n.toLocaleString('en-PH');
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDaysISO(days: number, fromISO?: string): string {
  const d = fromISO ? new Date(fromISO + 'T00:00:00') : new Date();
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** Rental days counted inclusively (same-day pickup/return = 1 day). */
export function daysBetween(pickup: string, dropoff: string): number {
  const a = new Date(pickup + 'T00:00:00');
  const b = new Date(dropoff + 'T00:00:00');
  const diff = Math.round((b.getTime() - a.getTime()) / 86400000) + 1;
  return Math.max(1, diff);
}

export interface PriceBreakdown {
  days: number;
  subtotal: number;
  discount: number;
  total: number;
}

export function calcPrice(moto: Moto, days: number): PriceBreakdown {
  const subtotal = moto.pricePerDay * days;
  const discount = days >= 7 ? Math.round(subtotal * 0.1) : 0;
  return { days, subtotal, discount, total: subtotal - discount };
}

export function fmtDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
