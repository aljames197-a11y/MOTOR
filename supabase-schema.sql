-- ============================================================================
-- MotoRent PH — Supabase schema (reference copy — already applied)
-- ============================================================================

-- 1) motos — publicly readable fleet
-- 2) profiles — one row per auth user, auto-created on sign-up
-- 3) bookings — RLS via customer_email = auth.jwt()->>'email'

-- See Supabase dashboard for live schema.
-- This file is kept for reference / re-seeding only.
