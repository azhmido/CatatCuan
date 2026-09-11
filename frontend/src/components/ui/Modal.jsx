import { useEffect, useRef } from 'react'

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'max-w-lg',
  className = '',
}) {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div
        ref={modalRef}
        className={`relative w-full ${maxWidth} bg-surface text-text border border-border rounded-radius shadow-card my-4 sm:my-8 z-10 overflow-hidden flex flex-col max-h-[90vh] transition-all transform ${className}`}
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
            <div>
              {title && (
                <h3 id="modal-title" className="text-base sm:text-lg font-semibold text-text">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs sm:text-sm text-text-muted mt-0.5">{description}</p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="touch-target inline-flex items-center justify-center p-2 rounded-radius text-text-muted hover:text-text hover:bg-secondary transition-colors"
              aria-label="Tutup dialog"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-4 sm:p-5 border-t border-border flex flex-wrap items-center justify-end gap-2.5 bg-secondary/20">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
