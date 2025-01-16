"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Laptop, Headphones, Radio, Music, Disc, Smartphone, MonitorSmartphone, Save, MoreHorizontal, ArrowLeft } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useOnboarding } from '@/contexts/onboarding-context'
import Avatar from 'boring-avatars'

const ageGroups = [
  { value: '10后', label: '10后', icon: Headphones, description: '2010年后出生' },
  { value: '05后', label: '05后', icon: Smartphone, description: '2005年后出生' },
  { value: '00后', label: '00后', icon: MonitorSmartphone, description: '2000年后出生' },
  { value: '95后', label: '95后', icon: Save, description: '1995年后出生' },
  { value: '90后', label: '90后', icon: Laptop, description: '1990年后出生' },
  { value: '85后', label: '85后', icon: Disc, description: '1985年后出生' },
  { value: '80后', label: '80后', icon: Save, description: '1980年后出生' },
  { value: '75后', label: '75后', icon: Music, description: '1975年后出生' },
  { value: '70后', label: '70后', icon: Radio, description: '1970年后出生' },
  { value: '65后', label: '65后', icon: Radio, description: '1965年后出生' },
  { value: '60后', label: '60后', icon: Disc, description: '1960年后出生' },
  { value: 'more', label: '更多', icon: MoreHorizontal, description: '查看更多年龄段' },
]

const additionalAgeGroups = [
  { value: '25后', label: '25后', description: '2025年后出生' },
  { value: '20后', label: '20后', description: '2020年后出生' },
  { value: '15后', label: '15后', description: '2015年后出生' },
  { value: '55后', label: '55后', description: '1955年后出生' },
  { value: '50后', label: '50后', description: '1950年后出生' },
  { value: '45后', label: '45后', description: '1945年后出生' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { data, updateData } = useOnboarding()
  const [selectedAge, setSelectedAge] = useState<string>('')
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null)
  const [showSkipDialog, setShowSkipDialog] = useState(false)
  const [showMoreAges, setShowMoreAges] = useState(false)
  const [showAdditionalAges, setShowAdditionalAges] = useState(false)

  const handleNext = () => {

    if (selectedAge && selectedGender) {
      updateData({
        age_group: selectedAge,
        gender: selectedGender,
      })
      router.push('/onboarding/step2')
    }
  }

  const handleSkip = () => {
    setShowSkipDialog(true)
  }

  const handleConfirmSkip = () => {
    router.push('/')
  }

  const handleAgeSelect = (value: string) => {
    if (value === 'more') {
      setShowAdditionalAges(!showAdditionalAges)
    } else {
      setSelectedAge(value)
      setShowAdditionalAges(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100 via-blue-100 to-blue-50 opacity-70"></div>
      
      <div className="max-w-md mx-auto px-4 py-8">
        <header className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="mr-3"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">开启智能财富决策人生</h1>
            <p className="text-sm text-gray-500">请选择您的年龄和性别</p>
          </div>
          <Button variant="ghost" className="text-gray-500" onClick={handleSkip}>
            跳过
          </Button>
        </header>

        <Card className="p-6 backdrop-blur-xl bg-white/80 border-gray-200">
          <div className="space-y-6">
            {/* Age Selection */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">选择年龄段</h2>
              <div className="grid grid-cols-4 gap-3">
                {ageGroups.map((age) => {
                  const Icon = age.icon
                  return (
                    <motion.button
                      key={age.value}
                      onClick={() => handleAgeSelect(age.value)}
                      className={`relative aspect-square rounded-xl p-2 flex flex-col items-center justify-center gap-1 ${
                        selectedAge === age.value
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-white border border-gray-200 hover:border-blue-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className={`w-6 h-6 ${
                        selectedAge === age.value ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                      <span className={`text-xs font-medium ${
                        selectedAge === age.value ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {age.label}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
              {showAdditionalAges && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 grid grid-cols-3 gap-3"
                >
                  {additionalAgeGroups.map((age) => (
                    <motion.button
                      key={age.value}
                      onClick={() => handleAgeSelect(age.value)}
                      className={`p-2 rounded-xl flex flex-col items-center justify-center ${
                        selectedAge === age.value
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-white border border-gray-200 hover:border-blue-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className={`text-xs font-medium ${
                        selectedAge === age.value ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {age.label}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">{age.description}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Gender Selection */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">选择性别</h2>
              <div className="flex gap-4">
                <motion.button
                  onClick={() => setSelectedGender('male')}
                  className={`flex-1 aspect-[4/3] rounded-xl p-4 flex flex-col items-center justify-center gap-2 ${
                    selectedGender === 'male'
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-white border border-gray-200 hover:border-blue-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-12 h-12">
                    <Avatar
                      size={48}
                      name="male-professional"
                      variant="bauhaus"
                      colors={[
                        "#0A2463",
                        "#247BA0",
                        "#3B8EA5",
                        "#5C6B73",
                        "#E8F1F2"
                      ]}
                    />
                  </div>
                  <span className={`text-sm font-medium ${
                    selectedGender === 'male' ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    男
                  </span>
                </motion.button>

                <motion.button
                  onClick={() => setSelectedGender('female')}
                  className={`flex-1 aspect-[4/3] rounded-xl p-4 flex flex-col items-center justify-center gap-2 ${
                    selectedGender === 'female'
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-white border border-gray-200 hover:border-blue-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-12 h-12">
                    <Avatar
                      size={48}
                      name="female-professional"
                      variant="bauhaus"
                      colors={[
                        "#9B2C2C",
                        "#D53F8C",
                        "#ED64A6",
                        "#B83280",
                        "#FFF5F7"
                      ]}
                    />
                  </div>
                  <span className={`text-sm font-medium ${
                    selectedGender === 'female' ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    女
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Next Button */}
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              size="lg"
              disabled={!selectedAge || !selectedGender}
              onClick={handleNext}
            >
              下一步
            </Button>
          </div>
        </Card>
      </div>

      {/* Skip Dialog */}
      <AlertDialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认跳过</AlertDialogTitle>
            <AlertDialogDescription>
              如果跳过，我们将无法提供准确的财富决策策略，您也将无法获得新人福利。确定要跳过吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSkip}>确认跳过</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* More Ages Dialog */}
      <Dialog open={showMoreAges} onOpenChange={setShowMoreAges}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>选择更多年龄段</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {additionalAgeGroups.map((age) => (
              <motion.button
                key={age.value}
                onClick={() => {
                  setSelectedAge(age.value)
                  setShowMoreAges(false)
                }}
                className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 bg-white text-left transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-medium text-gray-900">{age.label}</div>
                <div className="text-sm text-gray-500">{age.description}</div>
              </motion.button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

