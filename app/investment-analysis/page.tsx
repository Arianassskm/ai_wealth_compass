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

export default function InvestmentAnalysisPage() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState('')
  const [duration, setDuration] = useState('')
  const [riskTolerance, setRiskTolerance] = useState('')
  const [investmentType, setInvestmentType] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
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
        content: "根据您的投资需求，我建议您可以考虑以下投资组合：40%配置低风险的债券基金，40%配置中等风险的混合基金，20%配置高风险高收益的股票。这样的配置既能保证稳定收益，又有一定的升值空间。您觉得这个建议如何？",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsSubmitting(false)
    }, 1000)
  }

  const handleSubmitInfo = () => {
    const summary = `我计划投资${amount}元，期限为${duration}，风险承受能力为${riskTolerance}，投资类型偏好${investmentType}。请为我提供投资建议。`
    handleSendMessage(summary)
  }

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

