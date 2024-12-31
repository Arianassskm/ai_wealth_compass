"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Wallet, Home, Briefcase, ShoppingCart } from 'lucide-react'
import { RadioCard } from "@/components/radio-card"

export default function LifestyleInformationPage() {
  const router = useRouter()
  const [financialStatus, setFinancialStatus] = useState('')
  const [housingStatus, setHousingStatus] = useState('')
  const [employmentStatus, setEmploymentStatus] = useState('')
  const [lifestyleStatus, setLifestyleStatus] = useState('')

  const allOptionsSelected = () => {
    return financialStatus !== '' && housingStatus !== '' && employmentStatus !== '' && lifestyleStatus !== '';
  };

  const handleNext = () => {
    router.push('/onboarding/step4')
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">生活水平信息</h1>
            <p className="text-xs sm:text-sm text-gray-500">帮助我们了解您的财务状况</p>
          </div>
        </header>

        <Card className="p-3 sm:p-6 backdrop-blur-xl bg-white/80 border-gray-200">
          <form className="space-y-4 sm:space-y-8">
            {/* Financial Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Label className="flex items-center text-sm sm:text-lg font-medium mb-2 sm:mb-4 text-blue-600">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                财务状况
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {[
                  { main: '省吃俭用', sub: '泡面加蛋，月光族' },
                  { main: '基本温饱', sub: '外卖续命，存不下钱' },
                  { main: '小有盈余', sub: '偶尔下馆子，能存点钱' },
                  { main: '品质生活', sub: '周末探店，理财有道' },
                  { main: '精致生活', sub: '米其林常客，投资理财' }
                ].map((status, index) => (
                  <RadioCard
                    key={`financial-${index}`}
                    id={`financial-${index}`}
                    mainLabel={status.main}
                    subLabel={status.sub}
                    colorScheme="blue"
                    name="financialStatus"
                    value={status.main}
                    checked={financialStatus === status.main}
                    onChange={(e) => setFinancialStatus(e.currentTarget.value)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Housing Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Label className="flex items-center text-sm sm:text-lg font-medium mb-2 sm:mb-4 text-green-600">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                住房状况
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {[
                  { main: '蜗居生活', sub: '租房过日子，慢慢攒钱' },
                  { main: '小家初成', sub: '按揭买房，紧巴巴的' },
                  { main: '温馨三口', sub: '孩子上学，工资够用' },
                  { main: '安逸生活', sub: '房贷结清，轻松自在' },
                  { main: '优质生活', sub: '家庭和睦，衣食无忧' }
                ].map((status, index) => (
                  <RadioCard
                    key={`housing-${index}`}
                    id={`housing-${index}`}
                    mainLabel={status.main}
                    subLabel={status.sub}
                    colorScheme="green"
                    name="housingStatus"
                    value={status.main}
                    checked={housingStatus === status.main}
                    onChange={(e) => setHousingStatus(e.currentTarget.value)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Employment Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Label className="flex items-center text-sm sm:text-lg font-medium mb-2 sm:mb-4 text-purple-600">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                就业状况
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {[
                  { main: '朝九晚五', sub: '安稳工作，按部就班' },
                  { main: '自由职业', sub: '时间自由，收入波动' },
                  { main: '创业奋斗', sub: '披星戴月，期待未来' },
                  { main: '斜杠青年', sub: '多重身份，多元收入' },
                  { main: '退休生活', sub: '悠闲自得，偶尔兼职' }
                ].map((status, index) => (
                  <RadioCard
                    key={`employment-${index}`}
                    id={`employment-${index}`}
                    mainLabel={status.main}
                    subLabel={status.sub}
                    colorScheme="purple"
                    name="employmentStatus"
                    value={status.main}
                    checked={employmentStatus === status.main}
                    onChange={(e) => setEmploymentStatus(e.currentTarget.value)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Lifestyle Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Label className="flex items-center text-sm sm:text-lg font-medium mb-2 sm:mb-4 text-orange-600">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                生活方式
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {[
                  { main: '勤俭持家', sub: '精打细算，注重积累' },
                  { main: '品质追求', sub: '讲究品味，适度享受' },
                  { main: '享受人生', sub: '及时行乐，注重体验' },
                  { main: '极简主义', sub: '减少欲望，追求自由' },
                  { main: '投资未来', sub: '注重学习，规划长远' }
                ].map((status, index) => (
                  <RadioCard
                    key={`lifestyle-${index}`}
                    id={`lifestyle-${index}`}
                    mainLabel={status.main}
                    subLabel={status.sub}
                    colorScheme="orange"
                    name="lifestyleStatus"
                    value={status.main}
                    checked={lifestyleStatus === status.main}
                    onChange={(e) => setLifestyleStatus(e.currentTarget.value)}
                  />
                ))}
              </div>
            </motion.div>
          </form>
        </Card>

        <div className="flex justify-between mt-4 sm:mt-6">
          <Button
            variant="outline"
            onClick={() => router.push('/onboarding/step2')}
            className="w-1/2 mr-2 text-xs sm:text-sm h-9 sm:h-10"
          >
            上一步
          </Button>
          <Button
            className="w-1/2 ml-2 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm h-9 sm:h-10"
            onClick={handleNext}
            disabled={!allOptionsSelected()}
          >
            下一步
          </Button>
        </div>
      </div>
    </main>
  )
}

