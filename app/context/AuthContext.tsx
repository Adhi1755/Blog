'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

// ── Types ──────────────────────────────────────────────────────
export type AuthUser = {
  id: number
  name: string
  email: string
}

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ error?: string }>
  logout: () => void
}

// ── API base ───────────────────────────────────────────────────
const API = 'http://localhost:5001'
const TOKEN_KEY = 'blogspace_token'
const USER_KEY = 'blogspace_user'

// ── Context ────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)   // true until we've checked localStorage

  // ── Hydrate from localStorage on mount ─────────────────────
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)
    if (storedToken && storedUser) {
      try {
        /* eslint-disable react-hooks/set-state-in-effect */
        setToken(storedToken)
        setUser(JSON.parse(storedUser) as AuthUser)
        /* eslint-enable react-hooks/set-state-in-effect */
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }
    setLoading(false)
  }, [])

  // ── Verify token with backend once hydrated ─────────────────
  useEffect(() => {
    if (loading) return
    if (!token) return

    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error('invalid')
        return r.json()
      })
      .then((data) => {
        setUser(data.user)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      })
      .catch(() => {
        // Token expired or backend unreachable — clear state
        setToken(null)
        setUser(null)
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  // ── Login ───────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) return { error: data.error ?? 'Login failed' }

      setToken(data.token)
      setUser(data.user)
      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      return {}
    } catch {
      return { error: 'Cannot reach the server. Is the backend running?' }
    }
  }, [])

  // ── Register ────────────────────────────────────────────────
  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) return { error: data.error ?? 'Registration failed' }

      setToken(data.token)
      setUser(data.user)
      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      return {}
    } catch {
      return { error: 'Cannot reach the server. Is the backend running?' }
    }
  }, [])

  // ── Logout ──────────────────────────────────────────────────
  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
