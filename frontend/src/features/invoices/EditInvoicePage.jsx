import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardHeader, CardTitle, CardContent, CardPerforation, Button, Input, InvoiceSkeleton } from '../../components/ui'
import { useToast } from '../../hooks/useToast'
import invoicesApi from './invoicesApi'

export function EditInvoicePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [clientName, setClientName] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState([])
  const [applyDiscount, setApplyDiscount] = useState(false)
  const [discountType, setDiscountType] = useState('percentage')
  const [discountValue, setDiscountValue] = useState(0)
  const [applyTax, setApplyTax] = useState(false)
  const [taxRate, setTaxRate] = useState(11)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    let ignore = false
    async function fetchInvoice() {
      try {
        const data = await invoicesApi.getInvoiceById(id)
        if (!ignore && data) {
          setInvoiceNumber(data.invoiceNumber || `INV-${id}`)
          setClientName(data.clientName || '')
          setIssueDate(data.issueDate || '')
          setDueDate(data.dueDate || '')
          setNotes(data.notes || '')
          setApplyDiscount(Boolean(data.discountValue > 0 || data.discountAmount > 0))
          setDiscountType(data.discountType || 'percentage')
          setDiscountValue(data.discountValue || 0)
          setApplyTax(Boolean(data.taxRate > 0 || data.taxAmount > 0))
          setTaxRate(data.taxRate !== undefined ? data.taxRate : 11)
          setItems(
            data.items && data.items.length > 0
              ? data.items
              : [{ description: '', quantity: 1, unitPrice: 0 }]
          )
          const initialItems = (data.items && data.items.length > 0)
            ? data.items.map((it) => ({
                ...it,
                description: it.description || '',
                quantity: (it.quantity ?? it.qty ?? 1),
                unitPrice: it.unitPrice || 0,
              }))
            : [{ description: '', quantity: 1, unitPrice: 0 }]
          setItems(initialItems)


          setIsLoading(false)
        }
      } catch {
        if (!ignore) {
          setError('Gagal memuat detail invoice dari server.')
          setIsLoading(false)
        }
      }
    }

    fetchInvoice()
    return () => {
      ignore = true
    }
  }, [id])

  const handleItemChange = (index, field, value) => {
    const updated = [...items]
    updated[index] = {
      ...updated[index],
      [field]: field === 'description' ? value : Number(value) || 0,
    }
    setItems(updated)
    if (validationErrors.items) {
      setValidationErrors((prev) => ({ ...prev, items: null }))
    }
  }

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }])
    if (validationErrors.items) {
      setValidationErrors((prev) => ({ ...prev, items: null }))
    }
  }

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Client-side interactive validation
    const errors = {}
    if (new Date(dueDate) < new Date(issueDate)) {
      errors.dueDate = 'Jatuh tempo tidak boleh sebelum tanggal terbit.'
    }

    const hasInvalidItem = items.some(
      (item) => !item.description?.trim() || Number(item.quantity) <= 0 || Number(item.unitPrice) <= 0
    )

    if (items.length === 0) {
      errors.items = 'Tambahkan minimal satu item tagihan.'
    } else if (hasInvalidItem) {
      errors.items = 'Lengkapi deskripsi, kuantitas minimal 1, dan harga lebih dari Rp 0.'
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      toast.error('Mohon lengkapi formulir invoice.')
      return
    }

    setValidationErrors({})
    setIsSaving(true)
    try {
      const calculatedDiscount =
        applyDiscount && Number(discountValue) > 0
          ? discountType === 'percentage'
            ? Math.round(estimatedSubtotal * (Number(discountValue) / 100))
            : Math.min(estimatedSubtotal, Number(discountValue))
          : 0
      const taxable = Math.max(0, estimatedSubtotal - calculatedDiscount)
      const calculatedTax =
        applyTax && Number(taxRate) > 0 ? Math.round(taxable * (Number(taxRate) / 100)) : 0
      const calculatedTotal = taxable + calculatedTax

      await invoicesApi.updateInvoice(id, {
        issueDate,
        dueDate,
        notes,
        items,
        taxRate: applyTax ? Number(taxRate) || 0 : 0,
        taxAmount: calculatedTax,
        discountType,
        discountValue: applyDiscount ? Number(discountValue) || 0 : 0,
        discountAmount: calculatedDiscount,
        subtotal: estimatedSubtotal,
        total: calculatedTotal,
      })
      toast.success('Perubahan berhasil disimpan!')
      navigate(`/invoices/${id}`)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Gagal menyimpan perubahan invoice.'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-5">
        <InvoiceSkeleton rows={3} />
      </div>
    )
  }

  const estimatedSubtotal = items.reduce(
    (acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  )

  let discountAmount = 0
  if (applyDiscount && Number(discountValue) > 0) {
    discountAmount =
      discountType === 'percentage'
        ? Math.round(estimatedSubtotal * (Number(discountValue) / 100))
        : Math.min(estimatedSubtotal, Number(discountValue))
  }

  const taxableSubtotal = Math.max(0, estimatedSubtotal - discountAmount)
  const taxAmount =
    applyTax && Number(taxRate) > 0 ? Math.round(taxableSubtotal * (Number(taxRate) / 100)) : 0
  const estimatedTotal = taxableSubtotal + taxAmount

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title={`Edit ${invoiceNumber}`}
        action={
          <Link to={`/invoices/${id}`}>
            <Button variant="ghost" size="sm">
              ← Batal
            </Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {error && (
          <div className="p-3 rounded-sharp bg-danger/10 border border-danger/30 text-danger text-xs font-mono font-medium">
            ! {error}
          </div>
        )}

        <Card className="border-border">
          <CardHeader perforated>
            <CardTitle as="h2">Informasi Invoice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {clientName && (
              <div className="p-3 rounded-base bg-surface-sunken/60 border border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block">
                    Ditagihkan Kepada:
                  </span>
                  <span className="font-bold text-text text-sm font-heading">{clientName}</span>
                </div>
                <span className="text-xs font-mono text-text-muted bg-surface px-2.5 py-1 rounded-base border border-border">
                  {invoiceNumber}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Tanggal Terbit"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
              <Input
                label="Jatuh Tempo"
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value)
                  if (validationErrors.dueDate) {
                    setValidationErrors((prev) => ({ ...prev, dueDate: null }))
                  }
                }}
                error={validationErrors.dueDate}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader perforated className="flex flex-row items-center justify-between">
            <CardTitle as="h2">Item Tagihan</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              + Tambah Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {validationErrors.items && (
              <div className="p-3 rounded-base bg-danger/10 border border-danger/30 text-danger text-xs font-mono">
                ! {validationErrors.items}
              </div>
            )}
            {items.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-base border border-border bg-surface-sunken/40 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
              >
                <div className="flex-1">
                  <Input
                    placeholder="Deskripsi pekerjaan"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="w-16 sm:w-20 shrink-0">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                    />
                  </div>
                  <div className="flex-1 sm:w-36">
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                    />
                  </div>
                  <div className="w-28 text-right hidden sm:block">
                    <span className="text-xs font-bold font-mono text-text">
                      Rp {((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)).toLocaleString('id-ID')}
                    </span>
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="touch-target p-2 rounded-base text-danger hover:bg-danger/10 pressable"
                      title="Hapus baris"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Options: Diskon & Pajak (PPN) */}
            <div className="pt-2 border-t border-border/70 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Diskon Toggle & Input */}
                <div className="p-3 rounded-base bg-surface-sunken/50 border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-text">
                      <input
                        type="checkbox"
                        checked={applyDiscount}
                        onChange={(e) => setApplyDiscount(e.target.checked)}
                        className="w-4 h-4 rounded-sharp border-border text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                      />
                      <span>Potongan Diskon</span>
                    </label>
                    {applyDiscount && (
                      <div className="flex items-center gap-1 bg-surface border border-border rounded-base p-0.5 text-[11px] font-mono">
                        <button
                          type="button"
                          onClick={() => setDiscountType('percentage')}
                          className={`px-2 py-0.5 rounded-sharp cursor-pointer transition-colors ${
                            discountType === 'percentage'
                              ? 'bg-emerald-700 text-white font-bold'
                              : 'text-text-muted hover:text-text'
                          }`}
                        >
                          %
                        </button>
                        <button
                          type="button"
                          onClick={() => setDiscountType('fixed')}
                          className={`px-2 py-0.5 rounded-sharp cursor-pointer transition-colors ${
                            discountType === 'fixed'
                              ? 'bg-emerald-700 text-white font-bold'
                              : 'text-text-muted hover:text-text'
                          }`}
                        >
                          Rp
                        </button>
                      </div>
                    )}
                  </div>
                  {applyDiscount && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={discountValue || ''}
                        onChange={(e) => setDiscountValue(Number(e.target.value) || 0)}
                        placeholder={discountType === 'percentage' ? 'Contoh: 10' : 'Nominal potongan (Rp)'}
                        className="w-full min-h-[38px] px-3 py-1.5 text-xs rounded-base bg-surface text-text border border-border focus:border-primary focus:outline-none font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* Pajak (PPN) Toggle & Input */}
                <div className="p-3 rounded-base bg-surface-sunken/50 border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-text">
                      <input
                        type="checkbox"
                        checked={applyTax}
                        onChange={(e) => setApplyTax(e.target.checked)}
                        className="w-4 h-4 rounded-sharp border-border text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                      />
                      <span>Pajak (PPN)</span>
                    </label>
                    {applyTax && (
                      <span className="text-[11px] font-mono text-text-muted">Tarif (%)</span>
                    )}
                  </div>
                  {applyTax && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={taxRate ?? 11}
                        onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                        className="w-full min-h-[38px] px-3 py-1.5 text-xs rounded-base bg-surface text-text border border-border focus:border-primary focus:outline-none font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Real-time Subtotal & Total Preview */}
            <CardPerforation className="my-4" />

            {/* Calculation Breakdown & Total Preview */}
            <div className="flex justify-end">
              <div className="w-full sm:w-72 space-y-1.5 text-right font-mono text-xs">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal Item:</span>
                  <span>Rp {estimatedSubtotal.toLocaleString('id-ID')}</span>
                </div>

                {applyDiscount && discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>
                      Diskon {discountType === 'percentage' ? `(${discountValue}%)` : ''}:
                    </span>
                    <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
                  </div>
                )}

                {applyTax && taxAmount > 0 && (
                  <div className="flex justify-between text-text-muted">
                    <span>PPN ({taxRate}%):</span>
                    <span>+ Rp {taxAmount.toLocaleString('id-ID')}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-border flex justify-between items-baseline">
                  <span className="text-xs uppercase tracking-wider font-sans font-bold text-text">
                    Total Tagihan:
                  </span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-primary">
                    Rp {estimatedTotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-notes" className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Catatan (Opsional)
              </label>
              <textarea
                id="edit-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-base bg-surface text-text border border-border focus:border-primary focus:outline-none"
              />
            </div>

            <CardPerforation className="my-2" />

            <div className="flex justify-end gap-3 pt-2">
              <Link to={`/invoices/${id}`}>
                <Button variant="outline" type="button">
                  Batal
                </Button>
              </Link>
              <Button type="submit" variant="primary" isLoading={isSaving}>
                Simpan Perubahan
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default EditInvoicePage
