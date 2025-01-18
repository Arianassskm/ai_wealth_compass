"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { LoadingAnimation } from "@/components/loading-animation"

interface InstallmentDropdownProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (value: number, unit: 'month' | 'year') => void
}

const shortTermOptions = [3, 6, 9, 12, 24, 36]
const longTermOptions = [2, 3, 5, 10, 15, 20, 30]

export function InstallmentDropdown({ isOpen, onClose, onSelect }: InstallmentDropdownProps) {
  const [customValue, setCustomValue] = useState('')
  const [customUnit, setCustomUnit] = useState<'month' | 'year'>('month')
  const [isLongTerm, setIsLongTerm] = useState(false)
  const [selectedInstallment, setSelectedInstallment] = useState<{ value: number; unit: 'month' | 'year' } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const handleSelect = (value: number) => {
    setSelectedInstallment({ value, unit: isLongTerm ? 'year' : 'month' })
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = parseInt(customValue, 10)
    if (!isNaN(value) && value > 0) {
      setSelectedInstallment({ value, unit: customUnit })
    }
  }

  const handleConfirm = async () => {
    if (selectedInstallment) {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 2000))
      onSelect(selectedInstallment.value, selectedInstallment.unit)
      setIsLoading(false)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <motion.div
            ref={dropdownRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-6 w-full max-w-md mx-4"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">选择分期方式</h2>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-center space-x-4">
                <Button
                  variant={isLongTerm ? "outline" : "default"}
                  onClick={() => setIsLongTerm(false)}
                  className="w-24"
                >
                  短期
                </Button>
                <Button
                  variant={isLongTerm ? "default" : "outline"}
                  onClick={() => setIsLongTerm(true)}
                  className="w-24"
                >
                  长期
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(isLongTerm ? longTermOptions : shortTermOptions).map((option) => (
                  <Button
                    key={option}
                    variant={selectedInstallment?.value === option && selectedInstallment?.unit === (isLongTerm ? 'year' : 'month') ? "default" : "outline"}
                    onClick={() => handleSelect(option)}
                    className="py-2 px-4 bg-white bg-opacity-50 hover:bg-opacity-100 transition-all duration-200"
                  >
                    {option}{isLongTerm ? '年' : '期'}
                  </Button>
                ))}
              </div>
              <form onSubmit={handleCustomSubmit} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    placeholder="自定义"
                    className="flex-grow bg-white bg-opacity-50"
                  />
                  <RadioGroup defaultValue="month" onValueChange={(value) => setCustomUnit(value as 'month' | 'year')} className="flex space-x-4">
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="month" id="month" />
                      <Label htmlFor="month">月</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="year" id="year" />
                      <Label htmlFor="year">年</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button type="submit" className="w-full">
                  确定自定义
                </Button>
              </form>
              {selectedInstallment && (
                <div className="text-center">
                  <p className="text-lg font-semibold">已选择：{selectedInstallment.value} {selectedInstallment.unit === 'month' ? '期' : '年'}</p>
                  <Button onClick={handleConfirm} className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white" disabled={isLoading}>
                    {isLoading ? '处理中...' : '确认选择'}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
          <LoadingAnimation isLoading={isLoading} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

