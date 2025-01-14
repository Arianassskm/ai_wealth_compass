"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface LabelSheetProps {
  isOpen: boolean
  onClose: () => void
  amount: string
  onComplete: (label: string, type: string) => void
}

export function LabelSheet({ isOpen, onClose, amount, onComplete }: LabelSheetProps) {
  const [selectedType, setSelectedType] = useState('')
  const [label, setLabel] = useState('')
  const [canClose, setCanClose] = useState(false)

  const handleComplete = () => {
    if (selectedType && label.trim()) {
      onComplete(label, selectedType)
      setSelectedType('')
      setLabel('')
      setCanClose(false)
      onClose()
    }
  }

  const presetTypes = [
    { id: 'medical', label: '意外医疗' },
    { id: 'social', label: '人情送礼' },
    { id: 'impulse', label: '冲动购物' },
    { id: 'education', label: '学习提升' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => canClose && onClose()}
          />
          
          {/* Label Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-16 left-0 right-0 bg-white/80 backdrop-blur-xl rounded-t-3xl z-50 shadow-lg max-h-[calc(100vh-4rem)]"
          >
            <div className="max-w-md mx-auto p-4 overflow-y-auto">
              {/* Preset Types */}
              <div className="flex flex-wrap gap-2 mb-4">
                {presetTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type.id)
                      setCanClose(!!label.trim())
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                      ${selectedType === type.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-100/50 text-blue-600 hover:bg-blue-100'
                      }`}
                  >
                    {type.label}
                  </button>
                ))}
                <button className="p-1 rounded-full bg-gray-100/50 hover:bg-gray-100">
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Label Input */}
              <div className="mb-4">
                <h2 className="text-lg font-bold mb-2">支出描述</h2>
                <Input
                  type="text"
                  value={label}
                  onChange={(e) => {
                    setLabel(e.target.value)
                    setCanClose(!!selectedType && e.target.value.trim() !== '')
                  }}
                  placeholder="详细说明"
                  className="w-full p-2 bg-transparent border-none text-lg focus:ring-0 focus:outline-none placeholder-gray-400"
                />
              </div>

              {/* Complete Button */}
              <Button
                onClick={handleComplete}
                disabled={!selectedType || !label.trim()}
                className="w-full h-12 text-lg font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                完成
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

