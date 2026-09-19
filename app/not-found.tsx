import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-4 text-center">
      <div>
        <p className="text-6xl font-black text-gold-400">404</p>
        <h1 className="mt-3 text-2xl font-extrabold">This road doesn&apos;t exist.</h1>
        <p className="mt-2 text-sm text-steel">
          The page you&apos;re looking for has been moved or never existed.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-gold-500 px-6 py-3 text-sm font-extrabold text-navy-950 hover:bg-gold-400"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
