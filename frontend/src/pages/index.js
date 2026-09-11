/**
 * Pages Directory (Ketentuan Umum Frontend React - Struktur Folder Halaman)
 * Re-export seluruh halaman aplikasi untuk konsistensi struktur folder proyek
 */

export { default as LoginPage, LoginPage as Login } from '../features/auth/LoginPage'
export { default as RegisterPage, RegisterPage as Register } from '../features/auth/RegisterPage'
export { default as DashboardPage, DashboardPage as Dashboard } from '../features/dashboard/DashboardPage'
export { default as ThemePreviewPage } from '../features/dashboard/ThemePreviewPage'
export { default as HomePage } from '../features/home/HomePage'

export { default as ClientsPage, ClientsPage as Clients } from '../features/clients/ClientsPage'
export { default as ClientDetailPage, ClientDetailPage as ClientDetail } from '../features/clients/ClientDetailPage'
export { default as NewClientPage, NewClientPage as NewClient } from '../features/clients/NewClientPage'

export { default as InvoicesPage, InvoicesPage as Invoices } from '../features/invoices/InvoicesPage'
export { default as InvoiceDetailPage, InvoiceDetailPage as InvoiceDetail } from '../features/invoices/InvoiceDetailPage'
export { default as NewInvoicePage, NewInvoicePage as NewInvoice } from '../features/invoices/NewInvoicePage'
export { default as EditInvoicePage, EditInvoicePage as EditInvoice } from '../features/invoices/EditInvoicePage'

export { default as PaymentsPage, PaymentsPage as Payments } from '../features/payments/PaymentsPage'
export { default as SettingsPage, SettingsPage as Settings } from '../features/settings/SettingsPage'