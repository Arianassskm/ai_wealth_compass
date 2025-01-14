'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { config } from '@/config'

interface OnboardingData {
  // 基本信息
  life_stage: string
  age_group: string
  gender: string
  employment_status: string
  estimated_monthly_income: number
  
  // 财务状况
  monthly_expenses: number
  savings: number
  debt_amount: number
  debt_type: string[]
  assets: {
    cash: number
    stock: number
    fund: number
    insurance: number
    real_estate: number
    other: number
  }
  
  // 投资偏好
  risk_tolerance: string
  investment_experience: string
  preferred_investment_types: string[]
  investment_horizon: string
  
  // 财务目标
  short_term_goal: string
  mid_term_goal: string
  long_term_goal: string
  monthly_investment_amount: number
  expected_return_rate: number
}

interface OnboardingContextType {
  data: OnboardingData
  updateData: (newData: Partial<OnboardingData>) => void
  submitData: () => Promise<void>
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

const initialData: OnboardingData = {
  life_stage: '奋斗期',
  age_group: '',
  gender: '',
  employment_status: '',
  estimated_monthly_income: 0,
  monthly_expenses: 0,
  savings: 0,
  debt_amount: 0,
  debt_type: [],
  assets: {
    cash: 0,
    stock: 0,
    fund: 0,
    insurance: 0,
    real_estate: 0,
    other: 0
  },
  risk_tolerance: 'moderate',
  investment_experience: 'beginner',
  preferred_investment_types: [],
  investment_horizon: 'medium',
  short_term_goal: '',
  mid_term_goal: '',
  long_term_goal: '',
  monthly_investment_amount: 0,
  expected_return_rate: 0
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<OnboardingData>(initialData)

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }))
  }

  const submitData = async () => {
    if (!token) {
      toast.error('请先登录后再继续')
      router.push('/login')
      throw new Error('未登录')
    }

    try {
      const response = await fetch(`${config.apiUrl}${config.apiEndpoints.onboarding}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('登录已过期，请重新登录')
          router.push('/login')
          throw new Error('登录已过期')
        }
        throw new Error(result.error || '提交失败')
      }

      if (!result.success) {
        throw new Error(result.error || '提交失败')
      }

      toast.success('信息采集完成')
      router.push('/profile')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '提交失败'
      toast.error(errorMessage)
      throw error
    }
  }

  return (
    <OnboardingContext.Provider value={{ data, updateData, submitData }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
} 