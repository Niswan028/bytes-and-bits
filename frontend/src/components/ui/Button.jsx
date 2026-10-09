const VARIANT_CLASSES = {
  primary: 'border border-emerald-400 bg-emerald-100 text-emerald-950 font-bold hover:bg-emerald-200 shadow-xs',
  secondary: 'border border-zinc-200 bg-white text-zinc-700 hover:border-emerald-300 hover:text-emerald-700',
  danger: 'bg-red-500 text-white hover:bg-red-400'
};

export default function Button({ children, type = 'button', variant = 'primary', className = '', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
