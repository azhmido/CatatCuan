import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function getContextTitle(pathname) {
  if (pathname === '/dashboard') return 'Ringkasan'
  if (pathname === '/invoices/new') return 'Invoice Baru'
  if (pathname.includes('/invoices/') && pathname.endsWith('/edit')) return 'Edit Invoice'
  if (pathname.startsWith('/invoices/')) return 'Detail Invoice'
  if (pathname.startsWith('/invoices')) return 'Invoice'
  if (pathname === '/clients/new') return 'Tambah Klien'
  if (pathname.startsWith('/clients/')) return 'Detail Klien'
  if (pathname.startsWith('/clients')) return 'Klien'
  if (pathname.startsWith('/payments')) return 'Pembayaran'
  if (pathname.startsWith('/settings')) return 'Pengaturan'
  if (pathname.startsWith('/theme-preview')) return 'Design System'
  return 'Workspace'
}

export function Navbar({ title, onLogoutClick, onOpenMobileSidebar }) {
  const { tenant, logout, isAuthenticated } = useAuth()
  const location = useLocation()
  const displayTitle = title || getContextTitle(location.pathname)

  const handleLogoutAction = () => {
    if (onLogoutClick) {
      onLogoutClick()
    } else {
      logout()
    }
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-surface/90 backdrop-blur-md border-b border-border transition-colors">
      <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
        {/* Left: Mobile Brand or Page Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="lg:hidden flex items-center gap-1.5 sm:gap-2">
            {onOpenMobileSidebar && (
              <button
                type="button"
                onClick={onOpenMobileSidebar}
                aria-label="Buka menu navigasi"
                className="touch-target p-1.5 -ml-1 text-text hover:text-primary rounded-base hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-base bg-emerald-700 flex items-center justify-center text-white font-mono font-bold text-xs shadow-sm">
                CC
              </div>
              <span className="font-heading font-bold text-base tracking-tight text-text">
                CatatCuan
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs font-mono text-text-muted">Workspace /</span>
            <h1 className="text-sm sm:text-base font-bold text-text font-heading tracking-tight">
              {displayTitle}
            </h1>
          </div>
        </div>

        {/* Right Actions: Tenant Workspace & Logout */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <div className="flex items-center gap-3 pl-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-text leading-tight">
                  {tenant?.name || tenant?.tenantName || 'Freelancer'}
                </span>
                <span className="text-[10px] font-mono text-text-muted">
                  {tenant?.email || 'Workspace Aktif'}
                </span>
              </div>

              <div className="w-8 h-8 rounded-base bg-slate-100 border border-border flex items-center justify-center text-slate-800 font-mono font-bold text-xs">
                {(tenant?.name || tenant?.tenantName || 'U').charAt(0).toUpperCase()}
              </div>

              <button
                type="button"
                onClick={handleLogoutAction}
                title="Keluar / Logout"
                className="touch-target inline-flex items-center justify-center p-2 rounded-base text-text-muted hover:text-danger hover:bg-danger-bg transition-colors pressable"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
