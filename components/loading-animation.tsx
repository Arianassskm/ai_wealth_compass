"use client"

import { motion } from "framer-motion"

interface LoadingAnimationProps {
  isLoading: boolean
}

export function LoadingAnimation({ isLoading }: LoadingAnimationProps) {
  if (!isLoading) return null

  // Animation variants for the cubes
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cubeVariants = {
    initial: { scale: 0 },
    animate: { 
      scale: [0, 1, 0],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="max-w-md w-full px-4">
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="grid grid-cols-3 gap-2 mb-4"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                className="w-4 h-4 bg-blue-500 rounded-sm"
                variants={cubeVariants}
              />
            ))}
          </motion.div>
          <p className="text-gray-600 font-medium">加载中...</p>
        </motion.div>
      </div>
    </div>
  )
}

