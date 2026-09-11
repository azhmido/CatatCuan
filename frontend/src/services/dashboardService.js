import api from './api'

export const dashboardService = {
  /**
   * Get dashboard metrics and summary (revenue, unpaid, paid, overdue)
   */
  getSummary: async () => {
    return api.get('/dashboard/summary')
  },

  /**
   * Get recent invoices for dashboard
   */
  getRecentInvoices: async () => {
    return api.get('/dashboard/recent-invoices')
  },
}

export default dashboardService

