/**
 * CatatCuan Utility Formatters
 * Formatting functions for currency, dates, phone numbers, and status.
 */

/**
 * Format number or string to Indonesian Rupiah currency format
 * @param {number|string} amount
 * @returns {string} e.g. "Rp 1.500.000"
 */
export function formatRupiah(amount) {
  if (amount === undefined || amount === null || amount === '') return 'Rp 0'
  const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount
  if (isNaN(numericAmount)) return 'Rp 0'

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount).replace('IDR', 'Rp')
}

/**
 * Format ISO date string to Indonesian localized date
 * @param {string|Date} dateStr
 * @param {Intl.DateTimeFormatOptions} options
 * @returns {string} e.g. "05 Sep 2026"
 */
export function formatDate(dateStr, options = { day: '2-digit', month: 'short', year: 'numeric' }) {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return String(dateStr)
    return new Intl.DateTimeFormat('id-ID', options).format(date)
  } catch {
    return String(dateStr)
  }
}

/**
 * Format phone number to clean WhatsApp international standard (e.g. 0812 -> 62812)
 * @param {string} phone
 * @returns {string}
 */
export function formatPhoneForWhatsApp(phone) {
  if (!phone) return ''
  const cleanPhone = phone.replace(/[^0-9]/g, '')
  return cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone
}

/**
 * Map invoice status to badge variant & Indonesian label
 * @param {string} status
 * @returns {{ label: string, variant: string }}
 */
export function getInvoiceStatusMeta(status) {
  const normalized = (status || '').toUpperCase()
  switch (normalized) {
    case 'PAID':
      return { label: 'Lunas', variant: 'success' }
    case 'OVERDUE':
      return { label: 'Jatuh Tempo', variant: 'danger' }
    case 'SENT':
      return { label: 'Terkirim', variant: 'warning' }
    case 'DRAFT':
    default:
      return { label: 'Draft', variant: 'default' }
  }
}

