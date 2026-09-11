import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  InvoiceSkeleton,
  EmptyState,
} from '../../components/ui'
import { useToast } from '../../hooks/useToast'
import { exportToCsv } from '../../utils'
import paymentsApi from './paymentsApi'

const METHOD_FILTERS = [
  { id: 'Semua', label: 'Semua' },
  { id: 'Transfer Bank', label: 'Transfer Bank' },
  { id: 'Tunai', label: 'Tunai' },
  { id: 'E-Wallet', label: 'E-Wallet / QRIS' },
  { id: 'Lainnya', label: 'Lainnya' },
]

const SORT_OPTIONS = [
  { id: 'date_desc', label: 'Tanggal: Terbaru' },
  { id: 'date_asc', label: 'Tanggal: Terlama' },
  { id: 'amount_desc', label: 'Nominal: Tertinggi' },
  { id: 'amount_asc', label: 'Nominal: Terendah' },
]

function sortPaymentsList(list, sortId) {
  const items = [...list]
  switch (sortId) {
    case 'date_asc':
      return items.sort((a, b) => new Date(a.paymentDate || 0) - new Date(b.paymentDate || 0))
    case 'amount_desc':
      return items.sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0))
    case 'amount_asc':
      return items.sort((a, b) => (Number(a.amount) || 0) - (Number(b.amount) || 0))
    case 'date_desc':
    default:
      return items.sort((a, b) => new Date(b.paymentDate || 0) - new Date(a.paymentDate || 0))
  }
}

export function PaymentsPage() {
  const [payments, setPayments] = useState([])
  const [search, setSearch] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('Semua')
  const [selectedSort, setSelectedSort] = useState('date_desc')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const { toast } = useToast()

  const handleExportCsv = () => {
    if (!payments || payments.length === 0) {
      toast.info('Tidak ada data mutasi pembayaran untuk diekspor.')
      return
    }

    const columns = [
      { label: 'ID Pembayaran', key: (row) => row.id ? `#${row.id}` : '-' },
      { label: 'Nomor Invoice', key: (row) => row.invoiceNumber || '-' },
      { label: 'Nama Klien', key: (row) => row.clientName || '-' },
      { label: 'Tanggal Bayar', key: (row) => row.paymentDate || '-' },
      { label: 'Metode Pembayaran', key: (row) => row.paymentMethod || '-' },
      { label: 'Nominal', key: (row) => row.amountFormatted || row.amount || 0 },
      { label: 'Catatan', key: (row) => row.notes || '-' },
    ]

    const dateStr = new Date().toISOString().split('T')[0]
    exportToCsv(`CatatCuan-Mutasi-Pembayaran-${dateStr}`, columns, payments)
    toast.success('Buku mutasi pembayaran berhasil diekspor ke CSV!')
  }

  useEffect(() => {
    let ignore = false

    async function fetchPayments() {
      try {
        const data = await paymentsApi.getPayments({
          search: submittedSearch || undefined,
          method: selectedMethod !== 'Semua' ? selectedMethod : undefined,
          sort: selectedSort,
        })
        if (!ignore) {
          const rawList = Array.isArray(data) ? data : []
          // Apply client-side filtering fallback
          let filtered = rawList
          if (submittedSearch) {
            const query = submittedSearch.toLowerCase()
            filtered = filtered.filter(
              (p) =>
                (p.invoiceNumber && p.invoiceNumber.toLowerCase().includes(query)) ||
                (p.clientName && p.clientName.toLowerCase().includes(query)) ||
                (p.notes && p.notes.toLowerCase().includes(query))
            )
          }
          if (selectedMethod !== 'Semua') {
            filtered = filtered.filter((p) => {
              if (selectedMethod === 'Tunai') return p.paymentMethod?.toLowerCase().includes('tunai') || p.paymentMethod?.toLowerCase().includes('cash')
              if (selectedMethod === 'E-Wallet') return p.paymentMethod?.toLowerCase().includes('wallet') || p.paymentMethod?.toLowerCase().includes('qris')
              return p.paymentMethod?.toLowerCase().includes(selectedMethod.toLowerCase())
            })
          }
          setPayments(sortPaymentsList(filtered, selectedSort))
          setIsLoading(false)
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Gagal memuat buku mutasi pembayaran dari server.')
          setPayments([])
          setIsLoading(false)
        }
      }
    }

    fetchPayments()
    return () => {
      ignore = true
    }
  }, [submittedSearch, selectedMethod, selectedSort, refreshKey])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSubmittedSearch(search)
  }

  const handleResetFilter = () => {
    setSearch('')
    setSubmittedSearch('')
    setSelectedMethod('Semua')
    setSelectedSort('date_desc')
    setIsLoading(true)
    setError(null)
  }

  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="space-y-6 page-fade-in">
      <PageHeader
        title="Pembayaran"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              disabled={payments.length === 0}
              icon={
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              }
            >
              Ekspor CSV
            </Button>
            <Link to="/invoices">
              <Button variant="outline" size="sm">
                Lihat Invoice →
              </Button>
            </Link>
          </div>
        }
      />

      {/* Search, Filter, and Sort Bar */}
      <Card className="border-border">
        <CardContent className="p-3 sm:p-4 space-y-3">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <div className="flex-1">
              <Input
                placeholder="Cari transaksi..."
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
              {/* Dropdown Sorting */}
              <div className="relative">
                <select
                  id="payments-sort-select"
                  aria-label="Urutkan Mutasi Pembayaran"
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
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

          {/* Payment Method Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <span className="text-xs text-text-muted font-mono uppercase tracking-wider shrink-0">
              Metode:
            </span>
            {METHOD_FILTERS.map((mf) => {
              const isActive = selectedMethod === mf.id
              return (
                <button
                  key={mf.id}
                  type="button"
                  onClick={() => setSelectedMethod(mf.id)}
                  className={`touch-target text-xs px-3.5 py-1.5 rounded-sharp uppercase font-mono transition-all shrink-0 border pressable ${
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary shadow-press font-bold'
                      : 'bg-surface text-text-muted border-border hover:text-text hover:bg-secondary/60'
                  }`}
                >
                  {mf.label}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payments List Table with Conditional Rendering */}
      <Card className="border-border">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-5">
              <InvoiceSkeleton rows={3} />
            </div>
          ) : error ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base text-text">Gagal Memuat Mutasi Pembayaran</h3>
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
          ) : payments.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title={search || selectedMethod !== 'Semua' ? 'Pembayaran Tidak Ditemukan' : 'Belum Ada Pembayaran'}
                description={
                  search || selectedMethod !== 'Semua'
                    ? 'Tidak ada transaksi yang cocok.'
                    : 'Catatan pembayaran akan muncul di sini.'
                }
                action={
                  search || selectedMethod !== 'Semua' ? (
                    <Button variant="outline" size="sm" onClick={handleResetFilter}>
                      Reset Filter
                    </Button>
                  ) : (
                    <Link to="/invoices">
                      <Button variant="accent" size="sm">
                        Lihat Invoice
                      </Button>
                    </Link>
                  )
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-border">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-secondary/30 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-bold text-success font-mono">
                        {p.amountFormatted || `Rp ${Number(p.amount).toLocaleString('id-ID')}`}
                      </span>
                      <Badge status="lunas" size="sm" />
                    </div>
                    <div className="text-xs text-text-muted mt-1 font-mono">
                      Invoice: <strong className="text-text font-bold">{p.invoiceNumber}</strong> • Klien: {p.clientName}
                      {p.notes && <span className="block sm:inline sm:ml-2 text-text-muted/80">({p.notes})</span>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 font-mono">
                    <div className="text-left sm:text-right">
                      <div className="text-xs font-semibold text-text">{p.paymentDate}</div>
                      <div className="text-[11px] text-text-muted">{p.paymentMethod || 'Transfer Bank'}</div>
                    </div>
                    {p.invoiceId && (
                      <Link to={`/invoices/${p.invoiceId}`}>
                        <Button variant="outline" size="sm">
                          Lihat Invoice →
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentsPage
