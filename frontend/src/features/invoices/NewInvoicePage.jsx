import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardHeader, CardTitle, CardContent, CardPerforation, Button, Input } from '../../components/ui'
import { useToast } from '../../hooks/useToast'
import invoicesApi from './invoicesApi'
import clientsApi from '../clients/clientsApi'
import { settingsService } from '../../services/settingsService'

export function NewInvoicePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()

  const duplicateFrom = location.state?.duplicateFrom
  const defaultSettings = settingsService.getSettings()

  const [clients, setClients] = useState([])
  const [clientId, setClientId] = useState(() => duplicateFrom?.clientId || '')
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState(
    () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  )
  const [notes, setNotes] = useState(() => duplicateFrom?.notes || defaultSettings.defaultNotes || '')
  const [applyDiscount, setApplyDiscount] = useState(() => Boolean(duplicateFrom?.discountValue > 0))
  const [discountType, setDiscountType] = useState(() => duplicateFrom?.discountType || 'percentage')
  const [discountValue, setDiscountValue] = useState(() => duplicateFrom?.discountValue || 0)
  const [applyTax, setApplyTax] = useState(() => {
    if (duplicateFrom?.taxRate !== undefined) return Boolean(duplicateFrom.taxRate > 0)
    return Boolean(defaultSettings.applyTaxByDefault)
  })
  const [taxRate, setTaxRate] = useState(() => {
    if (duplicateFrom?.taxRate !== undefined) return duplicateFrom.taxRate
    return defaultSettings.defaultTaxRate ?? 11
  })
  const [items, setItems] = useState(() =>
    duplicateFrom?.items?.length
      ? duplicateFrom.items.map((it) => ({
          description: it.description || '',
          quantity: Number(it.quantity) || 1,
          unitPrice: Number(it.unitPrice) || 0,
        }))
      : [{ description: '', quantity: 1, unitPrice: 0 }]
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    clientsApi
      .getClients()
      .then((data) => {
        if (Array.isArray(data)) {
          if (
            duplicateFrom?.clientId &&
            !data.some((c) => String(c.id) === String(duplicateFrom.clientId))
          ) {
            setClients([
              {
                id: duplicateFrom.clientId,
                name: duplicateFrom.clientName || `Klien #${duplicateFrom.clientId}`,
                contact: duplicateFrom.clientContact || '',
              },
              ...data,
            ])
          } else {
            setClients(data)
          }
        }
      })
      .catch(() => {
        if (duplicateFrom?.clientId) {
          setClients([
            {
              id: duplicateFrom.clientId,
              name: duplicateFrom.clientName || `Klien #${duplicateFrom.clientId}`,
              contact: duplicateFrom.clientContact || '',
            },
          ])
        }
      })
  }, [duplicateFrom])

  const handleItemChange = (index, field, value) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'description' ? value : Number(value) || 0,
    }
    setItems(newItems)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Client-side Interactive Form Validation
    const errors = {}
    if (!clientId) {
      errors.clientId = 'Pilih klien penerima tagihan.'
    }

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
    setIsLoading(true)

    try {
      const payload = {
        clientId,
        issueDate,
        dueDate,
        notes,
        items,
        taxRate: applyTax ? Number(taxRate) || 0 : 0,
        taxAmount,
        discountType,
        discountValue: applyDiscount ? Number(discountValue) || 0 : 0,
        discountAmount,
        subtotal: estimatedSubtotal,
        total: estimatedTotal,
      }
      await invoicesApi.createInvoice(payload)
      toast.success('Invoice berhasil diterbitkan!')
      navigate('/invoices')
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Gagal membuat invoice.'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Invoice Baru"
        action={
          <Link to="/invoices">
            <Button variant="ghost" size="sm">
              ← Kembali
            </Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {duplicateFrom && (
          <div className="p-3.5 rounded-base bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center justify-between shadow-sm">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              <span>
                Formulir diisi dari duplikasi tagihan <strong>{duplicateFrom.clientName || 'Klien'}</strong>.
              </span>
            </span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-sharp bg-danger/10 border border-danger/30 text-danger text-xs font-mono font-medium">
            ! {error}
          </div>
        )}

        {/* Invoice Info & Client Selection */}
        <Card className="border-border">
          <CardHeader perforated>
            <CardTitle as="h2">Informasi Invoice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="invoice-client-select"
                  className="text-xs font-semibold uppercase tracking-wider text-text-muted"
                >
                  Pilih Klien <span className="text-accent">*</span>
                </label>
                <select
                  id="invoice-client-select"
                  value={clientId}
                  onChange={(e) => {
                    setClientId(e.target.value)
                    if (validationErrors.clientId) {
                      setValidationErrors((prev) => ({ ...prev, clientId: null }))
                    }
                  }}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm rounded-base bg-surface text-text border transition-colors focus:outline-none ${
                    validationErrors.clientId
                      ? 'border-danger focus:border-danger ring-1 ring-danger'
                      : 'border-border focus:border-primary'
                  }`}
                >
                  <option value="">-- Pilih Klien Terdaftar --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.contact || c.email})
                    </option>
                  ))}
                  {clients.length === 0 && (
                    <option value="demo-client">Klien Demo (Belum ada data di DB)</option>
                  )}
                </select>
                {validationErrors.clientId && (
                  <p className="text-xs text-danger font-mono mt-0.5">! {validationErrors.clientId}</p>
                )}
                <p className="text-[11px] text-text-muted font-mono">
                  Belum ada klien?{' '}
                  <Link to="/clients/new" className="text-accent hover:underline font-bold">
                    + Tambah klien baru
                  </Link>
                </p>
              </div>

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
            </div>
          </CardContent>
        </Card>

        {/* Work Items / Rincian Pekerjaan */}
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
                      Rp {(item.quantity * item.unitPrice).toLocaleString('id-ID')}
                    </span>
                  </div>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="touch-target p-2 rounded-base text-danger hover:bg-danger/10 transition-colors pressable"
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

            {/* Perforation Line Before Estimasi Total */}
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

        {/* Notes and Action */}
        <Card className="border-border">
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="invoice-notes" className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Catatan Pembayaran (Opsional)
              </label>
              <textarea
                id="invoice-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-base bg-surface text-text border border-border focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div className="pt-4 border-t border-dashed border-border-dashed flex items-center justify-end gap-3">
              <Link to="/invoices">
                <Button variant="outline" type="button">
                  Batal
                </Button>
              </Link>
              <Button type="submit" variant="accent" isLoading={isLoading}>
                Simpan Invoice
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default NewInvoicePage
