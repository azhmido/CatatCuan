import api from './api'

export const paymentService = {
  /**
   * Get payments list
   * @param {object} params
   */
  getPayments: async (params = {}) => {
    return api.get('/payments', params)
  },

  /**
   * Get payment by ID
   * @param {string|number} id
   */
  getPaymentById: async (id) => {
    return api.get(`/payments/${id}`)
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
}


export default paymentService
