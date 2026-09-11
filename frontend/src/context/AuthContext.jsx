import { createContext, useContext, useState } from 'react'

const TOKEN_KEY = 'catatcuan_token'
const TENANT_KEY = 'catatcuan_tenant'

export const AuthContext = createContext({
  token: null,
  tenant: null,
  isAuthenticated: false,
  isLoading: false,
  login: () => {},
  logout: () => {},
  setAuthData: () => {},
})

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  })

  const [tenant, setTenant] = useState(() => {
    try {
      const savedTenant = localStorage.getItem(TENANT_KEY)
      return savedTenant ? JSON.parse(savedTenant) : null
    } catch {
      return null
    }
  })

  const login = (newToken, tenantData) => {
    setToken(newToken)
    setTenant(tenantData)
    try {
      localStorage.setItem(TOKEN_KEY, newToken)
      if (tenantData) {
        localStorage.setItem(TENANT_KEY, JSON.stringify(tenantData))
      }
    } catch {
      // ignore storage errors
    }
  }

  const logout = () => {
    setToken(null)
    setTenant(null)
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(TENANT_KEY)
    } catch {
      // ignore
    }
  }

  const setAuthData = (newToken, tenantData) => {
    login(newToken, tenantData)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        tenant,
        isAuthenticated: Boolean(token),
        isLoading: false,
        login,
        logout,
        setAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
