"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Send, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { config } from '@/config'
import { fetchApi } from '@/lib/api'
import { useAuthContext } from '@/providers/auth-provider'
import { toast } from 'sonner'
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
import { FormattedMessage } from '@/components/formatted-message'

const commonRelationships = [
  "亲戚", "朋友", "同事", "邻居", "同学", "长辈", "晚辈"
]
const remindText = `您是一位专业的人情往来顾问，帮助用户在社交礼尚往来中做出恰当的决定。您需要综合考虑地域特点、通货膨胀、关系亲疏、场合性质等多个因素，给出合理的建议。

您将收到以下信息：

<location>
省份：{$PROVINCE}
城市：{$CITY}
</location>

<event>
发生时间：{$DATE}
礼金/礼物价值：{$GIFT_VALUE}
关系：{$RELATIONSHIP}
场景：{$OCCASION}
上次收到的礼金价值：{$PREVIOUS_GIFT_VALUE}
</event>

请您遵循以下步骤进行分析：

1. 首先在<analysis>标签内进行分析：
   - 考虑地域经济水平和当地礼俗
   - 评估时间跨度和通货膨胀影响
   - 分析关系亲疏程度
   - 考虑场合的正式程度
   - 参考往来历史

2. 然后在<recommendation>标签内提供建议，包含：
   - 建议的礼金/礼物范围 💰
   - 具体的礼物选择建议（如适用）🎁
   - 送礼时机和方式的建议 ⏰
   - 礼节注意事项 📝

3. 最后在<summary>标签内总结关键建议，用简洁的要点形式呈现。

请确保：
- 使用emoji增加可读性
- 保持礼貌友好的语气
- 考虑中国传统文化习俗
- 给出实际可操作的建议

请直接开始您的分析和建议。`

const userText = `<location>
省份：{$PROVINCE}
城市：{$CITY}
</location>

<event>
发生时间：{$DATE}
礼金/礼物价值：{$GIFT_VALUE}
关系：{$RELATIONSHIP}
场景：{$OCCASION}
上次收到的礼金价值：{$PREVIOUS_GIFT_VALUE}
</event>

请根据以上信息给出建议。`

const scenarioItems = [
  { title: "人生重大时刻", value: "life_milestone" },
  { title: "探病送礼", value: "hospital_visit" },
  { title: "结婚随礼", value: "wedding_gift" },
  { title: "生日庆祝", value: "birthday" },
  { title: "升学祝贺", value: "graduation" },
  { title: "乔迁新居", value: "housewarming" },
]

// 添加类型定义
type PromptParams = {
  PROVINCE: string;
  CITY: string;
  DATE: string;
  GIFT_VALUE: string;
  RELATIONSHIP: string;
  OCCASION: string;
  PREVIOUS_GIFT_VALUE: string;
};

export default function SocialReciprocityPage() {
  const router = useRouter()
  const { token } = useAuthContext()
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
  const [isFormExpanded, setIsFormExpanded] = useState(true)

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province)
    setSelectedCity('')
  }

  const availableCities = provinces.find(p => p.name === selectedProvince)?.cities || []

  const handleSendMessage = async (messages: { role: string; content: string }[]) => {
    if (!messages?.length) return;

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
          messages: messages,
        })
      });

      const content = response.choices[0]?.message?.content || '';
      // 解析并格式化内容
      const formattedContent = content
        // 先处理标签
        .replace(/<analysis>\n-/g, '\n\n📊 分析：\n')
        .replace(/<\/analysis>/g, '\n')
        .replace(/\n-/g, '\n')
        // 处理加粗文本
        .replace(/\*\*(.*?)\*\*/g, '\n**$1**')
        // 处理其他标签
        .replace(/<recommendation>\n-/g, '\n\n💡 建议：\n')
        .replace(/<recommendation>/g, '\n\n💡 建议：\n')
        .replace(/<\/recommendation>/g, '\n')
        .replace(/<summary>/g, '\n\n📝 总结：\n')
        .replace(/<summary>\n-/g, '\n\n📝 总结：\n')
        .replace(/<\/summary>/g, '\n')
        // 处理每行内容
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .join('\n')
        // 确保段落之间有足够的空行
        .replace(/\n{3,}/g, '\n\n');
      
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        content: formattedContent,
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
    // 验证表单
    const promptParams: PromptParams = {
      PROVINCE: selectedProvince,
      CITY: selectedCity,
      DATE: eventTime,
      GIFT_VALUE: event,
      RELATIONSHIP: relationship,
      OCCASION: scene,
      PREVIOUS_GIFT_VALUE: lastGiftValue
    };

    if (!promptParams.PROVINCE || !promptParams.CITY || !promptParams.DATE || 
        !promptParams.GIFT_VALUE || !promptParams.RELATIONSHIP || !promptParams.OCCASION) {
      toast.error('请填写完整信息');
      return;
    }

    // 先收起表单并设置提交状态
    setIsFormExpanded(false);
    setIsSubmitting(true);

    try {
      // 构建并发送消息
      const filledPrompt = userText.replace(
        /\{(\$[A-Z_]+)\}/g,
        (_, key) => promptParams[key.substring(1)] || '未填写'
      );

      const messages = [
        {
          role: 'system',
          content: remindText
        },
        {
          role: 'user',
          content: filledPrompt
        }
      ];

      await handleSendMessage(messages);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-400 to-blue-400 flex flex-col relative">
      {/* 添加加载遮罩 */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 shadow-lg flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600">分析中...</span>
          </div>
        </div>
      )}

      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm">
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
              isExpanded={isFormExpanded}
              onToggle={() => setIsFormExpanded(!isFormExpanded)}
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
                <FormattedMessage
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

