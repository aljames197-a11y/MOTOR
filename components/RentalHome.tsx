import Link from 'next/link';
import { CATEGORIES, categoryCount, motos, type Category } from '@/lib/data';
import { MotoCard } from '@/components/MotoCard';
import { SectionHeading } from '@/components/SectionHeading';

const chips: { name: Category | 'All' }[] = [
  { name: 'All' },
  ...CATEGORIES.map((c) => ({ name: c as Category })),
];

const steps = [
  {
    n: '01',
    title: 'Pick your ride',
    body: 'Browse the fleet by category, brand, or budget. Every bike is inspected, insured, and ready to roll.',
    image: '/images/honda-click-125i.jpg',
  },
  {
    n: '02',
    title: 'Choose your dates',
    body: 'Select pickup and return dates. The total is calculated instantly — 10% off for rentals of 7 days or more.',
    image: '/images/yamaha-mt-15.jpg',
  },
  {
    n: '03',
    title: 'Confirm & ride',
    body: 'Verify your rider details, confirm the booking, and collect your keys at the nearest pickup location.',
    image: '/images/honda-adv-160.jpg',
  },
];

const why = [
  'Verified, insured bikes on every rental',
  'Pickup in Calinogon, Iloilo, or Bacolod',
  'Transparent daily rates — no hidden fees',
  'Helmets, multi-tool & phone mount included',
  '24/7 roadside support while you ride',
  'Free cancellation up to 48 hours before pickup',
];

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 h-4 w-4 shrink-0 text-gold-400"
      aria-hidden
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function RentalHome() {
  const featured = [motos[2], motos[4], motos[5], motos[3]];
  const popular = [motos[0], motos[1], motos[6], motos[7]];

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[560px] items-center overflow-hidden">
        <img
          src="/images/hero.jpg"
          alt="Rider on a coastal road at dusk"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-navy-950 via-navy-950/80 to-navy-950/20" />
        <div className="absolute inset-0 bg-linear-to-t from-navy-950 via-transparent to-navy-950/60" />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-400">
            Motorcycle Rental • Western Visayas
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            Rent the ride. <span className="text-gold-400">Own the road.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-steel sm:text-lg">
            From city scooters at ₱650/day to a 399cc twin, MotoRent gets you rolling with verified
            bikes, instant booking, and fair daily rates.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/motorcycles"
              className="rounded-xl bg-gold-500 px-6 py-3 text-sm font-extrabold text-navy-950 transition hover:bg-gold-400"
            >
              Browse Motorcycles
            </Link>
            <a
              href="#how-it-works"
              className="rounded-xl border border-cream/25 px-6 py-3 text-sm font-bold text-cream transition hover:border-gold-400 hover:text-gold-300"
            >
              How it works
            </a>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6">
            {[
              ['8', 'Bikes in the fleet'],
              ['₱650', 'Daily rate from'],
              ['4.8★', 'Average rider rating'],
            ].map(([v, k]) => (
              <div key={k}>
                <dt className="order-2 text-xs text-steel">{k}</dt>
                <dd className="text-2xl font-extrabold text-gold-400">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Wide coastal band */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-navy-600/40">
          <img
            src="/images/honda-adv-160.jpg"
            alt="Adventure scooter on a coastal road"
            className="h-60 w-full object-cover sm:h-72"
          />
          <div className="absolute inset-0 bg-linear-to-r from-navy-950/80 via-navy-950/30 to-transparent" />
          <div className="absolute left-5 top-5 max-w-sm rounded-2xl border border-navy-600/50 bg-navy-900/85 p-5 backdrop-blur sm:left-6 sm:top-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">Island ready</p>
            <p className="mt-1.5 font-extrabold">From town streets to coastline in one tank of gas.</p>
            <Link
              href="/motorcycles?cat=Trail"
              className="mt-3 inline-block text-sm font-semibold text-gold-400 hover:text-gold-300"
            >
              See trail bikes →
            </Link>
          </div>
        </div>
      </section>

      {/* Category chips */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <div className="flex flex-wrap gap-3">
          {chips.map((c) => (
            <Link
              key={c.name}
              href={c.name === 'All' ? '/motorcycles' : `/motorcycles?cat=${c.name}`}
              className="rounded-full border border-navy-600 bg-navy-850 px-4 py-2 text-sm font-semibold text-steel transition hover:border-gold-500/60 hover:text-gold-300"
            >
              {c.name} <span className="ml-1 text-xs text-gold-400">{categoryCount(c.name)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeading eyebrow="Hand-picked" title="Featured Rentals" link="/motorcycles" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((m) => (
            <MotoCard key={m.id} m={m} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y border-navy-600/30 bg-navy-900/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <SectionHeading eyebrow="Three steps" title="How it works" />
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="overflow-hidden rounded-2xl border border-navy-600/40 bg-navy-850">
                <img src={s.image} alt="" className="h-36 w-full object-cover" />
                <div className="p-6">
                  <span className="text-3xl font-black text-gold-500/80">{s.n}</span>
                  <h3 className="mt-3 text-lg font-extrabold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why MotoRent */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="rounded-3xl border border-navy-600/40 bg-navy-850 p-8 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">Why MotoRent</p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Built for local roads, built for you.
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {why.map((w) => (
              <div
                key={w}
                className="flex items-start gap-3 rounded-xl border border-navy-600/30 bg-navy-900/60 px-4 py-3 text-sm text-cream"
              >
                <Check />
                {w}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular this month */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
        <SectionHeading eyebrow="Riders love these" title="Popular This Month" link="/motorcycles" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((m) => (
            <MotoCard key={m.id} m={m} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-gold-500/30 bg-linear-to-r from-navy-800 to-navy-850 p-10 text-center sm:p-14">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-500/10 blur-2xl" />
          <h2 className="relative text-2xl font-extrabold sm:text-3xl">Ready to hit the road?</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-sm text-steel sm:text-base">
            Book in under two minutes. Free cancellation up to 48 hours before pickup. Rates from
            ₱650/day.
          </p>
          <Link
            href="/motorcycles"
            className="relative mt-7 inline-block rounded-xl bg-gold-500 px-8 py-3.5 text-sm font-extrabold text-navy-950 transition hover:bg-gold-400"
          >
            Start Booking
          </Link>
        </div>
      </section>
    </>
  );
}
