import { Router } from 'express'
import { auth } from '../middleware/auth'
import { UserModel } from '../models/user'
import { ApiResponse, AuthenticatedRequest } from '../types'
import { 
  calculateRiskScore, 
  generateInvestmentAdvice, 
  generatePortfolioSuggestion 
} from '../utils/investment-calculator'

const router = Router()

router.post('/', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: '未授权'
      })
    }

    // 计算风险评分
    const riskScore = calculateRiskScore(req.body)
    
    // 生成投资建议
    const investmentAdvice = generateInvestmentAdvice(req.body, riskScore)
    
    // 生成投资组合建议
    const portfolioSuggestion = generatePortfolioSuggestion(riskScore)

    // 更新用户数据
    const updatedUser = await UserModel.updateOnboardingData(userId, {
      ...req.body,
      risk_score: riskScore,
      investment_advice: investmentAdvice,
      portfolio_suggestion: portfolioSuggestion
    })

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      })
    }

    const response: ApiResponse<typeof updatedUser> = {
      success: true,
      data: updatedUser
    }
    res.json(response)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新失败',
      message: error instanceof Error ? error.message : '未知错误'
    })
  }
})

export default router 