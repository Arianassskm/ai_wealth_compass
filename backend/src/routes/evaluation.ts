import { Router } from 'express'
import { auth } from '../middleware/auth'
import { EvaluationHistoryModel } from '../models/evaluation-history'
import { ApiResponse, AuthenticatedRequest } from '../types'
import { AIService } from '../services/ai-service'

const router = Router()

// 获取用户的评估历史
router.get('/', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const evaluations = await EvaluationHistoryModel.findByUserId(req.user?.id as string)
    
    const response: ApiResponse<typeof evaluations> = {
      success: true,
      data: evaluations
    }
    res.json(response)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取评估历史失败',
      message: error instanceof Error ? error.message : '未知错误'
    })
  }
})

// 创建新的评估记录
router.post('/', auth, async (req: AuthenticatedRequest, res) => {
  try {
    console.log('Creating evaluation with data:', req.body)

    const evaluation = await EvaluationHistoryModel.create({
      userId: req.user?.id as string,
      type: req.body.type,
      accounts: req.body.accounts,
      analysis: {
        totalBalance: req.body.analysis.totalBalance,
        savingsRatio: req.body.analysis.savingsRatio,
        suggestions: req.body.analysis.suggestions || [],
        riskLevel: req.body.analysis.riskLevel
      }
    })
    
    console.log('Evaluation created:', evaluation)
    
    const response: ApiResponse<typeof evaluation> = {
      success: true,
      data: evaluation
    }
    res.json(response)
  } catch (error) {
    console.error('Evaluation creation error:', error)
    res.status(500).json({
      success: false,
      error: '创建评估记录失败',
      message: error instanceof Error ? error.message : '未知错误'
    })
  }
})

// 获取特定评估记录
router.get('/:id', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const evaluation = await EvaluationHistoryModel.findById(req.params.id)
    
    if (!evaluation) {
      return res.status(404).json({
        success: false,
        error: '评估记录不存在'
      })
    }
    
    const response: ApiResponse<typeof evaluation> = {
      success: true,
      data: evaluation
    }
    res.json(response)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取评估记录失败',
      message: error instanceof Error ? error.message : '未知错误'
    })
  }
})

export default router 