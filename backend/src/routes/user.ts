import { Router, Response } from 'express'
import { auth } from '../middleware/auth'
import { UserModel } from '../models/user'
import { ApiResponse, AuthenticatedRequest, MonthlyFinanceData, MonthlyTrendData } from '../types'
import { AIConfigModel, AIConfig } from '../models/ai-config'
import { MonthlyFinanceModel } from '../models/monthly-finance'
import fs from 'fs/promises'
import path from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const router = Router()

router.get('/profile', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await UserModel.findById(req.user?.id as string)
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: '用户不存在'
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
      },
      // 添加 AI 评估详情
      ai_evaluation_details: {
        budget_settings: user.ai_evaluation_details?.budget_settings || null,
        wealth_composition: user.ai_evaluation_details?.wealth_composition || null,
        last_updated: user.ai_evaluation_details?.last_updated || null
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
      error: '服务器错误',
      message: error instanceof Error ? error.message : '未知错误'
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

router.get('/monthly-trend', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id as string
    const trendData = await MonthlyFinanceModel.getMonthlyTrend(userId)
    
    const response: ApiResponse<MonthlyTrendData[]> = {
      success: true,
      data: trendData
    }
    
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: '获取月度趋势数据失败',
      message: error instanceof Error ? error.message : '未知错误'
    }
    res.status(500).json(response)
  }
})

router.post('/calibrate/budget', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { total_budget, categories } = req.body;

    if (!total_budget || !categories || !Array.isArray(categories)) {
      res.status(400).json({
        success: false,
        error: '无效的预算数据',
        message: '请提供有效的预算金额和分类信息'
      });
      return;
    }

    // 读取用户数据
    const data = await fs.readFile(path.join(__dirname, '../../db/users.json'), 'utf-8');
    const { users } = JSON.parse(data);
    
    // 查找并更新用户数据
    const userIndex = users.findIndex((u: any) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '用户不存在',
        message: '未找到指定用户'
      });
    }

    // 更新预算设置
    if (!users[userIndex].ai_evaluation_details) {
      users[userIndex].ai_evaluation_details = {};
    }

    users[userIndex].ai_evaluation_details.budget_settings = {
      total_budget,
      categories,
      monthly_budget: {
        income: users[userIndex].estimated_monthly_income || 0,
        expenses: {
          fixed: {
            housing: Math.round(total_budget * 0.3),
            utilities: Math.round(total_budget * 0.05),
            transportation: Math.round(total_budget * 0.1)
          },
          variable: {
            food: Math.round(total_budget * 0.2),
            entertainment: Math.round(total_budget * 0.15),
            shopping: Math.round(total_budget * 0.1)
          },
          savings: Math.round(total_budget * 0.1)
        },
        current_month: new Date().toISOString().slice(0, 7),
        history: users[userIndex].ai_evaluation_details?.budget_settings?.monthly_budget?.history || []
      }
    };

    // 更新最后修改时间
    users[userIndex].ai_evaluation_details.last_updated = new Date().toISOString();
    users[userIndex].updatedAt = new Date().toISOString();

    // 保存更新后的数据
    await fs.writeFile(
      path.join(__dirname, '../../db/users.json'),
      JSON.stringify({ users }, null, 2)
    );

    res.json({
      success: true,
      data: users[userIndex].ai_evaluation_details.budget_settings
    });

  } catch (error) {
    console.error('Failed to update budget settings:', error);
    res.status(500).json({
      success: false,
      error: '更新预算失败',
      message: error instanceof Error ? error.message : '未知错误'
    });
  }
});

interface WealthComponent {
  type: string;
  percentage: number;
  amount: number;
  risk_level: string;
  liquidity: string;
}

interface WealthComposition {
  last_updated: string;
  components: WealthComponent[];
  analysis: {
    risk_score: number;
    diversification_score: number;
    liquidity_score: number;
    recommendations: string[];
  };
}

router.put('/wealth-composition', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const wealthComposition: WealthComposition = req.body;
    const userId = req.user?.id;

    // 读取用户数据
    const dbPath = join(__dirname, '../../db/users.json');
    const data = JSON.parse(readFileSync(dbPath, 'utf-8'));

    // 查找并更新用户数据
    const userIndex = data.users.findIndex((user: any) => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 验证数据
    if (!validateWealthComposition(wealthComposition)) {
      return res.status(400).json({ error: '无效的财富构成数据' });
    }

    // 更新数据
    data.users[userIndex].ai_evaluation_details.wealth_composition = {
      ...wealthComposition,
      last_updated: new Date().toISOString()
    };

    // 保存到文件
    writeFileSync(dbPath, JSON.stringify(data, null, 2));

    res.json({
      success: true,
      message: '财富构成更新成功',
      data: data.users[userIndex].ai_evaluation_details.wealth_composition
    });

  } catch (error) {
    console.error('更新财富构成失败:', error);
    res.status(500).json({
      error: '服务器错误',
      message: '更新财富构成失败'
    });
  }
});

// 添加数据验证函数
function validateWealthComposition(data: WealthComposition): boolean {
  try {
    // 验证基本结构
    if (!data.components || !Array.isArray(data.components)) {
      return false;
    }

    // 验证组件数据
    const totalPercentage = data.components.reduce(
      (sum, comp) => sum + comp.percentage,
      0
    );
    if (Math.abs(totalPercentage - 100) > 0.01) { // 允许 0.01% 的误差
      return false;
    }

    // 验证每个组件的必要字段
    return data.components.every(comp => 
      typeof comp.type === 'string' &&
      typeof comp.percentage === 'number' &&
      typeof comp.amount === 'number' &&
      typeof comp.risk_level === 'string' &&
      typeof comp.liquidity === 'string'
    );

  } catch (error) {
    return false;
  }
}

export default router 