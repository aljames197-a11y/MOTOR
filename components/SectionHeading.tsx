export function SectionHeading({
  eyebrow,
  title,
  link,
  linkLabel,
}: {
  eyebrow?: string;
  title: string;
  link?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">{eyebrow}</p>
        )}
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
      </div>
      {link && (
        <a href={link} className="shrink-0 text-sm font-semibold text-gold-400 hover:text-gold-300">
          {linkLabel ?? 'View all'} →
        </a>
      )}
    </div>
  );
}
