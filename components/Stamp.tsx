export function Stamp({ text }: { text: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
      <span
        className="-rotate-12 rounded-md border-4 border-red-500/90 bg-navy-950/40 px-5 py-1.5 text-2xl font-black uppercase tracking-[0.3em] text-red-500"
        style={{ boxShadow: 'inset 0 0 0 2px rgba(10, 18, 38, 0.6)' }}
      >
        {text}
      </span>
    </div>
  );
}
