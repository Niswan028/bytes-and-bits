export default function PremiumCard({ eyebrow, title, description, children, action, className = '', tone = 'default' }) {
  const toneClasses = {
    default: 'border-zinc-200 bg-white text-zinc-900',
    muted: 'border-zinc-200 bg-zinc-50 text-zinc-800',
    accent: 'border-emerald-200 bg-emerald-50/80 text-zinc-900',
    dark: 'border-emerald-200 bg-emerald-50 text-zinc-900'
  };

  return (
    <section className={`rounded-[1.75rem] border p-6 shadow-[0_18px_45px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)] ${toneClasses[tone] || toneClasses.default} ${className}`}>
      {(eyebrow || title || description || action) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">{eyebrow}</p>}
            {title && <h3 className="mt-2 text-xl font-semibold">{title}</h3>}
            {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
