"use client"

import { useState, useEffect } from 'react'
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
    name: "加载中...",
    avatar: "/placeholder.svg",
    lifeStage: "加载中...",
    riskPreference: "加载中...",
    age: "--",
    occupation: "加载中...",
    annualIncome: "加载中...",
    financialGoals: "加载中..."
  })

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/v1/user/profile')
        const data = await response.json()
        
        // 从AI评估数据中提取用户信息
        if (data) {
          setUserInfo({
            name: data.name || "未设置",
            avatar: data.avatar || "/placeholder.svg",
            lifeStage: data.life_stage || "未知",
            riskPreference: getRiskLevel(data.risk_tolerance) || "稳健型",
            age: getAgeFromGroup(data.age_group) || "--",
            occupation: data.employment_status || "未知",
            annualIncome: formatIncome(data.estimated_monthly_income * 12) || "未知",
            financialGoals: formatGoals([
              data.short_term_goal,
              data.mid_term_goal,
              data.long_term_goal
            ]) || "未设置"
          })
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        // 保持默认值
      }
    }

    fetchUserProfile()
  }, [])

  // 辅助函数
  const getRiskLevel = (tolerance?: string) => {
    const riskMap: { [key: string]: string } = {
      'conservative': '保守型',
      'moderate': '稳健型',
      'aggressive': '进取型'
    }
    return tolerance ? riskMap[tolerance] : '稳健型'
  }

  const getAgeFromGroup = (ageGroup?: string) => {
    const ageMap: { [key: string]: number } = {
      '18-25': 22,
      '26-35': 30,
      '36-45': 40,
      '46-55': 50,
      '56+': 60
    }
    return ageGroup ? ageMap[ageGroup] : '--'
  }

  const formatIncome = (annualIncome?: number) => {
    if (!annualIncome) return "未知"
    if (annualIncome < 100000) return "10万以下"
    if (annualIncome < 300000) return "10-30万"
    if (annualIncome < 500000) return "30-50万"
    return "50万以上"
  }

  const formatGoals = (goals: (string | undefined)[]) => {
    const validGoals = goals.filter(goal => goal)
    return validGoals.length > 0 ? validGoals.join('、') : "未设置"
  }

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

