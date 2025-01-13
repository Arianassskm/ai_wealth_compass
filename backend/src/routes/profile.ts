import { Router } from 'express'
import { UserModel } from '../models/user'
import { auth } from '../middleware/auth'
import { ApiResponse, User, AuthenticatedRequest } from '../types'

const router = Router()

router.get('/', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await UserModel.findById(req.user?.id as string)
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User not found'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse<User> = {
      success: true,
      data: user
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

router.put('/', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const updatedUser = await UserModel.updateProfile(req.user?.id as string, req.body)
    if (!updatedUser) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User not found'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse<User> = {
      success: true,
      data: updatedUser
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(response)
  }
})

export default router 