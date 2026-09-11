export function EmptyState({
  title = 'Belum Ada Transaksi Tercatat',
  description = 'Data yang Anda cari belum tersedia di buku besar workspace ini.',
  icon = null,
  action = null,
  className = '',
}) {
  const defaultReceiptIcon = (
    <div className="relative w-14 h-16 bg-surface border border-border rounded-sharp shadow-card flex flex-col justify-between p-2 mx-auto overflow-hidden">
      {/* Top mini receipt notch */}
      <div className="flex items-center justify-between border-b border-dashed border-border-dashed pb-1">
        <span className="w-4 h-1 bg-primary/20 rounded-xs" />
        <span className="w-2 h-1 bg-accent/40 rounded-xs" />
      </div>
      {/* Middle dotted lines */}
      <div className="space-y-1 my-auto">
        <div className="w-full h-1 bg-secondary rounded-xs" />
        <div className="w-3/4 h-1 bg-secondary rounded-xs" />
        <div className="w-1/2 h-1 bg-secondary rounded-xs" />
      </div>
      {/* Bottom perforation tick */}
      <div className="border-t border-dashed border-border-dashed pt-1 flex justify-end">
        <span className="w-3 h-1 bg-primary/40 rounded-xs" />
      </div>
    </div>
  )

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-base border border-dashed border-border-dashed bg-surface-sunken/40 ${className}`}
    >
      <div className="mb-4">
        {icon || defaultReceiptIcon}
      </div>

      <h3 className="text-base sm:text-lg font-bold text-text font-heading tracking-tight mb-1">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-text-muted max-w-sm mb-5 leading-relaxed">
        {description}
      </p>

      {action && <div className="inline-flex items-center">{action}</div>}
    </div>
  )
}

export default EmptyState
