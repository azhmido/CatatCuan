import api from './api'

export const clientService = {
  /**
   * Get all clients with optional search & pagination params
   * @param {object} params
   */
  getClients: async (params = {}) => {
    return api.get('/clients', params)
  },

  /**
   * Get single client by ID
   * @param {string|number} id
   */
  getClientById: async (id) => {
    return api.get(`/clients/${id}`)
  },

  /**
   * Create a new client (POST)
   * @param {object} clientData
   */
  createClient: async (clientData) => {
    return api.post('/clients', clientData)
  },

  /**
   * Update an existing client (PUT)
   * @param {string|number} id
   * @param {object} clientData
   */
  updateClient: async (id, clientData) => {
    return api.put(`/clients/${id}`, clientData)
  },

  /**
   * Delete a client (DELETE)
   * @param {string|number} id
   */
  deleteClient: async (id) => {
    return api.delete(`/clients/${id}`)
  },
}

export default clientService

