export default function MetricDisplay({ label, value, detail, tone = 'default', icon: Icon }) {
  const toneStyles = {
    default: 'border-zinc-200 bg-white text-zinc-900',
    accent: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    muted: 'border-zinc-100 bg-zinc-50 text-zinc-700'
  };

  return (
    <div className={`rounded-[1.25rem] border p-4 shadow-[0_12px_35px_rgba(15,23,42,0.03)] ${toneStyles[tone] || toneStyles.default}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
          {detail && <p className="mt-1 text-sm text-zinc-500">{detail}</p>}
        </div>
        {Icon && <div className="rounded-2xl bg-emerald-50 p-2.5"><Icon className="text-xl text-emerald-600" /></div>}
      </div>
    </div>
  );
}
