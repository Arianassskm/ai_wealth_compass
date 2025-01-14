"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, GraduationCap, Briefcase, Users, Home, Heart, Baby, Backpack, Building, Sunrise, Sunset } from 'lucide-react'
import { useOnboarding } from '@/contexts/onboarding-context'

const lifeStages = [
  {
    id: 'student',
    title: '学生',
    description: '正在学习，为未来做准备',
    icon: GraduationCap,
  },
  {
    id: 'fresh_graduate',
    title: '应届毕业生',
    description: '刚毕业，寻找人生方向',
    icon: Backpack,
  },
  {
    id: 'career_start',
    title: '职场新人',
    description: '刚开始工作，建立事业',
    icon: Briefcase,
  },
  {
    id: 'career_growth',
    title: '职业发展期',
    description: '专注事业发展和晋升',
    icon: Building,
  },
  {
    id: 'single',
    title: '单身贵族',
    description: '独立生活，专注个人发展',
    icon: Heart,
  },
  {
    id: 'relationship',
    title: '恋爱阶段',
    description: '与伴侣共同规划未来',
    icon: Users,
  },
  {
    id: 'married',
    title: '新婚阶段',
    description: '开始家庭生活',
    icon: Home,
  },
  {
    id: 'parent',
    title: '为人父母',
    description: '抚养子女，平衡工作与家庭',
    icon: Baby,
  },
  {
    id: 'midlife',
    title: '中年阶段',
    description: '事业稳定，考虑未来规划',
    icon: Sunrise,
  },
  {
    id: 'retirement',
    title: '退休准备',
    description: '为退休生活做准备',
    icon: Sunset,
  },
]

export default function LifeStageSelectionPage() {
  const router = useRouter()
  const { data, updateData } = useOnboarding()
  const [selectedStage, setSelectedStage] = useState<string>(data.life_stage || '')

  const handleNext = () => {
    console.log('selectedStage', selectedStage)
    if (selectedStage) {
      updateData({
        life_stage: selectedStage
      })
      router.push('/onboarding/step3')
    }
  }

  const handleSkip = () => {
    router.push('/onboarding/step3')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100 via-blue-100 to-blue-50 opacity-70"></div>
      
      <div className="max-w-2xl mx-auto px-4 py-4 sm:py-8">
        <header className="flex items-center mb-4 sm:mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="mr-3"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">选择人生阶段</h1>
            <p className="text-xs sm:text-sm text-gray-500">帮助我们更好地了解您的需求</p>
          </div>
          <Button variant="ghost" className="text-gray-500 text-xs sm:text-sm" onClick={handleSkip}>
            跳过
          </Button>
        </header>

        <Card className="p-3 sm:p-6 backdrop-blur-xl bg-white/80 border-gray-200">
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {lifeStages.map((stage) => {
              const Icon = stage.icon
              const isSelected = selectedStage === stage.id
              
              return (
                <motion.button
                  key={stage.id}
                  onClick={() => setSelectedStage(stage.id)}
                  className={`w-full text-left p-2 sm:p-4 rounded-xl transition-all ${
                    isSelected 
                      ? 'bg-blue-100 border-2 border-blue-500 text-blue-800'
                      : 'bg-white hover:bg-gray-50 border border-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className={`p-1.5 sm:p-2 rounded-lg ${
                      isSelected 
                        ? 'bg-blue-200 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-base font-semibold">{stage.title}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{stage.description}</p>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </Card>
        <div className="flex justify-between mt-4 sm:mt-6">
          <Button
            variant="outline"
            onClick={() => router.push('/onboarding')}
            className="w-1/2 mr-2 text-xs sm:text-sm h-9 sm:h-10"
          >
            上一步
          </Button>
          <Button
            className="w-1/2 ml-2 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm h-9 sm:h-10"
            disabled={!selectedStage}
            onClick={handleNext}
          >
            下一步
          </Button>
        </div>
      </div>
    </main>
  )
}

