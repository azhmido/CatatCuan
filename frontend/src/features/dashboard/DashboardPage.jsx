import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  EmptyState,
  InvoiceSkeleton,
} from '../../components/ui'
import { useCountUp } from '../../hooks/useCountUp'
import dashboardApi from './dashboardApi'

export function DashboardPage() {
  const [summary, setSummary] = useState({
    totalRevenueNumeric: 0,
    totalRevenue: 'Rp 0',
    unpaidCount: 0,
    overdueCount: 0,
  })
  const [recentInvoices, setRecentInvoices] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Smooth Count-Up Micro-Animations for Numbers
  const animatedRevenue = useCountUp(summary.totalRevenueNumeric ?? 0, 900)
  const animatedUnpaid = useCountUp(summary.unpaidCount ?? 0, 700)
  const animatedOverdue = useCountUp(summary.overdueCount ?? 0, 700)

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const [sumData, invData] = await Promise.all([
          dashboardApi.getSummary().catch(() => null),
          dashboardApi.getRecentInvoices().catch(() => null),
        ])

        if (!ignore) {
          if (sumData) {
            // Extract numeric value if string is provided
            const numeric = typeof sumData.totalRevenue === 'number'
              ? sumData.totalRevenue
              : parseInt(String(sumData.totalRevenue).replace(/\D/g, ''), 10) || 0

            setSummary({
              ...sumData,
              totalRevenueNumeric: numeric,
            })
          }
          if (invData) setRecentInvoices(invData)
          setIsLoading(false)
        }
      } catch {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [])

  return (
    <div className="space-y-8 page-fade-in">
      <PageHeader
        title="Ringkasan"
        action={
          <div className="flex items-center gap-2.5">
            <Link to="/clients/new">
              <Button variant="outline" size="sm">
                + Tambah Klien
              </Button>
            </Link>
            <Link to="/invoices/new">
              <Button variant="accent" size="sm">
                + Buat Invoice
              </Button>
            </Link>
          </div>
        }
      />

      {/* 3 Clean Summary Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* 1. Total Pendapatan */}
        <Link to="/payments" className="group block focus:outline-none focus:ring-2 focus:ring-emerald-600 rounded-base">
          <Card className="h-full flex flex-col justify-between p-5 border border-border bg-surface hover-lift">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-muted">
                  Total Pendapatan
                </span>
                <Badge status="lunas" size="sm" dot />
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-text tracking-tight mt-2.5">
                Rp {animatedRevenue.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="pt-3.5 mt-5 border-t border-border flex items-center justify-between text-xs text-text-muted">
              <span className="group-hover:text-emerald-700 transition-colors font-medium">Riwayat Pembayaran →</span>
            </div>
          </Card>
        </Link>

        {/* 2. Belum Lunas */}
        <Link to="/invoices?status=terkirim" className="group block focus:outline-none focus:ring-2 focus:ring-emerald-600 rounded-base">
          <Card className="h-full flex flex-col justify-between p-5 border border-border bg-surface hover-lift">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-muted">
                  Menunggu Pembayaran
                </span>
                <Badge status="terkirim" size="sm" dot />
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-text tracking-tight mt-2.5">
                {animatedUnpaid}{' '}
                <span className="text-xs font-sans font-normal text-text-muted">Tagihan</span>
              </div>
            </div>
            <div className="pt-3.5 mt-5 border-t border-border flex items-center justify-between text-xs text-text-muted">
              <span className="group-hover:text-emerald-700 transition-colors font-medium">Lihat Invoice →</span>
            </div>
          </Card>
        </Link>

        {/* 3. Telat Jatuh Tempo */}
        <Link to="/invoices?status=telat" className="group block focus:outline-none focus:ring-2 focus:ring-emerald-600 rounded-base">
          <Card className="h-full flex flex-col justify-between p-5 border border-border bg-surface hover-lift">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-muted">
                  Lewat Jatuh Tempo
                </span>
                <Badge status="telat" size="sm" dot />
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-rose-600 tracking-tight mt-2.5">
                {animatedOverdue}{' '}
                <span className="text-xs font-sans font-normal text-text-muted">Invoice</span>
              </div>
            </div>
            <div className="pt-3.5 mt-5 border-t border-border flex items-center justify-between text-xs text-text-muted">
              <span className="group-hover:text-rose-600 transition-colors font-medium">Lihat Tagihan →</span>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Invoices Section */}
      <Card className="border-border shadow-card">
        <CardHeader perforated className="flex flex-row items-center justify-between bg-surface">
          <div>
            <CardTitle as="h2">Invoice Terbaru</CardTitle>
          </div>
          <Link to="/invoices">
            <Button variant="ghost" size="sm">
              Semua Invoice →
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-5">
              <InvoiceSkeleton rows={3} />
            </div>
          ) : recentInvoices.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="Belum Ada Invoice"
                description="Buat invoice pertama untuk mulai mencatat tagihan klien."
                action={
                  <Link to="/invoices/new">
                    <Button variant="accent" size="sm">
                      + Buat Invoice
                    </Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-secondary/40 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold text-text font-mono tracking-tight">
                        {inv.invoiceNumber}
                      </span>
                      <Badge status={inv.status} dot />
                    </div>
                    <p className="text-xs text-text-muted mt-1 font-mono">
                      Klien: <span className="font-semibold text-text font-sans">{inv.clientName}</span>{' '}
                      • Tempo: {inv.dueDate}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <div className="text-left sm:text-right">
                      <div className="text-sm sm:text-base font-bold text-primary font-mono">
                        {inv.totalFormatted}
                      </div>
                      <div className="text-[10px] text-text-muted font-mono">
                        {inv.itemCount || 1} Rincian Pekerjaan
                      </div>
                    </div>
                    <Link to={`/invoices/${inv.id}`}>
                      <Button variant="outline" size="sm">
                        Buka Nota
                      </Button>
                    </Link>
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

export default DashboardPage
