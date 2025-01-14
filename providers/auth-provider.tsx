'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const PUBLIC_PATHS = ['/login', '/register']

interface AuthContextType {
  token: string | null
  setToken: (token: string | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { token, setToken } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const logout = () => {
    setToken(null)
    router.push('/login')
  }

  // 路由保护
  if (!token && !PUBLIC_PATHS.includes(pathname)) {
    router.push('/login')
    return null
  }

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
} 