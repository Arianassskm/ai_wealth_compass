"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, PieChartIcon, BarChart3, Sparkles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts'

interface IncomeSource {
  name: string
  amount: number
  change: number
}

interface Expense {
  name: string
  amount: number
  change: number
}

interface DisposableIncomeAnalysisProps {
  disposableIncome: number
  totalIncome: number
  totalExpenses: number
  incomeSources: IncomeSource[]
  expenses: Expense[]
  onClose: () => void
}

const COLORS = ['#3B82F6', '#EF4444'];

export function DisposableIncomeAnalysis({
  disposableIncome,
  totalIncome,
  totalExpenses,
  incomeSources,
  expenses,
  onClose
}: DisposableIncomeAnalysisProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  const pieChartData = [
    { name: '总收入', value: totalIncome, color: COLORS[0] },
    { name: '总支出', value: totalExpenses, color: COLORS[1] },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded-lg shadow-lg border text-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-gray-600">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto"
    >
      <div className="min-h-screen py-4">
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 15, stiffness: 300 }}
          className="w-full max-w-[320px] mx-auto px-4"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl rounded-xl overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-blue-900">当月可支配金额分析</h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-blue-900">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <Card className="bg-white/80 p-4 rounded-xl">
                  <div className="text-center">
                    <p className="text-sm text-blue-800 mb-1">当月可支配金额</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(disposableIncome)}</p>
                    <p className="text-xs text-blue-500 mt-1">
                      占总收入的 {formatPercentage(disposableIncome / totalIncome)}
                    </p>
                  </div>
                </Card>

                <Card className="bg-white/80 p-4 rounded-xl">
                  <h3 className="text-sm font-semibold mb-2 text-blue-900 flex items-center">
                    <PieChartIcon className="mr-2 h-4 w-4" />
                    收支概览
                  </h3>
                  <div className="h-[180px] -mt-4 -mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={55}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color}
                              strokeWidth={1}
                            />
                          ))}
                        </Pie>
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          formatter={(value) => <span className="text-xs">{value}</span>}
                        />
                        <RechartsTooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="bg-white/80 p-4 rounded-xl">
                  <h3 className="text-sm font-semibold mb-3 text-blue-900 flex items-center">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    收入来源
                  </h3>
                  <div className="space-y-3">
                    {incomeSources.map((source, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-blue-800">{source.name}</span>
                          <div className="flex items-center">
                            <span className="text-xs font-medium mr-2 text-blue-900">
                              {formatCurrency(source.amount)}
                            </span>
                            <ChangeIndicator change={source.change} />
                          </div>
                        </div>
                        <Progress value={(source.amount / totalIncome) * 100} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="bg-white/80 p-4 rounded-xl">
                  <h3 className="text-sm font-semibold mb-3 text-blue-900 flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    主要支出
                  </h3>
                  <div className="space-y-3">
                    {expenses.map((expense, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-blue-800">{expense.name}</span>
                          <div className="flex items-center">
                            <span className="text-xs font-medium mr-2 text-blue-900">
                              {formatCurrency(expense.amount)}
                            </span>
                            <ChangeIndicator change={expense.change} />
                          </div>
                        </div>
                        <Progress value={(expense.amount / totalExpenses) * 100} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="bg-white/80 p-4 rounded-xl mt-4">
                  <h3 className="text-sm font-semibold mb-3 text-blue-900 flex items-center">
                    <Sparkles className="mr-2 h-4 w-4" />
                    财务建议
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-xs text-blue-800">
                    <li>尝试增加额外收入来源，如副业或投资</li>
                    <li>审查并优化固定支出，寻找可以节省的地方</li>
                    <li>设置自动储蓄，确保每月都能存下一定比例的收入</li>
                    <li>关注投资收益，适度增加风险投资以提高回报</li>
                  </ul>
                </Card>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

function ChangeIndicator({ change }: { change: number }) {
  const isPositive = change > 0
  const Icon = isPositive ? TrendingUp : TrendingDown
  const color = isPositive ? 'text-green-500' : 'text-red-500'

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Icon className={`h-3 w-3 ${color}`} />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{isPositive ? '增加' : '减少'} {Math.abs(change)}%</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

