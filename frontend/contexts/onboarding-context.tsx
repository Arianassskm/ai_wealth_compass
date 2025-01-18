'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { config } from '@/config'
import { calculateBasicSalary, calculateNecessaryExpenses, LifeStyle } from '@/utils/salary-calculator'
const reminderText = `帮我计算一下我的基础薪资,我给出基本算法,你帮我计算出结果，比如：95后 + 职场新人 + 一线城市 = 约15000元/月,你给我返回<basic_salary>10000</basic_salary>这样的数据,最好能给出具体值`
interface OnboardingData {
  // 基本信息
  life_stage: string
  age_group: string
  gender: string
  employment_status: string
  estimated_monthly_income: number
  basic_salary: number
  
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
  financial_status: string
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
  basic_salary: 0,
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
  expected_return_rate: 0,
  financial_status: '小有盈余'
}

// 添加映射常量
const LIFE_STAGE_EN_MAP = {
  'student': '学生',
  'fresh_graduate': '应届毕业生',
  'career_start': '职场新人',
  'career_growth': '职业发展期',
  'single': '单身贵族',
  'relationship': '恋爱阶段',
  'married': '新婚阶段',
  'parent': '为人父母',
  'midlife': '中年阶段',
  'retirement': '退休准备'
} as const

const GENDER_CN_MAP = {
  'male': '男',
  'female': '女',
  'other': '其他'
} as const

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
      // 转换生命阶段为英文
      const lifeStageEn = Object.entries(LIFE_STAGE_EN_MAP).find(
        ([key]) => key === data.life_stage
      )?.[1] || data.life_stage

      // 转换性别为英文
      const genderEn = GENDER_CN_MAP[data.gender as keyof typeof GENDER_CN_MAP] || data.gender

      const aiResponse = await fetch(`${config.apiUrl}${config.apiEndpoints.ai.chat}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: reminderText },
            { 
              role: 'user', 
              content: `我是${data.age_group}, 我的人生阶段是${lifeStageEn}, 我的性别是${genderEn}，我所在的城市是深圳。请预估我的月收入` 
            }
          ]
        })
      })

      const aiResult = await aiResponse.json()
      const content = aiResult.choices?.[0]?.message?.content
      let basic_salary = 0
      if (content) {
        const match = content.match(/<basic_salary>.*?(\d+).*?<\/basic_salary>/)
        if (match && match[1]) {
          basic_salary = parseInt(match[1], 10)
        }
      }

      // 根据财务状况计算必需开支
      let expenseRatio = {
        min: 0.4,  // 默认值
        max: 0.6   // 默认值
      }

      switch (data.financial_status) {
        case '省吃俭用':
          expenseRatio = { min: 0.6, max: 0.8 }
          break
        case '小有盈余':
          expenseRatio = { min: 0.4, max: 0.6 }
          break
        case '品质生活':
          expenseRatio = { min: 0.3, max: 0.4 }
          break
        case '精致生活':
          expenseRatio = { min: 0.2, max: 0.3 }
          break
      }

      // 计算必需开支（取区间平均值）
      const necessary_expenses = Math.round(basic_salary * (expenseRatio.min + expenseRatio.max) / 2)
      const estimated_monthly_income = basic_salary

      const dataToSubmit = {
        ...data,
        basic_salary,
        necessary_expenses,
        estimated_monthly_income
      }

      const response = await fetch(`${config.apiUrl}${config.apiEndpoints.onboarding}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSubmit)
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