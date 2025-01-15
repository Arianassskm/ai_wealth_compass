"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, AlertTriangle, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { EnhancedBackground } from '@/components/enhanced-background'
import { motion } from 'framer-motion'

type Notification = {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'warning' | 'info';
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: '预算超支警告', description: '您的娱乐支出已超过预算20%', date: '2023-05-28', type: 'warning' },
    { id: '2', title: '储蓄目标达成', description: '恭喜！您已达成本月储蓄目标', date: '2023-05-25', type: 'info' },
    { id: '3', title: '大额支出提醒', description: '检测到一笔大额支出，请确认是否为您本人操作', date: '2023-05-20', type: 'warning' },
  ])

  const [notificationSettings, setNotificationSettings] = useState({
    budgetAlerts: true,
    savingsGoals: true,
    investmentUpdates: false,
    securityAlerts: true,
  })

  const toggleSetting = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({ ...prev, [setting]: !prev[setting] }))
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
          <h1 className="text-lg font-semibold text-gray-900">预警通知</h1>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6 p-6 backdrop-blur-xl bg-white/80 border-gray-200">
            <h2 className="text-xl font-semibold mb-4">通知设置</h2>
            <div className="space-y-4">
              <NotificationSetting
                title="预算提醒"
                description="当支出接近或超过预算时通知我"
                enabled={notificationSettings.budgetAlerts}
                onToggle={() => toggleSetting('budgetAlerts')}
              />
              <NotificationSetting
                title="储蓄目标"
                description="当达成储蓄目标时通知我"
                enabled={notificationSettings.savingsGoals}
                onToggle={() => toggleSetting('savingsGoals')}
              />
              <NotificationSetting
                title="投资更新"
                description="接收关于我的投资的定期更新"
                enabled={notificationSettings.investmentUpdates}
                onToggle={() => toggleSetting('investmentUpdates')}
              />
              <NotificationSetting
                title="安全警报"
                description="当检测到异常活动时通知我"
                enabled={notificationSettings.securityAlerts}
                onToggle={() => toggleSetting('securityAlerts')}
              />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mb-6 p-6 backdrop-blur-xl bg-white/80 border-gray-200">
            <h2 className="text-xl font-semibold mb-4">最近通知</h2>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}

function NotificationSetting({ title, description, enabled, onToggle }: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
  )
}

function NotificationItem({ notification }: { notification: Notification }) {
  return (
    <div className="flex items-start space-x-3">
      <div className={`mt-1 ${notification.type === 'warning' ? 'text-yellow-500' : 'text-green-500'}`}>
        {notification.type === 'warning' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
        <p className="text-sm text-gray-500">{notification.description}</p>
        <p className="text-xs text-gray-400 mt-1">{notification.date}</p>
      </div>
    </div>
  )
}

