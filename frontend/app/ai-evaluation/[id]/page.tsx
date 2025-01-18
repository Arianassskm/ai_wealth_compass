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
import { Smartphone, Map, Utensils, Shield, CheckCircle2, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { ProgressCircle } from '@/components/progress-circle'
import { v4 as uuidv4 } from 'uuid'
import Image from 'next/image';
import { LoadingOverlay } from "@/components/loading-overlay"
import { BoardCarousel } from "@/components/board-carousel"
import { ShoppingComparison } from "@/components/shopping-comparison"
import {mockItems} from '@/components/mock-data'

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

张文模型：
- score：1-10分
- comment：简短评价
- emoji：👍/👎/🤔
- 决策结果：
  * 最终建议：
    * 批准/拒绝/谨慎/警告

潘乱模型：
- score：1-10分
- comment：简短评价
- emoji：🙌/✖️/🚧
- 决策结果：
  * 最终建议：
    * 批准/拒绝/谨慎/警告

黄志敏模型：
- score：1-10分
- comment：简短评价
- emoji：🤝/🛑/⚠️
- 决策结果：
  * 最终建议：
    * 批准/拒绝/谨慎/警告

徐玥晨模型：
- score：1-10分
- comment：简短评价
- emoji：🤝/🛑/⚠️
- 决策结果：
  * 最终建议：
    * 批准/拒绝/谨慎/警告

李炯明模型：
- score：1-10分
- comment：简短评价
- emoji：🙌/✖️/🚧
- 决策结果：
  * 最终建议：
    * 批准/拒绝/谨慎/警告

林惠文模型：
- score：1-10分
- comment：简短评价
- emoji：🙌/✖️/🚧
- 决策结果：
  * 最终建议：
    * 批准/拒绝/谨慎/警告

<第四板块: 财务评估>
- 必要性评分：1-10分
- 必要性评分说明：
- 紧急性评分：1-10分
- 紧急性评分说明：
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
    necessityDesc: string
    urgency: number
    urgencyDesc: string
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
  description: string
  result: string
  paymentMethod: '一次性支付' | '分期付款'
  installmentInfo?: {
    value: number
    unit: 'month' | 'year'
    monthlyPayment: number
    installmentType?: string
  }
  analysis: {
    necessity: number
    necessityDesc: string
    urgency: number
    urgencyDesc: string
    shortTermImpact: string
    longTermImpact: string
    riskLevel: string
    valueComparisons: ValueComparison[]
    boardDecisions: {
      [key: string]: {
        score: number
        comment: string
        emoji: string
      }
    }
    finalSuggestion: string
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

function LoadingSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card className="p-6">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-6 w-full" />
      </Card>
      <Card className="p-6">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4" />
      </Card>
    </div>
  )
}

export default function AIEvaluationPage({ params }: { params: { id: string } }) {
  const { token } = useAuthContext()
  const searchParams = useSearchParams()
  const [evaluation, setEvaluation] = useState<AIEvaluation | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  // 更新用户信息的类型
  const [userInfo, setUserInfo] = useState<{
    userId?: string
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
        const response = await fetchApi(config.apiEndpoints.user.profile, {
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
        
        // 检查用户 ID 是否存在
        if (!data.id) {
          console.error('用户信息中缺少 ID:', data);
          toast({
            variant: "destructive",
            title: "用户信息错误",
            description: "无法获取用户ID，请重新登录"
          });
          return;
        }

        // 处理并转换用户信息
        setUserInfo({
          userId: data.id,  // 确保 ID 存在
          age_group: data.age_group,
          monthlyIncome: data.disposable_income?.amount || 0,
          occupation: data.employment_status || '未知',
          familyStatus: LIFE_STAGE_MAP[data.life_stage as keyof typeof LIFE_STAGE_MAP] || '未知',
          financialGoals: [data.short_term_goal, data.mid_term_goal, data.long_term_goal]
            .filter(Boolean)
            .join('、') || '未设置',
          riskTolerance: RISK_TOLERANCE_MAP[data.risk_tolerance as keyof typeof RISK_TOLERANCE_MAP] || '未知'
        });

        console.log('处理用户数据中:', {
          userId: data.id,
          ...data
        });
      } catch (error) {
        console.error('获取用户信息失败:', error);
        toast({
          variant: "destructive",
          title: "获取用户信息失败",
          description: "请检查网络连接并重试"
        });
      }
    };

    // 只在有 token 且没有用户信息时获取
    if (token && !userInfo?.userId) {
      fetchUserInfo();
    }
  }, [token, userInfo?.userId]);

  // 修改 AI 评估请求
  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
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
        setLoading(true);
        // const mockResponse = {
        //   "choices": [
        //     {
        //       "finish_reason": "stop",
        //       "index": 0,
        //       "logprobs": null,
        //       "message": {
        //         "content": "<第一板块: 审核结果>\n- 评估标准：\n  * result：谨慎\n- 审核状态说明：由于用户的基本信息（如年龄段、月收入、职业、家庭状况、理财目标、风险承受能力等）均未知，仅知道此次是为购买iPhone 进行的冲动型消费且采用分期付款方式，无法全面准确评估该支出对用户财务状况的影响，所以给出谨慎的审核结果。\n\n<第二板块: 费用可视化>\n- 可视化 转换场景：\n  * 生成对应商品图片：[此处可插入一张iPhone官方宣传图片，因格式原因暂无法实际提供，你可自行通过苹果官网查找对应iPhone型号图片]\n  * 提供官 方购买链接：https://www.apple.com/cn/shop/buy-iphone （不同型号具体购买页面需进一步选择配置等，此为苹果中国官网购买iPhone的通用入口）\n  * 价值对比图表：\n|消费类型|数量对比（假设其他商品单价）|\n|----|----|\n|旅游（假设单价5000元）|约2.8次|\n|衣服（假设单价1000元）|13.999件|\n|餐饮（假设单价200元）| 约69.995次|\n\n<第三板块: 私董会决议>\n- 吴军模型：\n  - score：3分\n  - comment：信息不足，冲动消费存疑。\n  - emoji：🤔\n- 刘擎模型：\n  - score：2分\n  - comment：不明财务状况下的冲动消费欠妥。\n  - emoji：✖️\n- 冯唐模型：\n  - score：3分\n  - comment：缺乏财务背景支撑的购买行为。\n  - emmoji：⚠️\n\n<第四板块: 财务评估>\n- 必要性评分：3分\n- 必要性评分说明：购买iPhone属于消费电子产品，在不清楚用户具体需求及已有设备情况等前提下  ，仅从已知的冲动消费类型判断，其必要性相对不高。\n- 紧急性评分：2分\n- 紧急性评分说明：购买iPhone通常并非紧急到必须即刻完成的事项，尤其此次还是冲动消费，所以紧急性较低。\n- 财务影响评估：\n  * 短期影响：每月需承担2333.17元的分期还款，可能会对当月现金流造成一定压力，具体取决于用户原本的财务安排。\n  * 长期影响：若后续还有类似冲动消费或其他财务支出，可能影响整体财务规划及储蓄等，也可能因还款压力导致信用风险（如逾期等）。\n- 风险等级：中\n因为不清楚用 户的财务状况全貌，此次冲动消费且分期的支出存在一定不确定性，可能会给用户财务带来如现金流紧张、信用受损等风险，所以风险等级为中。",
        //         "role": "assistant"
        //       }
        //     }
        //   ],
        //   "created": 1737181965,
        //   "id": "021737181950356320f9aadc50dbf6687c3b1e9f9e54ac63edb51",
        //   "model": "doubao-pro-256k-241115",
        //   "object": "chat.completion",
        //   "usage": {
        //     "completion_tokens": 630,
        //     "prompt_tokens": 541,
        //     "total_tokens": 1171,
        //     "prompt_tokens_details": {
        //       "cached_tokens": 0
        //     }
        //   }
        // };
        
        // // 使用 mock 数据
        // const response = mockResponse;
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
            valueComparisons: extractValueComparisons(aiContent),
            installmentInfo: searchParams.get('paymentMethod') === 'installment' ? {
              value: parseInt(searchParams.get('installmentValue') || '0'),
              unit: searchParams.get('installmentUnit') as 'month' | 'year',
              monthlyPayment: parseFloat(searchParams.get('monthlyPayment') || '0'),
              installmentType: searchParams.get('installmentUnit') === 'year' ? '年付' : '月付'
            } : undefined
          };

          // 设置评估结果
          setEvaluation(parsedEvaluation);

          // 只有在 AI 响应成功时才保存评估历史
          try {
            // 检查必要字段
            if (!userInfo?.userId) {
              console.error('Missing userId:', userInfo);
              throw new Error('用户未登录或身份信息缺失，请重新登录');
            }

            const saveResponse = await fetchApi(config.apiEndpoints.evaluations.save, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                id: uuidv4(),
                type: 'expense_evaluation',
                userId: userInfo.userId,
                expenseType: parsedEvaluation.expenseType,
                amount: parseFloat(parsedEvaluation.amount.replace(/,/g, '')),
                result: parsedEvaluation.result,
                description: parsedEvaluation.expenseDescription,
                paymentMethod: parsedEvaluation.paymentMethod,
                installmentInfo: parsedEvaluation.installmentInfo,
                analysis: {
                  necessity: parsedEvaluation.financialAssessment.necessity,
                  necessityDesc: parsedEvaluation.financialAssessment.necessityDesc || '',
                  urgency: parsedEvaluation.financialAssessment.urgency,
                  urgencyDesc: parsedEvaluation.financialAssessment.urgencyDesc || '',
                  shortTermImpact: parsedEvaluation.financialAssessment.shortTermImpact || '',
                  longTermImpact: parsedEvaluation.financialAssessment.longTermImpact || '',
                  riskLevel: parsedEvaluation.financialAssessment.riskLevel || '未知',
                  valueComparisons: parsedEvaluation.valueComparisons || [],
                  boardDecisions: parsedEvaluation.boardDecisions || {},
                  finalSuggestion: parsedEvaluation.finalSuggestion || ''
                },
                createdAt: new Date().toISOString()
              })
            });

            // 添加请求和响应的详细日志
            console.log('Save evaluation request:', {
              userId: userInfo.userId,
              id: params.id,
              type: 'expense_evaluation',
              expenseType: parsedEvaluation.expenseType,
              amount: parseFloat(parsedEvaluation.amount.replace(/,/g, '')),
              result: parsedEvaluation.result,
              description: parsedEvaluation.expenseDescription,
              paymentMethod: parsedEvaluation.paymentMethod,
              installmentInfo: parsedEvaluation.installmentInfo,
              analysis: {
                necessity: parsedEvaluation.financialAssessment.necessity,
                necessityDesc: parsedEvaluation.financialAssessment.necessityDesc || '',
                urgency: parsedEvaluation.financialAssessment.urgency,
                urgencyDesc: parsedEvaluation.financialAssessment.urgencyDesc || '',
                shortTermImpact: parsedEvaluation.financialAssessment.shortTermImpact || '',
                longTermImpact: parsedEvaluation.financialAssessment.longTermImpact || '',
                riskLevel: parsedEvaluation.financialAssessment.riskLevel || '未知',
                valueComparisons: parsedEvaluation.valueComparisons || [],
                boardDecisions: parsedEvaluation.boardDecisions || {},
                finalSuggestion: parsedEvaluation.finalSuggestion || ''
              },
              createdAt: new Date().toISOString()
            });
            console.log('Save evaluation response:', saveResponse);

            if (!saveResponse.success) {
              console.error('Save response error:', saveResponse);
              throw new Error(saveResponse.error || '保存失败');
            }
          } catch (error) {
            console.error('Failed to save evaluation:', error);
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            toast({
              variant: "destructive",
              title: "保存失败",
              description: errorMessage
            });
          }

        } catch (error) {
          console.error('AI response parsing failed:', error, response);
          toast({
            variant: "destructive",
            title: "解析失败",
            description: "AI响应格式异常，请稍后重试"
          });
        } finally {
          setLoading(false);
        }
      } catch (error) {
        console.error('AI evaluation failed:', error);
        toast({
          variant: "destructive",
          title: "评估失败",
          description: "获取AI评估失败，请稍后重试"
        });
        setLoading(false);
      }
    };

    // 使用条件检查避免不必要的请求
    if (token && !evaluation) {
      fetchEvaluation();
    }

    return () => {
      // 清理函数
    };
  }, [token, params.id, searchParams, evaluation]);

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
    const models = ['张文', '潘乱', '黄志敏','徐玥晨','李炯明','林惠文'];
    
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
      necessityDesc: content.match(/必要性评分说明[\"'\s]*[:：]\s*([^\n]+)/i)?.[1]?.trim() || '',
      urgency: parseInt(content.match(/紧急性评分[\"'\s]*[:：]\s*(\d+)/i)?.[1] || '0', 10),
      urgencyDesc: content.match(/紧急性评分说明[\"'\s]*[:：]\s*([^\n]+)/i)?.[1]?.trim() || '',
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
    return <LoadingOverlay />
  }

  // Transform board decisions into carousel format
  const boardMembers = Object.entries(evaluation?.boardDecisions || {}).map(([name, decision]) => ({
    name,
    role: name === '张文' ? '稀土掘金主编' : 
          name === '潘乱' ? '乱翻书主理人' : 
          name === '黄志敏' ? '北京大学汇丰商学院创新创业中心副主任':
          name === '徐玥晨'? '明势资本投资副总裁':
          name === '李炯明' ? 'CSDN高级副总裁':
          name === '林惠文'? '真格基金VP': '',
    avatar: name === '张文'? '/images/zw.png' :
            name === '潘乱'? '/images/pl.png' :
            name === '黄志敏'? '/images/hzm.png' :
            name === '徐玥晨'? '/images/xyc.png' :
            name === '李炯明'? '/images/ljm.png' :
            name === '林惠文'? '/images/lhw.png' : '/images/placeholder.svg',
    score: decision.score,
    comment: decision.comment,
    emoji: decision.emoji
  }))

  // Transform value comparisons into shopping items
  const shoppingItems = evaluation?.valueComparisons?.map(item => ({
    category: item.category,
    quantity: item.quantity,
    price: item.price,
    tags: ['热门爆款', '限时特惠']
  })) || []

  return (
    <div className="relative">
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
            <div className="flex flex-col items-center">
              <StatusBadge status={evaluation?.result || 'pending'} className="text-2xl px-6 py-2 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">{evaluation?.expenseDescription}</h2>
              <p className="text-3xl font-bold text-blue-600">¥{evaluation?.amount}</p>
            </div>
          </CardContent>
        </Card>
        {/* AI评估策略来源 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Shield className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">AI评估策略来源</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-gray-600">来自</span>
                  <span className="text-blue-600 font-medium">人工输入官方</span>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* 私董会决议 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">私董会决议</h3>
              <Button variant="ghost" size="sm">
                管理私董会成员
              </Button>
            </div>
            <BoardCarousel members={boardMembers} />
          </CardContent>
        </Card>

      

        {/* 费用可视化 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">该金额可以买到什么</h3>
              </div>
            </div>
            <ShoppingComparison items={mockItems} />
          </CardContent>
        </Card>

        {/* 评估内容 */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">评估内容</h3>
            <ul className="space-y-4">
              <li className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-800 mb-2">必要性评分</h4>
                <p className="text-sm text-gray-600">{evaluation?.financialAssessment?.necessity}/10</p>
                {evaluation?.financialAssessment?.necessityDesc && (
                  <p className="text-sm text-gray-500 mt-2">{evaluation.financialAssessment.necessityDesc}</p>
                )}
              </li>
              <li className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-800 mb-2">紧急性评分</h4>
                <p className="text-sm text-gray-600">{evaluation?.financialAssessment?.urgency}/10</p>
                {evaluation?.financialAssessment?.urgencyDesc && (
                  <p className="text-sm text-gray-500 mt-2">{evaluation?.financialAssessment.urgencyDesc}</p>
                )}
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
                <p className="text-sm text-gray-700">
                  {evaluation?.financialAssessment?.shortTermImpact}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">长期影响</h4>
                <p className="text-sm text-gray-700">
                  {evaluation?.financialAssessment?.longTermImpact}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">风险等级</h4>
                <p className="text-sm text-gray-700">
                  {evaluation?.financialAssessment?.riskLevel}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

