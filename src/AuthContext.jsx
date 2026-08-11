import { createContext, useContext, useState, useCallback } from 'react'
import { api } from './api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('nedaka_token'))
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('nedaka_user')
    return raw ? JSON.parse(raw) : null
  })

  const persist = useCallback((newToken, newUser) => {
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem('nedaka_token', newToken)
    localStorage.setItem('nedaka_user', JSON.stringify(newUser))
  }, [])

  const login = useCallback(async (username, password) => {
    const data = await api.login(username, password)
    persist(data.access_token, data.user)
  }, [persist])

  const register = useCallback(async (username, password) => {
    const data = await api.register(username, password)
    persist(data.access_token, data.user)
  }, [persist])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('nedaka_token')
    localStorage.removeItem('nedaka_user')
  }, [])

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
