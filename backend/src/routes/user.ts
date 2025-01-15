import { Router } from 'express'
import { auth } from '../middleware/auth'
import { UserModel } from '../models/user'
import { ApiResponse, User, AuthenticatedRequest, MonthlyFinanceData } from '../types'
import { AIConfigModel, AIConfig } from '../models/ai-config'
import { MonthlyFinanceModel } from '../models/monthly-finance'

const router = Router()

router.get('/profile', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await UserModel.findById(req.user?.id as string)
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User not found'
      }
      return res.status(404).json(response)
    }

    // 获取月度财务数据
    const { currentAmount, growthRate } = await MonthlyFinanceModel.calculateGrowthRate(user.id)

    // 转换数据格式以匹配前端需求
    const profileData = {
      name: user.name,
      avatar: user.avatar,
      life_stage: user.life_stage,
      risk_tolerance: user.risk_tolerance,
      age_group: user.age_group,
      employment_status: user.employment_status,
      estimated_monthly_income: user.estimated_monthly_income,
      short_term_goal: user.short_term_goal,
      mid_term_goal: user.mid_term_goal,
      long_term_goal: user.long_term_goal,
      // 添加月度财务数据
      disposable_income: {
        amount: currentAmount,
        growth_rate: growthRate
      }
    }
    
    const response: ApiResponse<typeof profileData> = {
      success: true,
      data: profileData
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

router.get('/ai-config', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const config = await AIConfigModel.findByUserId(req.user?.id as string)
    
    const response: ApiResponse<typeof config> = {
      success: true,
      data: config
    }
    res.json(response)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取失败',
      message: error instanceof Error ? error.message : '未知错误'
    })
  }
})

router.put('/ai-config', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const { aiConfig } = req.body
    const userId = req.user?.id as string

    const updatedConfig = await AIConfigModel.updateConfig(userId, {
      provider: aiConfig.provider,
      apiKey: aiConfig.apiKey,
      baseUrl: aiConfig.baseUrl,
      isEnabled: aiConfig.isEnabled
    } as Partial<AIConfig>)

    const response: ApiResponse<typeof updatedConfig> = {
      success: true,
      data: updatedConfig
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

router.get('/monthly-finance', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id as string
    const { currentAmount, growthRate, lastMonthAmount } = await MonthlyFinanceModel.calculateGrowthRate(userId)

    const response: ApiResponse<{
      disposable_income: {
        current: number
        last: number
        growth: number
      }
    }> = {
      success: true,
      data: {
        disposable_income: {
          current: currentAmount,
          last: lastMonthAmount,
          growth: Number(growthRate.toFixed(2))  // 保留两位小数
        }
      }
    }
    res.json(response)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取财务数据失败',
      message: error instanceof Error ? error.message : '未知错误'
    })
  }
})

router.get('/finance-dashboard', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id as string
    const user = await UserModel.findById(userId)
    const { currentAmount, growthRate, lastMonthAmount } = await MonthlyFinanceModel.calculateGrowthRate(userId)
    
    // 获取当月完整财务数据
    const currentMonthData = await MonthlyFinanceModel.getCurrentMonthData(userId)
    
    const response: ApiResponse<MonthlyFinanceData> = {
      success: true,
      data: {
        user: {
          name: user?.name || '',
          avatar: user?.avatar || ''
        },
        disposable_income: {
          current: currentAmount,
          last: lastMonthAmount,
          growth: Number(growthRate.toFixed(2))
        },
        income_details: {
          total: currentMonthData.totalIncome,
          categories: currentMonthData.categories
        },
        expense_details: {
          total: currentMonthData.totalExpenses,
          categories: currentMonthData.categories
        },
        investment_details: {
          total: currentMonthData.investments,
          categories: currentMonthData.investmentDetails
        },
        savings: currentMonthData.savings
      }
    }
    res.json(response)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取财务数据失败',
      message: error instanceof Error ? error.message : '未知错误'
    })
  }
})

export default router 