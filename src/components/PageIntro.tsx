/** Eyebrow, display headline, and standfirst — the opening of every content page. */
export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-500">{eyebrow}</p>
      <h1 className="mt-3 text-balance font-serif text-4xl leading-[1.08] text-ink-900 sm:text-5xl">
        {title}
      </h1>
      {children && <div className="mt-5 text-lg leading-relaxed text-ink-600">{children}</div>}
    </div>
  );
}
