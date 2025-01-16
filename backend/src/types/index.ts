import { Request } from 'express'

export interface User {
  id: string
  email: string
  password: string
  name: string
  avatar: string
  life_stage: string
  risk_tolerance: string
  age_group: string
  employment_status: string
  estimated_monthly_income: number
  short_term_goal: string
  mid_term_goal: string
  long_term_goal: string
  createdAt: string
  updatedAt: string
  
  // 新增字段
  gender?: string
  monthly_expenses?: number
  savings?: number
  debt_amount?: number
  debt_type?: string[]
  assets?: {
    cash: number
    stock: number
    fund: number
    insurance: number
    real_estate: number
    other: number
  }
  investment_experience?: string
  preferred_investment_types?: string[]
  investment_horizon?: string
  monthly_investment_amount?: number
  expected_return_rate?: number
  financial_status?: string
  housing_status?: string
  lifestyle_status?: string
  risk_score?: number
  investment_advice?: string
  portfolio_suggestion?: {
    cash: number
    bond: number
    stock: number
    gold: number
    real_estate: number
  }
  lastAssessmentAt?: string
}

export interface AuthenticatedRequest extends Request {
  user?: User
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ExpenseCategories {
  salary: number
  bonus: number
  rent: number
  food: number
  transport: number
  utilities: number
  entertainment: number
  others: number
}

export interface InvestmentDetails {
  stocks: number
  funds: number
  deposits: number
}

export interface MonthlyFinanceData {
  user: {
    name: string
    avatar: string
  }
  basic_salary: number
  necessary_expenses: number
  disposable_income: {
    current: number
    last: number
    growth: number
  }
  income_details: {
    total: number
    categories: ExpenseCategories
  }
  expense_details: {
    total: number
    categories: ExpenseCategories
  }
  investment_details: {
    total: number
    categories: InvestmentDetails
  }
  savings: number
}

export interface MonthlyTrendData {
  date: string
  value: number
} 