"use client"

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronDown, ChevronUp } from 'lucide-react'

interface BudgetThreshold {
  color: string;
  amount: number;
  label: string;
}

interface Subcategory {
  name: string;
  amount: number;
}

interface ProgressCircleProps {
  title: string
  percentage: number
  amount: number
  total: number
  color: string
  thresholds: BudgetThreshold[]
  subcategories: Subcategory[]
  disposableIncome: number
  onExpand: (isExpanded: boolean) => void
  showPercentageBreakdown?: boolean
}

const BUDGET_PERCENTAGES = {
  '生活必需品': 40,
  '娱乐社交': 20,
  '储蓄投资': 30,
  '其他支出': 10
} as const;

export function ProgressCircle({ 
  title, 
  percentage, 
  amount, 
  total, 
  color,
  thresholds,
  subcategories,
  disposableIncome,
  onExpand,
  showPercentageBreakdown = true
}: ProgressCircleProps) {
  console.log('ProgressCircle props:', {
    title,
    subcategories,
    disposableIncome
  });

  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const radius = 24
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  // Handle clicks outside to close the expanded panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
        onExpand(false)
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded, onExpand])

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newExpandedState = !isExpanded
    setIsExpanded(newExpandedState)
    onExpand(newExpandedState)
  }

  const formatSubcategoryText = (subcategory: Subcategory) => {
    const percentageMap: { [key: string]: number } = {
      '生活必需品': 40,
      '娱乐社交': 20,
      '储蓄投资': 30,
      '其他支出': 10
    };
    
    const percentage = percentageMap[subcategory.name] || 0;
    return `${subcategory.name}：${disposableIncome}×(${percentage}%)`;
  };

  const totalAmount = useMemo(() => {
    return Object.values(BUDGET_PERCENTAGES).reduce((total, percentage) => {
      return total + (disposableIncome * percentage / 100);
    }, 0);
  }, [disposableIncome]);

  // 根据 title 创建对应的 subcategory
  const currentCategory = useMemo(() => {
    const titleToNameMap: { [key: string]: string } = {
      '生活必需品': '生活必需品',
      '娱乐': '娱乐社交',
      '储蓄': '储蓄投资',
      '其他': '其他支出'
    };
    
    const categoryName = titleToNameMap[title] || title;
    const percentage = BUDGET_PERCENTAGES[categoryName as keyof typeof BUDGET_PERCENTAGES] || 0;
    const calculatedAmount = Math.floor(disposableIncome * percentage / 100);
    
    return {
      name: categoryName,
      amount: total,
      calculatedAmount,
      percentage
    };
  }, [title, disposableIncome, total]);

  // 渲染当前类别的预算分配
  const renderCategory = (
    <div className="text-center">
     
      <div className="text-xs text-blue-600">
        ¥{currentCategory.calculatedAmount.toLocaleString('ja-JP')} / ¥{Math.floor(total).toLocaleString('ja-JP')}
      </div>
    </div>
  );

  return (
    <div className="relative" ref={containerRef}>
      <Card 
        className={`overflow-hidden bg-white/70 backdrop-blur-md border border-blue-100 transition-all duration-300 cursor-pointer
          ${isExpanded ? 'shadow-2xl ring-2 ring-blue-200 scale-105 relative z-50' : 'shadow-lg hover:shadow-xl'}`}
        onClick={toggleExpand}
      >
        <CardContent className="p-2">
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 mb-2">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-blue-100"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="32"
                  cy="32"
                />
                <motion.circle
                  className={color}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="32"
                  cy="32"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-sm font-bold text-blue-900">{percentage}%</span>
              </div>
            </div>
            <h3 className="font-medium text-xs text-center mb-1 text-blue-900">{title}</h3>
            
            {/* 显示当前类别的预算分配 */}
            <div className="w-full space-y-1">
              {renderCategory}
            </div>

            {isExpanded ? (
              <ChevronUp className="w-4 h-4 mt-1 text-blue-500" />
            ) : (
              <ChevronDown className="w-4 h-4 mt-1 text-blue-500" />
            )}
          </div>
        </CardContent>
      </Card>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed left-4 right-4 z-[60] mt-1 max-w-xl mx-auto"
            style={{
              top: containerRef.current 
                ? containerRef.current.getBoundingClientRect().bottom + window.scrollY 
                : 'auto'
            }}
          >
            <Card className="overflow-hidden bg-white/95 backdrop-blur-xl border border-blue-100 shadow-2xl">
              <div 
                className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-blue-100"
                style={{ zIndex: -1 }}
              />
              <CardContent className="p-4">
                <h4 className="font-semibold text-sm mb-2 text-blue-900">预算阈值</h4>
                {thresholds.map((threshold, index) => (
                  <div key={index} className="flex justify-between items-center mb-1">
                    <span className="text-xs text-blue-800">{threshold.label}</span>
                    <span className={`text-xs font-medium ${threshold.color}`}>
                      ¥{threshold.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                
                <h4 className="font-semibold text-sm mt-4 mb-2 text-blue-900">子类别</h4>
                {subcategories.map((subcategory, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-blue-800">{subcategory.name}</span>
                      <span className="text-xs font-medium text-blue-900">
                        ¥{subcategory.amount.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={(subcategory.amount / total) * 100} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to prevent interaction with background content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => {
              setIsExpanded(false)
              onExpand(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

