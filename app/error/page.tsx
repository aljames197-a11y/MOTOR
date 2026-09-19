'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[60vh] place-items-center bg-[#F7F5F0] text-sm text-slate-600">
          Loading…
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}

function ErrorContent() {
  const sp = useSearchParams();
  const msg = sp.get('msg') || 'Something went wrong while processing your booking.';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F7F5F0] px-4 py-24 text-center text-navy-950 sm:px-6">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border-4 border-red-500/60 bg-red-500/10">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="h-9 w-9 text-red-500"
          aria-hidden
        >
          <path d="M7 7l10 10M17 7L7 17" />
        </svg>
      </div>

      <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-red-500">
        Booking not processed
      </p>
      <h1 className="mt-2 text-3xl font-black">We couldn&apos;t complete that booking.</h1>
      <p className="mt-3 text-sm text-slate-600">{msg}</p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/motorcycles"
          className="rounded-xl bg-gold-500 px-6 py-3 text-sm font-extrabold text-navy-950 hover:bg-gold-400"
        >
          Browse Motorcycles
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-navy-950 hover:border-gold-500"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
