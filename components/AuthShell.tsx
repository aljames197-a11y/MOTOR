import Link from 'next/link';
import type { ReactNode } from 'react';

function FlagIcon() {
  return (
    <svg viewBox="0 0 20 14" className="h-3 w-[22px] rounded-[2px]" aria-hidden>
      <rect width="20" height="14" fill="#F5F5F5" />
      {[0, 2.8, 5.6, 8.4, 11.2].map((y) => (
        <rect key={y} y={y} width="20" height="1.4" fill="#B22234" />
      ))}
      <rect width="9" height="7" fill="#3C3B6E" />
      <circle cx="2" cy="1.8" r="0.5" fill="#fff" />
      <circle cx="4.5" cy="1.8" r="0.5" fill="#fff" />
      <circle cx="7" cy="1.8" r="0.5" fill="#fff" />
      <circle cx="3.2" cy="3.6" r="0.5" fill="#fff" />
      <circle cx="5.7" cy="3.6" r="0.5" fill="#fff" />
      <circle cx="2" cy="5.4" r="0.5" fill="#fff" />
      <circle cx="4.5" cy="5.4" r="0.5" fill="#fff" />
      <circle cx="7" cy="5.4" r="0.5" fill="#fff" />
    </svg>
  );
}

function LangButton() {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
    >
      <FlagIcon />
      ENG
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-white">
      {/* Background photo (desktop) */}
      <img
        src="/images/auth-rider.jpg"
        alt=""
        className="absolute inset-0 hidden h-full w-full object-cover lg:block"
      />
      {/* White form panel (desktop) */}
      <div className="absolute inset-y-0 right-0 hidden w-[56%] rounded-l-[2.5rem] bg-white lg:block xl:w-[52%]" />

      {/* Brand over the photo (desktop) */}
      <Link
        href="/"
        className="absolute left-5 top-4 z-20 hidden items-center gap-2 sm:left-7 sm:top-5 lg:flex"
      >
        <img src="/images/logo.jpg" alt="AJL" className="h-9 w-9 rounded-lg object-cover" />
        <span className="text-lg font-extrabold tracking-tight text-white drop-shadow-lg">
          Moto<span className="text-gold-300">Rent</span>
        </span>
      </Link>

      {/* Brand on white (mobile / tablet) */}
      <Link href="/" className="absolute left-5 top-4 z-20 flex items-center gap-2 sm:left-7 sm:top-5 lg:hidden">
        <img src="/images/logo.jpg" alt="AJL" className="h-9 w-9 rounded-lg object-cover" />
        <span className="text-lg font-extrabold tracking-tight text-slate-900">
          Moto<span className="text-gold-500">Rent</span>
        </span>
      </Link>

      <div className="absolute right-5 top-4 z-20 sm:right-7 sm:top-5">
        <LangButton />
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center">
        <div className="w-full px-6 py-16 sm:px-12 lg:ml-auto lg:w-[56%] lg:px-14 xl:w-[52%] xl:px-16">
          {children}
        </div>
      </div>
    </div>
  );
}
