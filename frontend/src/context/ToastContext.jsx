import { createContext, useState, useCallback } from 'react'

export const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message, type = 'success', duration = 3500) => {
      const id = Date.now() + Math.random()
      setToasts((prev) => [...prev, { id, message, type }])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
    },
    [removeToast]
  )

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Floating Toast Notification Container (No Print) */}
      <div
        aria-live="polite"
        className="fixed bottom-20 lg:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 flex flex-col gap-2 sm:max-w-sm w-auto sm:w-full pointer-events-none no-print"
      >
        {toasts.map((t) => {
          const typeStyles = {
            success: 'bg-[#0f291e] text-slate-100 border border-emerald-800/60 shadow-lg',
            error: 'bg-[#0f291e] text-slate-100 border border-rose-800/60 shadow-lg',
            info: 'bg-[#0f291e] text-slate-100 border border-emerald-800/60 shadow-lg',
          }

          const iconColor = {
            success: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50',
            error: 'text-rose-400 bg-rose-950/60 border-rose-800/50',
            info: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50',
          }

          const icons = {
            success: (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ),
            error: (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ),
            info: (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-base font-sans text-xs transition-all duration-200 animate-page-in ${
                typeStyles[t.type] || typeStyles.success
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-5 h-5 rounded-base border flex items-center justify-center font-bold text-xs shrink-0 ${iconColor[t.type] || iconColor.success}`}>
                  {icons[t.type] || icons.success}
                </span>
                <span className="font-medium truncate">{t.message}</span>
              </div>

              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="opacity-60 hover:opacity-100 p-1 text-xs shrink-0 cursor-pointer transition-opacity"
                aria-label="Tutup notifikasi"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider

