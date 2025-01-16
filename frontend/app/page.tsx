"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Grid, ArrowRight, User, LogOut } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { LineChartComponent } from '@/components/line-chart'
import { ProgressCircle } from '@/components/progress-circle'
import { MilestoneItem } from '@/components/milestone-item'
import { TrophyAnimation } from '@/components/trophy-animation'
import { MetricCard } from '@/components/metric-card'
import { EnhancedBackground } from '@/components/enhanced-background'
import { QuickDashboard } from '@/components/quick-dashboard'
import { motion, AnimatePresence } from 'framer-motion'
import { BottomNav } from "@/components/bottom-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { DisposableIncomeAnalysis } from "@/components/disposable-income-analysis"
import { useFinanceData } from '@/hooks/useFinanceData'
import { toast } from 'sonner'
import { useAuthContext } from '@/providers/auth-provider'
import { useProfile } from '@/hooks/useProfile'

type Threshold = {
  color: string;
  amount: number;
  label: string;
}

type Subcategory = {
  name: string;
  amount: number;
}

type BudgetCategory = {
  title: string;
  percentage: number;
  amount: number;
  total: number;
  color: string;
  thresholds: Threshold[];
  subcategories: Subcategory[];
}

const monthlyData = [
  { date: "1月", value: 2400 },
  { date: "2月", value: 1398 },
  { date: "3月", value: 9800 },
  { date: "4月", value: 3908 },
  { date: "5月", value: 4800 },
  { date: "6月", value: 3800 },
  { date: "7月", value: 4300 },
]

export default function HomePage() {
  const router = useRouter()
  const [showTrophy, setShowTrophy] = useState(false)
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [isDashboardOpen, setIsDashboardOpen] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [showBottomNav, setShowBottomNav] = useState(true)
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null)
  const { token } = useAuthContext()
  const { financeData, loading, error } = useFinanceData()
  const { profileData, loading: profileLoading } = useProfile()
  
  const disposableIncome = ((financeData?.basic_salary || 0) - (financeData?.necessary_expenses || 0)) || 0
  const growthRate = financeData?.disposable_income.growth || 0
  const lastMonthAmount = financeData?.disposable_income.last || 0

  const handleAIButtonClick = () => {
    router.push('/decisions')
  }

  const handleMilestoneClick = (milestone: any) => {
    setSelectedMilestone(milestone)
    setShowTrophy(true)
  }

  const handleShowAnalysis = () => {
    if (!token) {
      toast.error('请先登录后查看详细分析', {
        action: {
          label: '去登录',
          onClick: () => router.push('/login')
        }
      })
      return
    }
    
    setShowAnalysis(true)
    setShowBottomNav(false)
  }

  const handleCloseAnalysis = () => {
    setShowAnalysis(false)
    setShowBottomNav(true)
  }

  const handleCategoryExpand = (index: number, isExpanded: boolean) => {
    setExpandedCategory(isExpanded ? index : null)
  }
  
  const getBudgetCategories = (): BudgetCategory[] => {
    if (!profileData?.ai_evaluation_details?.budget_settings?.categories) {
      return [];
    }
    return profileData.ai_evaluation_details.budget_settings.categories.map(category => ({
      title: category.name,
      percentage: Math.round((Number(category.spent_amount || 0) / Number(category.amount || 1)) * 100),
      amount: Number(category.spent_amount || 0),
      total: Number(category.amount || 0),
      color: `text-${category.color || 'blue'}-600`,
      thresholds: [
        {
          color: 'text-red-500',
          amount: Number(category.amount || 0) * 0.9,
          label: '红线'
        },
        {
          color: 'text-yellow-500',
          amount: Number(category.amount || 0) * 0.8,
          label: '黄线'
        },
        {
          color: 'text-green-500',
          amount: Number(category.amount || 0) * 0.7,
          label: '绿线'
        }
      ],
      subcategories: (category.sub_categories || []).map(sub => ({
        name: sub.name,
        amount: Number(sub.spent_amount || 0)
      }))
    }));
  };

  const budgetCategories = getBudgetCategories();

  if (profileLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <EnhancedBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-gray-200">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.button 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDashboardOpen(true)}
          >
            <Grid className="w-6 h-6 text-gray-600" />
          </motion.button>
          <h1 className="text-lg font-semibold text-gray-900">财务概览</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={financeData?.user?.avatar} 
                    alt="User Avatar" 
                  />
                  <AvatarFallback>
                    {financeData?.user?.name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isLoggedIn ? (
                <>
                  <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>个人资料</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>退出登录</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => router.push('/login')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>登录</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/register')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>注册</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
        {/* Monthly Disposable Amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`transition-all duration-300 ${
            expandedCategory !== null ? 'filter blur-sm pointer-events-none' : ''
          }`}
        >
          <MetricCard
            title="当月可支配金额"
            amount={disposableIncome}
            subtitle={`较上月${growthRate >= 0 ? '增长' : '下降'}${Math.abs(growthRate)}%`}
            trend={growthRate}
            textColor="text-gray-900"
            onClick={handleShowAnalysis}
            actionText={token ? "查看详情" : "登录后查看"}
          />
        </motion.div>

        {/* Budget Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-40"
        >
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">预算类别</h2>
            <ScrollArea className="w-full">
              <div className="flex space-x-4 pb-4 min-w-full overflow-x-auto">
                {budgetCategories.map((category, index) => (
                  <div key={index} className="relative flex-none w-[calc(33.333%-0.67rem)]">
                    <ProgressCircle
                      disposableIncome={disposableIncome}
                      title={category.title}
                      percentage={category.percentage}
                      amount={category.amount}
                      total={category.total}
                      color={category.color}
                      thresholds={category.thresholds}
                      subcategories={category.subcategories}
                      onExpand={(isExpanded) => handleCategoryExpand(index, isExpanded)}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </motion.div>

        {['AI Banner', 'Monthly Trend Chart', 'Important Milestones'].map((section, index) => (
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className={`transition-all duration-300 ${
              expandedCategory !== null ? 'filter blur-sm pointer-events-none' : ''
            }`}
          >
            {section === 'AI Banner' && (
              <div className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white border border-blue-400 shadow-lg">
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-2">试试反向财富管理功能</h3>
                  <p className="mb-4 text-white/90">更好地了解和控制您的个人财务状况</p>
                  <Button 
                    className="w-full bg-white text-blue-600 hover:bg-white/90 transition-colors shadow-md" 
                    onClick={() => router.push('/wealth-management')}
                  >
                    开始管理
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-32 translate-x-32" />
              </div>
            )}
            {section === 'Monthly Trend Chart' && (
              <div className="backdrop-blur-xl bg-white/80 rounded-xl shadow-lg border border-gray-200 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">月度收支趋势</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/income-expense-history')}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    查看历史详情
                  </Button>
                </div>
                <div className="h-64">
                  <LineChartComponent
                    data={monthlyData}
                    color="#2563EB"
                  />
                </div>
              </div>
            )}
            {section === 'Important Milestones' && (
              <div className="backdrop-blur-xl bg-white/80 rounded-xl shadow-lg border border-gray-200 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">重要里程碑</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                    查看全部
                  </button>
                </div>
                <ScrollArea className="h-64 w-full">
                  <div className="space-y-4 pr-4">
                    <MilestoneItem 
                      icon="Trophy"
                      iconBg="bg-yellow-100"
                      iconColor="text-yellow-yellow-600"
                      title="达成11月储蓄目标"
                      message="恭喜您完成了本月3000元的储蓄目标！"
                      onClick={() => handleMilestoneClick({
                        title: "达成11月储蓄目标",
                        message: "恭喜您完成了本月3000元的储蓄目标！",
                        icon: "Trophy",
                        iconColor: "text-yellow-600"
                      })}
                    />
                    <MilestoneItem 
                      icon="Target"
                      iconBg="bg-green-100"
                      iconColor="text-green-600"
                      title="控制生活成本"
                      message="本月固定生活成本低于预算500元，继续保持！"
                      onClick={() => handleMilestoneClick({
                        title: "控制生活成本",
                        message: "本月固定生活成本低于预算500元，继续保持！",
                        icon: "Target",
                        iconColor: "text-green-600"
                      })}
                    />
                    <MilestoneItem 
                      icon="TrendingUp"
                      iconBg="bg-blue-100"
                      iconColor="text-blue-600"
                      title="投资收益突破"
                      message="您的投资组合本月收益率达到8%，超过平均水平。"
                      onClick={() => handleMilestoneClick({
                        title: "投资收益突破",
                        message: "您的投资组合本月收益率达到8%，超过平均水平。",
                        icon: "TrendingUp",
                        iconColor: "text-blue-600"
                      })}
                    />
                    <MilestoneItem 
                      icon="PiggyBank"
                      iconBg="bg-purple-100"
                      iconColor="text-purple-600"
                      title="额外储蓄"
                      message="您本月额外储蓄了1000元，为未来做好了准备！"
                      onClick={() => handleMilestoneClick({
                        title: "额外储蓄",
                        message: "您本月额外储蓄了1000元，为未来做好了准备！",
                        icon: "PiggyBank",
                        iconColor: "text-purple-600"
                      })}
                    />
                    <MilestoneItem 
                      icon="Home"
                      iconBg="bg-red-100"
                      iconColor="text-red-600"
                      title="房贷还款里程碑"
                      message="恭喜您已经还清了25%的房贷，继续加油！"
                      onClick={() => handleMilestoneClick({
                        title: "房贷还款里程碑",
                        message: "恭喜您已经还清了25%的房贷，继续加油！",
                        icon: "Home",
                        iconColor: "text-red-600"
                      })}
                    />
                  </div>
                </ScrollArea>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {showAnalysis && (
        <DisposableIncomeAnalysis
          disposableIncome={disposableIncome}
          totalIncome={financeData?.income_details.total || 0}
          totalExpenses={financeData?.expense_details.total || 0}
          incomeSources={[
            { 
              name: '工资', 
              amount: financeData?.income_details.categories.salary || 0,
              change: 5 
            },
            { 
              name: '投资收益', 
              amount: financeData?.investment_details.total || 0,
              change: 10 
            },
          ]}
          expenses={[
            { 
              name: '房租', 
              amount: financeData?.expense_details.categories.rent || 0,
              change: 0 
            },
            { 
              name: '日常开销', 
              amount: financeData?.expense_details.categories.food || 0,
              change: -5 
            },
            { 
              name: '交通', 
              amount: financeData?.expense_details.categories.transport || 0,
              change: 2 
            },
            { 
              name: '其他固定支出', 
              amount: financeData?.expense_details.categories.others || 0,
              change: 3 
            },
          ]}
          onClose={handleCloseAnalysis}
        />
      )}

      {selectedMilestone && (
        <TrophyAnimation
          isVisible={showTrophy}
          onClose={() => setShowTrophy(false)}
          title={selectedMilestone.title}
          message={selectedMilestone.message}
          icon={selectedMilestone.icon}
          iconColor={selectedMilestone.iconColor}
        />
      )}

      <QuickDashboard isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} />

      {showBottomNav && <BottomNav activePage="home" />}
    </main>
  )
}

