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
import { provinces } from '@/data/china-regions'
import { CollapsibleSection } from '@/components/collapsible-section'

const commonRelationships = [
  "亲戚", "朋友", "同事", "邻居", "同学", "长辈", "晚辈"
]

const scenarioItems = [
  { title: "人生重大时刻", value: "life_milestone" },
  { title: "探病送礼", value: "hospital_visit" },
  { title: "结婚随礼", value: "wedding_gift" },
  { title: "生日庆祝", value: "birthday" },
  { title: "升学祝贺", value: "graduation" },
  { title: "乔迁新居", value: "housewarming" },
]

export default function SocialReciprocityPage() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [event, setEvent] = useState('')
  const [relationship, setRelationship] = useState('')
  const [scene, setScene] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      content: "你好！我是人情往来助手。请告诉我你的具体情况，我会帮你分析合适的人情往来方案。",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [eventTime, setEventTime] = useState('')
  const [lastGiftValue, setLastGiftValue] = useState('')

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province)
    setSelectedCity('')
  }

  const availableCities = provinces.find(p => p.name === selectedProvince)?.cities || []

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
        content: "根据您提供的信息，考虑到时间、通货膨胀等因素，我建议您的回礼金额在上次收到礼金的基础上适当增加10-15%。这样既能体现您的诚意，又不会给自己造成过大压力。您觉得这个建议如何？",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsSubmitting(false)
    }, 1000)
  }

  const handleSubmitInfo = () => {
    const location = selectedCity ? `${selectedProvince}${selectedCity}` : selectedProvince
    const summary = `我的情况是：发生地点在${location}，发生时间是${eventTime}，${event ? `涉及金额或礼物是${event}，` : ''}与对方的关系是${relationship}，场景是${scene}，上次收到的礼金价值约${lastGiftValue}元。请根据这些信息给我一些建议，考虑时间和通货膨胀因素。`
    handleSendMessage(summary)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-400 to-blue-400 flex flex-col">
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
            <h1 className="text-base font-medium">人情往来助手</h1>
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
                <h2 className="font-medium mb-1 text-sm">我是人情往来智能助手</h2>
                <p className="text-xs text-gray-600">
                  我会帮您合理安排人情往来，考虑时间、通胀等因素，确保您的礼尚往来得体有度，避免因疏忽而造成不适当的回礼~
                </p>
              </div>
            </div>

            {/* Input Form */}
            <CollapsibleSection
              previewContent={
                <div className="space-y-4">
                  <h3 className="text-base font-medium">人情信息</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block">省份</label>
                      <Select onValueChange={handleProvinceChange} value={selectedProvince}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="选择省份" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map(province => (
                            <SelectItem key={province.name} value={province.name}>
                              {province.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block">城市</label>
                      <Select 
                        onValueChange={setSelectedCity} 
                        value={selectedCity}
                        disabled={!selectedProvince}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder={selectedProvince ? "选择城市" : "请先选择省份"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCities.map(city => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              }
            >
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">发生时间</label>
                  <Input
                    type="datetime-local"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">金额/礼物</label>
                  <Input
                    placeholder="输入金额或礼物..."
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">关系</label>
                  <Select onValueChange={setRelationship}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="选择关系" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonRelationships.map(rel => (
                        <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">场景</label>
                  <Select onValueChange={(value) => setScene(scenarioItems.find(item => item.value === value)?.title || '')}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="选择场景" />
                    </SelectTrigger>
                    <SelectContent>
                      {scenarioItems.map(item => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">上次收到的礼金价值（元）</label>
                  <Input
                    type="number"
                    placeholder="输入上次收到的礼金价值..."
                    value={lastGiftValue}
                    onChange={(e) => setLastGiftValue(e.target.value)}
                    className="h-10"
                  />
                </div>

                <Button
                  className="w-full mt-6 bg-gradient-to-r from-emerald-400 to-blue-400 text-white h-10"
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
              className="bg-gradient-to-r from-emerald-400 to-blue-400 text-white h-10 w-10 shrink-0"
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

