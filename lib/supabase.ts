import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error(
    'Missing Supabase env vars. Make sure NEXT_PUBLIC_SUPABASE_URL and ' +
    'NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local and restart the dev server.',
  );
}

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'motorent.session',
  },
});

// ── Row types mirroring the actual Supabase schema ────────────────────────────

export interface ProfileRow {
  id: string;               // uuid — mirrors auth.users.id
  name: string | null;
  phone: string | null;
  license_no: string | null;
  created_at: string;
}

// NOTE: no user_id column — RLS is enforced via customer_email = auth.jwt()->>'email'
export interface BookingRow {
  id: string;               // "MR-XXXXXX"
  moto_id: string;          // FK → public.motos.id
  moto_slug: string;
  moto_name: string;
  brand: string;
  image: string;
  pickup: string;           // "YYYY-MM-DD"
  dropoff: string;
  days: number;
  rate: number;
  subtotal: number;
  discount: number;
  total: number;
  deposit: number;
  location: string;
  notes: string | null;
  status: 'upcoming' | 'completed' | 'cancelled';
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_license: string;
  created_at: string;
}

export interface MotoRow {
  id: string;
  name: string;
  brand: string;
  category: string;
  price_per_day: number;
  cc: number;
  transmission: string;
  fuel_tank: string;
  year: number;
  color: string;
  seat_height: string;
  image: string;
  available: boolean;
  deposit: number;
  rating: number;
  reviews: number;
  description: string;
  highlights: string[];
  tags: string[];
}
