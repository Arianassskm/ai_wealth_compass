import { useState, useEffect } from 'react'
import { useAuthContext } from '@/providers/auth-provider'
import { fetchApi } from '@/lib/api'
import { config } from '@/config'

export interface Account {
  id: string
  name: string
  balance: number
  purpose: string
  description: string
}

export function useAccounts() {
  const { token } = useAuthContext()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const response = await fetchApi<{ data: Account[] }>(
        config.apiEndpoints.accounts.list,
        { token }
      )
      setAccounts(response.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取账户失败')
    } finally {
      setLoading(false)
    }
  }

  const createAccount = async (data: Omit<Account, 'id'>) => {
    try {
      const response = await fetchApi(config.apiEndpoints.accounts.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        token
      })
      
      if (!response.success) {
        throw new Error(response.error || '创建账户失败')
      }
      
      await fetchAccounts()
    } catch (err) {
      console.error('Error creating account:', err)
      throw err
    }
  }

  const updateAccount = async (id: string, data: Partial<Account>) => {
    try {
      await fetchApi(config.apiEndpoints.accounts.update(id), {
        method: 'PUT',
        body: JSON.stringify(data),
        token
      })
      await fetchAccounts()
    } catch (err) {
      throw err
    }
  }

  const deleteAccount = async (id: string) => {
    try {
      await fetchApi(config.apiEndpoints.accounts.delete(id), {
        method: 'DELETE',
        token
      })
      await fetchAccounts()
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    if (token) {
      fetchAccounts()
    }
  }, [token])

  return {
    accounts,
    loading,
    error,
    createAccount,
    updateAccount,
    deleteAccount,
    totalBalance: accounts.reduce((sum, account) => sum + account.balance, 0)
  }
} 