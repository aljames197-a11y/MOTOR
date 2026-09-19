export type Category = 'Scooter' | 'Sport' | 'Naked' | 'Cruiser' | 'Trail' | 'Off-Road';

export interface Moto {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Category;
  pricePerDay: number;
  cc: number;
  transmission: string;
  fuelTank: string;
  year: number;
  color: string;
  seatHeight: string;
  image: string;
  available: boolean;
  deposit: number;
  rating: number;
  reviews: number;
  description: string;
  highlights: string[];
  tags: string[];
}

export const PICKUP_LOCATIONS = [
  'Calinogon Town Center',
  'Iloilo City — Plaza District',
  'Bacolod City — Minorcuart',
];

export const motos: Moto[] = [
  {
    id: 'm1',
    slug: 'honda-click-125i',
    name: 'Honda Click 125i',
    brand: 'Honda',
    category: 'Scooter',
    pricePerDay: 650,
    cc: 125,
    transmission: 'CVT (V-Matic)',
    fuelTank: '5.5 L',
    year: 2025,
    color: 'Pearl White',
    seatHeight: '750 mm',
    image: '/images/honda-click-125i.jpg',
    available: true,
    deposit: 2000,
    rating: 4.7,
    reviews: 214,
    description:
      'A featherweight city runabout with a smooth 125cc eSP+ engine. Low seat, tiny fuel bills, and zero-fuss ride-through traffic — the easiest way to get anywhere in town.',
    highlights: [
      '60 km/L fuel economy',
      'Lightweight 106 kg body',
      'LED headlight and indicators',
      'Low 750 mm seat height',
    ],
    tags: ['City', 'Beginner friendly', 'Fuel efficient'],
  },
  {
    id: 'm2',
    slug: 'yamaha-mio-aerox',
    name: 'Yamaha Mio Aerox',
    brand: 'Yamaha',
    category: 'Scooter',
    pricePerDay: 850,
    cc: 125,
    transmission: 'CVT',
    fuelTank: '5.0 L',
    year: 2024,
    color: 'Red / Black',
    seatHeight: '795 mm',
    image: '/images/yamaha-mio-aerox.jpg',
    available: true,
    deposit: 2000,
    rating: 4.8,
    reviews: 189,
    description:
      "Yamaha's sporty underbone with a wide stance and a punchy 125cc four-valve engine. Carves through corners, sports LED smart lighting, and a design that turns heads on every street.",
    highlights: ['12.5 kW four-valve engine', '14-inch sport wheels', 'LED smart lighting', 'Front disc brake'],
    tags: ['Sporty', 'City', 'LED lighting'],
  },
  {
    id: 'm3',
    slug: 'honda-adv-160',
    name: 'Honda ADV 160',
    brand: 'Honda',
    category: 'Trail',
    pricePerDay: 1200,
    cc: 160,
    transmission: 'CVT',
    fuelTank: '8.1 L',
    year: 2025,
    color: 'Matte Black',
    seatHeight: '795 mm',
    image: '/images/honda-adv-160.jpg',
    available: true,
    deposit: 2500,
    rating: 4.9,
    reviews: 156,
    description:
      "Honda's adventure scooter built for mixed surfaces. The 160cc eSP+ engine, long-travel suspension, and upright ergonomics make it the pick for provincial trips and coastal roads.",
    highlights: [
      '160cc eSP+ with idle-stop',
      'Long-travel suspension',
      'Upright adventure ergonomics',
      '8.1 L tank for long range',
    ],
    tags: ['Adventure', 'Provincial', 'Long range'],
  },
  {
    id: 'm4',
    slug: 'yamaha-nmax',
    name: 'Yamaha NMAX',
    brand: 'Yamaha',
    category: 'Scooter',
    pricePerDay: 1000,
    cc: 155,
    transmission: 'CVT',
    fuelTank: '7.5 L',
    year: 2024,
    color: 'Cosmic Black',
    seatHeight: '790 mm',
    image: '/images/yamaha-nmax.jpg',
    available: false,
    deposit: 2500,
    rating: 4.8,
    reviews: 203,
    description:
      'A refined maxiscooter with a 155cc liquid-cooled engine, a smart dashboard, and a big under-seat load. Comfortable for long days on the road with plenty of refinement for daily commuting.',
    highlights: ['155cc liquid-cooled engine', 'Full LED lighting', 'Huge under-seat storage', '7.5 L fuel tank'],
    tags: ['Maxi scooter', 'Comfort', 'Commuter'],
  },
  {
    id: 'm5',
    slug: 'kawasaki-ninja-400',
    name: 'Kawasaki Ninja 400',
    brand: 'Kawasaki',
    category: 'Sport',
    pricePerDay: 1800,
    cc: 399,
    transmission: '6-speed manual',
    fuelTank: '17 L',
    year: 2024,
    color: 'Lime Green / Black',
    seatHeight: '785 mm',
    image: '/images/kawasaki-ninja-400.jpg',
    available: true,
    deposit: 5000,
    rating: 4.9,
    reviews: 98,
    description:
      'A 399cc parallel-twin sportbike with a friendly, easy-to-ride character and razor-sharp looks. A proper sportbike experience without the big-bore intimidation.',
    highlights: [
      '399cc liquid-cooled twin',
      '41 mm inverted front forks',
      'Power modes & traction control',
      '17 L tank range',
    ],
    tags: ['Sport', 'Twin engine', 'Track ready'],
  },
  {
    id: 'm6',
    slug: 'honda-rebel-500',
    name: 'Honda Rebel 500',
    brand: 'Honda',
    category: 'Cruiser',
    pricePerDay: 2000,
    cc: 471,
    transmission: '5-speed manual',
    fuelTank: '12.4 L',
    year: 2023,
    color: 'Matte Battle Black',
    seatHeight: '690 mm',
    image: '/images/honda-rebel-500.jpg',
    available: true,
    deposit: 5000,
    rating: 4.7,
    reviews: 87,
    description:
      'A 471cc V-twin cruiser with a low seat and a relaxed stance. Cruise the coastal roads with a deep, throaty idle — the most comfortable long-distance rental in the fleet.',
    highlights: ['471cc V-twin engine', 'Low 690 mm seat height', 'Dual front disc brakes', 'LED headlight'],
    tags: ['Cruiser', 'Long distance', 'V-twin'],
  },
  {
    id: 'm7',
    slug: 'yamaha-mt-15',
    name: 'Yamaha MT-15',
    brand: 'Yamaha',
    category: 'Naked',
    pricePerDay: 950,
    cc: 155,
    transmission: '6-speed manual',
    fuelTank: '9.5 L',
    year: 2024,
    color: 'Raiden Grey',
    seatHeight: '790 mm',
    image: '/images/yamaha-mt-15.jpg',
    available: true,
    deposit: 3000,
    rating: 4.6,
    reviews: 142,
    description:
      'A 155cc naked bike with a sharp angular design and a real six-speed gearbox. Light, playful, and the most affordable way to experience a proper manual motorcycle.',
    highlights: ['155cc VVA engine', '6-speed gearbox', 'LED daytime running lights', '135 kg lightweight chassis'],
    tags: ['Naked', 'Manual', 'Playful'],
  },
  {
    id: 'm8',
    slug: 'honda-crf-300l',
    name: 'Honda CRF 300L',
    brand: 'Honda',
    category: 'Off-Road',
    pricePerDay: 1500,
    cc: 286,
    transmission: '6-speed manual',
    fuelTank: '7.8 L',
    year: 2024,
    color: 'Candy Red',
    seatHeight: '880 mm',
    image: '/images/honda-crf-300l.jpg',
    available: true,
    deposit: 4000,
    rating: 4.8,
    reviews: 65,
    description:
      'A 286cc dual-sport with long-travel suspension and knobby tires. Beaches, rocks, mountain switchbacks — this is the bike you bring when the road runs out.',
    highlights: ['286cc single-cylinder engine', 'Long-travel suspension', 'Knobby off-road tires', '7.8 L fuel tank'],
    tags: ['Off-road', 'Dirt', 'Adventure'],
  },
];

export const CATEGORIES: Category[] = ['Scooter', 'Sport', 'Naked', 'Cruiser', 'Trail', 'Off-Road'];

export const BRANDS: string[] = Array.from(new Set(motos.map((m) => m.brand))).sort();

export function categoryCount(cat: Category | 'All'): number {
  return cat === 'All' ? motos.length : motos.filter((m) => m.category === cat).length;
}

export function getMoto(slug: string): Moto | undefined {
  return motos.find((m) => m.slug === slug);
}

export function similarMotos(moto: Moto, count = 3): Moto[] {
  const sameCategory = motos.filter((m) => m.id !== moto.id && m.category === moto.category);
  const rest = motos.filter((m) => m.id !== moto.id && m.category !== moto.category);
  return [...sameCategory, ...rest].slice(0, count);
}
