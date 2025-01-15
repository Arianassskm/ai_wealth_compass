import { TypeIcon as type, type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface CategoryCardProps {
  icon: LucideIcon
  title: string
  color: string
  onClick: () => void
}

export function CategoryCard({ icon: Icon, title, color, onClick }: CategoryCardProps) {
  return (
    <motion.div
      className="w-24 h-24 bg-white/80 backdrop-blur-xl rounded-xl flex flex-col items-center justify-center p-2 shadow-lg border border-gray-200 cursor-pointer"
      onClick={onClick}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 0 15px rgba(59, 130, 246, 0.2)"
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className={`w-8 h-8 mb-2 ${color}`} />
      <span className="text-xs text-gray-700 text-center font-medium">{title}</span>
    </motion.div>
  )
}

