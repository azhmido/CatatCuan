export function Spinner({
  size = 'md',
  color = 'primary',
  className = '',
  label = 'Memuat...',
}) {
  const sizeMap = {
    xs: 'w-3.5 h-3.5 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-[2.5px]',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  }

  const colorMap = {
    primary: 'border-primary border-t-transparent',
    current: 'border-current border-t-transparent',
    secondary: 'border-secondary-foreground border-t-transparent',
    muted: 'border-text-muted border-t-transparent',
    white: 'border-white border-t-transparent',
  }

  return (
    <div
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <div
        className={`animate-spin rounded-full ${sizeMap[size] || sizeMap.md} ${
          colorMap[color] || colorMap.primary
        }`}
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}

export default Spinner
