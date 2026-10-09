import { memo } from 'react';

function MetricCard({ label, value, icon: Icon, accent = 'text-emerald-600', bg = 'bg-emerald-50', description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
          {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
        </div>
        {Icon && (
          <div className={`rounded-xl p-3 ${bg}`}>
            <Icon className={`text-2xl ${accent}`} />
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(MetricCard);
