import { MotorcycleListings } from '@/components/listings';

export const metadata = { title: 'Browse Motorcycles' };

export default async function MotorcyclesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  return <MotorcycleListings initial={sp} />;
}
