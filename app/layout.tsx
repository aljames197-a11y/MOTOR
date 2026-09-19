import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { BookingProvider } from '@/lib/booking-context';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'MotoRent — Motorcycle Rental in the Philippines',
    template: '%s | MotoRent',
  },
  description:
    'Rent motorcycles across the Western Visayas region. Daily rates from ₱650, verified bikes, instant online booking.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-navy-950 font-sans text-cream">
        <AuthProvider>
          <BookingProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
