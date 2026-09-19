'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const close = () => {
    setMobileOpen(false);
    setMenuOpen(false);
  };

  const initials = user
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

  const motorActive = pathname.startsWith('/motorcycles');

  return (
    <header className="sticky top-0 z-50 border-b border-navy-600/30 bg-navy-900/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={close}>
          <img
            src="/images/logo.jpg"
            alt="AJL"
            className="h-10 w-10 rounded-lg border border-navy-600/40 object-cover"
          />
          <span className="text-lg font-extrabold tracking-tight text-cream">
            Moto<span className="text-gold-400">Rent</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/motorcycles"
            className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
              motorActive ? 'bg-navy-800 text-gold-400' : 'text-steel hover:bg-navy-800 hover:text-cream'
            }`}
          >
            Motorcycles
          </Link>
          <a
            href="#contact"
            className="rounded-lg px-3.5 py-2 text-sm font-semibold text-steel transition hover:bg-navy-800 hover:text-cream"
          >
            Contact Us
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-navy-600 py-1.5 pl-1.5 pr-2.5 transition hover:border-gold-500/60"
              >
                <span className="grid h-7 w-7 place-items-center rounded-md bg-gold-500 text-xs font-black text-navy-950">
                  {initials}
                </span>
                <span className="hidden max-w-[9rem] truncate text-sm font-semibold text-cream sm:block">
                  {user.name}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className={`h-4 w-4 text-steel transition ${menuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-navy-600/50 bg-navy-850 shadow-xl shadow-black/50">
                  <div className="border-b border-navy-600/40 px-4 py-3">
                    <p className="truncate text-sm font-bold text-cream">{user.name}</p>
                    <p className="truncate text-xs text-steel">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={close}
                    className="block px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-navy-800"
                  >
                    My Profile &amp; Bookings
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      close();
                      router.push('/');
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm font-semibold text-red-400 transition hover:bg-navy-800"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/register"
                className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-cream transition hover:text-gold-300 sm:block"
              >
                Register
              </Link>
              <Link
                href="/signin"
                className="rounded-lg bg-gold-500 px-5 py-2 text-sm font-extrabold text-navy-950 transition hover:bg-gold-400"
              >
                Login
              </Link>
            </>
          )}

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-navy-600 text-cream md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-navy-600/30 bg-navy-900 px-4 py-3 md:hidden">
          <Link
            href="/motorcycles"
            onClick={close}
            className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-cream hover:bg-navy-800"
          >
            Motorcycles
          </Link>
          <a
            href="#contact"
            onClick={close}
            className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-cream hover:bg-navy-800"
          >
            Contact Us
          </a>
          {user ? (
            <>
              <Link
                href="/profile"
                onClick={close}
                className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-gold-400 hover:bg-navy-800"
              >
                My Profile &amp; Bookings
              </Link>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  close();
                  router.push('/');
                }}
                className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-400 hover:bg-navy-800"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                onClick={close}
                className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-cream hover:bg-navy-800"
              >
                Register
              </Link>
              <Link
                href="/signin"
                onClick={close}
                className="block rounded-lg px-3 py-2.5 text-sm font-extrabold text-gold-400 hover:bg-navy-800"
              >
                Login
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
