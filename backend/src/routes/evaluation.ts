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

// 获取历史评估列表
router.get('/history', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: '未授权访问'
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    // 获取用户的所有评估记录
    const allEvaluations = await EvaluationModel.getByUserId(userId);
    
    // 按时间倒序排序
    const sortedEvaluations = allEvaluations.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // 分页处理
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedEvaluations = sortedEvaluations.slice(start, end);

    // 格式化返回数据
    const evaluationList = paginatedEvaluations.map(evaluation => ({
      id: evaluation.id,
      expenseType: evaluation.expenseType,
      amount: evaluation.amount,
      result: evaluation.result,
      description: evaluation.description,
      createdAt: evaluation.createdAt
    }));

    const response: ApiResponse<{
      total: number,
      list: typeof evaluationList,
      page: number,
      pageSize: number
    }> = {
      success: true,
      data: {
        total: allEvaluations.length,
        list: evaluationList,
        page,
        pageSize
      }
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: '获取评估历史失败',
      message: error instanceof Error ? error.message : '未知错误'
    };
    res.status(500).json(response);
  }
})

// 保存评估记录
router.post('/save', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const evaluation = await EvaluationModel.create({
      userId: req.user?.id as string,
      expenseType: req.body.expenseType,
      amount: req.body.amount,
      result: req.body.result,
      description: req.body.description,
      paymentMethod: req.body.paymentMethod,
      installmentInfo: req.body.installmentInfo,
      boardDecisions: req.body.boardDecisions,
      finalSuggestion: req.body.finalSuggestion,
      financialAssessment: req.body.financialAssessment,
      valueComparisons: req.body.valueComparisons
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

export default router 