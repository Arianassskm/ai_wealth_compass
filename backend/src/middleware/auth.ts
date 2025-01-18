import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { UserModel } from '../models/user'
import { ApiResponse } from '../types'
import { User } from '../models/user'

interface RequestWithUser extends Request {
  user?: User
}

export const auth = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      const response: ApiResponse<null> = {
        success: false,
        error: '请先登录后再继续',
        message: '未检测到登录信息'
      }
      return res.status(401).json(response)
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      const response: ApiResponse<null> = {
        success: false,
        error: '请先登录后再继续',
        message: '登录信息无效'
      }
      return res.status(401).json(response)
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { id: string }
      const user = await UserModel.findById(decoded.id)
      
      if (!user) {
        const response: ApiResponse<null> = {
          success: false,
          error: '请重新登录',
          message: '用户信息已失效'
        }
        return res.status(401).json(response)
      }

      req.user = user
      next()
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: '登录已过期，请重新登录',
        message: '登录信息已过期'
      }
      return res.status(401).json(response)
    }
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: '认证失败，请重新登录',
      message: error instanceof Error ? error.message : '未知错误'
    }
    res.status(401).json(response)
  }
} 