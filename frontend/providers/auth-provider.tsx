'use client'

import { createContext, useContext, ReactNode, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const PUBLIC_PATHS = ['/login', '/register']

interface AuthContextType {
  token: string | null
  user: {
    age?: string
    monthlyIncome?: string
    occupation?: string
    familyStatus?: string
    financialGoals?: string
  } | null
  setToken: (token: string | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { token, setToken } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<AuthContextType['user']>(null)

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
    <AuthContext.Provider value={{ token, user, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext 必须在 AuthProvider 中使用')
  }
  return context
} 