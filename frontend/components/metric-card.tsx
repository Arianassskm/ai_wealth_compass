import { Card } from "@/components/ui/card"
import { ArrowUp, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

interface MetricCardProps {
  title: string
  amount: number
  subtitle: string
  trend: number
  textColor?: string
  onClick?: () => void
  actionText?: string
}

export function MetricCard({
  title,
  amount,
  subtitle,
  trend,
  textColor = "text-gray-900",
  onClick,
  actionText = "查看详情"
}: MetricCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md cursor-pointer"
    >
      <motion.div
        whileHover={{ scale: 1.02, translateY: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="overflow-hidden relative backdrop-blur-xl bg-white/80 border-gray-200 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          <div className="relative p-6 space-y-2">
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            <div className="flex items-baseline justify-between">
              <p className={`text-2xl font-bold ${textColor}`}>
                {amount.toString().startsWith('¥') ? amount : `¥${amount}`}
              </p>
              {trend && (
                <div className="flex items-center space-x-1 text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{trend}%</span>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">{subtitle}</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                {actionText} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-16 translate-x-16" />
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

