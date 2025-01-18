"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Delete } from 'lucide-react'

interface NumberPadProps {
  isOpen: boolean
  onClose: () => void
  onInput: (value: string) => void
  onDelete: () => void
  onConfirm: () => void
  onClear: () => void
}

export function NumberPad({ isOpen, onClose, onInput, onDelete, onConfirm, onClear }: NumberPadProps) {

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
          />
          
          {/* Number pad */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-16 left-0 right-0 bg-white/80 backdrop-blur-xl rounded-t-3xl z-50 pb-4 shadow-lg"
          >
            <div className="max-w-md mx-auto">
              <div className="grid grid-cols-3 gap-2 p-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0].map((num) => (
                  <button
                    key={num}
                    onClick={() => num === 'C' ? onClear() : onInput(num.toString())}
                    className="h-12 text-2xl font-medium rounded-2xl bg-white/50 hover:bg-white/80 active:bg-white/90 transition-colors"
                  >
                    {num === 'C' ? 'C' : num}
                  </button>
                ))}
                <button
                  onClick={onDelete}
                  className="h-12 flex items-center justify-center rounded-2xl bg-white/50 hover:bg-white/80 active:bg-white/90 transition-colors"
                >
                  <Delete className="w-6 h-6" />
                </button>
              </div>
              <div className="px-4 pb-2">
                <button
                  onClick={onConfirm}
                  className="w-full h-12 text-lg font-medium rounded-2xl bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 active:bg-blue-500/40 transition-colors"
                >
                  确认，下一步
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

