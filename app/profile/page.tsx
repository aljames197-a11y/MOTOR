'use client';

import Link from 'next/link';
import { useBookings, type BookingStatus } from '@/lib/booking-context';
import { useAuth } from '@/lib/auth-context';
import { fmtDate, peso } from '@/lib/format';

function StatusBadge({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    upcoming: 'bg-gold-500/15 text-gold-400',
    completed: 'bg-emerald-400/10 text-emerald-400',
    cancelled: 'bg-red-500/10 text-red-400',
  };
  const labels: Record<BookingStatus, string> = {
    upcoming: 'Upcoming',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function ProfilePage() {
  const { bookings, loading } = useBookings();
  const { user, ready } = useAuth();

  // Still restoring session
  if (!ready) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-sm text-steel">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-16 sm:px-0">
        <div className="text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border-2 border-navy-600 bg-navy-850 text-2xl font-black text-steel">
            ?
          </div>
          <h1 className="mt-5 text-2xl font-black">You&apos;re not signed in</h1>
          <p className="mt-2 text-sm text-steel">
            Sign in or create an account to view your rider profile and booking history.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/signin"
              className="rounded-xl bg-gold-500 px-6 py-3 text-sm font-extrabold text-navy-950 hover:bg-gold-400">
              Sign In
            </Link>
            <Link href="/register"
              className="rounded-xl border border-cream/25 px-6 py-3 text-sm font-bold text-cream hover:border-gold-400 hover:text-gold-300">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const totalDays = bookings.reduce((s, b) => s + b.days, 0);
  const totalSpent = bookings.reduce((s, b) => s + b.total, 0);

  const favorite = (() => {
    const counts: Record<string, number> = {};
    for (const b of bookings) counts[b.motoName] = (counts[b.motoName] ?? 0) + 1;
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : '—';
  })();

  const stats: [string, string][] = [
    ['Total bookings', String(bookings.length)],
    ['Days on the road', String(totalDays)],
    ['Total rented', peso(totalSpent)],
    ['Favorite bike', favorite],
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Profile card */}
      <div className="flex flex-wrap items-center gap-5 rounded-3xl border border-navy-600/40 bg-navy-850 p-6">
        <div className="grid h-20 w-20 place-items-center rounded-full border-2 border-gold-500 bg-navy-800 text-2xl font-black text-gold-400">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-black">{user.name}</h1>
          <p className="mt-0.5 text-sm text-steel">
            {user.licenseNo ? `License ${user.licenseNo} • ` : ''}Class &ldquo;B&rdquo;
          </p>
          <p className="mt-0.5 text-xs text-steel">
            {user.email}{user.phone ? ` • ${user.phone}` : ''}
          </p>
          <span className="mt-2 inline-block rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-400">
            ✓ Verified rider
          </span>
        </div>
        <Link href="/motorcycles"
          className="ml-auto rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-extrabold text-navy-950 transition hover:bg-gold-400">
          + New Rental
        </Link>
      </div>

      {/* Stats */}
      <dl className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-navy-600/40 bg-navy-850 p-4">
            <dt className="text-xs text-steel">{k}</dt>
            <dd className="mt-1 truncate text-lg font-extrabold text-gold-400" title={v}>{v}</dd>
          </div>
        ))}
      </dl>

      {/* Booking history */}
      <h2 className="mt-10 text-xl font-extrabold">Booking history</h2>

      {loading ? (
        <div className="mt-6 text-sm text-steel">Loading bookings…</div>
      ) : bookings.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-navy-600 p-14 text-center">
          <p className="font-bold">No bookings yet.</p>
          <p className="mt-1 text-sm text-steel">Your confirmed rentals will show up here.</p>
          <Link href="/motorcycles"
            className="mt-5 inline-block rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-extrabold text-navy-950 hover:bg-gold-400">
            Browse Motorcycles
          </Link>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {bookings.map((b) => (
            <Link key={b.id} href={`/bookings/${b.id}`}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-navy-600/40 bg-navy-850 p-4 transition hover:border-gold-500/50">
              <img src={b.image} alt={b.motoName}
                className="h-16 w-24 rounded-lg border border-navy-600/40 object-cover" />
              <div className="min-w-0">
                <p className="font-bold">
                  {b.motoName}{' '}
                  <span className="ml-1 text-xs font-semibold text-steel">{b.id}</span>
                </p>
                <p className="mt-0.5 truncate text-xs text-steel">
                  {fmtDate(b.pickup)} → {fmtDate(b.dropoff)} • {b.days} day{b.days > 1 ? 's' : ''} • {b.location}
                </p>
              </div>
              <div className="ml-auto text-right">
                <StatusBadge status={b.status} />
                <p className="mt-1.5 text-sm font-extrabold text-gold-400">{peso(b.total)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
