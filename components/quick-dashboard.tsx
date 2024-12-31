"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, PiggyBank, TrendingUp, DollarSign } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

interface QuickDashboardProps {
  isOpen: boolean
  onClose: () => void
}

export function QuickDashboard({ isOpen, onClose }: QuickDashboardProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="fixed top-0 left-0 bottom-0 w-[180px] sm:w-80 md:w-[384px] bg-gradient-to-br from-white/80 to-blue-100/80 backdrop-blur-md z-50 p-4 sm:p-6 shadow-lg overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold">快速概览</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="space-y-4">
              <DashboardItem
                icon={CreditCard}
                title="本月支出"
                status={{
                  emoji: "😠",
                  text: "恨铁不成钢",
                  advice: "支出过高，考虑削减非必要开支",
                  amount: "5,280",
                  change: "+15%"
                }}
              />
              <DashboardItem
                icon={PiggyBank}
                title="总储蓄"
                status={{
                  emoji: "😊",
                  text: "储蓄不错",
                  advice: "别忘了投资对冲通货膨胀",
                  amount: "50,000",
                  change: "+8%"
                }}
              />
              <DashboardItem
                icon={TrendingUp}
                title="投资收益"
                status={{
                  emoji: "🤔",
                  text: "有待提高",
                  advice: "考虑多元化投资组合",
                  amount: "2,800",
                  change: "+3%"
                }}
              />
              <DashboardItem
                icon={DollarSign}
                title="可支配收入"
                status={{
                  emoji: "😌",
                  text: "状况良好",
                  advice: "合理分配到储蓄和投资",
                  amount: "3,500",
                  change: "+5%"
                }}
              />
            </div>
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold mb-2">快速链接</h3>
              <Button variant="outline" className="w-full justify-start h-10 sm:h-12 text-base sm:text-lg" onClick={() => router.push('/budget-settings')}>
                预算设置
              </Button>
              <Button variant="outline" className="w-full justify-start h-10 sm:h-12 text-base sm:text-lg" onClick={() => router.push('/investment-portfolio')}>
                投资组合
              </Button>
              <Button variant="outline" className="w-full justify-start h-10 sm:h-12 text-base sm:text-lg" onClick={() => router.push('/wealth-management')}>
                反向财富管理
              </Button>
              <Button variant="outline" className="w-full justify-start h-10 sm:h-12 text-base sm:text-lg" onClick={() => router.push('/financial-goals')}>
                财务目标
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface DashboardItemProps {
  icon: React.ElementType
  title: string
  status: {
    emoji: string
    text: string
    advice: string
    amount: string
    change: string
  }
}

function DashboardItem({ icon: Icon, title, status }: DashboardItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div 
      className="flex flex-col p-1.5 sm:p-4 bg-white/60 rounded-lg backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-white/80"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center space-x-4">
        <div className="bg-blue-100 p-1.5 sm:p-3 rounded-full">
          <Icon className="h-3.5 w-3.5 sm:h-6 sm:w-6 text-blue-600" />
        </div>
        <div className="flex-grow">
          <h3 className="text-sm sm:text-lg font-medium text-gray-900">{title}</h3>
          <div className="flex items-center space-x-1 sm:space-x-2 mt-0.5 sm:mt-1">
            <span className="text-lg sm:text-2xl">{status.emoji}</span>
            <p className="text-xs sm:text-sm font-medium text-gray-600">{status.text}</p>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-600"
          >
            <p className="mb-2">具体金额: ¥{status.amount}</p>
            <p className="mb-2">同比变化: {status.change}</p>
            <p>{status.advice}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

