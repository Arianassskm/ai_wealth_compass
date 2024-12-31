"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AssistantLayout } from '@/components/assistant-layout'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, BarChart2, FileText, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function InvestmentPortfolioPage() {
  const router = useRouter();
  const [investments, setInvestments] = useState([
    { name: '股票', value: 50000, return: 8.5, risk: 'high' },
    { name: '债券', value: 30000, return: 3.2, risk: 'low' },
    { name: '基金', value: 20000, return: 6.7, risk: 'medium' },
    { name: '房地产', value: 100000, return: 5.5, risk: 'medium' },
  ])

  const totalValue = investments.reduce((sum, inv) => sum + inv.value, 0)

  const chartData = investments.map(inv => ({
    name: inv.name,
    value: inv.value
  }))

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'high': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <AssistantLayout
      title="投资组合"
      description="查看和管理您的投资组合"
      avatarSrc="/placeholder.svg"
      sections={[
        {
          id: 'portfolio-overview',
          title: '组合概览',
          content: (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="aspect-square max-w-md mx-auto">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">总投资价值</p>
                <motion.p 
                  className="text-3xl font-bold text-green-600"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  ¥{totalValue.toLocaleString()}
                </motion.p>
              </div>
            </motion.div>
          ),
          defaultOpen: true,
        },
        {
          id: 'investment-details',
          title: '投资详情',
          content: (
            <div className="space-y-6">
              {investments.map((investment, index) => (
                <motion.div 
                  key={index} 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{investment.name}</span>
                    <span className="text-green-600 font-medium">¥{investment.value.toLocaleString()}</span>
                  </div>
                  <Progress value={investment.value / totalValue * 100} className="h-2" />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      {investment.return >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      回报率: {investment.return}%
                    </span>
                    <span className={`px-2 py-1 rounded-full text-white ${getRiskColor(investment.risk)}`}>
                      {investment.risk === 'low' ? '低' : investment.risk === 'medium' ? '中' : '高'}风险
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ),
          defaultOpen: true,
        },
      ]}
    >
      <motion.div 
        className="mt-8 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Button className="w-full">
          <BarChart2 className="h-4 w-4 mr-2" />
          调整投资组合
        </Button>
        <Button variant="outline" className="w-full">
          <FileText className="h-4 w-4 mr-2" />
          查看详细报告
        </Button>
        <Button variant="secondary" className="w-full" onClick={() => router.push('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回主页
        </Button>
      </motion.div>
    </AssistantLayout>
  )
}

