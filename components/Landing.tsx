import Link from 'next/link';

const tiles = [
  { label: 'OUR SHOWROOM', img: '/images/landing-hero.jpg', href: '/motorcycles', big: true },
  { label: 'BEST SELLERS', img: '/images/honda-adv-160.jpg', href: '/motorcycles', big: false },
  { label: 'OUR BIKES', img: '/images/kawasaki-ninja-400.jpg', href: '/motorcycles', big: false },
  { label: 'FEATURED', img: '/images/honda-rebel-500.jpg', href: '/motorcycles', big: false },
  { label: 'ALL CATEGORIES', img: '/images/honda-crf-300l.jpg', href: '/motorcycles', big: false },
];

const whyCopy = [
  'Since 2018, MotoRent has gathered hundreds of motorcycles — from quick city scooters to big twins — so whether you are testing them on the open road or simply finding a ride that fits, we are right here with you, available with you at every step.',
  'Our team knows these bikes inside out, with years of experience and tons of knowledge about them. No pressure and no bother — we help you talk through the options, fair daily rates, and we are happy to make you explore prices on any motorcycle.',
  'And we keep a large collection across many brands — Honda, Yamaha, Kawasaki and more — every bike inspected, insured and ready to go, so you can explore your choices and hit the road on a motorcycle that truly fits you.',
];

function Tile({ label, img, href, big }: (typeof tiles)[number]) {
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-xl border border-navy-600/40 ${
        big ? 'col-span-2 row-span-2' : ''
      }`}
    >
      <img
        src={img}
        alt={label}
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-navy-950/60 transition group-hover:bg-navy-950/40" />
      <span className="absolute inset-0 grid place-items-center p-4 text-center text-sm font-extrabold uppercase tracking-[0.2em] text-gold-400 sm:text-base">
        {label}
      </span>
    </Link>
  );
}

export function Landing() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[560px] items-center overflow-hidden sm:min-h-[600px]">
        <img
          src="/images/landing-hero.jpg"
          alt="Rider on a winding mountain road at dusk"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-navy-950 via-navy-950/75 to-navy-950/10" />
        <div className="absolute inset-0 bg-linear-to-t from-navy-950 via-transparent to-navy-950/50" />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6">
          <div className="max-w-lg">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-gold-400 sm:text-5xl">
              Find your dream motorcycle here!
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-steel sm:text-base">
              We have 100s of collections of new and used motorcycles from big names such as Honda,
              Yamaha, Kawasaki and more — find yours, your choice, and your style here.
            </p>
            <Link
              href="/motorcycles"
              className="mt-8 inline-block rounded-full bg-gold-500 px-8 py-3 text-sm font-extrabold text-navy-950 shadow-lg shadow-black/30 transition hover:bg-gold-400"
            >
              Let&apos;s find one
            </Link>
          </div>
        </div>
      </section>

      {/* Summer ride banner */}
      <section className="relative overflow-hidden">
        <img src="/images/summer.jpg" alt="Tropical coastal road" className="h-72 w-full object-cover sm:h-96" />
        <div className="absolute inset-0 bg-linear-to-r from-navy-950/70 via-navy-950/20 to-transparent" />
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6">
            <div className="max-w-md">
              <h2 className="text-3xl font-black uppercase leading-tight tracking-tight text-white drop-shadow-lg sm:text-4xl">
                Get ready for your summer ride
              </h2>
              <p className="mt-3 text-base font-medium text-white drop-shadow sm:text-lg">
                Save 10% off on rentals of 7 days or more
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/80">
                Valid until August 31, 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section id="why-us" className="bg-navy-900">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-14">
          <div className="overflow-hidden rounded-3xl border border-navy-600/40">
            <img src="/images/why-us.jpg" alt="Motorcycle handlebars at sunset" className="h-72 w-full object-cover lg:h-96" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Why us?</h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-steel sm:text-[15px]">
              {whyCopy.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid grid-cols-2 gap-3 auto-rows-[150px] sm:auto-rows-[170px] md:grid-cols-4">
            {tiles.map((t) => (
              <Tile key={t.label} {...t} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
