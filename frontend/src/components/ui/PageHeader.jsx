export default function PageHeader({ label, title, description, badge, actions, className = '' }) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.04)] sm:flex-row sm:items-end sm:justify-between">
        <div>
          {label && <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">{label}</p>}
          {title && <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">{title}</h1>}
          {description && <p className="mt-3 max-w-3xl text-zinc-600">{description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {badge && <div className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-700">{badge}</div>}
          {actions}
        </div>
      </div>
    </div>
  );
}
