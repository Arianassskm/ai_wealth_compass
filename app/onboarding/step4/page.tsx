"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Sunrise, Sun, Sunset } from 'lucide-react'
import { RadioCard } from "@/components/radio-card"
import { CompletionAnimation } from "@/components/completion-animation"

export default function LifeGoalsPage() {
  const router = useRouter()
  const [shortTermGoal, setShortTermGoal] = useState('')
  const [midTermGoal, setMidTermGoal] = useState('')
  const [longTermGoal, setLongTermGoal] = useState('')
  const [showCompletion, setShowCompletion] = useState(false)

  const allGoalsSelected = () => {
    return shortTermGoal !== '' && midTermGoal !== '' && longTermGoal !== '';
  };

  const handleNext = () => {
    if (allGoalsSelected()) {
      setShowCompletion(true)
    }
  }

  const handleAnimationClose = () => {
    setShowCompletion(false)
    router.push('/')
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">人生目标</h1>
            <p className="text-xs sm:text-sm text-gray-500">选择您的短期愿望、中期规划和长期愿景</p>
          </div>
        </header>

        <Card className="p-3 sm:p-6 backdrop-blur-xl bg-white/80 border-gray-200">
          <form className="space-y-4 sm:space-y-8">
            {/* Short-term Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Label className="flex items-center text-sm sm:text-lg font-medium mb-2 sm:mb-4 text-blue-600">
                <Sunrise className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                短期愿望
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {[
                  { main: '能睡懒觉', sub: '不用早起打卡' },
                  { main: '想吃就吃', sub: '不用算钱点菜' },
                  { main: '随心购物', sub: '不看价格标签' },
                  { main: '说走就走', sub: '说走就能走' },
                  { main: '自由工作', sub: '时间能自主' }
                ].map((goal, index) => (
                  <RadioCard
                    key={`short-term-${index}`}
                    id={`short-term-${index}`}
                    mainLabel={goal.main}
                    subLabel={goal.sub}
                    colorScheme="blue"
                    name="shortTermGoal"
                    value={goal.main}
                    checked={shortTermGoal === goal.main}
                    onChange={(e) => setShortTermGoal(e.currentTarget.value)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Mid-term Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Label className="flex items-center text-sm sm:text-lg font-medium mb-2 sm:mb-4 text-green-600">
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                中期规划
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {[
                  { main: '小家安居', sub: '有个自己的家' },
                  { main: '快乐工作', sub: '做喜欢的事' },
                  { main: '健康生活', sub: '运动健身无忧' },
                  { main: '亲子时光', sub: '陪伴家人成长' },
                  { main: '兴趣发展', sub: '培养自己爱好' }
                ].map((goal, index) => (
                  <RadioCard
                    key={`mid-term-${index}`}
                    id={`mid-term-${index}`}
                    mainLabel={goal.main}
                    subLabel={goal.sub}
                    colorScheme="green"
                    name="midTermGoal"
                    value={goal.main}
                    checked={midTermGoal === goal.main}
                    onChange={(e) => setMidTermGoal(e.currentTarget.value)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Long-term Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Label className="flex items-center text-sm sm:text-lg font-medium mb-2 sm:mb-4 text-purple-600">
                <Sunset className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                长期愿景
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {[
                  { main: '早早退休', sub: '提前退休享受生活' },
                  { main: '环球旅行', sub: '走遍世界各地' },
                  { main: '乐享生活', sub: '做想做的每件事' },
                  { main: '健康养老', sub: '医疗保障无忧' },
                  { main: '财富自由', sub: '被动收入养家' }
                ].map((goal, index) => (
                  <RadioCard
                    key={`long-term-${index}`}
                    id={`long-term-${index}`}
                    mainLabel={goal.main}
                    subLabel={goal.sub}
                    colorScheme="purple"
                    name="longTermGoal"
                    value={goal.main}
                    checked={longTermGoal === goal.main}
                    onChange={(e) => setLongTermGoal(e.currentTarget.value)}
                  />
                ))}
              </div>
            </motion.div>
          </form>
        </Card>

        <div className="flex justify-between mt-4 sm:mt-6">
          <Button
            variant="outline"
            onClick={() => router.push('/onboarding/step3')}
            className="w-1/2 mr-2 text-xs sm:text-sm h-9 sm:h-10"
          >
            上一步
          </Button>
          <Button
            className="w-1/2 ml-2 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm h-9 sm:h-10"
            onClick={handleNext}
            disabled={!allGoalsSelected()}
          >
            完成
          </Button>
        </div>
        <CompletionAnimation 
          isVisible={showCompletion}
          onClose={handleAnimationClose}
        />
      </div>
    </main>
  )
}

