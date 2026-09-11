import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import BottomNav from './BottomNav'
import { Modal, Button } from '../ui'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'

export function AppShell({ title }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const { logout, tenant } = useAuth()
  const { toast } = useToast()

  const handleConfirmLogout = () => {
    setShowLogoutModal(false)
    logout()
    toast.info('Anda telah keluar.')
  }

  return (
    <div className="h-[100dvh] overflow-hidden bg-bg text-text flex flex-col font-body transition-colors">
      {/* Desktop Sidebar (lg breakpoint and above) & Mobile Slide-Over Drawer */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onLogoutClick={() => setShowLogoutModal(true)}
      />

      {/* Main Layout Area (offset for sidebar on desktop) */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          title={title}
          onLogoutClick={() => setShowLogoutModal(true)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-10 w-full mx-auto">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (base up to lg) */}
      <BottomNav />

      {/* Safety UX: Modal Konfirmasi Logout */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Keluar Akun"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLogoutModal(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmLogout}
            >
              Keluar
            </Button>
          </>
        }
      >
        <p className="text-sm text-text font-sans">
          Keluar dari akun <strong className="font-mono text-primary">{tenant?.name || tenant?.tenantName || ''}</strong>?
        </p>
      </Modal>
    </div>
  )
}

export default AppShell

