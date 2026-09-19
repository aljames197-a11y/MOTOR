# MotoRent — Motorcycle Rental Website

A motorcycle **rental booking** website built from a dark navy + gold marketplace reference design.

## Stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/postcss`)
- **Linting:** ESLint 9 + `eslint-config-next`
- **Backend:** none — frontend prototype with mock data
- **Currency:** Philippine peso (₱)
- **State:** React Context + `localStorage` (auth session, accounts, booking history)

## Pages

| Route | Description |
| --- | --- |
| `/` | Homepage — hero, coastal band, category chips, featured rentals, how it works, why MotoRent, popular this month, CTA |
| `/motorcycles` | Listings — search, category/brand/price filters, sorting, pagination (URL-synced) |
| `/motorcycles/[slug]` | Detail — gallery, specs, what's included, date picker with live price calculation |
| `/checkout` | Rider details form + order summary (auto-filled when signed in) |
| `/success?b=ID` | Booking confirmation screen (green check + booking code) |
| `/error` | Booking failure screen (red X) |
| `/signin` | Sign in (mock auth + demo account) |
| `/register` | Create a rider account |
| `/profile` | Rider profile — stats + booking history (sign-in required) |
| `/bookings/[id]` | Full booking confirmation with rental timeline, payment summary, rider details |

## Auth (frontend prototype)

There is no backend — accounts and sessions are stored in the browser's `localStorage`.

- **Sign In / Register** buttons live in the navbar (mobile menu included)
- **Demo account:** `juan.dela.cruz@example.com` / `moto2026` (a "Fill demo credentials" helper is on the sign-in page)
- Registered accounts persist in `localStorage`; signing in auto-fills the checkout rider details
- When signed in, the navbar shows an avatar dropdown with **My Profile & Bookings** and **Sign Out**
- The profile page prompts for sign-in/register when signed out

## Fleet & pricing (mock)

| Motorcycle | Rate |
| --- | --- |
| Honda Click 125i | ₱650/day |
| Yamaha Mio Aerox | ₱850/day |
| Honda ADV 160 | ₱1,200/day |
| Yamaha NMAX | ₱1,000/day (marked **Booked**) |
| Kawasaki Ninja 400 | ₱1,800/day |
| Honda Rebel 500 | ₱2,000/day |
| Yamaha MT-15 | ₱950/day |
| Honda CRF 300L | ₱1,500/day |

### Price rules

- Daily rate × rental days (same-day pickup/return counts as 1 day)
- **10% long-stay discount** for rentals of 7+ days
- Refundable security deposit per bike (collected at pickup, not in the total)

## Run it

```bash
npm install
npm run dev     # development on http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

## Notes

- Booking flow is fully client-side: checkout saves the booking into context/localStorage and
  redirects to the confirmation screen; profile and booking detail read from the same store.
- Two seed bookings (one completed, one upcoming) pre-populate the profile so the history
  screens have content on first visit.
- All imagery is generated locally in `/public/images` — the site works fully offline.
"# motorent" 
