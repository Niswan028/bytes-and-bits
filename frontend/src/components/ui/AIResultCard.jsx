export default function AIResultCard({ title, finding, reason, evidence, action, badge, className = '' }) {
  return (
    <div className={`rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.04)] ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">AI Insight</p>
          <h4 className="mt-2 text-lg font-semibold text-zinc-900">{title}</h4>
        </div>
        {badge && <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{badge}</span>}
      </div>
      <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
        {finding && <p><span className="font-semibold text-zinc-900">Finding:</span> {finding}</p>}
        {reason && <p><span className="font-semibold text-zinc-900">Reason:</span> {reason}</p>}
        {evidence && <p><span className="font-semibold text-zinc-900">Evidence:</span> {evidence}</p>}
        {action && <p><span className="font-semibold text-zinc-900">Recommended action:</span> {action}</p>}
      </div>
    </div>
  );
}
