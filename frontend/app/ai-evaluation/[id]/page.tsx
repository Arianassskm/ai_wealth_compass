"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchApi } from '@/lib/api'
import { config } from '@/config'
import { useAuthContext } from '@/providers/auth-provider'
import { Card ,CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/ui/status-badge'
import { Smartphone, Map, Utensils } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

// 将 remindText 移到顶部并格式化
const remindText = `你是一个专业的财务分析和决策支持AI系统。你将接收用户的财务支出申请，并提供全面、多维度的分析报告。

输入要求：
1. 金额：必须为阿拉伯数字
2. 用途：需明确具体的支出类型
3. 支付方式：可选一次性或分期
4. 用户的基本信息
报告将包含四大板块:

<第一板块: 审核结果>
- 评估标准：
  * result：通过/不通过/谨慎/警告
- 给出明确的审核状态和简要说明

<第二板块: 费用可视化>
提供费用支出金额的等价物品或活动价值对比参考：如旅游：1000X3,衣服：800X3，餐饮：200X15
- 可视化转换场景：
  * 生成对应商品图片
  * 提供官方购买链接
  * 价值对比图表

<第三板块: 私董会决议>
私董会评估规则：

吴军模型：
- score：1-10分
- comment：简短评价
- emoji：👍/👎/🤔

刘擎模型：
- score：1-10分
- comment：简短评价
- emoji：🙌/✖️/🚧

冯唐模型：
- score：1-10分
- comment：简短评价
- emoji：🤝/🛑/⚠️

<第四板块: 财务评估>
- 必要性评分：1-10分
- 紧急性评分：1-10分
- 财务影响评估：
  * 短期影响
  * 长期影响
- 风险等级：高/中/低

请按照以上格式输出分析报告，确保包含所有必要字段。`;

interface ValueComparison {
  category: string
  quantity: string
  price?: string
}

interface AIEvaluation {
  result: string
  imageUrl?: string
  linkUrl?: string
  expenseType: string
  expenseDescription: string
  amount: string
  paymentMethod: '一次性支付' | '分期付款'
  installmentInfo?: {
    value: number
    unit: 'month' | 'year'
    monthlyPayment: number
    installmentType?: string
  }
  boardDecisions: {
    [key: string]: {
      score: number
      comment: string
      emoji: string
    }
  }
  finalSuggestion: string
  financialAssessment: {
    necessity: number
    urgency: number
    shortTermImpact: string
    longTermImpact: string
    riskLevel: string
  }
  valueComparisons?: ValueComparison[]
}

interface AIEvaluationHistory {
  id: string
  userId: string
  type: 'expense_evaluation'
  amount: number
  expenseType: string
  result: string
  analysis: {
    necessity: number
    urgency: number
    riskLevel: string
    valueComparisons: ValueComparison[]
    boardDecisions: {
      [key: string]: {
        score: number
        comment: string
        emoji: string
      }
    }
  }
  createdAt: string
}

// 添加状态翻译字典
const STATUS_MAP = {
  'caution': '谨慎',
  'warning': '警告',
  'approved': '通过',
  'rejected': '不通过',
  'pending': '等待中'
} as const;

export default function AIEvaluationPage({ params }: { params: { id: string } }) {
  const { token } = useAuthContext()
  const searchParams = useSearchParams()
  const [evaluation, setEvaluation] = useState<AIEvaluation | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  // 更新用户信息的类型
  const [userInfo, setUserInfo] = useState<{
    age_group?: string
    monthlyIncome?: number
    occupation?: string
    familyStatus?: string
    financialGoals?: string
    riskTolerance?: string
  } | null>(null)

  // 生命阶段翻译
  const LIFE_STAGE_MAP = {
    'single': '单身',
    'married': '已婚',
    'divorced': '离异',
    'widowed': '丧偶'
  } as const;

  // 风险承受能力翻译
  const RISK_TOLERANCE_MAP = {
    'conservative': '保守型',
    'moderate': '稳健型',
    'aggressive': '进取型'
  } as const;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetchApi(`${config.apiEndpoints.user.profile}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response?.success) {
          console.error('用户信息获取失败:', response);
          return;
        }

        const data = response.data;
        
        // 处理并转换用户信息
        setUserInfo({
          age_group: data.age_group,
          monthlyIncome: data.disposable_income?.amount || 0,
          occupation: data.employment_status || '未知',
          familyStatus: LIFE_STAGE_MAP[data.life_stage as keyof typeof LIFE_STAGE_MAP] || '未知',
          financialGoals: [data.short_term_goal, data.mid_term_goal, data.long_term_goal]
            .filter(Boolean)
            .join('、') || '未设置',
          riskTolerance: RISK_TOLERANCE_MAP[data.risk_tolerance as keyof typeof RISK_TOLERANCE_MAP] || '未知'
        });

        console.log('Processed user info:', data); // 添加日志
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    if (token) {
      fetchUserInfo();
    }
  }, [token]);

  // 修改 AI 评估请求
  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        console.log()
        setLoading(true);
        // 如果有历史记录ID，先尝试获取历史数据
        if (!searchParams.get('labelType')) {
          const historyResponse = await fetchApi(config.apiEndpoints.evaluations.getById(params.id), {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (historyResponse.success && historyResponse.data) {
            setEvaluation(historyResponse.data);
            setLoading(false);
            return;
          }
        }

        // 如果是新评估或获取历史失败，调用AI接口
        // 构建用户信息文本
        const userInfoText = `用户基本信息：
        - 年龄段：${userInfo?.age_group || '未知'}
        - 月收入：${userInfo?.monthlyIncome?.toLocaleString() || '未知'}元
        - 职业：${userInfo?.occupation || '未知'}
        - 家庭状况：${userInfo?.familyStatus || '未知'}
        - 理财目标：${userInfo?.financialGoals || '未知'}
        - 风险承受：${userInfo?.riskTolerance || '未知'}`;

        // 构建支付信息文本
        const paymentInfo = `支付计划：
        - 金额：${searchParams.get('amount')}元
        - 消费类型：${searchParams.get('labelType') || '未知'}
        - 具体用途：${searchParams.get('labelName') || '未知'}
        - 支付方式：${searchParams.get('paymentMethod') === 'installment' ? '分期付款' : '一次性支付'}
        ${searchParams.get('paymentMethod') === 'installment' ? `
        分期详情：
        - 期数：${searchParams.get('installmentValue')}${searchParams.get('installmentUnit') === 'year' ? '年' : '个月'}
        - 每期金额：${searchParams.get('monthlyPayment')}元` : ''}`;

        // 检查必要参数
        const rawAmount = searchParams.get('amount');
        if (!rawAmount || !token) {
          console.warn('Missing required parameters:', { amount: rawAmount, hasToken: !!token });
          return;
        }

        const response = await fetchApi(config.apiEndpoints.ai.chat, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: remindText
              },
              {
                role: 'user',
                content: userInfoText + '\n' + paymentInfo
              }
            ]
          })
        });

        // 检查响应格式并解析内容
        let aiContent: string;
        try {
          // 直接从 response 中获取内容
          aiContent = response.choices[0]?.message?.content;
          
          if (!aiContent) {
            throw new Error('Invalid AI response format');
          }

          // 解析评估结果
          const parsedEvaluation: AIEvaluation = {
            result: extractResult(aiContent),
            expenseType: searchParams.get('labelType') || '',
            expenseDescription: searchParams.get('labelName') || '',
            amount: searchParams.get('amount') || '',
            paymentMethod: searchParams.get('paymentMethod') === 'installment' ? '分期付款' : '一次性支付',
            boardDecisions: extractBoardDecisions(aiContent),
            finalSuggestion: aiContent.match(/说明：([^]*?)(?=\n\n|\n<|$)/i)?.[1]?.trim() || '',
            financialAssessment: extractFinancialAssessment(aiContent),
            valueComparisons: extractValueComparisons(aiContent)
          };

          // 保存评估结果到数据库
          try {
            const saveResponse = await fetchApi(config.apiEndpoints.evaluations.save, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                expenseType: searchParams.get('labelType') || '',
                amount: parseFloat(searchParams.get('amount') || '0'),
                result: parsedEvaluation.result,
                description: searchParams.get('labelName') || '',
                paymentMethod: searchParams.get('paymentMethod') === 'installment' ? 'installment' : 'one-time',
                installmentInfo: searchParams.get('paymentMethod') === 'installment' ? {
                  value: parseInt(searchParams.get('installmentValue') || '0'),
                  unit: searchParams.get('installmentUnit') || 'month',
                  monthlyPayment: parseFloat(searchParams.get('monthlyPayment') || '0')
                } : undefined
              })
            });

            if (!saveResponse.success) {
              throw new Error(saveResponse.error || '保存失败');
            }
          } catch (error) {
            console.error('Failed to save evaluation:', error);
            toast({
              variant: "destructive",
              title: "保存失败",
              description: "评估结果保存失败，但不影响当前显示"
            });
          }

          setEvaluation(parsedEvaluation);
        } catch (error) {
          console.error('AI response parsing failed:', error, response);
          toast({
            variant: "destructive",
            title: "解析失败",
            description: "AI响应格式异常，请稍后重试"
          });
        }
      } catch (error) {
        console.error('AI evaluation failed:', error);
        // 使用 toast 替代 message
        toast({
          variant: "destructive",
          title: "评估失败",
          description: "获取AI评估失败，请稍后重试"
        });
      } finally {
        setLoading(false);
      }
    };

    // 修改调用条件，添加防抖
    const timer = setTimeout(() => {
      if (userInfo && token && !evaluation) {
        fetchEvaluation();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchParams, token, userInfo, evaluation]);

  // 保持原有的辅助函数
  function extractResult(content: string): string {
    const match = content.match(/result[\"'\s]*[:：]\s*([^\n]+)/i)
    return match?.[1]?.trim() || '未知'
  }

  function extractValue(content: string, key: string): string {
    const regex = new RegExp(`${key}[\"'\s]*[:：]\s*([^\n]+)`, 'i')
    const match = content.match(regex)
    return match?.[1] || ''
  }

  function extractScore(content: string, model: string): number {
    const regex = new RegExp(`${model}[^]*?score[\"'\s]*[:：]\s*(\d+)`, 'i')
    const match = content.match(regex)
    return parseInt(match?.[1] || '0', 10)
  }

  function extractComment(content: string, model: string): string {
    const regex = new RegExp(`${model}[^]*?comment[\"'\s]*[:：]\s*([^\n]+)`, 'i')
    const match = content.match(regex)
    return match?.[1] || ''
  }

  function extractEmoji(content: string, model: string): string {
    const regex = new RegExp(`${model}[^]*?[谨慎|通过|不通过][\"'\s]*[:：]\s*([^\n]+)`, 'i')
    const match = content.match(regex)
    return match?.[1] || '❓'
  }

  function extractNumber(content: string, key: string): number {
    const regex = new RegExp(`${key}[\"'\s]*[:：]\s*(\d+)`, 'i')
    const match = content.match(regex)
    return parseInt(match?.[1] || '0', 10)
  }

  function extractBoardDecisions(content: string) {
    const decisions: AIEvaluation['boardDecisions'] = {};
    const models = ['吴军', '刘擎', '冯唐'];
    
    models.forEach(model => {
      const scoreMatch = content.match(new RegExp(`${model}[^]*?score[\"'\s]*[:：]\\s*(\\d+)`, 'i'));
      const commentMatch = content.match(new RegExp(`${model}[^]*?comment[\"'\s]*[:：]\\s*([^\n]+)`, 'i'));
      const emojiMatch = content.match(new RegExp(`${model}[^]*?emoji[\"'\s]*[:：]\\s*([^\n]+)`, 'i'));
      
      if (scoreMatch || commentMatch || emojiMatch) {
        decisions[model] = {
          score: parseInt(scoreMatch?.[1] || '0', 10),
          comment: commentMatch?.[1]?.trim() || '',
          emoji: emojiMatch?.[1]?.trim() || '❓'
        };
      }
    });
    
    return decisions;
  }

  function extractFinancialAssessment(content: string) {
    return {
      necessity: parseInt(content.match(/必要性评分[\"'\s]*[:：]\s*(\d+)/i)?.[1] || '0', 10),
      urgency: parseInt(content.match(/紧急性评分[\"'\s]*[:：]\s*(\d+)/i)?.[1] || '0', 10),
      shortTermImpact: content.match(/短期影响[\"'\s]*[:：]\s*([^\n]+)/i)?.[1]?.trim() || '',
      longTermImpact: content.match(/长期影响[\"'\s]*[:：]\s*([^\n]+)/i)?.[1]?.trim() || '',
      riskLevel: content.match(/风险等级[\"'\s]*[:：]\s*([高中低])/i)?.[1]?.trim() || ''
    };
  }

  // 修改价值对比解析函数
  function extractValueComparisons(content: string): ValueComparison[] {
    try {
      // 找到表格部分
      const tableMatch = content.match(/价值对比图表：([\s\S]*?)(?=\n\n|\n<|$)/i);
      if (!tableMatch) return [];

      // 提取所有表格行，跳过表头和分隔行
      const rows = tableMatch[1]
        .split('\n')
        .filter(line => 
          line.includes('|') && 
          !line.includes('类别') && 
          !line.includes('数量') && 
          !line.includes('----')
        );

      // 保留完整的表格内容
      return rows.map(row => {
        const [category, quantity, price] = row.split('|').filter(Boolean);
        return {
          category: category?.trim().replace(/（.*?）/g, ''),
          quantity: quantity?.trim(),
          price: price?.trim()?.replace(/（.*?）/g, '')
        };
      });

    } catch (error) {
      console.error('价值对比解析失败:', error);
      return [];
    }
  }

  // 添加风险等级提取函数
  function extractRiskLevel(content: string): string {
    const match = content.match(/风险等级[\"'\s]*[:：]\s*([高中低])/i);
    return match?.[1] || '未知';
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  // 保持原有的 UI 结构
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">AI评估详情</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6 pb-16">
        {/* 基本信息 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-4">
              <StatusBadge status={evaluation?.result || 'pending'} className="text-2xl px-6 py-2 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">{evaluation?.expenseDescription}</h2>
              <p className="text-3xl font-bold text-blue-600">¥{evaluation?.amount}</p>
            </div>
          </CardContent>
        </Card>

        {/* 费用可视化 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">费用可视化</h3>
            <div className="grid grid-cols-2 gap-3">
              {evaluation?.valueComparisons?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <span className="text-gray-900">{item.category}</span>
                    <span className="text-blue-600 font-medium ml-2">{item.quantity}</span>
                  </div>
                  {item.price && (
                    <span className="text-sm text-gray-500 ml-2">{item.price}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 私董会决议 */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">私董会决议情况</h3>
            <p className="text-sm text-gray-700 mb-4">{evaluation?.finalSuggestion}</p>
            <h4 className="text-md font-semibold text-gray-800 mt-6 mb-4">专家模型策略评估</h4>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(evaluation?.boardDecisions || {}).map(([name, decision]) => (
                <div key={name} className="text-center p-4 border rounded-lg">
                  <div className="text-3xl mb-2">{decision.emoji}</div>
                  <div className="font-medium">{name}</div>
                  <div className="text-2xl font-bold my-2">{decision.score}/10</div>
                  <div className="text-sm text-gray-600">{decision.comment}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 评估内容 */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">评估内容</h3>
            <ul className="space-y-4">
              <li className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-800 mb-2">必要性评分</h4>
                <p className="text-sm text-gray-600">{evaluation?.financialAssessment.necessity}/10</p>
              </li>
              <li className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-800 mb-2">紧急性评分</h4>
                <p className="text-sm text-gray-600">{evaluation?.financialAssessment.urgency}/10</p>
                </li>
            </ul>
          </CardContent>
        </Card>

        {/* 长期影响 */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">长期影响</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">短期影响</h4>
                <p className="text-sm text-gray-700">{evaluation?.financialAssessment.shortTermImpact}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">长期影响</h4>
                <p className="text-sm text-gray-700">{evaluation?.financialAssessment.longTermImpact}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">风险等级</h4>
                <p className="text-sm text-gray-700">{evaluation?.financialAssessment.riskLevel}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card className="p-6">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-6 w-full" />
      </Card>
    </div>
  )
}

