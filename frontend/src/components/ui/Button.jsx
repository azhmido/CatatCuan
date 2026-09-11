import Spinner from './Spinner'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  icon = null,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) {
  const baseClasses =
    'relative inline-flex items-center justify-center font-sans font-medium select-none tracking-tight rounded-base transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 pressable'

  const variantClasses = {
    // Primary: Deep Pine Slate
    primary:
      'bg-primary text-primary-foreground border border-primary-dark shadow-sm hover:bg-primary-light active:scale-[0.99] font-medium',
    
    // Accent: Executive Emerald
    accent:
      'bg-emerald-700 text-white border border-emerald-800 hover:bg-emerald-600 shadow-sm active:scale-[0.99] font-medium',

    // Secondary: Neutral Stone
    secondary:
      'bg-secondary text-secondary-foreground border border-border hover:bg-secondary/70 active:bg-secondary/90 font-medium',

    // Outline: 1px clean border
    outline:
      'bg-surface text-text border border-border hover:border-border-dashed hover:bg-secondary/60 active:bg-secondary shadow-sm font-medium',

    // Ghost: Zero border, clean minimal hover
    ghost:
      'bg-transparent text-text-muted hover:bg-secondary hover:text-text active:bg-secondary/80 font-medium',

    // Destructive: Crimson alert
    destructive:
      'bg-rose-600 text-white border border-rose-700 shadow-sm hover:bg-rose-500 active:scale-[0.99] font-medium',
    danger:
      'bg-rose-600 text-white border border-rose-700 shadow-sm hover:bg-rose-500 active:scale-[0.99] font-medium',
  }

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 min-h-[36px] gap-1.5',
    md: 'text-sm px-4 py-2.5 min-h-[44px] gap-2', // Meets 44px mobile tap target
    lg: 'text-base px-6 py-3 min-h-[48px] gap-2.5 font-semibold',
  }

  const disabledClasses =
    disabled || isLoading
      ? 'opacity-40 cursor-not-allowed pointer-events-none filter grayscale'
      : 'cursor-pointer'
  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      aria-busy={isLoading}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${
        sizeClasses[size] || sizeClasses.md
      } ${disabledClasses} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" color="current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
        </>
      )}
    </button>
  )
}

export default Button
