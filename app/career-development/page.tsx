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
import { Slider } from "@/components/ui/slider"

const workEnvironments = [
  { title: "办公室", value: "office" },
  { title: "远程工作", value: "remote" },
  { title: "混合模式", value: "hybrid" },
  { title: "户外", value: "outdoor" },
  { title: "灵活", value: "flexible" },
]

const skillLevels = [
  { title: "入门", value: "beginner" },
  { title: "初级", value: "junior" },
  { title: "中级", value: "intermediate" },
  { title: "高级", value: "senior" },
  { title: "专家", value: "expert" },
]

export default function CareerDevelopmentPage() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [desiredSalary, setDesiredSalary] = useState('')
  const [workEnvironment, setWorkEnvironment] = useState('')
  const [workHoursPerDay, setWorkHoursPerDay] = useState<number[]>([8])
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState<number[]>([5])
  const [commuteDistance, setCommuteDistance] = useState<number[]>([30])
  const [skills, setSkills] = useState('')
  const [expertise, setExpertise] = useState('')
  const [experience, setExperience] = useState('')
  const [skillLevel, setSkillLevel] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      content: "你好！我是职业发展智能助手。请告诉我你理想的工作和生活状况，我会为你分析并推荐合适的职业发展路径。",
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
        content: `根据您提供的信息，我为您制定了以下职业发展建议：

1. 主要工作：考虑寻找一份年薪约${Number(desiredSalary) * 0.7}元的${workEnvironment}工作，这将满足您大部分的薪资需求。工作时间为每天${workHoursPerDay}小时，每周${workDaysPerWeek}天。

2. 副业选择：为了达到您期望的${desiredSalary}元年薪，您可以考虑发展以下副业：
   - 利用您的${skills}技能，在非工作日进行自由职业或兼职工作
   - 在线教学或咨询，分享您在${expertise}领域的专业知识

3. 技能提升：为了增加您的竞争力和收入潜力，建议您：
   - 进一步提升${skills}相关的技能，争取达到更高级别
   - 学习与${expertise}相关的新兴技术或方法
   - 考虑获取相关的专业认证

4. 工作方式：寻找能够提供灵活工作时间的雇主，使您的工作时间接近您期望的每天${workHoursPerDay}小时，每周${workDaysPerWeek}天，并且通勤时间在${commuteDistance}分钟左右的范围内。

5. 长期发展：随着您${experience}的工作经验不断积累，考虑向管理岗位或更高级别的专业岗位发展，这将有助于提高您的收入潜力。

您对这个建议有什么看法？我们可以进一步讨论任何具体的方面。`,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsSubmitting(false)
    }, 1000)
  }

  const handleSubmitInfo = () => {
    const summary = `我希望年薪达到${desiredSalary}元，偏好${workEnvironment}的工作环境，每天工作${workHoursPerDay}小时，每周工作${workDaysPerWeek}天，通勤时间${commuteDistance}分钟以内。我的主要技能是${skills}，专长领域是${expertise}，目前有${experience}年工作经验，技能水平为${skillLevel}。请为我分析并推荐合适的职业发展路径。`
    handleSendMessage(summary)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-400 to-purple-400 flex flex-col">
      <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-3"
            onClick={() => router.push('/decisions')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-base font-medium">职业发展智能助手</h1>
        </div>
      </header>

      <div className="flex-grow overflow-y-auto pb-16">
        <div className="max-w-md mx-auto px-4 py-6">
          {/* Assistant Introduction */}
          <div className="mb-6 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
              <Image
                src="/placeholder.svg"
                alt="Assistant"
                width={60}
                height={60}
                className="rounded-full"
              />
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mx-auto max-w-[280px] shadow-sm">
              <h2 className="font-medium mb-1 text-sm">我是职业发展智能助手</h2>
              <p className="text-xs text-gray-600">
                告诉我你理想的工作和生活状况，我会为你量身定制职业发展方案，包括主副业选择、技能提升建议等，助你实现理想的工作生活平衡~
              </p>
            </div>
          </div>

          {/* Input Form */}
          <CollapsibleSection
            previewContent={
              <div className="space-y-4">
                <h3 className="text-base font-medium">期望信息</h3>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">期望年薪（元）</label>
                  <Input
                    type="number"
                    placeholder="输入期望年薪..."
                    value={desiredSalary}
                    onChange={(e) => setDesiredSalary(e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>
            }
          >
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">理想工作环境</label>
                <Select onValueChange={setWorkEnvironment}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="选择工作环境" />
                  </SelectTrigger>
                  <SelectContent>
                    {workEnvironments.map(env => (
                      <SelectItem key={env.value} value={env.title}>
                        {env.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">期望每天工作时间（小时）</label>
                <Slider
                  min={1}
                  max={12}
                  step={0.5}
                  value={workHoursPerDay}
                  onValueChange={setWorkHoursPerDay}
                />
                <div className="text-sm text-gray-500 mt-1">{workHoursPerDay} 小时/天</div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">期望每周工作天数</label>
                <Slider
                  min={1}
                  max={7}
                  step={1}
                  value={workDaysPerWeek}
                  onValueChange={setWorkDaysPerWeek}
                />
                <div className="text-sm text-gray-500 mt-1">{workDaysPerWeek} 天/周</div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">可接受的通勤时间（分钟）</label>
                <Slider
                  min={0}
                  max={120}
                  step={5}
                  value={commuteDistance}
                  onValueChange={setCommuteDistance}
                />
                <div className="text-sm text-gray-500 mt-1">{commuteDistance} 分钟</div>
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

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">专长领域</label>
                <Input
                  placeholder="输入您的专长领域..."
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                  className="h-10"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">工作经验（年）</label>
                <Input
                  type="number"
                  placeholder="输入工作年限..."
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="h-10"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">技能水平</label>
                <Select onValueChange={setSkillLevel}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="选择技能水平" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillLevels.map(level => (
                      <SelectItem key={level.value} value={level.title}>
                        {level.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full mt-6 bg-gradient-to-r from-indigo-400 to-purple-400 text-white h-10"
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
            className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white h-10 w-10 shrink-0"
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

