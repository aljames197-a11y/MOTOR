import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMoto, motos, similarMotos } from '@/lib/data';
import { peso } from '@/lib/format';
import { MotoCard } from '@/components/MotoCard';
import { SectionHeading } from '@/components/SectionHeading';
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
      className="mt-0.5 h-4 w-4 shrink-0 text-gold-400"
      aria-hidden
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="text-xs text-steel" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gold-400">
          Home
        </Link>{' '}
        /{' '}
        <Link href="/motorcycles" className="hover:text-gold-400">
          Motorcycles
        </Link>{' '}
        / <span className="font-semibold text-cream">{moto.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative overflow-hidden rounded-3xl border border-navy-600/40">
            <img
              src={moto.image}
              alt={moto.name}
              className="h-[380px] w-full object-cover sm:h-[440px]"
            />
            {!moto.available && <Stamp text="Booked" />}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {['object-left', 'object-center', 'object-right'].map((pos) => (
              <div key={pos} className="overflow-hidden rounded-xl border border-navy-600/40">
                <img src={moto.image} alt="" className={`h-24 w-full object-cover ${pos}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-navy-800 px-3 py-1 text-xs font-semibold text-gold-300">
              {moto.category}
            </span>
            {moto.available ? (
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-400">
                Available now
              </span>
            ) : (
              <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400">
                Currently booked
              </span>
            )}
          </div>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{moto.name}</h1>
          <p className="mt-1 text-sm text-steel">
            {moto.brand} • {moto.year} • {moto.color}
          </p>
          <p className="mt-2 text-sm font-semibold text-gold-400">
            ★ {moto.rating} <span className="font-normal text-steel">({moto.reviews} rider reviews)</span>
          </p>

          <div className="mt-5">
            <p className="text-4xl font-black text-gold-400">
              {peso(moto.pricePerDay)}
              <span className="text-base font-bold text-steel">/day</span>
            </p>
            <p className="mt-1 text-xs text-steel">
              + {peso(moto.deposit)} refundable security deposit
            </p>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-steel">{moto.description}</p>

          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {moto.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-cream">
                <Check />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border border-navy-600/40 bg-navy-850/60 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold-400">Specifications</h3>
            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              {specs.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-navy-600/30 pb-2">
                  <dt className="text-steel">{k}</dt>
                  <dd className="text-right font-semibold text-cream">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6 rounded-2xl border border-navy-600/40 bg-navy-850/60 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold-400">
              What&apos;s included
            </h3>
            <ul className="mt-3 space-y-2">
              {INCLUDED.map((i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-steel">
                  <Check />
                  {i}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <BookingPanel moto={moto} />
          </div>
        </div>
      </div>

      <section className="mt-16">
        <SectionHeading eyebrow="Keep looking" title="Similar Bikes" link="/motorcycles" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((m) => (
            <MotoCard key={m.id} m={m} />
          ))}
        </div>
      </section>
    </div>
  );
}
