import Link from 'next/link';

const explore = [
  { label: 'Browse Motorcycles', href: '/motorcycles' },
  { label: 'Scooters', href: '/motorcycles?cat=Scooter' },
  { label: 'Sport Bikes', href: '/motorcycles?cat=Sport' },
  { label: 'Trail & Off-Road', href: '/motorcycles?cat=Off-Road' },
];

const support = [
  { label: 'My Bookings', href: '/profile' },
  { label: 'Sign In', href: '/signin' },
  { label: 'Create Account', href: '/register' },
  { label: 'Contact Us', href: '#contact' },
];

const socials = [
  {
    label: 'Facebook',
    path: 'M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V11H8.3v3h2.4v7h2.8Z',
  },
  {
    label: 'Instagram',
    path: 'M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Zm0 5.9a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6Zm4.6-6.1a.84.84 0 1 1-1.68 0 .84.84 0 0 1 1.68 0ZM12 4.5c-2 0-2.3 0-3.1.05a5.6 5.6 0 0 0-1.9.36 4 4 0 0 0-2.3 2.3c-.27.6-.36 1.2-.36 1.9C4.3 9.9 4.3 10.2 4.3 12s0 2.1.05 2.9c.05.7.14 1.3.36 1.9a4 4 0 0 0 2.3 2.3c.6.27 1.2.36 1.9.36.8.05 1.1.05 3.1.05s2.3 0 3.1-.05c.7-.05 1.3-.14 1.9-.36a4 4 0 0 0 2.3-2.3c.27-.6.36-1.2.36-1.9.05-.8.05-1.1.05-2.9s0-2.1-.05-2.9c-.05-.7-.14-1.3-.36-1.9a4 4 0 0 0-2.3-2.3 5.6 5.6 0 0 0-1.9-.36C14.3 4.5 14 4.5 12 4.5Z',
  },
  {
    label: 'YouTube',
    path: 'M23 12s0-3.9-.5-5.8c-.3-1-1.1-1.8-2.1-2C18.5 3.7 12 3.7 12 3.7s-6.5 0-8.4.5c-1 .3-1.8 1.1-2.1 2C1 8.1 1 12 1 12s0 3.9.5 5.8c.3 1 1.1 1.8 2.1 2 1.9.5 8.4.5 8.4.5s6.5 0 8.4-.5c1-.3 1.8-1.1 2.1-2 .5-1.9.5-5.8.5-5.8ZM9.8 15.5v-7l6 3.5-6 3.5Z',
  },
  {
    label: 'LinkedIn',
    path: 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z',
  },
];

function SocialIcon({ label, path }: { label: string; path: string }) {
  return (
    <a
      href="#contact"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-navy-600 text-steel transition hover:border-gold-500/60 hover:text-gold-400"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
        <path d={path} />
      </svg>
    </a>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="border-t border-navy-600/30 bg-navy-900">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/images/logo.jpg" alt="AJL" className="h-9 w-9 rounded-lg object-cover" />
            <span className="text-lg font-extrabold tracking-tight text-cream">
              Moto<span className="text-gold-400">Rent</span>
            </span>
          </div>
          <ul className="mt-4 space-y-1.5 text-sm text-steel">
            <li>Calinogon Town Center</li>
            <li>3112 Calinogon, Iloilo, PH</li>
            <li className="pt-1 font-semibold text-cream">+63 917 555 0142</li>
            <li className="font-semibold text-cream">rentals@motorent.ph</li>
          </ul>
          <div className="mt-5 flex gap-2.5">
            {socials.map((s) => (
              <SocialIcon key={s.label} label={s.label} path={s.path} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-cream">Explore</h3>
          <ul className="mt-4 space-y-2.5">
            {explore.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-steel transition hover:text-gold-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-cream">Support</h3>
          <ul className="mt-4 space-y-2.5">
            {support.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-steel transition hover:text-gold-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-cream">Store Hours</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-steel">
            <li>
              <span className="text-cream">Weekdays:</span> 8 AM – 8 PM
            </li>
            <li>
              <span className="text-cream">Saturday:</span> 8 AM – 6 PM
            </li>
            <li>
              <span className="text-cream">Sunday:</span> 9 AM – 5 PM
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-600/30 py-5 text-center text-xs text-steel">
        © 2026 MotoRent PH. All rights reserved. Rates in Philippine pesos (₱).
      </div>
    </footer>
  );
}
