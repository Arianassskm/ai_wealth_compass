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