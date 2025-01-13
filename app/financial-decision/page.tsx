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
import { CollapsibleSection } from "@/components/collapsible-section";

const decisionTypes = [
  { title: "裸辞", value: "quit_job" },
  { title: "创业", value: "start_business" },
  { title: "投资", value: "investment" },
  { title: "购买理财产品", value: "financial_product" },
  { title: "购买保险", value: "insurance" },
]

const riskLevels = [
  { title: "保守型", value: "conservative" },
  { title: "稳健型", value: "moderate" },
  { title: "积极型", value: "aggressive" },
  { title: "进取型", value: "very_aggressive" },
]

export default function FinancialDecisionPage() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [decisionType, setDecisionType] = useState('')
  const [amount, setAmount] = useState('')
  const [timeframe, setTimeframe] = useState('')
  const [riskTolerance, setRiskTolerance] = useState('')
  const [currentSituation, setCurrentSituation] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      content: "你好！我是理财决策助手。请告诉我你的具体情况，我会帮你分析投资理财方案。",
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
        content: "根据您提供的信息，我建议您在做出决定之前，仔细评估当前的财务状况和未来的风险。对于这种重大决策，建议您制定一个详细的计划，包括应急资金和退路方案。您可能需要更多时间来积累足够的资金储备。您对这个建议有什么看法？",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsSubmitting(false)
    }, 1000)
  }

  const handleSubmitInfo = () => {
    const summary = `我正在考虑${decisionType}，涉及金额约${amount}元，预计时间范围是${timeframe}。我的风险承受能力是${riskTolerance}，目前的情况是：${currentSituation}。请根据这些信息为我分析决策的可行性和潜在风险。`
    handleSendMessage(summary)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-400 flex flex-col">
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
            <h1 className="text-base font-medium">理财决策助手</h1>
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
                <h2 className="font-medium mb-1 text-sm">我是理财决策智能助手</h2>
                <p className="text-xs text-gray-600">
                  我会帮您理性分析重大财务决策，避免冲动行为导致的风险，如裸辞、盲目创业或投资。我的目标是确保您的财务安全，并为您提供专业的理财建议~
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
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">涉及金额</label>
                  <Input
                    placeholder="输入金额..."
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">预计时间范围</label>
                  <Input
                    placeholder="输入时间范围..."
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
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
                  <label className="text-xs text-gray-500 mb-1.5 block">当前情况</label>
                  <Input
                    placeholder="描述您的当前情况..."
                    value={currentSituation}
                    onChange={(e) => setCurrentSituation(e.target.value)}
                    className="h-10"
                  />
                </div>

                <Button
                  className="w-full mt-6 bg-gradient-to-r from-blue-400 to-purple-400 text-white h-10"
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
              className="bg-gradient-to-r from-blue-400 to-purple-400 text-white h-10 w-10 shrink-0"
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

