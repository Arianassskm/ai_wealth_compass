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

const consumptionTypes = [
  { title: "结婚", value: "wedding" },
  { title: "子女教育", value: "education" },
  { title: "购房", value: "house" },
  { title: "购车", value: "car" },
  { title: "旅游", value: "travel" },
  { title: "其他大额消费", value: "other" },
]

const financingMethods = [
  { title: "储蓄", value: "savings" },
  { title: "贷款", value: "loan" },
  { title: "分期付款", value: "installment" },
  { title: "投资收益", value: "investment" },
]

export default function AdvanceConsumptionPage() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [consumptionType, setConsumptionType] = useState('')
  const [amount, setAmount] = useState('')
  const [timeframe, setTimeframe] = useState('')
  const [income, setIncome] = useState('')
  const [financingMethod, setFinancingMethod] = useState('')
  const [currentSavings, setCurrentSavings] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      content: "你好！我是消费规划助手。请告诉我你的具体情况，我会帮你分析消费计划。",
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
        content: "根据您提供的信息，我建议您考虑以下方案：1. 制定详细的储蓄计划，每月固定存储一定比例的收入。2. 评估是否有可能增加收入来源。3. 考虑是否可以延长实现目标的时间，以减轻财务压力。4. 如果选择贷款，请确保月供不超过收入的30%。您对这个建议有什么看法？",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsSubmitting(false)
    }, 1000)
  }

  const handleSubmitInfo = () => {
    const summary = `我计划${consumptionType}，预计需要${amount}元，希望在${timeframe}内实现。我的月收入是${income}元，当前储蓄${currentSavings}元，计划通过${financingMethod}方式筹集资金。请为我分析可行性并提供建议。`
    handleSendMessage(summary)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-200 flex flex-col">
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
            <h1 className="text-base font-medium">提前消费助手</h1>
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
                <h2 className="font-medium mb-1 text-sm">我是提前消费智能助手</h2>
                <p className="text-xs text-gray-600">
                  我会帮您合理安排提前消费，平衡当前享受和未来财务，确保您在提升生活品质的同时保持财务健康~
                </p>
              </div>
            </div>

            {/* Input Form */}
            <CollapsibleSection
              previewContent={
                <div className="space-y-4">
                  <h3 className="text-base font-medium">消费信息</h3>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">消费类型</label>
                    <Select onValueChange={setConsumptionType}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="选择消费类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {consumptionTypes.map(type => (
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
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">预计金额</label>
                  <Input
                    placeholder="输入金额..."
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">计划时间</label>
                  <Input
                    placeholder="输入计划时间..."
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">月收入</label>
                  <Input
                    placeholder="输入月收入..."
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
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

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">筹资方式</label>
                  <Select onValueChange={setFinancingMethod}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="选择筹资方式" />
                    </SelectTrigger>
                    <SelectContent>
                      {financingMethods.map(method => (
                        <SelectItem key={method.value} value={method.title}>
                          {method.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full mt-6 bg-gradient-to-r from-amber-400 to-orange-400 text-white h-10"
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
              className="bg-gradient-to-r from-amber-400 to-orange-400 text-white h-10 w-10 shrink-0"
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

