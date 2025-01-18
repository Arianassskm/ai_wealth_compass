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

const improvementAreas = [
  { title: "职业技能", value: "professional_skills" },
  { title: "语言学习", value: "language_learning" },
  { title: "领导力", value: "leadership" },
  { title: "创新思维", value: "innovative_thinking" },
]

const currentLevels = [
  { title: "入门级", value: "beginner" },
  { title: "初级", value: "elementary" },
  { title: "中级", value: "intermediate" },
  { title: "高级", value: "advanced" },
]

export default function AbilityImprovementPage() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [goal, setGoal] = useState('')
  const [timeframe, setTimeframe] = useState('')
  const [currentLevel, setCurrentLevel] = useState('')
  const [improvementArea, setImprovementArea] = useState('')
  const [expectedLevel, setExpectedLevel] = useState('')
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
        content: "根据您的目标和当前水平，我建议您可以采用以下学习路径：1. 制定每周学习计划 2. 参加相关培训课程 3. 实践练习和项目实战。您期望在多长时间内达到目标？我可以为您制定更详细的提升计划。",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsSubmitting(false)
    }, 1000)
  }

  const handleSubmitInfo = () => {
    const summary = `我想提升${improvementArea}，当前水平是${currentLevel}，期望达到${expectedLevel}水平，计划用时${timeframe}。具体目标是：${goal}。请为我制定提升计划。`
    handleSendMessage(summary)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-400 to-purple-400">
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
          <h1 className="text-base font-medium">能力提升助手</h1>
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
            <h2 className="font-medium mb-1 text-sm">我是能力提升智能助手</h2>
            <p className="text-xs text-gray-600">
              告诉我你的提升目标，我将为你制定专业的学习计划~
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
          <h3 className="text-base mb-4">提升信息</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">提升领域</label>
              <Select onValueChange={setImprovementArea}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="选择提升领域" />
                </SelectTrigger>
                <SelectContent>
                  {improvementAreas.map(area => (
                    <SelectItem key={area.value} value={area.title}>
                      {area.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">当前水平</label>
              <Select onValueChange={setCurrentLevel}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="选择当前水平" />
                </SelectTrigger>
                <SelectContent>
                  {currentLevels.map(level => (
                    <SelectItem key={level.value} value={level.title}>
                      {level.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">期望水平</label>
              <Select onValueChange={setExpectedLevel}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="选择期望水平" />
                </SelectTrigger>
                <SelectContent>
                  {currentLevels.map(level => (
                    <SelectItem key={level.value} value={level.title}>
                      {level.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <label className="text-xs text-gray-500 mb-1.5 block">具体目标</label>
              <Input
                placeholder="输入具体目标..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          <Button
            className="w-full mt-6 bg-gradient-to-r from-indigo-400 to-purple-400 text-white h-10"
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
            className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white h-10 w-10 shrink-0"
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

