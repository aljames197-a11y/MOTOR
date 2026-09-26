'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase, type BookingRow } from './supabase';
import { useAuth } from './auth-context';

export interface BookingCustomer {
  name: string;
  phone: string;
  email: string;
  licenseNo: string;
}

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  motoId: string;
  motoSlug: string;
  motoName: string;
  brand: string;
  image: string;
  pickup: string;
  dropoff: string;
  days: number;
  rate: number;
  subtotal: number;
  discount: number;
  total: number;
  deposit: number;
  location: string;
  notes: string;
  status: BookingStatus;
  customer: BookingCustomer;
  createdAt: string;
}

interface BookingContextValue {
  bookings: Booking[];
  loading: boolean;
  addBooking: (b: Booking) => Promise<void>;
  getBooking: (id: string) => Booking | undefined;
  refresh: () => Promise<void>;
}

const BookingContext = createContext<BookingContextValue | null>(null);

function rowToBooking(r: BookingRow): Booking {
  return {
    id: r.id,
    motoId: r.moto_id,
    motoSlug: r.moto_slug,
    motoName: r.moto_name,
    brand: r.brand,
    image: r.image,
    pickup: r.pickup,
    dropoff: r.dropoff,
    days: r.days,
    rate: Number(r.rate),
    subtotal: Number(r.subtotal),
    discount: Number(r.discount),
    total: Number(r.total),
    deposit: Number(r.deposit),
    location: r.location,
    notes: r.notes ?? '',
    status: r.status,
    customer: {
      name: r.customer_name,
      phone: r.customer_phone,
      email: r.customer_email,
      licenseNo: r.customer_license,
    },
    createdAt: r.created_at,
  };
}

export function bookingCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = 'MR-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) { setBookings([]); return; }
    setLoading(true);
    // RLS filters by customer_email = auth.jwt()->>'email' automatically
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setBookings((data as BookingRow[]).map(rowToBooking));
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const value = useMemo<BookingContextValue>(
    () => ({
      bookings,
      loading,
      addBooking: async (b: Booking) => {
        if (!user) return;
        // No user_id column — the schema uses customer_email for RLS
        const row: Omit<BookingRow, 'created_at'> = {
          id: b.id,
          moto_id: b.motoId,
          moto_slug: b.motoSlug,
          moto_name: b.motoName,
          brand: b.brand,
          image: b.image,
          pickup: b.pickup,
          dropoff: b.dropoff,
          days: b.days,
          rate: b.rate,
          subtotal: b.subtotal,
          discount: b.discount,
          total: b.total,
          deposit: b.deposit,
          location: b.location,
          notes: b.notes,
          status: b.status,
          customer_name: b.customer.name,
          customer_phone: b.customer.phone,
          customer_email: b.customer.email,   // must match auth.jwt()->>'email'
          customer_license: b.customer.licenseNo,
        };
        const { error } = await supabase.from('bookings').insert(row);
        if (error) {
          console.error('Booking insert failed:', error.message);
          throw new Error(error.message);
        }
        setBookings((prev) => [b, ...prev]);
      },
      getBooking: (id) => bookings.find((b) => b.id === id),
      refresh,
    }),
    [bookings, loading, user, refresh],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBookings(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBookings must be used within a BookingProvider');
  return ctx;
}
