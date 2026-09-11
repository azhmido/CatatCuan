/**
 * Native fetch() wrapper for Spring Boot REST API
 * Handles GET, POST, PUT, DELETE requests with JWT authentication and error management.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const TOKEN_KEY = 'catatcuan_token'

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/**
 * Core request function using native window.fetch()
 */
async function request(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  // Build full URL
  let url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`

  // Append query params if provided (for search, sort, filters)
  if (options.params && typeof options.params === 'object') {
    const searchParams = new URLSearchParams()
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value)
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString
    }
  }

  const fetchConfig = {
    method: options.method || 'GET',
    headers,
  }

  if (options.body) {
    if (typeof options.body === 'string' || options.body instanceof FormData) {
      fetchConfig.body = options.body
      if (options.body instanceof FormData) {
        delete headers['Content-Type'] // Let browser set boundary automatically
      }
    } else {
      fetchConfig.body = JSON.stringify(options.body)
    }
  }

  try {
    const response = await fetch(url, fetchConfig)

    // Handle 401 Unauthorized
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem('catatcuan_tenant')
        if (
          !window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/register') &&
          window.location.pathname !== '/'
        ) {
          window.location.href = '/login'
        }
      }
    }

    // Binary / Blob responses (e.g. PDF downloads)
    if (options.responseType === 'blob') {
      if (!response.ok) {
        throw new ApiError(`Gagal mengunduh file (HTTP ${response.status})`, response.status)
      }
      return await response.blob()
    }

    // 204 No Content
    if (response.status === 204) {
      return null
    }

    // Parse JSON or text
    const contentType = response.headers.get('content-type')
    let data = null
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      data = text ? { message: text } : null
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `Request failed with status ${response.status}`
      throw new ApiError(errorMessage, response.status, data)
    }

    // Unwrap Spring Boot ApiResponse { success, message, data }
    let payload = data
    if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
      payload = data.data !== null && data.data !== undefined ? data.data : data
    }

    // Adapt Spring Data Page object { content: [...], totalPages, totalElements, ... }
    // Returning an array with pagination properties ensures Array.isArray(data) === true
    if (payload && typeof payload === 'object' && Array.isArray(payload.content)) {
      const list = [...payload.content]
      list.totalPages = payload.totalPages
      list.totalElements = payload.totalElements
      list.page = payload.number
      list.size = payload.size
      list.first = payload.first
      list.last = payload.last
      list.rawPage = payload
      return list
    }

    return payload
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(error.message || 'Terjadi kesalahan koneksi jaringan', 0, null)
  }
}

/**
 * Standard HTTP methods using fetch()
 */
export const api = {
  /**
   * HTTP GET method
   * @param {string} endpoint
   * @param {object} [params]
   * @param {object} [options]
   */
  get: (endpoint, params = {}, options = {}) => request(endpoint, { ...options, method: 'GET', params }),

  /**
   * HTTP POST method
   * @param {string} endpoint
   * @param {any} body
   * @param {object} [options]
   */
  post: (endpoint, body = {}, options = {}) => request(endpoint, { ...options, method: 'POST', body }),

  /**
   * HTTP PUT method
   * @param {string} endpoint
   * @param {any} body
   * @param {object} [options]
   */
  put: (endpoint, body = {}, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),

  /**
   * HTTP DELETE method
   * @param {string} endpoint
   * @param {object} [options]
   */
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),

  /**
   * HTTP PATCH method
   * @param {string} endpoint
   * @param {any} body
   * @param {object} [options]
   */
  patch: (endpoint, body = {}, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
}

export const fetchClient = api
export default api


