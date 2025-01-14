"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

interface CompletionAnimationProps {
  isVisible: boolean
  onClose: () => void
}

export function CompletionAnimation({ isVisible, onClose }: CompletionAnimationProps) {
  const router = useRouter()

  const handleClose = () => {
    onClose()
    router.push('/')
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-500/90 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-xs sm:max-w-sm bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center"
          >
            {/* Floating elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="w-full h-full"
              >
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{
                      x: Math.random() * 400 - 200,
                      y: Math.random() * 400 - 200,
                    }}
                    animate={{
                      x: Math.random() * 400 - 200,
                      y: Math.random() * 400 - 200,
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: Math.random() * 2,
                    }}
                  >
                    <div className={`
                      w-3 h-3 rounded-full
                      ${['bg-yellow-400', 'bg-blue-400', 'bg-green-400', 'bg-red-400'][i % 4]}
                    `} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Main content */}
            <div className="relative">
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6"
              >
                <Image
                  src="/mascot-ale.png"
                  alt="ALE AI Assistant"
                  width={128}
                  height={128}
                  className="w-full h-full object-contain"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-2">恭喜！信息收集完成</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                  我们将为您提供更精准的财富建议
                </p>

                <div className="flex justify-center space-x-4 mb-4 sm:mb-6">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-orange-500">800次</div>
                    <div className="text-xs sm:text-sm text-gray-500">私董会权利</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-orange-500">1800w</div>
                    <div className="text-xs sm:text-sm text-gray-500">新手体验token</div>
                  </div>
                </div>

                <div className="flex items-center justify-center text-xs sm:text-sm text-blue-600 mb-4 sm:mb-6">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  已预约每日提醒
                </div>

                <Button
                  onClick={handleClose}
                  className="w-full h-9 sm:h-10 text-sm sm:text-base bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                >
                  开始探索
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

