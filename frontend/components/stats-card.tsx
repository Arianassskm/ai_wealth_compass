import { Card } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from 'lucide-react'

interface StatsCardProps {
  title: string
  amount: number
  percentageChange: number
  trend: "up" | "down"
  color: string
  bgColor: string
}

export function StatsCard({ title, amount, percentageChange, trend, color, bgColor }: StatsCardProps) {
  return (
    <Card className={`${bgColor} p-6 transition-all hover:scale-[1.02]`}>
      <div className="flex flex-col space-y-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="flex items-baseline justify-between">
          <p className={`text-2xl font-bold ${color}`}>
            ¥{amount.toLocaleString()}
          </p>
          <div className={`flex items-center space-x-1 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            {trend === "up" ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{percentageChange}%</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

