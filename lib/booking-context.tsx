'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

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
  addBooking: (b: Booking) => void;
  getBooking: (id: string) => Booking | undefined;
}

const BookingContext = createContext<BookingContextValue | null>(null);
const STORAGE_KEY = 'motorent.bookings.v1';

const seed: Booking[] = [
  {
    id: 'MR-8H2KQD',
    motoId: 'm5',
    motoSlug: 'kawasaki-ninja-400',
    motoName: 'Kawasaki Ninja 400',
    brand: 'Kawasaki',
    image: '/images/kawasaki-ninja-400.jpg',
    pickup: '2026-08-02',
    dropoff: '2026-08-05',
    days: 4,
    rate: 1800,
    subtotal: 7200,
    discount: 0,
    total: 7200,
    deposit: 5000,
    location: 'Iloilo City — Plaza District',
    notes: '',
    status: 'completed',
    customer: {
      name: 'Juan Dela Cruz',
      phone: '+63 917 555 0142',
      email: 'juan.dela.cruz@example.com',
      licenseNo: 'PH-B 09171-2231-456',
    },
    createdAt: '2026-07-28T09:15:00.000Z',
  },
  {
    id: 'MR-3T7WPB',
    motoId: 'm3',
    motoSlug: 'honda-adv-160',
    motoName: 'Honda ADV 160',
    brand: 'Honda',
    image: '/images/honda-adv-160.jpg',
    pickup: '2026-09-21',
    dropoff: '2026-09-25',
    days: 5,
    rate: 1200,
    subtotal: 6000,
    discount: 0,
    total: 6000,
    deposit: 2500,
    location: 'Calinogon Town Center',
    notes: 'Coastal loop towards San Joaquin.',
    status: 'upcoming',
    customer: {
      name: 'Juan Dela Cruz',
      phone: '+63 917 555 0142',
      email: 'juan.dela.cruz@example.com',
      licenseNo: 'PH-B 09171-2231-456',
    },
    createdAt: '2026-09-10T14:05:00.000Z',
  },
];

export function bookingCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = 'MR-';
  for (let i = 0; i < 6; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(seed);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Booking[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBookings(parsed);
        }
      }
    } catch {
      /* ignore corrupted storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      /* storage unavailable */
    }
  }, [bookings, loaded]);

  const value = useMemo<BookingContextValue>(
    () => ({
      bookings,
      addBooking: (b) => setBookings((prev) => [b, ...prev]),
      getBooking: (id) => bookings.find((b) => b.id === id),
    }),
    [bookings],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBookings(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return ctx;
}
