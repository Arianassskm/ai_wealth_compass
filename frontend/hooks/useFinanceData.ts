import { useState, useEffect } from 'react'
import { useAuthContext } from '@/providers/auth-provider'
import { fetchApi } from '@/lib/api'
import { config } from '@/config'

export interface FinanceData {
  user?: {
    name: string
    avatar: string
  }
  disposable_income: {
    current: number
    last: number
    growth: number
  }
  income_details: {
    total: number
    categories: {
      salary: number
      bonus: number
      rent: number
      food: number
      transport: number
      utilities: number
      entertainment: number
      others: number
    }
  }
  expense_details: {
    total: number
    categories: {
      salary: number
      bonus: number
      rent: number
      food: number
      transport: number
      utilities: number
      entertainment: number
      others: number
    }
  }
  investment_details: {
    total: number
    categories: {
      stocks: number
      funds: number
      deposits: number
    }
  }
  savings: number
  monthly_trend: Array<{
    date: string
    value: number
  }>
}

export function useFinanceData() {
  const { token } = useAuthContext()
  const [financeData, setFinanceData] = useState<FinanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setLoading(true)
        const [dashboardResponse, trendResponse] = await Promise.all([
          fetchApi<FinanceData>(config.apiEndpoints.user.financeDashboard, { token }),
          fetchApi<{ data: Array<{ date: string, value: number }> }>(
            config.apiEndpoints.user.monthlyTrend, 
            { token }
          )
        ])

        setFinanceData({
          ...dashboardResponse.data,
          monthly_trend: trendResponse.data
        })
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchFinanceData()
    }
  }, [token])

  return { financeData, loading, error }
} 