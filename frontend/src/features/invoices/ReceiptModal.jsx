import { useMemo } from 'react'
import { Modal, Button } from '../../components/ui'
import { terbilang, formatDate } from '../../utils'
import { settingsService } from '../../services/settingsService'
import { useToast } from '../../hooks/useToast'

export function ReceiptModal({ isOpen, onClose, invoice }) {
  const { toast } = useToast()
  const businessProfile = useMemo(() => settingsService.getSettings(), [])

  if (!invoice) return null

  // Calculate total paid or invoice total
  const totalAmount = Number(invoice.total) || 0
  const receiptNumber = invoice.invoiceNumber
    ? invoice.invoiceNumber.replace('INV-', 'KW-')
    : `KW-${invoice.id || '001'}`
  const receiptDate = invoice.payments?.[0]?.paymentDate || invoice.issueDate || new Date().toISOString().split('T')[0]
  const amountWords = terbilang(totalAmount)

  const itemsSummary = (invoice.items || [])
    .map((it) => it.description)
    .filter(Boolean)
    .join(', ')

  const handleCopyText = () => {
    const textReceipt = `*KUITANSI PEMBAYARAN RESMI*
No. Kuitansi: ${receiptNumber}
Tanggal: ${formatDate(receiptDate)}

Telah Diterima Dari: ${invoice.clientName || 'Klien'}
Uang Sejumlah: ## ${amountWords} ##
Untuk Pembayaran: Pelunasan ${invoice.invoiceNumber} (${itemsSummary || 'Jasa / Layanan'})

*JUMLAH: Rp ${totalAmount.toLocaleString('id-ID')},-*

${businessProfile.city || 'Indonesia'}, ${formatDate(receiptDate)}
Penerima:
${businessProfile.businessName || 'CatatCuan'}
${businessProfile.bankName ? `(${businessProfile.bankName} - ${businessProfile.accountNumber})` : ''}
Status: [ LUNAS / SAH ]`

    navigator.clipboard
      .writeText(textReceipt)
      .then(() => toast.success('Format teks kuitansi berhasil disalin ke clipboard!'))
      .catch(() => toast.error('Gagal menyalin ke clipboard.'))
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kuitansi Pembayaran Resmi"
      footer={
        <div className="flex flex-wrap items-center justify-between w-full gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyText} type="button">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Salin Teks Kuitansi
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} type="button">
              Tutup
            </Button>
            <Button variant="accent" size="sm" onClick={handlePrintReceipt} type="button">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak Kuitansi
            </Button>
          </div>
        </div>
      }
    >
      {/* Formal Paper Receipt Voucher View */}
      <div className="p-4 sm:p-6 bg-[#fafbf9] border-2 border-slate-300 rounded-base text-slate-800 font-sans shadow-inner space-y-5">
        {/* Header Voucher */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-slate-800 pb-3 gap-2">
          <div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-slate-500 block">
              Tanda Terima Pembayaran
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-black tracking-wide text-slate-900 uppercase">
              KUITANSI
            </h3>
            <p className="text-xs font-semibold text-emerald-800 font-sans">
              {businessProfile.businessName}
            </p>
          </div>

          <div className="text-left sm:text-right font-mono text-xs text-slate-600">
            <div>
              <span className="text-slate-400">No: </span>
              <strong className="text-slate-900">{receiptNumber}</strong>
            </div>
            <div>
              <span className="text-slate-400">Tanggal: </span>
              <span className="text-slate-800">{formatDate(receiptDate)}</span>
            </div>
          </div>
        </div>

        {/* Form Lines */}
        <div className="space-y-3.5 text-xs sm:text-sm">
          {/* Telah Diterima Dari */}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
            <span className="w-36 text-slate-500 font-medium shrink-0">
              Telah Diterima Dari
            </span>
            <span className="hidden sm:inline text-slate-400">:</span>
            <div className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400 pb-0.5">
              {invoice.clientName || 'Klien'}
            </div>
          </div>

          {/* Uang Sejumlah */}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
            <span className="w-36 text-slate-500 font-medium shrink-0">
              Uang Sejumlah
            </span>
            <span className="hidden sm:inline text-slate-400">:</span>
            <div className="flex-1 font-serif italic font-semibold text-slate-800 bg-slate-100/80 px-2.5 py-1.5 border border-slate-200 rounded-sharp">
              &ldquo; {amountWords} &rdquo;
            </div>
          </div>

          {/* Untuk Pembayaran */}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
            <span className="w-36 text-slate-500 font-medium shrink-0">
              Untuk Pembayaran
            </span>
            <span className="hidden sm:inline text-slate-400">:</span>
            <div className="flex-1 text-slate-800 border-b border-dotted border-slate-400 pb-0.5 font-medium">
              Pelunasan Tagihan Invoice <strong className="font-mono">{invoice.invoiceNumber}</strong>
              {itemsSummary && (
                <span className="text-slate-600 block text-xs mt-0.5">
                  ({itemsSummary})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer: Amount Box & Signature */}
        <div className="pt-4 border-t-2 border-slate-800 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          {/* Amount Tag */}
          <div className="border-2 border-slate-800 bg-slate-100 px-4 py-2 rounded-sharp self-start font-mono font-bold text-lg sm:text-xl tracking-tight text-slate-900 shadow-xs">
            Rp {totalAmount.toLocaleString('id-ID')},-
          </div>

          {/* Signature Area */}
          <div className="text-right font-sans text-xs space-y-1">
            <p className="text-slate-600">
              {businessProfile.city || 'Jakarta'}, {formatDate(receiptDate)}
            </p>
            <p className="text-slate-500 text-[11px] uppercase tracking-wider">
              Penerima Pembayaran,
            </p>
            <div className="h-12 flex items-center justify-end">
              <span className="inline-block px-2.5 py-0.5 border border-emerald-700 text-emerald-800 text-[10px] font-mono font-bold tracking-widest uppercase rounded-sharp rotate-[-6deg] opacity-80">
                [ LUNAS ]
              </span>
            </div>
            <p className="font-bold text-slate-900 underline decoration-slate-400 underline-offset-2">
              ( {businessProfile.ownerName || businessProfile.businessName} )
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              {businessProfile.businessName}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ReceiptModal

