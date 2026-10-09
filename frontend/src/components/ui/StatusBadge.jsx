const STATUS_CLASSES = {
  verified: 'bg-green-500/20 text-green-400 border border-green-500/30',
  embedded: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  extracted: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  uploaded: 'bg-slate-700/20 text-slate-200 border border-slate-700/50',
  processed: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  critical: 'bg-red-500/20 text-red-400 border border-red-500/30'
};

export default function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${STATUS_CLASSES[status?.toLowerCase()] || STATUS_CLASSES.uploaded}`}>
      {status || 'Unknown'}
    </span>
  );
}
