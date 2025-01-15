"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Lock, Eye, EyeOff, Download, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { EnhancedBackground } from '@/components/enhanced-background'
import { motion } from 'framer-motion'

export default function PrivacyPage() {
  const router = useRouter()
  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: false,
    anonymousAnalytics: true,
    thirdPartyAccess: false,
  })

  const toggleSetting = (setting: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({ ...prev, [setting]: !prev[setting] }))
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
          <h1 className="text-lg font-semibold text-gray-900">数据隐私</h1>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6 p-6 backdrop-blur-xl bg-white/80 border-gray-200">
            <h2 className="text-xl font-semibold mb-4">隐私设置</h2>
            <div className="space-y-4">
              <PrivacySetting
                icon={<Eye className="w-5 h-5" />}
                title="数据共享"
                description="允许与合作伙伴共享您的匿名数据以改善服务"
                enabled={privacySettings.dataSharing}
                onToggle={() => toggleSetting('dataSharing')}
              />
              <PrivacySetting
                icon={<Lock className="w-5 h-5" />}
                title="匿名分析"
                description="允许收集匿名使用数据以改善应用体验"
                enabled={privacySettings.anonymousAnalytics}
                onToggle={() => toggleSetting('anonymousAnalytics')}
              />
              <PrivacySetting
                icon={<EyeOff className="w-5 h-5" />}
                title="第三方访问"
                description="允许经过验证的第三方应用访问您的数据"
                enabled={privacySettings.thirdPartyAccess}
                onToggle={() => toggleSetting('thirdPartyAccess')}
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
            <h2 className="text-xl font-semibold mb-4">数据管理</h2>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-5 h-5 mr-2" />
                下载我的数据
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                <Trash2 className="w-5 h-5 mr-2" />
                删除我的账户
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}

function PrivacySetting({ icon, title, description, enabled, onToggle }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="text-gray-500">{icon}</div>
        <div>
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
  )
}

