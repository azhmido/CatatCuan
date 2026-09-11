import { NavLink, Link } from 'react-router-dom'

export function BottomNav() {
  return (
    <nav
      aria-label="Navigasi Bawah Mobile"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0a1812] border-t border-[#14281f] text-slate-300 transition-colors safe-area-pb"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `touch-target flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors pressable ${
              isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`
          }
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          <span className="text-[10px] font-sans tracking-tight mt-0.5">Ringkasan</span>
        </NavLink>

        {/* Invoices */}
        <NavLink
          to="/invoices"
          className={({ isActive }) =>
            `touch-target flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors pressable ${
              isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`
          }
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="text-[10px] font-sans tracking-tight mt-0.5">Invoice</span>
        </NavLink>

        {/* Floating Quick Action */}
        <Link
          to="/invoices/new"
          className="touch-target -mt-5 flex items-center justify-center w-12 h-12 rounded-base bg-emerald-700 text-white shadow-md active:scale-95 transition-all pressable border border-emerald-600 hover:bg-emerald-600"
          aria-label="Buat Invoice Baru"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </Link>

        {/* Clients */}
        <NavLink
          to="/clients"
          className={({ isActive }) =>
            `touch-target flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors pressable ${
              isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`
          }
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="text-[10px] font-sans tracking-tight mt-0.5">Klien</span>
        </NavLink>

        {/* Pembayaran */}
        <NavLink
          to="/payments"
          className={({ isActive }) =>
            `touch-target flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors pressable ${
              isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`
          }
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="text-[10px] font-sans tracking-tight mt-0.5">Bayar</span>
        </NavLink>
      </div>
    </nav>
  )
}

export default BottomNav
