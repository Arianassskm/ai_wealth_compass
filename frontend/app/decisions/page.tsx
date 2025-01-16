"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CreditCard, Calendar, ChevronDown, Brain, CheckCircle, AlertTriangle, XCircle, Gift, TrendingUp, PiggyBank, GraduationCap, PlusCircle } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NumberPad } from "@/components/number-pad"
import { LabelSheet } from "@/components/label-sheet"
import { LoadingAnimation } from "@/components/loading-animation"
import { InstallmentDropdown } from "@/components/installment-dropdown"
import { CategoryCard } from "@/components/category-card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { EnhancedBackground } from '@/components/enhanced-background'
import { BottomNav } from "@/components/bottom-nav"
import { FloatingAssistant } from '@/components/floating-assistant'
import { useAuthContext } from '@/providers/auth-provider'
import { fetchApi } from '@/lib/api'
import { config } from '@/config'
import OpenAI from 'openai';
import { ProgressCircle } from '@/components/progress-circle';

type PaymentMethod = 'one-time' | 'installment' | null
type DecisionType = 'approved' | 'caution' | 'warning' | 'pending' | string;

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_ARK_API_KEY || 'default_key',
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
  dangerouslyAllowBrowser: true
});

// 添加分期信息类型
interface InstallmentInfo {
  value: number
  unit: 'month' | 'year'
  monthlyPayment?: number
}

// 添加标签类型接口
interface LabelInfo {
  label: string
  type: string
}

// 添加支出类型映射
const expenseTypeMap: Record<string, string> = {
  daily: '日常消费',
  education: '教育投资',
  health: '医疗健康',
  entertainment: '娱乐休闲',
  investment: '投资理财',
  other: '其他支出'
}

// 添加评估历史类型定义
interface EvaluationHistory {
  id: string
  expenseType: string
  amount: number
  result: string
  description: string
  createdAt: string
}

interface PaginatedResponse {
  total: number
  list: EvaluationHistory[]
  page: number
  pageSize: number
}

// 添加格式化函数
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

function AIEvaluationHistoryItem({ id, label, time, amount, decision }: { 
  id: string
  label: string
  time: string
  amount: string
  decision: DecisionType
}) {
  const router = useRouter()

  const getDecisionIcon = () => {
    switch (decision) {
      case '通过':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case '谨慎':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case '警告':
        return <XCircle className="w-5 h-5 text-red-600" />
      case '等待中':
        return <Clock className="w-5 h-5 text-gray-600" />
      case '不通过':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getDecisionText = () => {
    switch (decision) {
      case '通过':
        return '通过'
      case '谨慎':
        return '谨慎'
      case '警告':
        return '警告'
      case '不通过':
        return '不通过'
      case '等待中':
        return '等待中'
      default:
        return decision
    }
  }

  return (
    <div 
      className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => 
        router.push(`/ai-evaluation/${id}`)
      }
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
          {getDecisionIcon()}
        </div>
        <div>
          <div className="font-medium text-gray-900">{label}</div>
          <div className="text-sm text-gray-500">{time}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium text-gray-900">¥{amount}</div>
        <div className="text-sm text-gray-500">{decision}</div>
      </div>
    </div>
  )
}

export default function DecisionsPage() {
  const { token } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [evaluationHistory, setEvaluationHistory] = useState<EvaluationHistory[]>([])

  // 添加获取评估历史的逻辑
  useEffect(() => {
    const fetchEvaluationHistory = async () => {
      try {
        const response = await fetchApi(config.apiEndpoints.evaluations.history, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.success) {
          throw new Error(response.error || '获取历史记录失败')
        }

        const data = response.data as PaginatedResponse
        setEvaluationHistory(data.list)
      } catch (error) {
        console.error('Failed to fetch evaluations:', error)
        toast({
          variant: "destructive",
          title: "加载失败",
          description: "获取评估历史失败，请稍后重试"
        })
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchEvaluationHistory()
    }
  }, [token])

  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [isNumberPadOpen, setIsNumberPadOpen] = useState(false)
  const [isLabelSheetOpen, setIsLabelSheetOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInstallmentOpen, setIsInstallmentOpen] = useState(false)
  const [selectedInstallment, setSelectedInstallment] = useState<InstallmentInfo | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(null)
  const [showPaymentMethodReminder, setShowPaymentMethodReminder] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState<LabelInfo | null>(null)

  const handleAmountChange = (value: string) => {
    if (value === '') {
      setAmount('')
      return
    }
    const cleanValue = value.replace(/[^0-9.]/g, '')
    const parts = cleanValue.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    const formattedValue = parts.join('.')
    setAmount(formattedValue)
  }

  const handleNumberPadInput = (value: string) => {
    const newAmount = amount + value
    handleAmountChange(newAmount)
  }

  const handleNumberPadDelete = () => {
    const newAmount = amount.slice(0, -1)
    handleAmountChange(newAmount)
  }

  const handleConfirm = () => {
    setIsNumberPadOpen(false)
    setIsLabelSheetOpen(true)
  }

  const handleOneTimePayment = () => {
    setSelectedPaymentMethod('one-time')
    console.log("一次性支付 selected for amount:", amount)
  }

  const handleInstallmentSelect = (value: number, unit: 'month' | 'year') => {
    const totalAmount = parseFloat(amount.replace(/,/g, ''))
    const monthlyPayment = calculateMonthlyPayment(totalAmount, value, unit)
    const installmentInfo = { 
      value, 
      unit,
      monthlyPayment,
      totalAmount,
      totalInstallments: unit === 'year' ? value * 12 : value,
      installmentType: unit === 'year' ? '年付' : '月付'
    }
    
    setSelectedInstallment(installmentInfo)
    setSelectedPaymentMethod('installment')
    setIsInstallmentOpen(false)
  }

  const calculateMonthlyPayment = (total: number, value: number, unit: 'month' | 'year'): number => {
    const months = unit === 'year' ? value * 12 : value
    // 简单除法计算，实际可能需要考虑利率
    return Math.round((total / months) * 100) / 100
  }

  const handleAIEvaluation = async () => {
    if (!amount || !selectedPaymentMethod) {
      toast({
        title: "请输入必要信息",
        description: "请确保已输入金额并选择支付方式",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // 生成评估 ID
      const evaluationId = Date.now().toString();
      
      // 构建查询参数
      const queryParams = new URLSearchParams({
        amount: amount,
        paymentMethod: selectedPaymentMethod,
        ...(selectedLabel && {
          labelType: selectedLabel.type,
          labelName: selectedLabel.label
        }),
        ...(selectedInstallment && {
          installmentValue: selectedInstallment.value.toString(),
          installmentUnit: selectedInstallment.unit,
          monthlyPayment: selectedInstallment.monthlyPayment?.toString() || '',
          totalInstallments: selectedInstallment.totalInstallments?.toString() || '',
          installmentType: selectedInstallment.installmentType
        })
      });

      router.push(`/ai-evaluation/${evaluationId}?${queryParams.toString()}`);
    } catch (error) {
      console.error('AI 评估错误:', error);
      toast({
        title: "评估失败",
        description: "无法完成 AI 评估，请稍后重试",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setAmount('')
  }

  const handleLabelComplete = (label: string, type: string) => {
    setSelectedLabel({ label, type })
    setIsLabelSheetOpen(false)
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <EnhancedBackground />
      
      <div className="max-w-xl mx-auto px-4 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
          财富困惑，智能道破
        </h1>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
        {/* Amount Input */}
        <div className="my-8 relative z-50">
          <motion.div 
            className="relative backdrop-blur-xl bg-white/80 rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-4xl font-bold text-gray-900">¥</span>
            <Input
              type="text"
              value={amount}
              readOnly
              onClick={() => setIsNumberPadOpen(true)}
              placeholder="请输入金额"
              className={`text-4xl font-bold pl-10 pr-2 py-2 bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-400 text-gray-900 ${isNumberPadOpen ? 'bg-gray-50' : ''}`}
              style={{ fontSize: '2.25rem', lineHeight: '2.5rem' }}
            />
          </motion.div>
        </div>

        {/* Payment Methods */}
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-2 gap-4 mb-8"
            animate={showPaymentMethodReminder ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3, repeat: 3 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`h-12 flex items-center justify-center space-x-2 rounded-lg border ${
                selectedPaymentMethod === 'one-time' 
                  ? 'bg-blue-50 border-blue-200 text-blue-600' 
                  : showPaymentMethodReminder
                  ? 'bg-red-100 border-red-200 text-red-600'
                  : 'bg-white/80 border-gray-200 text-gray-600'
              } backdrop-blur-xl transition-colors duration-300`}
              onClick={handleOneTimePayment}
            >
              <CreditCard className="w-5 h-5" />
              <span>一次性支付</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`h-12 flex items-center justify-center space-x-2 rounded-lg border ${
                selectedPaymentMethod === 'installment' 
                  ? 'bg-blue-50 border-blue-200 text-blue-600' 
                  : showPaymentMethodReminder
                  ? 'bg-red-100 border-red-200 text-red-600'
                  : 'bg-white/80 border-gray-200 text-gray-600'
              } backdrop-blur-xl transition-colors duration-300`}
              onClick={() => setIsInstallmentOpen(true)}
            >
              <Calendar className="w-5 h-5" />
              <span>
                {selectedInstallment 
                  ? `${selectedInstallment.value}${selectedInstallment.unit === 'month' ? '期' : '年'}`
                  : '分期支付'}
              </span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </motion.button>
          </motion.div>
        </AnimatePresence>

        {/* AI Evaluation Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="mb-8"
        >
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-8 rounded-xl shadow-lg flex items-center justify-center space-x-2"
            onClick={handleAIEvaluation}
          >
            <Brain className="w-6 h-6" />
            <span className="text-lg">AI 评估开始</span>
          </Button>
        </motion.div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">智能决策助手</h2>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-4">
              <CategoryCard 
                icon={Gift} 
                title="人情往来" 
                color="text-pink-600" 
                onClick={() => router.push('/social-reciprocity')}
              />
              <CategoryCard 
                icon={TrendingUp} 
                title="投资/辞职" 
                color="text-purple-600" 
                onClick={() => router.push('/investment-resignation')}
              />
              <CategoryCard 
                icon={PiggyBank} 
                title="提前消费" 
                color="text-blue-600" 
                onClick={() => router.push('/advance-consumption')}
              />
              <CategoryCard 
                icon={GraduationCap} 
                title="财富开发" 
                color="text-green-600" 
                onClick={() => router.push('/wealth-development')}
              />
              <CategoryCard 
                icon={PlusCircle} 
                title="新建助手" 
                color="text-gray-400" 
                onClick={() => console.log('新建助手')}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* AI Evaluation History */}
        <Card className="backdrop-blur-xl bg-white/80 rounded-xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">AI评估历史</h2>
          <ScrollArea className="h-64 w-full pr-4">
            <div className="space-y-4">
              {evaluationHistory.map((evaluation) => (
                <AIEvaluationHistoryItem 
                  key={evaluation.id}
                  id={evaluation.id}
                  label={evaluation.description || '未知消费'}
                  time={formatDate(evaluation.createdAt)}
                  amount={formatAmount(evaluation.amount)}
                  decision={evaluation.result as DecisionType}
                />
              ))}
              {evaluationHistory.length === 0 && !loading && (
                <div className="text-center text-gray-500 py-4">
                  暂无评估记录
                </div>
              )}
            </div>
            <ScrollBar />
          </ScrollArea>
        </Card>
      </div>

      <NumberPad
        isOpen={isNumberPadOpen}
        onClose={() => setIsNumberPadOpen(false)}
        onInput={handleNumberPadInput}
        onDelete={handleNumberPadDelete}
        onConfirm={handleConfirm}
        onClear={handleClear}
      />

      <LabelSheet
        isOpen={isLabelSheetOpen}
        onClose={() => setIsLabelSheetOpen(false)}
        amount={amount}
        onComplete={handleLabelComplete}
      />

      {isLoading && <ProgressCircle fullScreen />}

      <InstallmentDropdown
        isOpen={isInstallmentOpen}
        onClose={() => setIsInstallmentOpen(false)}
        onSelect={handleInstallmentSelect}
      />

      <FloatingAssistant showOnDecisionsPageOnly={true} />
      <BottomNav activePage="decisions" />
    </main>
  )
}

