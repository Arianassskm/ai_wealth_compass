import { Request } from 'express'

export interface User {
  id: string
  username?: string
  email: string
  password: string
  fullName?: string
  birthDate?: string
  gender?: string
  occupation?: string
  incomeRange?: string
  educationLevel?: string
  maritalStatus?: string
  address?: Record<string, any>
  contactInfo?: Record<string, any>
  createdAt: string
  updatedAt: string
  
  // 添加 AI 配置接口
  aiConfig: {
    model: string
    temperature: number
    maxTokens: number
    topP: number
    frequencyPenalty: number
    presencePenalty: number
    systemPrompt: string
  }
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