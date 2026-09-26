import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMoto, motos, similarMotos } from '@/lib/data';
import { peso } from '@/lib/format';
import { BookingPanel } from '@/components/BookingPanel';
import { Stamp } from '@/components/Stamp';

export const metadata = { title: 'Motorcycle Details' };

export function generateStaticParams() {
  return motos.map((m) => ({ slug: m.slug }));
}

const INCLUDED = [
  'Comprehensive insurance included',
  'Two helmets included',
  'Multi-tool and phone mount',
  '24/7 roadside support',
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
      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
      aria-hidden
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export default async function MotoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const moto = getMoto(slug);
  if (!moto) notFound();

  const similar = similarMotos(moto, 3);

  const specs: [string, string][] = [
    ['Engine', `${moto.cc} cc, fuel-injected`],
    ['Transmission', moto.transmission],
    ['Fuel tank', moto.fuelTank],
    ['Seat height', moto.seatHeight],
    ['Model year', String(moto.year)],
    ['Color', moto.color],
  ];

  // 4 thumbnail slots showing different focal points via CSS scale
  const thumbCount = [0, 1, 2, 3];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">

        {/* Breadcrumb */}
        <nav className="mb-6 text-xs text-slate-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          {' / '}
          <Link href="/motorcycles" className="hover:text-slate-600">Motorcycles</Link>
          {' / '}
          <span className="font-semibold text-slate-700">{moto.name}</span>
        </nav>

        {/* ── MAIN GRID ── */}
        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">

          {/* LEFT — gallery + action buttons */}
          <div>
            {/* Main image */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <img
                src={moto.image}
                alt={moto.name}
                className="h-72 w-full object-contain sm:h-80"
              />
              {!moto.available && <Stamp text="Booked" />}
            </div>

            {/* 4 thumbnails */}
            <div className="mt-3 grid grid-cols-4 gap-2">
              {thumbCount.map((i) => (
                <div key={i} className="cursor-pointer overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-100 transition hover:border-gold-500">
                  <img
                    src={moto.image}
                    alt=""
                    className="h-16 w-full object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="mt-5 flex flex-col gap-2.5">
              {/* Specifications toggle — shows specs below on mobile */}
              <details className="group rounded-xl border border-slate-200">
                <summary className="flex cursor-pointer items-center justify-between rounded-xl bg-gold-500 px-5 py-3 text-sm font-bold text-navy-950 transition hover:bg-gold-400 list-none">
                  Specifications
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    className="h-4 w-4 transition group-open:rotate-180" aria-hidden>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 p-4 text-sm">
                  {specs.map(([k, v]) => (
                    <div key={k} className="border-b border-slate-100 pb-2">
                      <dt className="text-xs text-slate-500">{k}</dt>
                      <dd className="font-semibold text-slate-800">{v}</dd>
                    </div>
                  ))}
                </dl>
              </details>

              <Link
                href="/motorcycles"
                className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-gold-500 hover:text-gold-600"
              >
                Return to Showroom
              </Link>
            </div>

            {/* What's included */}
            <div className="mt-5 rounded-xl border border-slate-200 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                What&apos;s included
              </h3>
              <ul className="mt-2 space-y-1.5">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT — product info */}
          <div className="relative overflow-hidden">
            {/* Brand watermark — clipped within this column only */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-2 -top-2 select-none text-[8rem] font-black uppercase leading-none tracking-tighter text-slate-100 sm:text-[10rem]"
            >
              {moto.brand}
            </div>

            <div className="relative z-10">
              {/* Name */}
              <h1 className="text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-3xl">
                {moto.name}
              </h1>

              {/* Status */}
              <p className="mt-2 text-sm text-slate-500">
                Status:{' '}
                <span className={`font-semibold ${moto.available ? 'text-emerald-600' : 'text-red-500'}`}>
                  {moto.available ? 'Available' : 'Booked'}
                </span>
              </p>

              {/* Rating */}
              <p className="mt-1 text-sm text-slate-500">
                <span className="font-semibold text-gold-500">★ {moto.rating}</span>
                <span className="ml-1">({moto.reviews} rider reviews)</span>
              </p>

              {/* Price */}
              <p className="mt-4 text-3xl font-black text-slate-900">
                {peso(moto.pricePerDay)}
                <span className="text-lg font-semibold text-slate-500">/day</span>
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                + {peso(moto.deposit)} refundable security deposit
              </p>

              {/* Color swatch — using brand colour palette */}
              <div className="mt-5">
                <p className="text-sm font-semibold text-slate-600">Color(s)</p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    aria-label={moto.color}
                    className="h-7 w-7 rounded-full border-2 border-white shadow ring-2 ring-gold-500"
                    style={{ backgroundColor: colorHex(moto.color) }}
                  />
                  <button
                    type="button"
                    aria-label="Alternate colour"
                    className="h-7 w-7 rounded-full border-2 border-white shadow ring-1 ring-slate-300"
                    style={{ backgroundColor: altColorHex(moto.color) }}
                  />
                </div>
              </div>

              {/* Stock */}
              <p className="mt-4 text-sm text-slate-600">
                Stock:{' '}
                <span className="font-bold text-slate-900">
                  {moto.available ? '2' : '0'}
                </span>
              </p>

              {/* Description */}
              <p className="mt-4 text-sm leading-relaxed text-slate-500">{moto.description}</p>

              {/* Highlights */}
              <ul className="mt-4 grid grid-cols-2 gap-1.5">
                {moto.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-1.5 text-xs text-slate-600">
                    <Check />
                    {h}
                  </li>
                ))}
              </ul>

              {/* Add to Wishlist + Add to Cart */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-gold-500 hover:text-gold-600"
                >
                  <HeartIcon />
                  Add to Wishlist
                </button>
                <Link
                  href={`/checkout?moto=${moto.slug}`}
                  className="flex-1 rounded-xl bg-gold-500 px-4 py-2.5 text-center text-sm font-extrabold text-navy-950 transition hover:bg-gold-400"
                >
                  Add to Cart
                </Link>
              </div>

              {/* Booking panel */}
              <div className="mt-6">
                <BookingPanel moto={moto} />
              </div>
            </div>
          </div>
        </div>

        {/* ── CHECK OTHER MOTORCYCLES ── */}
        <section className="mt-14">
          <h2 className="text-center text-xl font-black text-slate-900">
            Check other motorcycles
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {similar.map((m) => (
              <Link
                key={m.id}
                href={`/motorcycles/${m.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-gold-400 hover:shadow-md"
              >
                <div className="overflow-hidden bg-slate-50">
                  <img
                    src={m.image}
                    alt={m.name}
                    className="h-36 w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-bold text-slate-800 group-hover:text-gold-600">
                    {m.name}{' '}
                    <span className="font-normal text-slate-400">({m.year})</span>
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-700">
                    {peso(m.pricePerDay)}
                    <span className="text-xs font-normal text-slate-400">/day</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

/** Map a colour name to a rough hex for the swatch */
function colorHex(color: string): string {
  const c = color.toLowerCase();
  if (c.includes('white') || c.includes('pearl')) return '#f1f1f1';
  if (c.includes('black')) return '#1a1a1a';
  if (c.includes('red')) return '#e02020';
  if (c.includes('green') || c.includes('lime')) return '#22c55e';
  if (c.includes('blue')) return '#3b82f6';
  if (c.includes('grey') || c.includes('gray')) return '#6b7280';
  if (c.includes('orange')) return '#f97316';
  if (c.includes('yellow')) return '#eab308';
  return '#94a3b8';
}

function altColorHex(color: string): string {
  const c = color.toLowerCase();
  if (c.includes('white') || c.includes('pearl')) return '#e8b400';
  if (c.includes('black')) return '#e02020';
  if (c.includes('red')) return '#1a1a1a';
  if (c.includes('green') || c.includes('lime')) return '#1a1a1a';
  if (c.includes('blue')) return '#1a1a1a';
  return '#e8b400';
}
