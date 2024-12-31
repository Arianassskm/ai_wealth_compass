"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Target, TrendingUp, PiggyBank, Home } from 'lucide-react'

interface TrophyAnimationProps {
  isVisible: boolean
  onClose: () => void
  title: string
  message: string
  icon: 'Trophy' | 'Target' | 'TrendingUp' | 'PiggyBank' | 'Home'
  iconColor: string
}

const iconComponents = {
  Trophy,
  Target,
  TrendingUp,
  PiggyBank,
  Home
}

export function TrophyAnimation({ isVisible, onClose, title, message, icon, iconColor }: TrophyAnimationProps) {
  const IconComponent = iconComponents[icon]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            className="bg-white rounded-lg p-8 text-center max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
            >
              <IconComponent className={`w-24 h-24 ${iconColor} mx-auto mb-4`} />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-lg mb-4">{message}</p>
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              关闭
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

