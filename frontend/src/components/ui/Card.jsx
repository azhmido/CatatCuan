export function Card({
  children,
  variant = 'default', // 'default' | 'receipt' | 'stat' | 'stat-revenue' | 'stat-pending' | 'stat-danger' | 'interactive'
  className = '',
  onClick,
  ...props
}) {
  const variantStyles = {
    // 1. Default structured paper document
    default:
      'bg-surface text-text border border-border rounded-base shadow-card transition-all duration-200',

    // 2. Signature Invoice / Receipt: Crisp paper with emerald top bar and perforated accents
    receipt:
      'relative bg-surface text-text border border-border rounded-base shadow-card overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-primary',

    // 3. Stat Card Neutral
    stat:
      'bg-surface text-text border border-border rounded-base p-5 shadow-card transition-all duration-150 hover-lift',

    // 4. Stat Card: Revenue
    'stat-revenue':
      'bg-surface text-text border border-border rounded-base p-5 shadow-card transition-all duration-150 hover-lift',

    // 5. Stat Card: Pending
    'stat-pending':
      'bg-surface text-text border border-border rounded-base p-5 shadow-card transition-all duration-150 hover-lift',

    // 6. Stat Card: Overdue
    'stat-danger':
      'bg-surface text-text border border-border rounded-base p-5 shadow-card transition-all duration-150 hover-lift',

    // 7. Interactive List Item
    interactive:
      'bg-surface text-text border border-border rounded-base hover:border-emerald-600/40 active:bg-secondary/40 hover-lift cursor-pointer transition-all duration-150',
  }

  return (
    <div
      onClick={onClick}
      className={`${variantStyles[variant] || variantStyles.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '', perforated = false, ...props }) {
  return (
    <div
      className={`p-4 sm:p-5 flex flex-col gap-1 border-b ${
        perforated ? 'border-dashed border-border-dashed' : 'border-border/70'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '', as = 'h3', ...props }) {
  const Component = as
  return (
    <Component
      className={`text-base sm:text-lg font-bold text-text font-heading tracking-tight ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={`text-xs text-text-muted ${className}`} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`p-4 sm:p-5 ${className}`} {...props}>
      {children}
    </div>
  )
}

/**
 * Clean Section Divider inside Cards
 */
export function CardPerforation({ className = '' }) {
  return (
    <div className={`w-full my-2 border-t border-dashed border-border-dashed ${className}`} />
  )
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div
      className={`p-4 sm:p-5 pt-0 sm:pt-0 flex items-center border-t border-border/70 mt-auto ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
