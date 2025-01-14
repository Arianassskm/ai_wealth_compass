import { Grid, ArrowRight, User, Home, LayoutGrid } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export function BottomNav({ activePage }: { activePage: 'home' | 'decisions' | 'square' | 'profile' }) {
  const router = useRouter()

  return (
    <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/80 border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-xl mx-auto px-4 py-2 flex justify-around">
        <NavButton
          icon={Home}
          label="主页"
          isActive={activePage === 'home'}
          onClick={() => router.push('/')}
        />
        <NavButton
          icon={ArrowRight}
          label="决策"
          isActive={activePage === 'decisions'}
          onClick={() => router.push('/decisions')}
        />
        <NavButton
          icon={LayoutGrid}
          label="广场"
          isActive={activePage === 'square'}
          onClick={() => router.push('/square')}
        />
        <NavButton
          icon={User}
          label="我的"
          isActive={activePage === 'profile'}
          onClick={() => router.push('/profile')}
        />
      </div>
    </nav>
  )
}

function NavButton({ icon: Icon, label, isActive, onClick }: {
  icon: typeof Grid
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <motion.button 
      className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs mt-1 font-medium">{label}</span>
    </motion.button>
  )
}

