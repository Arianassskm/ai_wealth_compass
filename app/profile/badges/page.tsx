"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EnhancedBackground } from '@/components/enhanced-background'
import { motion } from 'framer-motion'

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  achieved: boolean;
  progress?: number;
}

export default function BadgesPage() {
  const router = useRouter()
  const [badges, setBadges] = useState<Badge[]>([
    { id: "1", name: "初次储蓄", description: "完成人生第一笔储蓄", icon: "💰", achieved: true },
    { id: "2", name: "投资新人", description: "进行第一次投资", icon: "📈", achieved: true },
    { id: "3", name: "预算达人", description: "连续三个月达成预算目标", icon: "🎯", achieved: false, progress: 66 },
    { id: "4", name: "理财小能手", description: "使用AI助手进行10次决策", icon: "🤖", achieved: true },
    { id: "5", name: "节俭之星", description: "月度支出低于预算20%", icon: "⭐", achieved: false, progress: 80 },
    { id: "6", name: "储蓄达人", description: "累计储蓄达到10万元", icon: "🏆", achieved: false, progress: 45 },
  ])

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
          <h1 className="text-lg font-semibold text-gray-900">勋章馆</h1>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-2 gap-4">
            {badges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}

function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <Card className={`p-4 ${badge.achieved ? 'bg-yellow-50' : 'bg-gray-50'}`}>
      <div className="flex flex-col items-center text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 ${badge.achieved ? 'bg-yellow-200' : 'bg-gray-200'}`}>
          {badge.icon}
        </div>
        <h3 className="font-semibold mb-1">{badge.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
        {badge.achieved ? (
          <span className="text-xs text-green-600 font-semibold">已获得</span>
        ) : (
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${badge.progress}%` }}></div>
          </div>
        )}
      </div>
    </Card>
  )
}

