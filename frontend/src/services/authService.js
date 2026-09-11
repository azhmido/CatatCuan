import api from './api'

export const authService = {
  login: async (credentials) => {
    return api.post('/auth/login', credentials)
  },

  register: async (registrationData) => {
    return api.post('/auth/register', registrationData)
  },

  googleLogin: async (idToken) => {
    return api.post('/auth/google', { idToken })
  },

  getProfile: async () => {
    return api.get('/auth/me')
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignore network errors during client logout
    }
  },
}

export default authService

