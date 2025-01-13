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

const wealthDevelopmentTypes = [
  { title: "被动收入", value: "passive_income" },
  { title: "技能变现", value: "skill_monetization" },
  { title: "副业创业", value: "side_business" },
  { title: "知识付费", value: "knowledge_payment" },
  { title: "资产配置", value: "asset_allocation" },
]

export default function WealthDevelopmentPage() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [developmentType, setDevelopmentType] = useState('')
  const [currentIncome, setCurrentIncome] = useState('')
  const [targetIncome, setTargetIncome] = useState('')
  const [timeframe, setTimeframe] = useState('')
  const [skills, setSkills] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      content: "你好！我是财富开发助手。请告诉我你的具体情况，我会帮你分析并提供建议。",
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
        content: "根据您提供的信息，我建议您考虑以下几点：1. 评估您的技能和资源。2. 研究市场需求和潜在机会。3. 制定详细的行动计划和时间表。4. 考虑寻求专业指导或合作伙伴。您对这个建议有什么看法？",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsSubmitting(false)
    }, 1000)
  }

  const handleSubmitInfo = () => {
    const summary = `我计划通过${developmentType}来开发财富。我当前的收入是${currentIncome}元，目标是在${timeframe}内达到${targetIncome}元的收入。我的主要技能是${skills}。请为我分析可行性并提供建议。`
    handleSendMessage(summary)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-100 to-teal-200 flex flex-col">
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
            <h1 className="text-base font-medium">财富开发助手</h1>
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
                <h2 className="font-medium mb-1 text-sm">我是财富开发智能助手</h2>
                <p className="text-xs text-gray-600">
                  我会帮您分析财富开发机会，提供专业建议，助您实现财务增长目标~
                </p>
              </div>
            </div>

            {/* Input Form */}
            <CollapsibleSection
              previewContent={
                <div className="space-y-4">
                  <h3 className="text-base font-medium">财富开发信息</h3>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">开发类型</label>
                    <Select onValueChange={setDevelopmentType}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="选择开发类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {wealthDevelopmentTypes.map(type => (
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
                  <label className="text-xs text-gray-500 mb-1.5 block">当前收入</label>
                  <Input
                    placeholder="输入当前月收入..."
                    value={currentIncome}
                    onChange={(e) => setCurrentIncome(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">目标收入</label>
                  <Input
                    placeholder="输入目标月收入..."
                    value={targetIncome}
                    onChange={(e) => setTargetIncome(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">预计时间</label>
                  <Input
                    placeholder="输入预计达成时间..."
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">主要技能</label>
                  <Input
                    placeholder="输入您的主要技能..."
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="h-10"
                  />
                </div>

                <Button
                  className="w-full mt-6 bg-gradient-to-r from-green-400 to-teal-400 text-white h-10"
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
              className="bg-gradient-to-r from-green-400 to-teal-400 text-white h-10 w-10 shrink-0"
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

