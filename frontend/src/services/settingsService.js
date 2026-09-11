/**
 * Settings & Business Profile Service
 * Manages tenant/business profile, default bank accounts, tax rate, and billing notes.
 * Persists to localStorage to support both offline/demo mode and active sessions.
 */

const SETTINGS_KEY = 'catatcuan_settings'

export const DEFAULT_SETTINGS = {
  businessName: 'Studio Solusi Kreatif',
  ownerName: 'Budi Santoso',
  contactEmail: 'owner@solusikreatif.id',
  contactPhone: '081234567890',
  city: 'Jakarta Selatan',
  address: 'Jl. Senopati No. 18, Kebayoran Baru, Jakarta Selatan',
  bankName: 'Bank Central Asia (BCA)',
  accountNumber: '888-019-281',
  accountHolder: 'Studio Solusi Kreatif',
  defaultTaxRate: 11,
  applyTaxByDefault: false,
  defaultNotes:
    'Pembayaran via transfer Bank Central Asia (BCA) 888-019-281 a/n Studio Solusi Kreatif.\nHarap konfirmasi setelah melakukan transfer.',
}

export const settingsService = {
  getSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY)
      if (!raw) {
        // Check if there's tenant data from auth
        const tenantRaw = localStorage.getItem('catatcuan_tenant')
        if (tenantRaw) {
          const tenant = JSON.parse(tenantRaw)
          const bName = tenant.name || tenant.tenantName || 'Usaha Saya'
          return {
            ...DEFAULT_SETTINGS,
            businessName: tenant.name || tenant.tenantName || DEFAULT_SETTINGS.businessName,
            businessName: bName,
            ownerName: bName,
            accountHolder: bName,
            contactEmail: tenant.email || DEFAULT_SETTINGS.contactEmail,
            defaultNotes: `Pembayaran via transfer Bank Central Asia (BCA) 888-019-281 a/n ${bName}.\nHarap konfirmasi setelah melakukan transfer.`,
          }
        }
        return DEFAULT_SETTINGS
      }
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
    } catch {
      return DEFAULT_SETTINGS
    }
  },

  saveSettings(newSettings) {
    try {
      const current = this.getSettings()
      const merged = { ...current, ...newSettings }
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged))

      // Also update tenant cache in localStorage so navbar/sidebar avatar syncs smoothly
      const tenantRaw = localStorage.getItem('catatcuan_tenant')
      if (tenantRaw) {
        try {
          const tenant = JSON.parse(tenantRaw)
          tenant.name = merged.businessName
          tenant.tenantName = merged.businessName
          tenant.email = merged.contactEmail
          localStorage.setItem('catatcuan_tenant', JSON.stringify(tenant))
        } catch {
          // ignore
        }
      }

      window.dispatchEvent(new Event('catatcuan_settings_updated'))
      return merged
    } catch {
      return newSettings
    }
  },

  generateDefaultNotes(bankName, accountNumber, accountHolder) {
    if (!bankName && !accountNumber) return ''
    return `Pembayaran via transfer ${bankName || 'Bank'} ${accountNumber || ''} a/n ${
      accountHolder || 'Pemilik Rekening'
    }.\nHarap konfirmasi setelah melakukan transfer.`
  },
}

export default settingsService

