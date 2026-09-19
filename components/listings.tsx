'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { BRANDS, CATEGORIES, motos } from '@/lib/data';
import { MotoCard } from '@/components/MotoCard';

const PER_PAGE = 6;

const selectCls =
  'rounded-lg border border-navy-600 bg-navy-900 px-3 py-2.5 text-sm text-cream focus:border-gold-500 focus:outline-none';

function pick(v: string | string[] | undefined, fallback = ''): string {
  if (Array.isArray(v)) return v[0] ?? fallback;
  return v ?? fallback;
}

export function MotorcycleListings({
  initial,
}: {
  initial: Record<string, string | string[] | undefined>;
}) {
  const router = useRouter();
  const [q, setQ] = useState(() => pick(initial.q));
  const [cat, setCat] = useState(() => pick(initial.cat, 'All'));
  const [brand, setBrand] = useState(() => pick(initial.brand, 'All'));
  const [maxPrice, setMaxPrice] = useState(() => pick(initial.max, 'Any'));
  const [sort, setSort] = useState(() => pick(initial.sort, 'featured'));
  const [page, setPage] = useState(() => Math.max(1, Number(pick(initial.page, '1')) || 1));

  // Keep state in sync when the URL changes from outside (e.g. category chips on the home page).
  const initialKey = [
    pick(initial.q),
    pick(initial.cat, 'All'),
    pick(initial.brand, 'All'),
    pick(initial.max, 'Any'),
    pick(initial.sort, 'featured'),
    pick(initial.page, '1'),
  ].join('|');
  const [lastKey, setLastKey] = useState(initialKey);

  useEffect(() => {
    if (initialKey === lastKey) return;
    setLastKey(initialKey);
    setQ(pick(initial.q));
    setCat(pick(initial.cat, 'All'));
    setBrand(pick(initial.brand, 'All'));
    setMaxPrice(pick(initial.max, 'Any'));
    setSort(pick(initial.sort, 'featured'));
    setPage(Math.max(1, Number(pick(initial.page, '1')) || 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialKey]);

  // Reflect the current filter state back into the URL.
  useEffect(() => {
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (cat !== 'All') sp.set('cat', cat);
    if (brand !== 'All') sp.set('brand', brand);
    if (maxPrice !== 'Any') sp.set('max', maxPrice);
    if (sort !== 'featured') sp.set('sort', sort);
    if (page > 1) sp.set('page', String(page));
    const qs = sp.toString();
    router.replace(qs ? `/motorcycles?${qs}` : '/motorcycles', { scroll: false });
  }, [q, cat, brand, maxPrice, sort, page, router]);

  const filtered = useMemo(() => {
    let list = [...motos];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((m) =>
        `${m.name} ${m.brand} ${m.category} ${m.tags.join(' ')}`.toLowerCase().includes(s),
      );
    }
    if (cat !== 'All') list = list.filter((m) => m.category === cat);
    if (brand !== 'All') list = list.filter((m) => m.brand === brand);
    if (maxPrice !== 'Any') list = list.filter((m) => m.pricePerDay <= Number(maxPrice));
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case 'price-desc':
        list.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return list;
  }, [q, cat, brand, maxPrice, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, pages);
  const shown = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  function reset() {
    setQ('');
    setCat('All');
    setBrand('All');
    setMaxPrice('Any');
    setSort('featured');
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">The fleet</p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Browse Motorcycles</h1>
        <p className="text-sm text-steel">
          {filtered.length} motorcycle{filtered.length === 1 ? '' : 's'} found
        </p>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-navy-600/40 bg-navy-850 p-4 lg:grid-cols-[minmax(180px,1.4fr)_1fr_1fr_1fr_1fr_auto]">
        <label className="relative block">
          <span className="sr-only">Search</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-950/50"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search bikes…"
            className="w-full rounded-lg border border-transparent bg-cream py-2.5 pl-9 pr-3 text-sm font-medium text-navy-950 placeholder:text-navy-950/50 focus:border-gold-500 focus:outline-none"
          />
        </label>

        <select
          value={cat}
          onChange={(e) => {
            setCat(e.target.value);
            setPage(1);
          }}
          className={selectCls}
          aria-label="Category"
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            setPage(1);
          }}
          className={selectCls}
          aria-label="Brand"
        >
          <option value="All">All brands</option>
          {BRANDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            setPage(1);
          }}
          className={selectCls}
          aria-label="Maximum price"
        >
          <option value="Any">Any price</option>
          <option value="800">₱800 / day and under</option>
          <option value="1000">Up to ₱1,000 / day</option>
          <option value="1500">Up to ₱1,500 / day</option>
          <option value="2000">Up to ₱2,000 / day</option>
        </select>

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className={selectCls}
          aria-label="Sort"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>

        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-navy-600 px-4 py-2.5 text-sm font-semibold text-steel transition hover:border-gold-500/60 hover:text-gold-400"
        >
          Reset
        </button>
      </div>

      {shown.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((m) => (
            <MotoCard key={m.id} m={m} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-navy-600 p-16 text-center">
          <p className="text-lg font-bold">No motorcycles match your filters.</p>
          <p className="mt-1 text-sm text-steel">Try widening the price range or clearing the search.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-extrabold text-navy-950 hover:bg-gold-400"
          >
            Clear filters
          </button>
        </div>
      )}

      {pages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={safePage === 1}
            onClick={() => setPage(safePage - 1)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-navy-600 text-steel transition hover:border-gold-500/60 hover:text-gold-400 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous page"
          >
            ←
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              className={`h-10 w-10 rounded-lg text-sm font-bold transition ${
                n === safePage
                  ? 'bg-gold-500 text-navy-950'
                  : 'border border-navy-600 text-steel hover:border-gold-500/60 hover:text-gold-400'
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            disabled={safePage === pages}
            onClick={() => setPage(safePage + 1)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-navy-600 text-steel transition hover:border-gold-500/60 hover:text-gold-400 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Next page"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
