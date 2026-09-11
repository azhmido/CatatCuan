import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AppShell from '../components/layout/AppShell'

// Application Pages
import {
  HomePage,
  LoginPage,
  RegisterPage,
  DashboardPage,
  ThemePreviewPage,
  ClientsPage,
  NewClientPage,
  ClientDetailPage,
  InvoicesPage,
  NewInvoicePage,
  InvoiceDetailPage,
  EditInvoicePage,
  PaymentsPage,
  SettingsPage,
} from '../pages'
import { Button, Card, CardContent } from '../components/ui'

function NotFoundPage() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-bg text-text">
      <Card className="max-w-md w-full text-center p-6 border-border shadow-card">
        <CardContent className="space-y-4">
          <div className="text-4xl font-bold font-heading text-primary">404</div>
          <h2 className="text-lg font-bold text-text font-heading">Halaman Tidak Ditemukan</h2>
          <p className="text-xs text-text-muted font-sans">
            Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <Link to="/">
              <Button variant="outline" size="sm">Halaman Beranda</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="primary" size="sm">Buka Dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<HomePage />} />

        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected App Routes under AppShell */}
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Clients Routes */}
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/clients/new" element={<NewClientPage />} />
          <Route path="/clients/:id" element={<ClientDetailPage />} />

          {/* Invoices Routes */}
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/invoices/new" element={<NewInvoicePage />} />
          <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
          <Route path="/invoices/:id/edit" element={<EditInvoicePage />} />

          {/* Payments Route */}
          <Route path="/payments" element={<PaymentsPage />} />

          {/* Settings & Business Profile */}
          <Route path="/settings" element={<SettingsPage />} />

          {/* Theme & Design System Preview Lab */}
          <Route path="/theme-preview" element={<ThemePreviewPage />} />
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
