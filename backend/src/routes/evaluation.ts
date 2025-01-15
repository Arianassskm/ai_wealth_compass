import { Router } from 'express'
import { auth } from '../middleware/auth'
import { EvaluationModel } from '../models/evaluation'
import { ApiResponse, AuthenticatedRequest } from '../types'

const router = Router()

// 创建评估记录
router.post('/', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const evaluation = await EvaluationModel.create({
      userId: req.user?.id as string,
      ...req.body
    })
    
    const response: ApiResponse<typeof evaluation> = {
      success: true,
      data: evaluation
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: '创建评估记录失败',
      message: error instanceof Error ? error.message : '未知错误'
    }
    res.status(500).json(response)
  }
})

// 获取用户的评估历史
router.get('/user/:userId', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const evaluations = await EvaluationModel.getByUserId(req.params.userId)
    
    const response: ApiResponse<typeof evaluations> = {
      success: true,
      data: evaluations
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: '获取评估历史失败',
      message: error instanceof Error ? error.message : '未知错误'
    }
    res.status(500).json(response)
  }
})

// 获取单条评估记录
router.get('/:id', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const evaluation = await EvaluationModel.getById(req.params.id)
    if (!evaluation) {
      const response: ApiResponse<null> = {
        success: false,
        error: '评估记录不存在'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse<typeof evaluation> = {
      success: true,
      data: evaluation
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: '获取评估记录失败',
      message: error instanceof Error ? error.message : '未知错误'
    }
    res.status(500).json(response)
  }
})

// 添加保存评估记录的路由
router.post('/save', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const evaluation = await EvaluationModel.create({
      userId: req.user?.id as string,
      expenseType: req.body.expenseType,
      amount: req.body.amount,
      result: req.body.result,
      description: req.body.description,
      paymentMethod: req.body.paymentMethod,
      installmentInfo: req.body.installmentInfo
    });
    
    const response: ApiResponse<typeof evaluation> = {
      success: true,
      data: evaluation
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: '保存评估记录失败',
      message: error instanceof Error ? error.message : '未知错误'
    };
    res.status(500).json(response);
  }
});

export default router 