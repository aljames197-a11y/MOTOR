import Link from 'next/link';
import type { Moto } from '@/lib/data';
import { peso } from '@/lib/format';
import { Stamp } from './Stamp';

export function MotoCard({ m }: { m: Moto }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy-600/40 bg-navy-850 transition duration-300 hover:-translate-y-1 hover:border-gold-500/60 hover:shadow-xl hover:shadow-black/40">
      <div className="flex items-center justify-between gap-2 px-4 pt-3.5">
        <h3 className="truncate text-sm font-bold text-cream transition group-hover:text-gold-300">
          <Link href={`/motorcycles/${m.slug}`}>{m.name}</Link>
        </h3>
        <p className="shrink-0 text-sm font-extrabold text-gold-400">
          {peso(m.pricePerDay)}
          <span className="text-[10px] font-semibold text-steel">/day</span>
        </p>
      </div>

      <Link
        href={`/motorcycles/${m.slug}`}
        className="relative m-4 mt-3 block h-40 overflow-hidden rounded-xl"
      >
        <img
          src={m.image}
          alt={m.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-navy-900/70 via-transparent to-transparent" />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-navy-900/85 px-2.5 py-0.5 text-[11px] font-semibold text-gold-300">
          {m.category}
        </span>
        <span className="absolute right-2.5 top-2.5 rounded-full bg-navy-900/85 px-2.5 py-0.5 text-[11px] font-semibold text-cream">
          ★ {m.rating}
        </span>
        {!m.available && <Stamp text="Booked" />}
      </Link>

      <div className="px-4">
        <p className="text-[11px] text-steel">
          {m.brand} • {m.cc} cc • {m.transmission}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2 px-4 pb-4">
        <Link
          href={`/motorcycles/${m.slug}`}
          className="flex-1 rounded-lg border border-navy-600 px-3 py-2 text-center text-xs font-semibold text-steel transition hover:border-gold-500/60 hover:text-gold-300"
        >
          Details
        </Link>
        {m.available ? (
          <Link
            href={`/checkout?moto=${m.slug}`}
            className="flex-1 rounded-lg bg-gold-500 px-3 py-2 text-center text-xs font-extrabold text-navy-950 transition hover:bg-gold-400"
          >
            Book Now
          </Link>
        ) : (
          <span className="flex-1 rounded-lg border border-navy-600 px-3 py-2 text-center text-xs font-semibold text-steel">
            Unavailable
          </span>
        )}
      </div>
    </article>
  );
}
