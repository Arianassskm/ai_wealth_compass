import { Router } from 'express'
import { auth } from '../middleware/auth'
import { AccountModel } from '../models/account'
import { ApiResponse, AuthenticatedRequest } from '../types'

const router = Router()

// 获取用户所有账户
router.get('/', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const accounts = await AccountModel.findByUserId(req.user?.id as string)
    
    const response: ApiResponse<typeof accounts> = {
      success: true,
      data: accounts
    }
    res.json(response)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取账户失败',
      message: error instanceof Error ? error.message : '未知错误'
    })
  }
})

// 创建新账户
router.post('/', auth, async (req: AuthenticatedRequest, res) => {
  try {
    console.log('Creating account with data:', {
      userId: req.user?.id,
      ...req.body
    })

    const account = await AccountModel.create({
      userId: req.user?.id as string,
      ...req.body
    })
    
    console.log('Account created:', account)

    const response: ApiResponse<typeof account> = {
      success: true,
      data: account
    }
    res.json(response)
  } catch (error) {
    console.error('Error creating account:', error)
    res.status(500).json({
      success: false,
      error: '创建账户失败',
      message: error instanceof Error ? error.message : '未知错误'
    })
  }
})

// 更新账户
router.put('/:id', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const account = await AccountModel.update(req.params.id, req.body)
    
    if (!account) {
      return res.status(404).json({
        success: false,
        error: '账户不存在'
      })
    }
    
    const response: ApiResponse<typeof account> = {
      success: true,
      data: account
    }
    res.json(response)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新账户失败',
      message: error instanceof Error ? error.message : '未知错误'
    })
  }
})

// 删除账户
router.delete('/:id', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const success = await AccountModel.delete(req.params.id)
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: '账户不存在'
      })
    }
    
    res.json({
      success: true,
      message: '账户已删除'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '删除账户失败',
      message: error instanceof Error ? error.message : '未知错误'
    })
  }
})

export default router 