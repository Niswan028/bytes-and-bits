export default function InfoCard({ title, value, detail, accent = 'emerald', className = '' }) {
  const accentClasses = {
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    red: 'border-red-200 bg-red-50 text-red-700',
    purple: 'border-emerald-200 bg-emerald-50 text-emerald-700'
  };

  return (
    <div className={`rounded-[1.25rem] border px-5 py-5 shadow-sm ${accentClasses[accent] || accentClasses.emerald} ${className}`}>
      <p className="text-sm uppercase tracking-[0.24em] text-zinc-600">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-zinc-900">{value}</p>
      {detail && <p className="mt-2 text-sm text-zinc-700">{detail}</p>}
    </div>
  );
}
