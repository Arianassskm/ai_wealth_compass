"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EnhancedBackground } from '@/components/enhanced-background'
import { motion } from 'framer-motion'

export default function PersonalInfoPage() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState({
    name: "张三",
    avatar: "/placeholder.svg",
    lifeStage: "奋斗期",
    riskPreference: "稳健型",
    age: 28,
    occupation: "软件工程师",
    annualIncome: "30-50万",
    financialGoals: "买房、投资理财"
  })

  return (
    <main className="min-h-screen overflow-hidden">
      <EnhancedBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-3"
            onClick={() => router.push('/profile')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">个人资料</h1>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6 p-6 backdrop-blur-xl bg-white/80 border-gray-200">
            <div className="flex items-center mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                <AvatarFallback>{userInfo.name[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-4 flex-grow">
                <h2 className="text-2xl font-bold text-gray-900">{userInfo.name}</h2>
                <p className="text-sm text-gray-500">{userInfo.lifeStage}</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto bg-white text-gray-600 border-gray-200">
                <Edit2 className="w-4 h-4 mr-2" />
                编辑
              </Button>
            </div>

            <div className="space-y-4">
              <InfoItem label="风险偏好" value={userInfo.riskPreference} />
              <InfoItem label="年龄" value={`${userInfo.age}岁`} />
              <InfoItem label="职业" value={userInfo.occupation} />
              <InfoItem label="年收入" value={userInfo.annualIncome} />
              <InfoItem label="财务目标" value={userInfo.financialGoals} />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button
            variant="outline"
            className="w-full bg-white text-gray-600 border-gray-200"
            onClick={() => router.push('/profile')}
          >
            返回个人中心
          </Button>
        </motion.div>
      </div>
    </main>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}

