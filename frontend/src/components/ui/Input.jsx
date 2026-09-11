import { forwardRef } from 'react'

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    type = 'text',
    id,
    name,
    placeholder,
    disabled = false,
    required = false,
    prefixIcon = null,
    suffixIcon = null,
    className = '',
    containerClassName = '',
    ...props
  },
  ref
) {
  const inputId = id || name || `input-${Math.random().toString(36).substring(2, 9)}`

  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1"
        >
          {label}
          {required && <span className="text-accent">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {prefixIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-text-muted">
            {prefixIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm rounded-base bg-surface text-text border transition-colors duration-150 placeholder:text-text-muted/50 focus:outline-none focus:ring-1 ${
            error
              ? 'border-danger focus:border-danger focus:ring-danger'
              : 'border-border focus:border-primary focus:ring-primary'
          } ${prefixIcon ? 'pl-10' : ''} ${suffixIcon ? 'pr-10' : ''} ${
            disabled ? 'opacity-40 cursor-not-allowed bg-surface-sunken' : ''
          } ${className}`}
          {...props}
        />

        {suffixIcon && (
          <div className="absolute right-3 flex items-center text-text-muted">
            {suffixIcon}
          </div>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-xs text-danger font-mono font-medium flex items-center gap-1">
          ! {error}
        </p>
      )}

      {!error && helperText && (
        <p id={`${inputId}-helper`} className="text-xs text-text-muted">
          {helperText}
        </p>
      )}
    </div>
  )
})

export default Input
