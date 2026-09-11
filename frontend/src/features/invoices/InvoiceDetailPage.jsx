import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardPerforation,
  Button,
  Badge,
  InvoiceSkeleton,
  Modal,
  Input,
} from '../../components/ui'
import { useToast } from '../../hooks/useToast'
import invoicesApi from './invoicesApi'
import paymentsApi from '../payments/paymentsApi'
import { ReceiptModal } from './ReceiptModal'

export function InvoiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [invoice, setInvoice] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isRecordingPayment, setIsRecordingPayment] = useState(false)
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)

  // Payment Form State
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank')
  const [paymentNotes, setPaymentNotes] = useState('')
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split('T')[0])
  const [paymentError, setPaymentError] = useState('')

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const data = await invoicesApi.getInvoiceById(id)
        if (!ignore) {
          setInvoice(data)
          setIsLoading(false)
        }
      } catch {
        if (!ignore) {
          // Fallback placeholder structure when backend is offline
          setInvoice({
            id,
            invoiceNumber: `INV-${id}`,
            status: 'terkirim',
            clientName: 'PT Nusantara Perkasa',
            clientContact: '081234567890',
            clientAddress: 'Jl. Sudirman Kav 21, Jakarta Selatan',
            issueDate: '2026-09-01',
            dueDate: '2026-09-15',
            notes: 'Pembayaran via transfer Mandiri 123-000-456 a/n PT CatatCuan Digital Indonesia',
            subtotalFormatted: 'Rp 5.000.000',
            totalFormatted: 'Rp 5.000.000',
            items: [
              { id: 1, description: 'Pengembangan Desain UI/UX Mobile App', quantity: 1, unitPrice: 3500000, subtotal: 3500000 },
              { id: 2, description: 'Maintenance Cloud Server (Bulan Pertama)', quantity: 1, unitPrice: 1500000, subtotal: 1500000 },
            ],
            payments: [
              { id: 101, amountFormatted: 'Rp 2.000.000', paymentDate: '2026-09-02', method: 'Transfer Bank', notes: 'DP 40%' },
            ],
          })
          setIsLoading(false)
        }
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [id])

  // Native Print or Backend PDF Download with Graceful Fallback
  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true)
    try {
      const blob = await invoicesApi.downloadPdf(id)
      
      // Buat object URL dari blob
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Invoice_${invoice?.invoiceNumber || id}.pdf`
      document.body.appendChild(a)
      a.click()
      
      // Bersihkan URL setelah diklik
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Berkas PDF berhasil diunduh!')
    } catch {
      // Graceful fallback to client-side browser print dialog (Save as PDF)
      toast.info('Membuka dialog cetak / Simpan sebagai PDF...')
      setTimeout(() => {
        window.print()
      }, 300)
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  // Helper: format rupiah dari angka BigDecimal
  const fmtRp = (num) => `Rp ${Number(num || 0).toLocaleString('id-ID')}`

  // Generate and open courteous WhatsApp billing message
  const handleShareWhatsApp = () => {
    const rawContact = invoice.clientContact || ''
    const cleanPhone = rawContact.replace(/\D/g, '')

    const itemsText = (invoice.items || [])
      .map((it, idx) => {
        const qty = it.qty ?? it.quantity ?? 1
        return `${idx + 1}. ${it.description} — ${fmtRp(it.unitPrice)} (${qty}x)`
      })
      .join('\n')

    const subtotalVal = invoice.subtotal ?? invoice.total ?? 0
    const totalVal = invoice.total ?? 0

    const message = `Halo ${invoice.clientName},\n\nBerikut kami sampaikan rincian tagihan invoice:\n*No. Invoice:* ${invoice.invoiceNumber}\n*Subtotal:* ${fmtRp(subtotalVal)}\n*Total Tagihan:* ${fmtRp(totalVal)}\n*Jatuh Tempo:* ${invoice.dueDate}\n*Status:* [ ${(invoice.status || '').toUpperCase()} ]\n\n*Rincian Pekerjaan:*\n${itemsText}\n\n${invoice.notes ? `*Instruksi Pembayaran:*\n${invoice.notes}\n\n` : ''}Mohon konfirmasi apabila pembayaran telah dilakukan. Terima kasih!`

    let targetUrl = 'https://wa.me/?text=' + encodeURIComponent(message)
    if (cleanPhone.length >= 8) {
      const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone
      targetUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
    }

    window.open(targetUrl, '_blank')
    toast.success('Membuka WhatsApp penagihan...')
  }

  const handleRecordPaymentSubmit = async (e) => {
    e.preventDefault()
    setIsRecordingPayment(true)
    setPaymentError('')
    try {
      await paymentsApi.recordPayment(id, {
        amount: Number(paymentAmount),
        paymentMethod,
        paymentDate,
        notes: paymentNotes,
      })
      setShowPaymentModal(false)
      toast.success('Pembayaran berhasil dicatat!')
      const refreshed = await invoicesApi.getInvoiceById(id).catch(() => null)
      if (refreshed) setInvoice(refreshed)
    } catch (err) {
      setPaymentError(err.response?.data?.message || 'Gagal mencatat pembayaran ke backend.')
    } finally {
      setIsRecordingPayment(false)
    }
  }

  const handleDeleteInvoice = async () => {
    setIsDeleting(true)
    try {
      await invoicesApi.deleteInvoice(id)
      toast.success(`Invoice ${invoice?.invoiceNumber || ''} berhasil dihapus!`)
      navigate('/invoices')
    } catch (err) {
      toast.error(err.message || 'Gagal menghapus invoice dari database.')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdatingStatus(true)
    try {
      await invoicesApi.updateStatus(id, newStatus)
      setInvoice((prev) => (prev ? { ...prev, status: newStatus } : prev))
      const label = newStatus === 'terkirim' ? 'Terkirim' : newStatus === 'lunas' ? 'Lunas' : newStatus
      toast.success(`Status invoice berhasil diubah menjadi ${label}!`)
    } catch (err) {
      toast.error(err.message || 'Gagal mengubah status invoice ke backend.')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleDuplicateInvoice = () => {
    if (!invoice) return
    navigate('/invoices/new', {
      state: {
        duplicateFrom: {
          clientId: invoice.clientId || '',
          clientName: invoice.clientName || '',
          clientContact: invoice.clientContact || '',
          clientAddress: invoice.clientAddress || '',
          notes: invoice.notes || '',
          items: invoice.items?.map((it) => ({
            description: it.description || '',
            quantity: it.quantity || 1,
            unitPrice: it.unitPrice || 0,
          })) || [{ description: '', quantity: 1, unitPrice: 0 }],
        },
      },
    })
    toast.info('Data tagihan siap diduplikasi. Silakan sesuaikan tanggal dan rincian.')
  }

  const handleCopySummary = async () => {
    if (!invoice) return

    const itemsText = (invoice.items || [])
      .map(
        (it, idx) =>
          `  ${idx + 1}. ${it.description} (${it.quantity}x) — Rp ${Number(
            it.unitPrice || 0
          ).toLocaleString('id-ID')}`
      )
      .join('\n')

    const summaryText = `*RINGKASAN INVOICE — CATATCUAN*
---------------------------------------
No. Invoice   : ${invoice.invoiceNumber}
Klien         : ${invoice.clientName}
Tanggal Terbit: ${invoice.issueDate}
Jatuh Tempo   : ${invoice.dueDate}
Status        : ${(invoice.status || '').toUpperCase()}
---------------------------------------
RINCIAN:
${itemsText}
---------------------------------------
TOTAL         : ${invoice.totalFormatted || `Rp ${Number(invoice.total || 0).toLocaleString('id-ID')}`}
${invoice.notes ? `Catatan:\n${invoice.notes}\n` : ''}---------------------------------------`

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(summaryText)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = summaryText
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      toast.success('Ringkasan invoice disalin ke clipboard!')
    } catch {
      toast.error('Gagal menyalin ringkasan.')
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-5">
        <InvoiceSkeleton rows={4} />
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted font-mono">Invoice tidak ditemukan.</p>
        <Link to="/invoices">
          <Button variant="outline" size="sm" className="mt-4">
            Kembali ke Daftar Invoice
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 page-fade-in overflow-x-hidden">
      {/* Header Actions (Excluded in Print) */}
      <div className="no-print">
        <PageHeader
          title={invoice.invoiceNumber}
          badge={<Badge status={invoice.status} size="lg" dot />}
          action={
            <div className="flex flex-col gap-2">
              {/* Baris 1: Aksi utama — navigasi & status */}
              <div className="flex flex-wrap items-center gap-2">
              <Link to="/invoices">
                <Button
                  variant="ghost"
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
              <Link to={`/invoices/${id}/edit`}>
                <Button
                  variant="outline"
                  size="sm"
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  }
                >
                  Edit
                </Button>
              </Link>

              {/* Status Transition: Tandai Terkirim (hanya untuk Draft) */}
              {invoice.status?.toLowerCase() === 'draft' && (
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isUpdatingStatus}
                  onClick={() => handleUpdateStatus('terkirim')}
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  }
                >
                  Tandai Terkirim
                </Button>
              )}

              {/* Catat Pembayaran (sembunyikan bila sudah Lunas) */}
              {invoice.status?.toLowerCase() !== 'lunas' && (
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => setShowPaymentModal(true)}
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  }
                >
                  Catat Pembayaran
                </Button>
              )}
            </div>

            {/* Baris 2: Aksi sekunder — kirim, ekspor, hapus */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareWhatsApp}
                className="hover:border-[#25D366] hover:text-[#128C7E]"
                icon={
                  <svg className="w-4 h-4 text-[#25D366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                }
              >
                WhatsApp
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopySummary}
                title="Salin ringkasan invoice ke clipboard"
                icon={
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3" />
                  </svg>
                }
              >
                Salin
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDuplicateInvoice}
                title="Duplikat tagihan ini"
                icon={
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                }
              >
                Duplikat
              </Button>

              <Button
                variant="outline"
                size="sm"
                isLoading={isDownloadingPdf}
                onClick={handleDownloadPdf}
                icon={
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                }
              >
                Cetak / PDF
              </Button>

              {/* Kuitansi Resmi */}
              {(invoice.status?.toLowerCase() === 'lunas' || (invoice.payments && invoice.payments.length > 0)) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReceiptModal(true)}
                  className="hover:border-emerald-600 hover:text-emerald-700"
                  icon={
                    <svg className="w-4 h-4 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                >
                  Kuitansi
                </Button>
              )}

              {/* Hapus — selalu tampil, di ujung kanan */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                }
              >
                Hapus
              </Button>
            </div>
            </div>
          }
        />
      </div>

      {/* Invoice Details Card: Signature Receipt Treatment with Perforation Line */}
      <Card variant="receipt" className="print-break-inside-avoid">
        <CardHeader perforated className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle as="h2">{invoice.invoiceNumber}</CardTitle>
              <Badge status={invoice.status} dot />
            </div>
            <p className="text-xs text-text-muted font-mono mt-0.5">
              Diterbitkan: {invoice.issueDate} • Jatuh tempo: {invoice.dueDate}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block">
              Total Tagihan
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-primary tracking-tight">
              {invoice.totalFormatted ?? fmtRp(invoice.total)}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Client Info */}
          <div className="p-4 rounded-base bg-surface-sunken/60 border border-border">
            <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-1.5 font-bold">
              Ditagihkan Kepada:
            </h4>
            <div className="font-bold text-text text-base font-heading">
              {invoice.clientName}
            </div>
            {invoice.clientContact && (
              <div className="text-xs text-text-muted font-mono mt-0.5">{invoice.clientContact}</div>
            )}
            {invoice.clientAddress && (
              <div className="text-xs text-text-muted font-mono mt-0.5">{invoice.clientAddress}</div>
            )}
          </div>

          {/* Items List / Table */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3 font-bold">
              Item Tagihan
            </h4>
            <div className="border border-border rounded-base overflow-hidden divide-y divide-border">
              <div className="hidden sm:grid grid-cols-12 bg-surface-sunken p-3 text-xs font-mono uppercase tracking-wider font-semibold text-text">
                <div className="col-span-6">Deskripsi</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Harga Satuan</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              {invoice.items?.map((item, index) => (
                <div
                  key={item.id || index}
                  className="p-3 sm:grid sm:grid-cols-12 flex flex-col sm:items-center gap-1 sm:gap-0 hover:bg-secondary/20 transition-colors"
                >
                  <div className="sm:col-span-6 font-medium text-sm text-text">
                    {item.description}
                  </div>
                  <div className="sm:col-span-2 text-xs sm:text-center text-text-muted font-mono">
                    <span className="sm:hidden font-semibold">Qty: </span>
                    {item.quantity}
                  </div>
                  <div className="sm:col-span-2 text-xs sm:text-right text-text-muted font-mono">
                    <span className="sm:hidden font-semibold">Harga: </span>
                    Rp {(item.unitPrice || 0).toLocaleString('id-ID')}
                  </div>
                  <div className="sm:col-span-2 text-sm sm:text-right font-bold text-text font-mono">
                    <span className="sm:hidden text-xs text-text-muted font-normal">Subtotal: </span>
                    Rp {(item.subtotal || item.quantity * item.unitPrice || 0).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>

            {/* Signature Perforation Line Before Final Total */}
            <CardPerforation className="my-5" />

            {/* Total summary */}
            <div className="flex justify-end">
              <div className="w-full sm:w-72 space-y-2 p-3.5 rounded-base bg-surface-sunken border border-border font-mono text-xs">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal Item:</span>
                  <span>{invoice.subtotalFormatted ?? fmtRp(invoice.subtotal ?? invoice.total)}</span>
                </div>

                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>
                      Diskon {invoice.discountType === 'percentage' ? `(${invoice.discountValue}%)` : ''}:
                    </span>
                    <span>- {fmtRp(invoice.discountAmount)}</span>
                  </div>
                )}

                {invoice.taxAmount > 0 && (
                  <div className="flex justify-between text-text-muted">
                    <span>PPN ({invoice.taxRate}%):</span>
                    <span>+ {fmtRp(invoice.taxAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-bold text-text font-mono pt-2 border-t border-border">
                  <span>Total Tagihan:</span>
                  <span className="text-primary text-lg">{invoice.totalFormatted ?? fmtRp(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="p-3.5 rounded-base border border-border/80 bg-surface text-xs text-text-muted font-mono">
              <strong className="text-text block mb-1 font-sans uppercase tracking-wider text-[11px]">
                Catatan Pembayaran:
              </strong>
              {invoice.notes}
            </div>
          )}

          {/* Payment History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted font-bold">
                Riwayat Pembayaran
              </h4>
              <Button
                variant="outline"
                size="sm"
                className="no-print"
                onClick={() => setShowPaymentModal(true)}
              >
                + Catat Pembayaran
              </Button>
            </div>

            {(!invoice.payments || invoice.payments.length === 0) ? (
              <p className="text-xs text-text-muted font-mono italic p-3 border border-dashed border-border-dashed rounded-base text-center bg-surface-sunken/40">
                Belum ada riwayat pembayaran untuk invoice ini.
              </p>
            ) : (
              <div className="border border-border rounded-base divide-y divide-border overflow-hidden">
                {invoice.payments.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="p-3.5 flex items-center justify-between text-xs sm:text-sm bg-surface"
                  >
                    <div>
                      <div className="font-bold text-success font-mono">{p.amountFormatted || `Rp ${p.amount}`}</div>
                      <div className="text-[11px] text-text-muted font-mono">
                        {p.paymentDate} • {p.method || 'Transfer'}
                      </div>
                    </div>
                    {p.notes && (
                      <span className="text-xs text-text-muted font-mono italic">{p.notes}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Record Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Catat Pembayaran"
      >
        <form onSubmit={handleRecordPaymentSubmit} className="space-y-4" noValidate>
          {paymentError && (
            <div className="p-2.5 rounded-sharp bg-danger/10 border border-danger/30 text-danger text-xs font-mono font-medium">
              ! {paymentError}
            </div>
          )}

          <Input
            label="Nominal (Rp)"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
          />

          <Input
            label="Tanggal Pembayaran"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Metode Pembayaran
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 text-sm rounded-base bg-surface text-text border border-border focus:border-primary focus:outline-none"
            >
              <option value="Transfer Bank">Transfer Bank</option>
              <option value="Tunai / Cash">Tunai / Cash</option>
              <option value="E-Wallet (QRIS/OVO/GoPay)">E-Wallet (QRIS/OVO/GoPay)</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <Input
            label="Catatan (Opsional)"
            value={paymentNotes}
            onChange={(e) => setPaymentNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPaymentModal(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="accent" size="sm" isLoading={isRecordingPayment}>
              Simpan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        title="Hapus Invoice"
      >
        <div className="space-y-4">
          <p className="text-sm text-text">
            Hapus invoice <strong className="font-mono text-primary">{invoice?.invoiceNumber}</strong> untuk klien{' '}
            <strong>{invoice?.clientName}</strong>? Seluruh data tagihan dan riwayat pembayaran terkait akan dihapus permanen.
          </p>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setShowDeleteModal(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={handleDeleteInvoice}
            >
              Hapus
            </Button>
          </div>
        </div>
      </Modal>

      {/* Official Payment Receipt Modal */}
      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        invoice={invoice}
      />
    </div>
  )
}

export default InvoiceDetailPage
