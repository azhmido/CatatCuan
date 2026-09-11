import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import {
  Button,
  Input,
  Card,
  CardContent,
  Badge,
  EmptyState,
  InvoiceSkeleton,
  Modal,
  Pagination,
} from '../../components/ui'
import { useToast } from '../../hooks/useToast'
import { exportToCsv } from '../../utils'
import invoicesApi from './invoicesApi'

const STATUS_FILTERS = [
  { id: 'Semua', label: 'Semua' },
  { id: 'draft', label: 'Draft' },
  { id: 'terkirim', label: 'Terkirim' },
  { id: 'lunas', label: 'Lunas' },
  { id: 'telat', label: 'Telat' },
]

const SORT_OPTIONS = [
  { id: 'date_desc', label: 'Tanggal: Terbaru', field: 'issueDate', order: 'desc' },
  { id: 'date_asc', label: 'Tanggal: Terlama', field: 'issueDate', order: 'asc' },
  { id: 'total_desc', label: 'Nominal: Tertinggi', field: 'total', order: 'desc' },
  { id: 'total_asc', label: 'Nominal: Terendah', field: 'total', order: 'asc' },
  { id: 'due_asc', label: 'Jatuh Tempo: Terdekat', field: 'dueDate', order: 'asc' },
]


export function InvoicesPage() {
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const statusParam = searchParams.get('status')
  const [invoices, setInvoices] = useState([])
  const [search, setSearch] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState(statusParam || 'Semua')
  const [selectedSort, setSelectedSort] = useState('date_desc')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Pagination state
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)

  // Delete modal state
  const [invoiceToDelete, setInvoiceToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let ignore = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const currentSort = SORT_OPTIONS.find((s) => s.id === selectedSort) || SORT_OPTIONS[0]
        const params = {
          search: submittedSearch || undefined,
          status: selectedStatus !== 'Semua' ? selectedStatus : undefined,
          sort: currentSort.order,
          sortBy: currentSort.field,
          page,
          size: pageSize,
        }
        const data = await invoicesApi.getInvoices(params)
        if (!ignore) {
          const rawList = Array.isArray(data) ? data : []
          setInvoices(rawList)
          setTotalPages(data.totalPages ?? 1)
          setTotalElements(data.totalElements ?? rawList.length)
          setIsLoading(false)
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Gagal memuat data invoice dari server.')
          setInvoices([])
          setIsLoading(false)
        }
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [submittedSearch, selectedStatus, selectedSort, page, pageSize, refreshKey])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(0)
    setSubmittedSearch(search)
  }

  const handleSortChange = (newSort) => {
    setPage(0)
    setSelectedSort(newSort)
  }

  const handleStatusChange = (newStatus) => {
    setPage(0)
    setSelectedStatus(newStatus)
  }

  const handleResetFilter = () => {
    setSearch('')
    setSubmittedSearch('')
    setSelectedStatus('Semua')
    setSelectedSort('date_desc')
    setPage(0)
    setError(null)
  }

  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    setRefreshKey((k) => k + 1)
  }

  const handleDeleteConfirm = async () => {
    if (!invoiceToDelete) return
    setIsDeleting(true)
    try {
      await invoicesApi.deleteInvoice(invoiceToDelete.id)
      setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceToDelete.id))
      toast.success(`Invoice ${invoiceToDelete.invoiceNumber} berhasil dihapus!`)
      setInvoiceToDelete(null)
    } catch (err) {
      toast.error(err.message || 'Gagal menghapus invoice dari database.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExportCsv = () => {
    if (!invoices || invoices.length === 0) {
      toast.info('Tidak ada data invoice untuk diekspor.')
      return
    }

    const columns = [
      { label: 'Nomor Invoice', key: 'invoiceNumber' },
      { label: 'Nama Klien', key: (row) => row.clientName || '-' },
      { label: 'Tanggal Terbit', key: (row) => row.issueDate || '-' },
      { label: 'Jatuh Tempo', key: (row) => row.dueDate || '-' },
      { label: 'Total Tagihan', key: (row) => row.totalFormatted || row.total || 0 },
      { label: 'Status', key: (row) => (row.status || '').toUpperCase() },
    ]

    const dateStr = new Date().toISOString().split('T')[0]
    exportToCsv(`CatatCuan-Daftar-Invoice-${dateStr}`, columns, invoices)
    toast.success('Daftar invoice berhasil diekspor ke format CSV!')
  }

  const getFilterActiveClass = (status) => {
    switch (status) {
      case 'lunas':
        return 'bg-[#047857] text-white border-[#065f46] shadow-press'
      case 'telat':
        return 'bg-[#dc2626] text-white border-[#b91c1c] shadow-press'
      case 'terkirim':
        return 'bg-[#d97706] text-white border-[#b45309] shadow-press'
      case 'draft':
        return 'bg-[#526356] text-white border-[#3d4b40] shadow-press'
      case 'Semua':
      default:
        return 'bg-primary text-primary-foreground border-primary shadow-press'
    }
  }

  return (
    <div className="space-y-6 page-fade-in">
      <PageHeader
        title="Invoice"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              disabled={invoices.length === 0}
              title="Unduh format Excel CSV"
              icon={
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              }
            >
              Ekspor CSV
            </Button>
            <Link to="/invoices/new">
              <Button
                variant="accent"
                size="sm"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                Buat Invoice
              </Button>
            </Link>
          </div>
        }
      />

      {/* Filter, Search, and Dropdown Sort Bar */}
      <Card className="border-border">
        <CardContent className="p-3 sm:p-4 space-y-3">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <div className="flex-1">
              <Input
                placeholder="Cari invoice..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                prefixIcon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
                suffixIcon={
                  search ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('')
                        setSubmittedSearch('')
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                      title="Hapus pencarian"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ) : null
                }
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Dropdown Sorting Component */}
              <div className="relative">
                <select
                  id="invoice-sort-select"
                  aria-label="Urutkan Daftar Invoice"
                  value={selectedSort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="touch-target text-xs font-mono px-3 py-2 pr-8 rounded-base border border-border bg-surface text-text hover:bg-secondary transition-colors cursor-pointer focus:outline-none focus:border-primary appearance-none"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <Button type="submit" variant="primary" size="sm">
                Cari
              </Button>
            </div>
          </form>

          {/* Status Filter Badges (Horizontal scroll on mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <span className="text-xs text-text-muted font-mono uppercase tracking-wider shrink-0">
              Status:
            </span>
            {STATUS_FILTERS.map((st) => {
              const isActive = selectedStatus === st.id
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleStatusChange(st.id)}
                  className={`touch-target text-xs px-3.5 py-1.5 rounded-sharp uppercase font-mono transition-all shrink-0 border pressable ${
                    isActive
                      ? `${getFilterActiveClass(st.id)} font-bold`
                      : 'bg-surface text-text-muted border-border hover:text-text hover:bg-secondary/60'
                  }`}
                >
                  {st.label}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Invoice List with conditional rendering */}
      <Card className="border-border">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-5">
              <InvoiceSkeleton rows={4} />
            </div>
          ) : error ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base text-text">Gagal Memuat Data Invoice</h3>
                <p className="text-xs text-text-muted max-w-sm mx-auto font-sans">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                }
              >
                Coba Lagi
              </Button>
            </div>
          ) : invoices.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title={search || selectedStatus !== 'Semua' ? 'Tidak Ditemukan' : 'Belum Ada Invoice'}
                description={
                  search || selectedStatus !== 'Semua'
                    ? 'Tidak ada invoice yang sesuai kriteria pencarian.'
                    : 'Buat invoice pertama untuk mulai mencatat tagihan klien.'
                }
                action={
                  search || selectedStatus !== 'Semua' ? (
                    <Button variant="outline" size="sm" onClick={handleResetFilter}>
                      Reset Pencarian
                    </Button>
                  ) : (
                    <Link to="/invoices/new">
                      <Button variant="accent" size="sm">
                        + Buat Invoice
                      </Button>
                    </Link>
                  )
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-border">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-secondary/30 transition-all duration-150"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold text-text font-mono tracking-tight">
                        {inv.invoiceNumber}
                      </span>
                      <Badge status={inv.status} dot />
                    </div>
                    <div className="text-xs text-text-muted mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono">
                      <span>
                        Klien: <strong className="text-text font-sans font-semibold">{inv.clientName}</strong>
                      </span>
                      <span>Terbit: {inv.issueDate}</span>
                      <span>Jatuh Tempo: {inv.dueDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <div className="text-left sm:text-right">
                      <div className="text-sm sm:text-base font-bold text-primary font-mono">
                        {inv.totalFormatted}
                      </div>
                      <div className="text-[10px] text-text-muted font-mono">
                        Subtotal: {inv.subtotalFormatted || '-'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/invoices/${inv.id}`}>
                        <Button variant="outline" size="sm">
                          Detail →
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setInvoiceToDelete(inv)}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2"
                        title="Hapus Invoice"
                        icon={
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Pagination control — shown only when there is more than one page */}
          {!isLoading && !error && invoices.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={pageSize}
              onPageChange={(p) => { setPage(p); setIsLoading(true) }}
              onPageSizeChange={(s) => { setPageSize(s); setPage(0); setIsLoading(true) }}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!invoiceToDelete}
        onClose={() => !isDeleting && setInvoiceToDelete(null)}
        title="Hapus Invoice"
      >
        <div className="space-y-4">
          <p className="text-sm text-text">
            Hapus invoice <strong className="font-mono text-primary">{invoiceToDelete?.invoiceNumber}</strong> untuk{' '}
            <strong>{invoiceToDelete?.clientName}</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setInvoiceToDelete(null)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={handleDeleteConfirm}
            >
              Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default InvoicesPage
