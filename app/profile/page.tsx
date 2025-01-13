"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Bell, Lock, LogOut, User, Award, Edit2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { EnhancedBackground } from '@/components/enhanced-background'
import { AIModelSettings } from '@/components/ai-model-settings'
import { motion } from 'framer-motion'
import { BottomNav } from "@/components/bottom-nav"
import { useAuthContext } from '@/providers/auth-provider'
import { fetchApi } from '@/lib/api'
import { config } from '@/config'
import { LIFE_STAGE_MAP } from '@/lib/dictionaries'

export default function ProfilePage() {
  const router = useRouter()
  const { token, logout } = useAuthContext()
  const [userInfo, setUserInfo] = useState({
    name: "加载中...",
    lifeStage: "加载中..."
  })

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await fetchApi(config.apiEndpoints.user.profile, {
          token
        })
        
        if (data) {
          setUserInfo({
            name: data.name || "未设置",
            lifeStage: data.life_stage || "未知"
          })
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    if (token) {
      fetchUserProfile()
    }
  }, [token])

  const menuItems = [
    { icon: <User className="w-5 h-5" />, title: "个人资料", link: "/profile/personal-info" },
    { icon: <Bell className="w-5 h-5" />, title: "预警通知", link: "/profile/notifications" },
    { icon: <Lock className="w-5 h-5" />, title: "数据隐私", link: "/profile/privacy" },
    { icon: <Award className="w-5 h-5" />, title: "勋章馆", link: "/profile/badges" },
  ]

  const badges: Badge[] = [
    { id: "1", name: "初次储蓄", description: "完成人生第一笔储蓄", icon: "💰", shortDescription: "迈出理财第一步" },
    { id: "2", name: "投资新人", description: "进行第一次投资", icon: "📈", shortDescription: "开启投资之旅" },
    { id: "3", name: "预算达人", description: "连续三个月达成预算目标", icon: "🎯", shortDescription: "精准控制支出" },
    { id: "4", name: "理财小能手", description: "使用AI助手进行10次决策", icon: "🤖", shortDescription: "善用智能工具" },
    { id: "5", name: "节俭之星", description: "月度支出低于预算20%", icon: "⭐", shortDescription: "节省有道" },
    { id: "6", name: "储蓄达人", description: "累计储蓄达到10万元", icon: "🏆", shortDescription: "稳步积累财富" },
  ]

  const handleLogout = () => {
    logout()
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <EnhancedBackground />
      <div className="max-w-xl mx-auto px-4 py-8">
        {/* User Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6 p-4 backdrop-blur-xl bg-white/80 border-gray-200">
            <div className="flex items-center">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" alt={userInfo.name} />
                <AvatarFallback>{userInfo.name[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-4 flex-grow">
                <h2 className="text-xl font-bold text-gray-900">{userInfo.name}</h2>
                <div className="flex items-center mb-2">
                  <span className="text-gray-900">
                    {LIFE_STAGE_MAP[userInfo.lifeStage] || userInfo.lifeStage}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="ml-auto bg-white text-gray-600 border-gray-200" onClick={() => router.push('/profile/personal-info')}>
                <Edit2 className="w-4 h-4 mr-2" />
                编辑
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* AI Model Settings */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <AIModelSettings />
        </motion.div>

        {/* Badge Gallery Preview */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mb-6 p-4 backdrop-blur-xl bg-white/80 border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">我的勋章</h3>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-4">
                {badges.map((badge) => (
                  <motion.div 
                    key={badge.id} 
                    className="flex flex-col items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl mb-1">
                      {badge.icon}
                    </div>
                    <span className="text-xs text-center text-gray-600">{badge.name}</span>
                  </motion.div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </Card>
        </motion.div>

        {/* Basic Information Menu */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="mb-6 backdrop-blur-xl bg-white/80 border-gray-200">
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => router.push(item.link)}
                whileHover={{ x: 5 }}
              >
                <div className="mr-3 text-gray-600">{item.icon}</div>
                <span className="flex-grow text-gray-900">{item.title}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </motion.div>
            ))}
          </Card>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            variant="outline"
            className="w-full bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-600 border-red-200"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            退出登录
          </Button>
        </motion.div>
      </div>

      <BottomNav activePage="profile" />
    </main>
  )
}

