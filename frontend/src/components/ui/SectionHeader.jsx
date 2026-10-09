export default function SectionHeader({ label, title, description, badge, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {label && <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">{label}</p>}
        {title && <h2 className="mt-2 text-3xl font-semibold text-zinc-900 sm:text-4xl">{title}</h2>}
        {description && <p className="mt-2 max-w-3xl text-zinc-600">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      {badge && !actions && (
        <div className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700">
          {badge}
        </div>
      )}
    </div>
  );
}
