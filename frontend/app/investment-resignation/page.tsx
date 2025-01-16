"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Send, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {config} from "@/config"
import { fetchApi } from '@/lib/api'
import { toast } from 'sonner'
import { useAuthContext } from '@/providers/auth-provider'
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
import { CollapsibleSection } from "@/components/collapsible-section"
import { FormattedMessage } from '@/components/formatted-message'
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
const decisionTypes = [
  { title: "投资", value: "investment" },
  { title: "辞职", value: "resignation" },
]

const investmentTypes = [
  { title: "股票", value: "stocks" },
  { title: "基金", value: "funds" },
  { title: "房地产", value: "real_estate" },
  { title: "加密货币", value: "cryptocurrency" },
  { title: "创业", value: "startup" },
]

const resignationReasons = [
  { title: "职业发展", value: "career_growth" },
  { title: "工作压力", value: "work_stress" },
  { title: "薪资待遇", value: "compensation" },
  { title: "公司文化", value: "company_culture" },
  { title: "个人原因", value: "personal_reasons" },
]

export default function InvestmentResignationPage() {
  const router = useRouter()
  const { token } = useAuthContext()
  const [message, setMessage] = useState('')
  const [decisionType, setDecisionType] = useState('')
  const [investmentType, setInvestmentType] = useState('')
  const [resignationReason, setResignationReason] = useState('')
  const [amount, setAmount] = useState('')
  const [timeframe, setTimeframe] = useState('')
  const [currentSavings, setCurrentSavings] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      content: "你好！我是投资/辞职决策助手。请告诉我你的具体情况，我会帮你分析并提供建议。",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormExpanded, setIsFormExpanded] = useState(true)

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: content,
      isUser: true,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsSubmitting(true)

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        content: "根据您提供的信息，我建议您考虑以下几点：1. 评估您的财务状况和风险承受能力。2. 研究市场趋势和潜在机会。3. 制定详细的行动计划和退出策略。4. 考虑寻求专业建议。您对这个建议有什么看法？",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsSubmitting(false)
    }, 1000)
  }

  const handleSubmitInfo = async () => {
    if (!decisionType || !amount || !timeframe || !currentSavings) {
      toast.error('请填写完整信息');
      return;
    }

    setIsFormExpanded(false);
    setIsSubmitting(true);

    try {
      // 根据决策类型构建用户消息内容
      const userContent = decisionType === "投资" 
        ? `我计划${investmentType}投资${amount}元，期限为${timeframe}，当前储蓄${currentSavings}元。请为我分析可行性并提供建议。`
        : `我计划因${resignationReason}辞职，预计需要${amount}元维持${timeframe}的生活，当前储蓄${currentSavings}元。请为我分析可行性并提供建议。`;

      // 构建请求消息
      const messages = [
        {
          role: 'system',
          content: remindText
        },
        {
          role: 'user',
          content: userContent
        }
      ];

      const response = await fetchApi(config.apiEndpoints.ai.chat, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages,
        })
      });

      const content = response.choices[0]?.message?.content || '';
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        content: formatContent(content),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('分析失败:', error);
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: "抱歉，分析过程中出现了错误，请稍后重试。",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAIResponse = (result: any) => {
    const { analysis_result, risk_assessment, recommendations } = result;
    
    return `
分析结果：
可行性评分：${analysis_result.feasibility_score}/100

主要发现：
${analysis_result.key_findings.map((finding: string) => `• ${finding}`).join('\n')}

风险评估：
风险等级：${risk_assessment.level}
${risk_assessment.factors.map((factor: string) => `• ${factor}`).join('\n')}

建议：
${recommendations.map((rec: string) => `• ${rec}`).join('\n')}

您对这个分析结果有什么想法或疑问吗？
  `.trim();
  };

  const formatContent = (content: string): string => {
    // 移除 <answer> 标签
    let formatted = content.replace(/<\/?answer>/g, '').trim();
    
    // 处理表格
    formatted = formatted.replace(
      /\| ---- \| ---- \|/g, 
      '|------|------|'
    );
    
    // 处理标题和分段
    formatted = formatted
      .replace(/📊 基本情况分析/g, '\n## 📊 基本情况分析\n')
      .replace(/⚖️ 可行性评估/g, '\n## ⚖️ 可行性评估\n')
      .replace(/⚠️ 风险等级/g, '\n## ⚠️ 风险等级')
      .replace(/💡 建议方案/g, '\n## 💡 建议方案\n')
      .replace(/📝 行动计划/g, '\n## 📝 行动计划\n')
      .replace(/❗注意事项/g, '\n## ❗注意事项\n');

    // 处理列表项缩进
    formatted = formatted.replace(/\n\s{4}-/g, '\n  -');

    // 确保段落之间有适当的空行
    formatted = formatted.replace(/\n{3,}/g, '\n\n');

    return formatted;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex flex-col relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 shadow-lg flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600">分析中...</span>
          </div>
        </div>
      )}
      <div className="flex flex-col h-screen">
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
            <h1 className="text-base font-medium">投资/辞职决策助手</h1>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto pb-16">
          <div className="max-w-md mx-auto px-4 pt-16">
            {/* Assistant Introduction */}
            <div className="mt-6 mb-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                <Image
                  src="/images/placeholder.svg"
                  alt="Assistant"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              </div>
              <div className="bg-white rounded-2xl p-4 mx-auto max-w-[280px] shadow-sm">
                <h2 className="font-medium mb-1 text-sm">我是投资/辞职决策智能助手</h2>
                <p className="text-xs text-gray-600">
                  我会帮您分析投资机会或辞职决定的可行性，提供专业建议，助您做出明智决策~
                </p>
              </div>
            </div>

            {/* Input Form */}
            <CollapsibleSection
              isExpanded={isFormExpanded}
              onToggle={() => setIsFormExpanded(!isFormExpanded)}
              previewContent={
                <div className="space-y-4">
                  <h3 className="text-base font-medium">决策信息</h3>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">决策类型</label>
                    <Select onValueChange={setDecisionType}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="选择决策类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {decisionTypes.map(type => (
                          <SelectItem key={type.value} value={type.title}>
                            {type.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              }
            >
              <div className="space-y-4">
                {decisionType === "投资" && (
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
                )}

                {decisionType === "辞职" && (
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">辞职原因</label>
                    <Select onValueChange={setResignationReason}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="选择辞职原因" />
                      </SelectTrigger>
                      <SelectContent>
                        {resignationReasons.map(reason => (
                          <SelectItem key={reason.value} value={reason.title}>
                            {reason.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">
                    {decisionType === "投资" ? "投资金额" : "预计所需金额"}
                  </label>
                  <Input
                    placeholder="输入金额..."
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">
                    {decisionType === "投资" ? "投资期限" : "预计维持时间"}
                  </label>
                  <Input
                    placeholder="输入时间..."
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">当前储蓄</label>
                  <Input
                    placeholder="输入当前储蓄..."
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(e.target.value)}
                    className="h-10"
                  />
                </div>

                <Button
                  className="w-full mt-6 bg-gradient-to-r from-purple-400 to-indigo-400 text-white h-10"
                  onClick={handleSubmitInfo}
                >
                  开始分析
                </Button>
              </div>
            </CollapsibleSection>

            {/* Chat Messages */}
            <div className="space-y-4 mt-6">
              {messages.map((msg) => (
                <FormattedMessage
                  key={msg.id}
                  message={msg}
                  assistantImage="/images/placeholder.svg?height=32&width=32"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="bg-white border-t border-gray-100 fixed bottom-0 left-0 right-0">
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
              className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white h-10 w-10 shrink-0"
              onClick={() => handleSendMessage(message)}
              disabled={isSubmitting || !message.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

