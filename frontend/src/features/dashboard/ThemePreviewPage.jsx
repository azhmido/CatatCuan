import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardPerforation,
  Button,
  Badge,
  InvoiceSkeleton,
} from '../../components/ui'
import { useCountUp } from '../../hooks/useCountUp'

export function ThemePreviewPage() {
  const [btnLoading, setBtnLoading] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState('lunas')
  const [demoTarget, setDemoTarget] = useState(24850000)

  // Animated Count-Up Preview
  const animatedNumber = useCountUp(demoTarget, 900)

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12 page-fade-in">
      {/* Page Header */}
      <PageHeader
        title="Design System"
        badge={<Badge variant="accent">UI Kit</Badge>}
        description="Pratinjau komponen antarmuka, token warna, dan status elemen."
        action={
          <Link to="/dashboard">
            <Button
              variant="outline"
              size="sm"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              }
            >
              Kembali
            </Button>
          </Link>
        }
      />

      {/* 1. BUTTON PREVIEW SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div>
            <h2 className="text-lg font-bold text-text font-heading tracking-tight">
              1. Tombol
            </h2>
            <p className="text-xs text-text-muted">
              Varian warna dan status tombol aksi.
            </p>
          </div>
          <Badge variant="outline">components/ui/Button.jsx</Badge>
        </div>

        <Card className="border-border">
          <CardContent className="space-y-6">
            {/* Varian Warna */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3 font-semibold">
                Varian Warna Semantik
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">
                  Primary (Deep Pine Slate)
                </Button>
                <Button variant="accent">
                  Accent (Executive Emerald)
                </Button>
                <Button variant="secondary">
                  Secondary (Slate Neutral)
                </Button>
                <Button variant="outline">
                  Outline Presisi 1px
                </Button>
                <Button variant="ghost">
                  Ghost Minimal
                </Button>
                <Button variant="destructive">
                  Destructive (Crimson)
                </Button>
              </div>
            </div>

            {/* Micro-Interaction & State */}
            <div className="pt-4 border-t border-dashed border-border-dashed">
              <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3 font-semibold">
                Micro-Interaction State (Tekan untuk Uji Coba)
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  isLoading={btnLoading}
                  onClick={() => {
                    setBtnLoading(true)
                    setTimeout(() => setBtnLoading(false), 1500)
                  }}
                >
                  {btnLoading ? 'Memproses...' : 'Uji Tombol Loading'}
                </Button>

                <Button variant="outline" disabled>
                  Disabled State
                </Button>

                <Button
                  variant="accent"
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  }
                >
                  Dengan Icon
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 2. STAT CARDS WITH COUNT-UP ANIMATION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div>
            <h2 className="text-lg font-bold text-text font-heading tracking-tight">
              2. Kartu Metrik
            </h2>
            <p className="text-xs text-text-muted">
              Visualisasi angka ringkasan dengan indikator status.
            </p>
          </div>
          <Badge variant="outline">useCountUp.js</Badge>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono text-text-muted">Pemicu Animasi:</span>
          <button
            type="button"
            onClick={() => setDemoTarget((prev) => (prev === 24850000 ? 38500000 : 24850000))}
            className="text-xs font-mono px-3 py-1 rounded-base bg-secondary text-primary border border-border hover:bg-secondary/80 pressable font-bold cursor-pointer"
          >
            ↻ Ubah Target (Rp {demoTarget.toLocaleString('id-ID')})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Revenue */}
          <Card className="flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Total Pendapatan
              </span>
              <Badge status="lunas" dot>
                Lunas
              </Badge>
            </div>
            <div className="text-3xl font-bold font-mono text-text tracking-tight mt-3">
              Rp {animatedNumber.toLocaleString('id-ID')}
            </div>
            <div className="pt-3 mt-4 border-t border-border text-xs font-mono text-text-muted flex justify-between">
              <span>Animasi Count-Up</span>
              <span className="font-semibold text-emerald-600">900ms</span>
            </div>
          </Card>

          {/* Card 2: Pending */}
          <Card className="flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Menunggu Pembayaran
              </span>
              <Badge status="terkirim" dot>
                Terkirim
              </Badge>
            </div>
            <div className="text-3xl font-bold font-mono text-text tracking-tight mt-3">
              4 Tagihan
            </div>
            <div className="pt-3 mt-4 border-t border-border text-xs font-mono text-text-muted flex justify-between">
              <span>Total Tertunda</span>
              <span className="font-semibold text-slate-800">Rp 12.400.000</span>
            </div>
          </Card>

          {/* Card 3: Overdue */}
          <Card className="flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Telat Jatuh Tempo
              </span>
              <Badge status="telat" dot>
                Urgent
              </Badge>
            </div>
            <div className="text-3xl font-bold font-mono text-rose-600 tracking-tight mt-3">
              2 Invoice
            </div>
            <div className="pt-3 mt-4 border-t border-border text-xs font-mono text-text-muted flex justify-between">
              <span>Prioritas Tagih</span>
              <span className="font-semibold text-rose-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                Segera Ditindak
              </span>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. SIGNATURE INVOICE CARD WITH CLEAN DIVIDER */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div>
            <h2 className="text-lg font-bold text-text font-heading tracking-tight">
              3. Kartu Nota
            </h2>
            <p className="text-xs text-text-muted">
              Struktur kartu receipt dengan garis pemisah presisi.
            </p>
          </div>
          <Badge variant="outline">Card variant="receipt"</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="receipt">
            <CardHeader className="flex-row items-center justify-between border-b border-border pb-3">
              <div>
                <CardTitle as="h3">INV-2026-0042</CardTitle>
                <CardDescription>PT Teknologi Maju Bersama</CardDescription>
              </div>
              <Badge status="lunas" dot />
            </CardHeader>

            <CardContent className="space-y-3 pt-4">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-text-muted">Jatuh Tempo:</span>
                <span className="text-text font-semibold">15 September 2026</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-text-muted">Jasa:</span>
                <span className="text-text">Desain UI/UX & Design System</span>
              </div>

              {/* Clean divider line */}
              <CardPerforation className="my-4" />

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
                  Total Tagihan:
                </span>
                <span className="text-xl font-bold font-mono text-primary">
                  Rp 8.500.000
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Skeleton Sample */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted block">
              Invoice Skeleton:
            </span>
            <InvoiceSkeleton rows={3} />
          </div>
        </div>
      </section>

      {/* 4. BADGE PREVIEW SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div>
            <h2 className="text-lg font-bold text-text font-heading tracking-tight">
              4. Status Badge
            </h2>
            <p className="text-xs text-text-muted">
              Pill status dengan dot indikator semantik.
            </p>
          </div>
          <Badge variant="outline">components/ui/Badge.jsx</Badge>
        </div>

        <Card className="border-border">
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3 font-semibold">
                Status Resmi Invoice
              </h4>
              <div className="flex flex-wrap items-center gap-4">
                <div className="space-y-1 text-center">
                  <Badge status="lunas" size="lg" dot />
                  <span className="block text-[10px] text-text-muted font-mono">Pelunasan Penuh</span>
                </div>

                <div className="space-y-1 text-center">
                  <Badge status="terkirim" size="lg" dot />
                  <span className="block text-[10px] text-text-muted font-mono">Menunggu Bayar</span>
                </div>

                <div className="space-y-1 text-center">
                  <Badge status="telat" size="lg" dot />
                  <span className="block text-[10px] text-text-muted font-mono">Lewat Tempo (Ping)</span>
                </div>

                <div className="space-y-1 text-center">
                  <Badge status="draft" size="lg" dot />
                  <span className="block text-[10px] text-text-muted font-mono">Draft Nota</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-dashed border-border-dashed flex items-center gap-3">
              <span className="text-xs font-mono text-text-muted">Uji Switch Cepat:</span>
              {['lunas', 'terkirim', 'telat', 'draft'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedBadge(st)}
                  className="text-xs font-mono underline text-primary hover:text-accent cursor-pointer capitalize"
                >
                  {st}
                </button>
              ))}
              <Badge status={selectedBadge} size="md" dot />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default ThemePreviewPage
