import { useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardPerforation,
  Button,
  Input,
} from '../../components/ui'
import { useToast } from '../../hooks/useToast'
import { settingsService } from '../../services/settingsService'

export function SettingsPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState(() => settingsService.getSettings())
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleGenerateNotes = () => {
    const generated = settingsService.generateDefaultNotes(
      formData.bankName,
      formData.accountNumber,
      formData.accountHolder
    )
    if (generated) {
      handleChange('defaultNotes', generated)
      toast.info('Instruksi pembayaran diperbarui dari rekening bank.')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      settingsService.saveSettings(formData)
      toast.success('Pengaturan profil & rekening berhasil disimpan!')
    } catch {
      toast.error('Gagal menyimpan pengaturan.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Pengaturan"
        description="Kelola identitas bisnis, rekening penerima, dan preferensi penagihan default."
      />

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Section 1: Profil Bisnis */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle as="h2">Identitas Bisnis</CardTitle>
            <p className="text-xs text-text-muted font-sans mt-0.5">
              Informasi ini akan tercantum sebagai pengirim invoice dan penerima pada kuitansi resmi.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Usaha / Studio / Brand"
                value={formData.businessName || ''}
                onChange={(e) => handleChange('businessName', e.target.value)}
              />
              <Input
                label="Nama Penanggung Jawab"
                value={formData.ownerName || ''}
                onChange={(e) => handleChange('ownerName', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Email Kontak"
                type="email"
                value={formData.contactEmail || ''}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
              />
              <Input
                label="No. Telepon / WhatsApp"
                value={formData.contactPhone || ''}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
              />
              <Input
                label="Kota Domisili (untuk Kuitansi)"
                value={formData.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Alamat Lengkap Usaha
              </label>
              <textarea
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2.5 text-sm rounded-base bg-surface text-text border border-border focus:border-primary focus:outline-none font-sans"
                placeholder="Alamat kantor atau domisili usaha..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Rekening Bank Default */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle as="h2">Rekening Bank & Pembayaran</CardTitle>
                <p className="text-xs text-text-muted font-sans mt-0.5">
                  Rekening default yang akan diinstruksikan kepada klien untuk transfer pelunasan.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateNotes}
                className="self-start sm:self-auto"
              >
                Sinkronkan ke Catatan
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Nama Bank / E-Wallet
                </label>
                <input
                  type="text"
                  list="bank-suggestions"
                  value={formData.bankName || ''}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm rounded-base bg-surface text-text border border-border focus:border-primary focus:outline-none"
                  placeholder="Contoh: BCA, Mandiri, BRI"
                />
                <datalist id="bank-suggestions">
                  <option value="Bank Central Asia (BCA)" />
                  <option value="Bank Mandiri" />
                  <option value="Bank Rakyat Indonesia (BRI)" />
                  <option value="Bank Negara Indonesia (BNI)" />
                  <option value="Bank Syariah Indonesia (BSI)" />
                  <option value="Bank Jago" />
                  <option value="CIMB Niaga" />
                  <option value="Permata Bank" />
                  <option value="QRIS / Dompet Digital" />
                </datalist>
              </div>

              <Input
                label="Nomor Rekening"
                value={formData.accountNumber || ''}
                onChange={(e) => handleChange('accountNumber', e.target.value)}
                placeholder="Contoh: 888-019-281"
              />

              <Input
                label="Atas Nama (Pemilik Rekening)"
                value={formData.accountHolder || ''}
                onChange={(e) => handleChange('accountHolder', e.target.value)}
                placeholder="Contoh: Studio Solusi Kreatif"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Preferensi Penagihan & Pajak */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle as="h2">Preferensi Penagihan & Pajak (PPN)</CardTitle>
            <p className="text-xs text-text-muted font-sans mt-0.5">
              Aturan standar yang otomatis diterapkan ketika Anda membuat invoice baru.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <Input
                label="Tarif PPN Default (%)"
                type="number"
                value={formData.defaultTaxRate ?? 11}
                onChange={(e) => handleChange('defaultTaxRate', Number(e.target.value) || 0)}
              />

              <div className="pt-5 flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="applyTaxByDefault"
                  checked={Boolean(formData.applyTaxByDefault)}
                  onChange={(e) => handleChange('applyTaxByDefault', e.target.checked)}
                  className="w-4 h-4 rounded-sharp border-border text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                />
                <label
                  htmlFor="applyTaxByDefault"
                  className="text-xs font-medium text-text cursor-pointer select-none"
                >
                  Otomatis centang PPN saat membuat invoice baru
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Catatan / Instruksi Pembayaran Bawaan
              </label>
              <textarea
                value={formData.defaultNotes || ''}
                onChange={(e) => handleChange('defaultNotes', e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 text-sm rounded-base bg-surface text-text border border-border focus:border-primary focus:outline-none font-mono"
                placeholder="Instruksi transfer bank yang otomatis terisi pada invoice baru..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Button Bar */}
        <CardPerforation className="my-4" />
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="accent"
            size="md"
            disabled={isSaving}
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SettingsPage
