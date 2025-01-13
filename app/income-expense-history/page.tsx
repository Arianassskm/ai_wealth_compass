"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChartComponent } from '@/components/line-chart'
import { EnhancedBackground } from '@/components/enhanced-background'

// Mock data for the chart
const monthlyData = [
  { date: "1月", income: 5000, expense: 4000 },
  { date: "2月", income: 5500, expense: 4200 },
  { date: "3月", income: 4800, expense: 4500 },
  { date: "4月", income: 6000, expense: 4800 },
  { date: "5月", income: 5800, expense: 5000 },
  { date: "6月", income: 6200, expense: 5200 },
]

export default function IncomeExpenseHistoryPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState('6months')

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <EnhancedBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="mr-3"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">收支趋势</h1>
          <Button variant="ghost" size="icon">
            <Download className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8">
        <Card className="p-6 backdrop-blur-xl bg-white/80 border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">历史收支趋势</h2>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择时间范围" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">近3个月</SelectItem>
                <SelectItem value="6months">近6个月</SelectItem>
                <SelectItem value="1year">近1年</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-64">
            <LineChartComponent
              data={monthlyData}
              lines={[
                { dataKey: "income", color: "#10B981", name: "收入" },
                { dataKey: "expense", color: "#EF4444", name: "支出" }
              ]}
            />
          </div>
        </Card>

        <Card className="p-6 backdrop-blur-xl bg-white/80 border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">详细数据</h3>
          <div className="space-y-4">
            {monthlyData.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                <span className="text-gray-600">{item.date}</span>
                <div className="flex space-x-4">
                  <span className="text-green-600">收入: ¥{item.income}</span>
                  <span className="text-red-600">支出: ¥{item.expense}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  )
}

