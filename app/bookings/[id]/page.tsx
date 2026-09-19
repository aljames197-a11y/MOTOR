import { BookingDetail } from '@/components/BookingDetail';

export const metadata = { title: 'Booking Details' };

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookingDetail id={id} />;
}
