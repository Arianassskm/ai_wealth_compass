"use client"

import React, { useState, useEffect } from 'react'
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, MinusCircle, Save, ArrowLeft } from 'lucide-react'
import { AssistantLayout } from '@/components/assistant-layout'
import { motion } from 'framer-motion'
import { toast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'

const CircularProgress = ({ percentage, color }: { percentage: number; color: string }) => (
  <div className="relative w-20 h-20">
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <circle
        className="text-gray-200 stroke-current"
        strokeWidth="10"
        cx="50"
        cy="50"
        r="40"
        fill="transparent"
      ></circle>
      <circle
        className="stroke-current"
        strokeWidth="10"
        strokeLinecap="round"
        cx="50"
        cy="50"
        r="40"
        fill="transparent"
        strokeDasharray={`${percentage * 2.51327}, 251.327`}
        strokeDashoffset="0"
        style={{ color }}
      ></circle>
    </svg>
    <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
      {percentage.toFixed(1)}%
    </span>
  </div>
)

export default function BudgetSettingsPage() {
  const router = useRouter()
  const [totalBudget, setTotalBudget] = useState(5000)
  const [categories, setCategories] = useState([
    { name: '生活必需品', percentage: 50, color: 'rgb(255, 99, 132)' },
    { name: '娱乐', percentage: 20, color: 'rgb(54, 162, 235)' },
    { name: '储蓄', percentage: 20, color: 'rgb(255, 206, 86)' },
    { name: '其他', percentage: 10, color: 'rgb(75, 192, 192)' },
  ])

  useEffect(() => {
    const fetchAIEstimation = async () => {
      try {
        const response = await fetch('/api/v1/user/profile')
        const data = await response.json()
        
        if (data.ai_evaluation_details?.budget_settings) {
          setTotalBudget(data.ai_evaluation_details.budget_settings.total_budget)
          setCategories(data.ai_evaluation_details.budget_settings.categories)
        }
      } catch (error) {
        console.error('Error fetching AI estimation:', error)
      }
    }

    fetchAIEstimation()
  }, [])

  const handlePercentageChange = (index: number, newValue: number) => {
    const newCategories = [...categories]
    const oldValue = newCategories[index].percentage
    const diff = newValue - oldValue

    // Adjust other categories
    for (let i = 0; i < newCategories.length; i++) {
      if (i !== index) {
        newCategories[i].percentage -= diff / (newCategories.length - 1)
      }
    }

    newCategories[index].percentage = newValue
    setCategories(newCategories)
  }

  const addCategory = () => {
    const newCategory = { 
      name: '新类别', 
      percentage: 0, 
      color: `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`
    }
    setCategories([...categories, newCategory])
  }

  const removeCategory = (index: number) => {
    const newCategories = categories.filter((_, i) => i !== index)
    const removedPercentage = categories[index].percentage
    const remainingCategories = newCategories.length
    
    newCategories.forEach(category => {
      category.percentage += removedPercentage / remainingCategories
    })

    setCategories(newCategories)
  }

  const saveBudget = async () => {
    try {
      const response = await fetch('/api/v1/user/calibrate/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          total_budget: totalBudget,
          categories: categories
        }),
      });
      
      if (!response.ok) throw new Error('Failed to save budget');
      
      toast({
        title: "预算已保存",
        description: "您的预算设置已成功保存，系统将基于这些数据为您提供更准确的建议。",
      });
      
      router.push('/');
    } catch (error) {
      toast({
        title: "保存失败",
        description: "保存预算时出现错误，请稍后重试。",
        variant: "destructive"
      });
    }
  };

  return (
    <AssistantLayout
      title="预算设置"
      description="设置和管理您的月度预算"
      avatarSrc="/placeholder.svg"
      onBack={() => router.push('/')}
      sections={[
        {
          id: 'total-budget',
          title: '总预算',
          content: (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="text-2xl font-bold"
              />
              <p className="text-sm text-gray-500">设置您的月度总预算</p>
            </motion.div>
          ),
          defaultOpen: true,
        },
        {
          id: 'budget-allocation',
          title: '预算分配',
          content: (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {categories.map((category, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <CircularProgress percentage={category.percentage} color={category.color} />
                    <span className="mt-2 text-sm font-medium">{category.name}</span>
                  </div>
                ))}
              </div>
              {categories.map((category, index) => (
                <motion.div 
                  key={index} 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-gray-500">
                      ¥{Math.round(totalBudget * category.percentage / 100)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Slider
                      value={[category.percentage]}
                      onValueChange={(value) => handlePercentageChange(index, value[0])}
                      max={100}
                      step={1}
                    />
                    <span className="w-12 text-right">{category.percentage.toFixed(1)}%</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCategory(index)}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
              <Button onClick={addCategory} className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                添加新类别
              </Button>
            </motion.div>
          ),
          defaultOpen: true,
        },
      ]}
    >
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Button className="w-full" onClick={() => {
          saveBudget();
          router.push('/');
        }}>
          <Save className="h-4 w-4 mr-2" />
          保存预算设置
        </Button>
      </motion.div>
    </AssistantLayout>
  )
}

