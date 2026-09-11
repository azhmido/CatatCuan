import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardPerforation,
} from '../../components/ui'

const FAQS = [
  {
    question: 'Apakah format invoice dan kuitansi sesuai standar bisnis di Indonesia?',
    answer:
      'Ya, seluruh dokumen invoice dan kuitansi tanda terima dibuat sesuai kaidah standar bisnis Indonesia dengan penomoran unik, rincian pekerjaan, opsi PPN (11%), nominal terbilang otomatis, dan rekening bank resmi.',
  },
  {
    question: 'Bagaimana cara membagikan invoice langsung ke WhatsApp klien?',
    answer:
      'Pada setiap detail invoice, Anda cukup menekan tombol "WhatsApp". Sistem akan otomatis menyusun pesan penagihan yang ringkas, sopan, dan langsung membuka aplikasi WhatsApp ke nomor kontak klien.',
  },
  {
    question: 'Apakah saya bisa menambahkan potongan diskon atau PPN pada invoice?',
    answer:
      'Tentu saja. Saat membuat atau mengedit invoice, Anda dapat mengaktifkan potongan diskon (persentase atau nominal rupiah) serta menambahkan pajak PPN dengan persentase standar atau kustom.',
  },
  {
    question: 'Bagaimana keamanan data dan privasi bisnis saya?',
    answer:
      'Setiap workspace terisolasi secara privat. Anda memegang kendali penuh atas data klien, invoice, dan riwayat pembayaran, serta dapat mengekspor seluruh catatan transaksi ke format CSV / Excel kapan saja.',
  },
]

export function HomePage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('lunas')
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  const handleInstantDemo = () => {
    login('mock-jwt-token-catatcuan-preview', {
      id: 'tenant-umkm-01',
      name: 'Studio Solusi Kreatif',
      tenantName: 'Studio Solusi Kreatif',
      email: 'owner@solusikreatif.id',
    })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-[100dvh] bg-bg text-text page-fade-in flex flex-col justify-between">
      {/* Top Navbar: Minimal, clean, focused */}
      <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-base bg-emerald-700 flex items-center justify-center text-white font-mono font-bold text-xs shadow-sm">
              CC
            </div>
            <span className="font-heading font-bold text-lg text-text tracking-tight">
              CatatCuan
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm">
                  Buka Dashboard →
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Masuk
                  </Button>
                </Link>
                <Button variant="accent" size="sm" onClick={handleInstantDemo}>
                  Coba Demo
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-bold font-heading text-text tracking-tight leading-tight">
            Penagihan & Invoice{' '}
            <span className="text-emerald-700">Sederhana dan Rapi</span>
          </h1>

          <p className="text-sm sm:text-base text-text-muted leading-relaxed font-sans max-w-lg mx-auto">
            Kelola invoice klien, pantau status pembayaran, dan cetak kuitansi resmi tanpa ribet.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button variant="accent" size="lg" onClick={handleInstantDemo}>
              Coba Demo
            </Button>
            <Link to="/register">
              <Button variant="outline" size="lg">
                Daftar
              </Button>
            </Link>
          </div>
        </div>

        {/* Product Showcase: Clean Document Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-sm border border-border relative overflow-hidden">
            {/* Dynamic Realistic Rubber Stamp */}
            {activeTab === 'lunas' && (
              <div className="absolute right-6 top-16 sm:top-14 pointer-events-none select-none z-10 transform -rotate-12 transition-all duration-300">
                <div className="border-3 border-double border-emerald-600 px-3.5 py-1 rounded-sharp text-emerald-700 font-mono font-black text-xs sm:text-sm tracking-widest uppercase bg-emerald-50/85 shadow-xs">
                  ✓ LUNAS / PAID
                </div>
              </div>
            )}
            {activeTab === 'terkirim' && (
              <div className="absolute right-6 top-16 sm:top-14 pointer-events-none select-none z-10 transform -rotate-6 transition-all duration-300">
                <div className="border-3 border-double border-amber-600 px-3 py-1 rounded-sharp text-amber-700 font-mono font-black text-[11px] sm:text-xs tracking-widest uppercase bg-amber-50/85 shadow-xs">
                  MENUNGGU BAYAR
                </div>
              </div>
            )}
            {activeTab === 'telat' && (
              <div className="absolute right-6 top-16 sm:top-14 pointer-events-none select-none z-10 transform -rotate-12 transition-all duration-300">
                <div className="border-3 border-double border-rose-600 px-3.5 py-1 rounded-sharp text-rose-700 font-mono font-black text-[11px] sm:text-xs tracking-widest uppercase bg-rose-50/85 shadow-xs">
                  ⚠ JATUH TEMPO
                </div>
              </div>
            )}

            <CardHeader className="bg-surface flex-row items-center justify-between py-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block">
                  Invoice
                </span>
                <CardTitle as="h3" className="text-base text-text font-mono">
                  INV-2026-0042
                </CardTitle>
                <p className="text-xs text-text-muted mt-0.5 font-sans">
                  Klien: <strong className="text-text">Studio Kopi Senja</strong>
                </p>
              </div>

              {/* Status Switcher Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-base border border-slate-200">
                {['lunas', 'terkirim', 'telat'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setActiveTab(st)}
                    className={`text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-base transition-colors ${
                      activeTab === st
                        ? 'bg-white text-slate-900 font-bold shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-4 bg-surface pt-4">
              {/* Line Items Table */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between py-1 border-b border-border/70 text-[11px] text-text-muted uppercase">
                  <span>Deskripsi</span>
                  <span>Subtotal</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-text font-sans text-xs">Pengembangan Website & Branding</span>
                  <span className="font-semibold text-text">Rp 6.000.000</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-text font-sans text-xs">Konfigurasi Cloud & Domain (1 Tahun)</span>
                  <span className="font-semibold text-text">Rp 2.500.000</span>
                </div>
              </div>

              {/* Divider Line */}
              <CardPerforation className="my-2" />

              {/* Total Row */}
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block">
                    Total:
                  </span>
                  <Badge status={activeTab} dot size="sm" className="mt-1" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-text">
                  Rp 8.500.000
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3 Core Highlights: Concise */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="p-5 border-border bg-surface hover-lift space-y-2">
            <h3 className="text-sm font-bold font-heading text-text">Kalkulasi Otomatis</h3>
            <p className="text-xs text-text-muted leading-relaxed font-sans">
              Subtotal dan total tagihan terhitung otomatis dan akurat.
            </p>
          </Card>

          <Card className="p-5 border-border bg-surface hover-lift space-y-2">
            <h3 className="text-sm font-bold font-heading text-text">Status Pembayaran</h3>
            <p className="text-xs text-text-muted leading-relaxed font-sans">
              Ketahui invoice terkirim, lunas, atau yang telah melewati jatuh tempo.
            </p>
          </Card>

          <Card className="p-5 border-border bg-surface hover-lift space-y-2">
            <h3 className="text-sm font-bold font-heading text-text">Format PDF Resmi</h3>
            <p className="text-xs text-text-muted leading-relaxed font-sans">
              Cetak dan unduh nota invoice dalam format standar bisnis.
            </p>
          </Card>
        </div>

        {/* Target Audience Section */}
        <div className="space-y-6 pt-4">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-text tracking-tight">
              Dirancang untuk Profesional Mandiri
            </h2>
            <p className="text-xs sm:text-sm text-text-muted font-sans">
              Solusi penagihan terstruktur yang disesuaikan dengan alur kerja bisnis kreatif dan teknis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 border-border bg-surface hover-lift space-y-2">
              <div className="w-8 h-8 rounded-base bg-emerald-100/70 border border-emerald-200/80 flex items-center justify-center text-emerald-800 text-xs font-mono font-bold">
                &lt;/&gt;
              </div>
              <h3 className="text-sm font-bold font-heading text-text">Web & Software Dev</h3>
              <p className="text-xs text-text-muted font-sans leading-relaxed">
                Tagihan sprint mingguan, milestone proyek, dan retainer maintenance server.
              </p>
            </Card>

            <Card className="p-4 border-border bg-surface hover-lift space-y-2">
              <div className="w-8 h-8 rounded-base bg-emerald-100/70 border border-emerald-200/80 flex items-center justify-center text-emerald-800 text-xs font-mono font-bold">
                UI
              </div>
              <h3 className="text-sm font-bold font-heading text-text">Desainer Grafis & UI/UX</h3>
              <p className="text-xs text-text-muted font-sans leading-relaxed">
                Penagihan bertahap DP 50%, penyerahan aset desain final, dan paket revisi.
              </p>
            </Card>

            <Card className="p-4 border-border bg-surface hover-lift space-y-2">
              <div className="w-8 h-8 rounded-base bg-emerald-100/70 border border-emerald-200/80 flex items-center justify-center text-emerald-800 text-xs font-mono font-bold">
                REC
              </div>
              <h3 className="text-sm font-bold font-heading text-text">Foto & Videografer</h3>
              <p className="text-xs text-text-muted font-sans leading-relaxed">
                Invoice liputan event, biaya sewa alat, serta kuitansi tanda terima resmi.
              </p>
            </Card>

            <Card className="p-4 border-border bg-surface hover-lift space-y-2">
              <div className="w-8 h-8 rounded-base bg-emerald-100/70 border border-emerald-200/80 flex items-center justify-center text-emerald-800 text-xs font-mono font-bold">
                B2B
              </div>
              <h3 className="text-sm font-bold font-heading text-text">Konsultan & Agensi</h3>
              <p className="text-xs text-text-muted font-sans leading-relaxed">
                Penagihan formal B2B lengkap dengan perhitungan PPN dan kuitansi pelunasan.
              </p>
            </Card>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto space-y-6 pt-4">
          <div className="text-center space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-text tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xs sm:text-sm text-text-muted font-sans">
              Informasi penting mengenai fungsionalitas dan penggunaan CatatCuan.
            </p>
          </div>

          <div className="border border-border rounded-base divide-y divide-border bg-surface overflow-hidden">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index
              return (
                <div key={index} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full py-3.5 px-4 sm:px-5 flex items-center justify-between text-left gap-4 hover:bg-surface-sunken/40 cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-text font-heading">
                      {faq.question}
                    </span>
                    <span className="text-text-muted text-xs font-mono shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 pt-1 text-xs text-text-muted font-sans leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Simple CTA Callout */}
        <div className="p-6 sm:p-8 rounded-base bg-surface border border-border text-center space-y-3 shadow-sm max-w-lg mx-auto">
          <h3 className="text-lg sm:text-xl font-bold font-heading text-text">
            Mulai kelola penagihan Anda
          </h3>
          <p className="text-xs text-text-muted font-sans">
            Jelajahi dashboard dan coba seluruh fiturnya sekarang.
          </p>
          <div className="pt-1">
            <Button variant="accent" size="md" onClick={handleInstantDemo}>
              Coba Demo →
            </Button>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-border bg-surface/70 py-6 px-4 sm:px-6 mt-12 text-xs font-sans text-text-muted">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text">CatatCuan</span>
            <span>—</span>
            <span>Billing Workspace</span>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <Link to="/login" className="hover:text-text transition-colors">
              Masuk
            </Link>
            <Link to="/register" className="hover:text-text transition-colors">
              Daftar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
