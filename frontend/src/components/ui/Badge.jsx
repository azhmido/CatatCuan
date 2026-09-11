export function Badge({
  children,
  variant = 'default',
  status = null, // 'draft' | 'terkirim' | 'lunas' | 'telat'
  size = 'md',
  className = '',
  dot = false,
  ...props
}) {
  let effectiveVariant = variant

  if (status) {
    const normalized = String(status).toLowerCase().trim()
    switch (normalized) {
      case 'lunas':
      case 'paid':
        effectiveVariant = 'lunas'
        break
      case 'terkirim':
      case 'sent':
        effectiveVariant = 'terkirim'
        break
      case 'telat':
      case 'overdue':
        effectiveVariant = 'telat'
        break
      case 'draft':
      default:
        effectiveVariant = 'draft'
        break
    }
  }

  // Clean & Modern FinTech Status Badges
  const variantStyles = {
    // LUNAS: Clean Emerald Pill
    lunas:
      'bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-semibold tracking-wide',

    // TELAT: Calm Crimson Pill
    telat:
      'bg-rose-50 text-rose-700 border border-rose-200 font-mono font-semibold tracking-wide',

    // TERKIRIM: Warm Amber Pill (Pending payment)
    terkirim:
      'bg-amber-50 text-amber-700 border border-amber-200 font-mono font-semibold tracking-wide',

    // DRAFT: Neutral Stone Pill
    draft:
      'bg-secondary text-text-muted border border-border font-mono font-medium',

    // Generic variants
    default:
      'bg-secondary text-text border border-border font-sans font-medium',
    primary:
      'bg-primary text-primary-foreground border border-primary font-mono font-medium',
    accent:
      'bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-semibold',
    outline:
      'bg-transparent text-text border border-border font-mono',
  }

  const dotColors = {
    lunas: 'bg-emerald-500',
    telat: 'bg-rose-500',
    terkirim: 'bg-amber-500',
    draft: 'bg-stone-400',
    default: 'bg-stone-400',
    primary: 'bg-primary-foreground',
    accent: 'bg-emerald-600',
    outline: 'bg-stone-600',
  }

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5 leading-tight',
    md: 'text-xs px-2.5 py-0.5 gap-1.5 leading-tight',
    lg: 'text-xs px-3 py-1 gap-2 leading-tight',
  }

  const displayContent = children || (status ? status.toUpperCase() : '')

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full select-none uppercase transition-colors ${
        variantStyles[effectiveVariant] || variantStyles.default
      } ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
              dotColors[effectiveVariant] || 'bg-current'
            }`}
            aria-hidden="true"
          />
        </span>
      )}
      <span>{displayContent}</span>
    </span>
  )
}

export default Badge
