"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Send, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

  const handleSubmitInfo = () => {
    let summary = ""
    if (decisionType === "投资") {
      summary = `我计划进行${investmentType}投资，预计投资金额为${amount}元，投资期限为${timeframe}。我当前的储蓄是${currentSavings}元。请为我分析可行性并提供建议。`
    } else if (decisionType === "辞职") {
      summary = `我正在考虑辞职，主要原因是${resignationReason}。我当前的储蓄是${currentSavings}元，预计可以维持${timeframe}的生活。请为我分析可行性并提供建议。`
    }
    handleSendMessage(summary)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex flex-col">
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
                  src="/placeholder.svg"
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
                <Message
                  key={msg.id}
                  message={msg}
                  assistantImage="/placeholder.svg?height=32&width=32"
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

