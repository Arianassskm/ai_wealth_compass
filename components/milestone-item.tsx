import { Trophy, Target, TrendingUp, PiggyBank, Home } from 'lucide-react'

interface MilestoneItemProps {
  icon: 'Trophy' | 'Target' | 'TrendingUp' | 'PiggyBank' | 'Home'
  iconBg: string
  iconColor: string
  title: string
  message: string
  onClick: () => void
}

const iconComponents = {
  Trophy,
  Target,
  TrendingUp,
  PiggyBank,
  Home
}

export function MilestoneItem({ 
  icon, 
  iconBg, 
  iconColor,
  title, 
  message,
  onClick
}: MilestoneItemProps) {
  const IconComponent = iconComponents[icon]

  return (
    <div 
      className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
      onClick={onClick}
    >
      <div className={`${iconBg} ${iconColor} p-2 rounded-full`}>
        <IconComponent className="w-5 h-5" />
      </div>
      <div>
        <h3 className={`font-semibold text-gray-800`}>{title}</h3>
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  )
}

