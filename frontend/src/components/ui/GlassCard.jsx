export default function GlassCard({ children, className = '' }) {
  return (
    <div className={`rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] ${className}`}>
      {children}
    </div>
  );
}
