'use client';

import { useAuth } from '@/lib/auth-context';
import { Landing } from './Landing';
import { RentalHome } from './RentalHome';

export function HomeRouter() {
  const { user } = useAuth();
  return user ? <RentalHome /> : <Landing />;
}
