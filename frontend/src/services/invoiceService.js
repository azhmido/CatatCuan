import api from './api'

const STATUS_MAP = {
  draft: 'DRAFT',
  terkirim: 'SENT',
  lunas: 'PAID',
  telat: 'OVERDUE',
}

function normalizeItems(items) {
  if (!Array.isArray(items)) return []
  return items.map((it) => ({
    description: it.description,
    qty: Number(it.qty ?? it.quantity) || 1,
    unitPrice: Number(it.unitPrice) || 0,
  }))
}

export const invoiceService = {
  /**
   * Get all invoices with search, sort, and filter parameters
   * @param {object} params - { search, sort, status, page, size }
   */
  getInvoices: async (params = {}) => {
    const cleanParams = { ...params }
    if (cleanParams.status && cleanParams.status !== 'Semua') {
      const lower = String(cleanParams.status).toLowerCase()
      cleanParams.status = STATUS_MAP[lower] || cleanParams.status
    } else if (cleanParams.status === 'Semua') {
      delete cleanParams.status
    }
    return api.get('/invoices', cleanParams)
  },

  /**
   * Get invoice details by ID
   * @param {string|number} id
   */
  getInvoiceById: async (id) => {
    return api.get(`/invoices/${id}`)
  },

  /**
   * Create new invoice (POST)
   * @param {object} invoiceData
   */
  createInvoice: async (invoiceData) => {
    const payload = {
      ...invoiceData,
      items: normalizeItems(invoiceData.items),
    }
    return api.post('/invoices', payload)
  },

  /**
   * Update invoice (PUT)
   * @param {string|number} id
   * @param {object} invoiceData
   */
  updateInvoice: async (id, invoiceData) => {
    const payload = {
      ...invoiceData,
      items: normalizeItems(invoiceData.items),
    }
    return api.put(`/invoices/${id}`, payload)
  },

  /**
   * Delete invoice (DELETE)
   * @param {string|number} id
   */
  deleteInvoice: async (id) => {
    return api.delete(`/invoices/${id}`)
  },

  /**
   * Update invoice status (PATCH)
   * @param {string|number} id
   * @param {string} status
   */
  updateStatus: async (id, status) => {
    const lower = String(status).toLowerCase()
    const backendStatus = STATUS_MAP[lower] || String(status).toUpperCase()
    return api.patch(`/invoices/${id}/status`, { status: backendStatus })
  },

  /**
   * Record payment for an invoice (POST)
   * @param {string|number} invoiceId
   * @param {object} paymentData
   */
  recordPayment: async (invoiceId, paymentData) => {
    const payload = {
      amount: Number(paymentData.amount),
      paidAt: paymentData.paidAt || paymentData.paymentDate || new Date().toISOString().split('T')[0],
      method: paymentData.method || paymentData.paymentMethod || 'Transfer Bank',
      note: paymentData.note || paymentData.notes || '',
    }
    return api.post(`/invoices/${invoiceId}/payments`, payload)
  },


  /**
   * Download invoice PDF
   * @param {string|number} id
   */
  downloadPdf: async (id) => {
    return api.get(`/invoices/${id}/pdf`, {}, { responseType: 'blob' })
  },
}

export default invoiceService

