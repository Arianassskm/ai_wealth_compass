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

const loanTypes = [
  { title: "个人消费贷款", value: "personal_loan" },
  { title: "住房贷款", value: "mortgage" },
  { title: "汽车贷款", value: "car_loan" },
  { title: "小额企业贷款", value: "small_business_loan" },
]

const repaymentMethods = [
  { title: "等额本息", value: "equal_installment" },
  { title: "等额本金", value: "equal_principal" },
  { title: "先息后本", value: "interest_first" },
  { title: "一次性还本付息", value: "lump_sum" },
]

export default function CreditAnalysisPage() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState('')
  const [duration, setDuration] = useState('')
  const [income, setIncome] = useState('')
  const [loanType, setLoanType] = useState('')
  const [repaymentMethod, setRepaymentMethod] = useState('')
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
        content: "根据您提供的信息，我建议您选择等额本息的还款方式，每月还款金额相对固定，更容易规划。考虑到您的收入水平，建议将月供控制在收入的30%以内，以确保还款压力在可控范围内。您觉得这个建议如何？",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsSubmitting(false)
    }, 1000)
  }

  const handleSubmitInfo = () => {
    const summary = `我需要申请${amount}元${loanType}，期限为${duration}，月收入${income}元，计划采用${repaymentMethod}方式还款。请为我分析可行性并提供建议。`
    handleSendMessage(summary)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-200">
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
          <h1 className="text-base font-medium">贷款分析助手</h1>
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
            <h2 className="font-medium mb-1 text-sm">我是贷款分析智能助手</h2>
            <p className="text-xs text-gray-600">
              告诉我你的贷款需求，我将为你提供专业的分析建议~
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
          <h3 className="text-base mb-4">贷款信息</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">贷款金额</label>
              <Input
                placeholder="输入金额..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-10"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">贷款期限</label>
              <Input
                placeholder="输入期限..."
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
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
              <label className="text-xs text-gray-500 mb-1.5 block">贷款类型</label>
              <Select onValueChange={setLoanType}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="选择贷款类型" />
                </SelectTrigger>
                <SelectContent>
                  {loanTypes.map(type => (
                    <SelectItem key={type.value} value={type.title}>
                      {type.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">还款方式</label>
              <Select onValueChange={setRepaymentMethod}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="选择还款方式" />
                </SelectTrigger>
                <SelectContent>
                  {repaymentMethods.map(method => (
                    <SelectItem key={method.value} value={method.title}>
                      {method.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="w-full mt-6 bg-gradient-to-r from-amber-400 to-orange-400 text-white h-10"
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
            className="bg-gradient-to-r from-amber-400 to-orange-400 text-white h-10 w-10 shrink-0"
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

