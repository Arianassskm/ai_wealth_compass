"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { MessageCircle } from 'lucide-react'

export function FloatingAssistant({ showOnDecisionsPageOnly = false }: { showOnDecisionsPageOnly?: boolean }) {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (showOnDecisionsPageOnly) {
      // Only show on the decisions page
      setIsVisible(router.pathname === '/decisions')
    } else {
      // Show on all pages after a delay
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [router.pathname, showOnDecisionsPageOnly])

  const handleClick = () => {
    router.push('/ai-assistant')
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClick}
        >
          <div className="bg-blue-500 text-white rounded-full p-3 shadow-lg cursor-pointer">
            <MessageCircle size={24} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

