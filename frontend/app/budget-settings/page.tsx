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
import { config } from '@/config'
import { useAuthContext } from '@/providers/auth-provider'
import { fetchApi } from '@/lib/api'

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
  const { token } = useAuthContext()
  const [totalBudget, setTotalBudget] = useState(5000)
  const [categories, setCategories] = useState([
    { name: '生活必需品', percentage: 50, color: 'rgb(255, 99, 132)', amount: 0 },
    { name: '娱乐', percentage: 20, color: 'rgb(54, 162, 235)', amount: 0 },
    { name: '储蓄', percentage: 20, color: 'rgb(255, 206, 86)', amount: 0 },
    { name: '其他', percentage: 10, color: 'rgb(75, 192, 192)', amount: 0 },
  ])

  useEffect(() => {
    const fetchAIEstimation = async () => {
      try {
        const response = await fetchApi<{
          ai_evaluation_details: {
            budget_settings?: {
              total_budget: number;
              categories: Array<{
                name: string;
                percentage: number;
                color: string;
              }>;
            };
          };
        }>(config.apiEndpoints.user.profile, {
          token
        });

        // 添加调试日志
        console.log('API Response:', response?.data?.ai_evaluation_details?.budget_settings);
        
        const budgetSettings = response?.data?.ai_evaluation_details?.budget_settings;
        if (budgetSettings) {
          setTotalBudget(budgetSettings.total_budget);
          if (Array.isArray(budgetSettings.categories) && budgetSettings.categories.length > 0) {
            setCategories(budgetSettings.categories);
          }
        }
      } catch (error) {
        console.error('Error fetching AI estimation:', error);
        toast({
          title: "获取预算数据失败",
          description: "无法加载您的预算设置，请稍后重试",
          variant: "destructive"
        });
      }
    };

    fetchAIEstimation();
  }, [token]);

  const handlePercentageChange = (index: number, newPercentage: number) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = {
      ...updatedCategories[index],
      percentage: newPercentage,
      // 计算并更新 amount
      amount: Math.round(totalBudget * newPercentage / 100)
    };

    // 重新计算其他类别的百分比和金额
    const remainingPercentage = 100 - newPercentage;
    const otherCategories = updatedCategories.filter((_, i) => i !== index);
    const totalOtherPercentage = otherCategories.reduce((sum, cat) => sum + cat.percentage, 0);

    if (totalOtherPercentage > 0) {
      otherCategories.forEach((cat) => {
        const adjustedPercentage = (cat.percentage / totalOtherPercentage) * remainingPercentage;
        cat.percentage = adjustedPercentage;
        // 同时更新其他类别的 amount
        cat.amount = Math.round(totalBudget * adjustedPercentage / 100);
      });
    }

    setCategories(updatedCategories);
  };

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
      interface BudgetResponse {
        message: string;
        success: boolean;
      }
      console.log(categories)
      const response = await fetchApi<BudgetResponse>(
        config.apiEndpoints.user.calibrateBudget,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          token,
          body: JSON.stringify({
            total_budget: totalBudget,
            categories: categories
          }),
        }
      );

      if (!response.success) {
        throw new Error('预算设置失败');
      }

      toast({
        title: "预算已保存",
        description: "您的预算设置已成功保存，系统将基于这些数据为您提供更准确的建议。",
      });

      router.push('/');
    } catch (error) {
      console.error('Save budget error:', error);
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

