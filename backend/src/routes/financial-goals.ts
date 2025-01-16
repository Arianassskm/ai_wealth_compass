import { Router, Response } from 'express';
import { z } from 'zod';
import { auth } from '../middleware/auth';
import { FinancialGoalsModel } from '../models/financial-goals';
import { ApiResponse, AuthenticatedRequest } from '../types';
import { FinancialGoal } from '../types/financial-goals';

const router = Router();

// 验证创建/更新目标的数据结构
const goalSchema = z.object({
  name: z.string().min(1, '目标名称不能为空'),
  targetAmount: z.number().min(1, '目标金额必须大于0'),
  currentAmount: z.number().min(0, '当前金额不能为负'),
  deadline: z.string().datetime({ message: '请输入有效的截止日期' })
});

// 获取用户的所有财务目标
router.get('/', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const goals = await FinancialGoalsModel.getUserGoals(req.user?.id as string);
    res.json({
      success: true,
      data: goals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取财务目标失败'
    });
  }
});

// 创建新的财务目标
router.post('/', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = await goalSchema.parseAsync(req.body);
    const goal = await FinancialGoalsModel.createGoal({
      userId: req.user?.id as string,
      ...validatedData
    });
    
    res.status(201).json({
      success: true,
      data: goal
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: '数据验证失败',
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: '创建财务目标失败'
    });
  }
});

// 更新财务目标
router.put('/:id', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = await goalSchema.partial().parseAsync(req.body);
    const goal = await FinancialGoalsModel.updateGoal(
      req.params.id,
      req.user?.id as string,
      validatedData
    );
    
    if (!goal) {
      return res.status(404).json({
        success: false,
        error: '目标不存在'
      });
    }
    
    res.json({
      success: true,
      data: goal
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: '数据验证失败',
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: '更新财务目标失败'
    });
  }
});

// 删除财务目标
router.delete('/:id', auth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const success = await FinancialGoalsModel.deleteGoal(req.params.id, req.user?.id as string);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: '目标不存在'
      });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '删除财务目标失败'
    });
  }
});

export default router;
