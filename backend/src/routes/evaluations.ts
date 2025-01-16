import { Router, Response } from 'express';
import { auth } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import { promises as fs } from 'fs';
import path from 'path';

const router = Router();

// 获取单个评估记录
router.get('/:id', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const evaluationId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: '未授权访问',
        message: '用户未登录'
      });
    }

    // 读取评估历史数据
    const dbPath = path.join(__dirname, '../../db/evaluation_histories.json');
    const data = await fs.readFile(dbPath, 'utf-8');
    const { histories } = JSON.parse(data);

    // 查找对应的评估记录，并验证所有权
    const evaluation = histories.find((h: any) => 
      h.id === evaluationId && h.userId === userId
    );

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        error: '评估记录不存在或无权访问'
      });
    }

    // 转换数据格式以匹配前端展示需求
    const formattedEvaluation = {
      result: evaluation.result,
      expenseType: evaluation.expenseType,
      expenseDescription: evaluation.description,
      amount: evaluation.amount.toString(),
      paymentMethod: evaluation.paymentMethod,
      installmentInfo: evaluation.installmentInfo,
      boardDecisions: evaluation.analysis?.boardDecisions || {},
      finalSuggestion: evaluation.analysis?.finalSuggestion || '',
      financialAssessment: {
        necessity: evaluation.analysis?.necessity ?? 0,
        necessityDesc: evaluation.analysis?.necessityDesc || '',
        urgency: evaluation.analysis?.urgency ?? 0,
        urgencyDesc: evaluation.analysis?.urgencyDesc || '',
        shortTermImpact: evaluation.analysis?.shortTermImpact || '',
        longTermImpact: evaluation.analysis?.longTermImpact || '',
        riskLevel: evaluation.analysis?.riskLevel || ''
      },
      valueComparisons: evaluation.analysis?.valueComparisons || [],
      // 确保所有必要字段都有默认值
      imageUrl: evaluation.imageUrl || '',
      linkUrl: evaluation.linkUrl || ''
    };

    // 打印日志以便调试
    console.log('Found evaluation:', evaluation);
    console.log('Formatted evaluation:', formattedEvaluation);

    res.json({
      success: true,
      data: formattedEvaluation
    });

  } catch (error) {
    console.error('Failed to get evaluation:', error);
    res.status(500).json({
      success: false,
      error: '获取评估记录失败',
      message: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 保存评估记录的路由保持不变
router.post('/save', auth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: '未授权',
        message: '用户未登录'
      });
    }

    // 验证请求数据
    const evaluation = req.body;
    if (!evaluation || !evaluation.id || !evaluation.amount) {
      return res.status(400).json({
        success: false,
        error: '无效的评估数据',
        message: '请提供完整的评估信息'
      });
    }

    // 读取现有评估历史
    const dbPath = path.join(__dirname, '../../db/evaluation_histories.json');
    let evaluations = [];
    try {
      const data = await fs.readFile(dbPath, 'utf-8');
      evaluations = JSON.parse(data);
    } catch (error) {
      // 如果文件不存在或为空，使用空数组
      evaluations = [];
    }

    // 添加新的评估记录
    const newEvaluation = {
      ...evaluation,
      userId,
      createdAt: new Date().toISOString()
    };

    evaluations.push(newEvaluation);

    // 保存到文件
    await fs.writeFile(dbPath, JSON.stringify(evaluations, null, 2));

    res.json({
      success: true,
      data: newEvaluation
    });

  } catch (error) {
    console.error('Failed to save evaluation:', error);
    res.status(500).json({
      success: false,
      error: '保存评估记录失败',
      message: error instanceof Error ? error.message : '未知错误'
    });
  }
});

export default router; 