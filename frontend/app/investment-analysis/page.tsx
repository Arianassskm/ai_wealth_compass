"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Send, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { config } from '@/config'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import { Message, type ChatMessage } from '@/components/chat/message'
import { v4 as uuidv4 } from 'uuid'
import { fetchApi } from '@/lib/api'
import { useAuthContext } from '@/providers/auth-provider'
import { toast } from 'sonner'

const remindText=`你是一个专业的决策分析助手，负责帮助用户分析投资或辞职决定的可行性。请根据用户提供的信息进行分析并给出建议。

输入信息如下：
<decision_type>{$DECISION_TYPE}</decision_type>
<required_amount>{$REQUIRED_AMOUNT}</required_amount>
<duration>{$DURATION}</duration>
<current_savings>{$CURRENT_SAVINGS}</current_savings>

分析步骤：
1. 首先在<思考>标签内进行初步计算：
- 计算储蓄缺口 = 所需金额 - 当前储蓄
- 计算每月所需金额 = 储蓄缺口/维持月数
- 评估风险等级（低/中/高）

2. 在<分析>标签内提供详细分析，包括：
- 财务可行性评估
- 风险分析
- 建议的准备工作
- 替代方案

3. 在<建议>标签内给出最终建议，包括：
- 明确的行动建议
- 时间规划
- 注意事项

输出格式要求：
1. 使用表格呈现关键数据
2. 用适当的emoji突出重点
3. 分点列出建议
4. 使用醒目的符号标示风险等级
5. 根据决策类型提供不同的专业建议

如果是投资决策，重点关注：
- 投资回报率分析
- 风险承受能力评估
- 投资组合建议
- 分散投资策略

如果是辞职决策，重点关注：
- 职业发展影响
- 生活成本评估
- 再就业计划
- 过渡期管理策略

最后，将完整回答放在<answer>标签内。确保建议具体、实用且易于理解。

示例输出格式：
📊 基本情况分析
[数据表格展示]

⚖️ 可行性评估
- 评估内容1
- 评估内容2

⚠️ 风险等级：[低/中/高]
- 风险点1
- 风险点2

💡 建议方案
1. 建议1
2. 建议2

📝 行动计划
[具体时间表]

❗注意事项
- 注意点1
- 注意点2

请确保分析过程细致，建议明确且有操作性，并适当使用emoji增强可读性。分析需要保持专业性和客观性，同时照顾到用户的具体情况。` 
const investmentTypes = [
  { title: "股票", value: "stocks" },
  { title: "基金", value: "funds" },
  { title: "债券", value: "bonds" },
  { title: "房地产", value: "real_estate" },
]

const riskLevels = [
  { title: "保守型", value: "conservative" },
  { title: "稳健型", value: "moderate" },
  { title: "积极型", value: "aggressive" },
  { title: "进取型", value: "very_aggressive" },
]

type PromptParams = {
  DECISION_TYPE: string;
  REQUIRED_AMOUNT: string;
  DURATION: string;
  CURRENT_SAVINGS: string;
};

export default function InvestmentAnalysisPage() {
  const router = useRouter()
  const { token } = useAuthContext()
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState('')
  const [duration, setDuration] = useState('')
  const [riskTolerance, setRiskTolerance] = useState('')
  const [investmentType, setInvestmentType] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSendMessage = async (messages: { role: string; content: string }[]) => {
    if (!messages?.length) return;
    console.log(messages)
    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: "开始分析...",
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsSubmitting(true);

    try {
      const response = await fetchApi(config.apiEndpoints.ai.chat, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          messages: messages
        })
      });

      const content = response.choices[0]?.message?.content || '';
      
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        content: content,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('分析失败:', error);
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: "抱歉，分析过程出现错误，请稍后重试。",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitInfo = async () => {
    const promptParams: PromptParams = {
      DECISION_TYPE: investmentType,
      REQUIRED_AMOUNT: amount,
      DURATION: duration,
      CURRENT_SAVINGS: '0' // 可以添加一个字段收集这个信息
    };

    if (!promptParams.DECISION_TYPE || !promptParams.REQUIRED_AMOUNT || 
        !promptParams.DURATION || !riskTolerance) {
      toast.error('请填写完整信息');
      return;
    }

    setIsSubmitting(true);

    try {
      const messages = [
        {
          role: 'system',
          content: remindText
        },
        {
          role: 'user',
          content: `我计划投资${amount}元，期限为${duration}，风险承受能力为${riskTolerance}，投资类型偏好${investmentType}。请为我提供投资建议。`
        }
      ];

      await handleSendMessage(messages);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-400 to-blue-400">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-3"
            onClick={() => router.push('/decisions')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-base font-medium">投资神话助手</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-16">
        {/* Assistant Introduction */}
        <div className="mt-6 mb-6 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
            <Image
              src="/placeholder.svg"
              alt="Assistant"
              width={60}
              height={60}
              className="rounded-full"
            />
          </div>
          <div className="bg-white rounded-2xl p-4 mx-auto max-w-[280px] shadow-sm">
            <h2 className="font-medium mb-1 text-sm">我是投资神话智能助手</h2>
            <p className="text-xs text-gray-600">
              告诉我你的投资需求，我将为你提供专业的投资建议~
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
          <h3 className="text-base mb-4">投资信息</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">投资金额</label>
              <Input
                placeholder="输入金额..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-10"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">投资期限</label>
              <Input
                placeholder="输入期限..."
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="h-10"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">风险承受能力</label>
              <Select onValueChange={setRiskTolerance}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="选择风险承受能力" />
                </SelectTrigger>
                <SelectContent>
                  {riskLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">投资类型</label>
              <Select onValueChange={setInvestmentType}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="选择投资类型" />
                </SelectTrigger>
                <SelectContent>
                  {investmentTypes.map(type => (
                    <SelectItem key={type.value} value={type.title}>
                      {type.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="w-full mt-6 bg-gradient-to-r from-green-400 to-blue-400 text-white h-10"
            onClick={handleSubmitInfo}
          >
            开始分析
          </Button>
        </div>

        {/* Chat Messages */}
        <div className="space-y-4 mb-20">
          {messages.map((msg) => (
            <Message 
              key={msg.id} 
              message={msg}
              assistantImage="/placeholder.svg?height=32&width=32"
            />
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center space-x-2">
          <Input
            type="text"
            placeholder="输入你的问题..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(message)
              }
            }}
            className="flex-grow h-10"
          />
          <Button
            size="icon"
            className="bg-gradient-to-r from-green-400 to-blue-400 text-white h-10 w-10 shrink-0"
            onClick={() => handleSendMessage(message)}
            disabled={isSubmitting || !message.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </main>
  )
}

