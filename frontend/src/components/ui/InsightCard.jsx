export default function InsightCard({ eyebrow, title, body, footer, className = '' }) {
  return (
    <div className={`rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.04)] ${className}`}>
      {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">{eyebrow}</p>}
      {title && <h4 className="mt-2 text-lg font-semibold text-zinc-900">{title}</h4>}
      {body && <p className="mt-2 text-sm leading-6 text-zinc-600">{body}</p>}
      {footer && <div className="mt-4 text-sm font-medium text-emerald-600">{footer}</div>}
    </div>
  );
}
