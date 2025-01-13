"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Target, Clock, TrendingUp, Shield } from 'lucide-react'
import { RadioCard } from "@/components/radio-card"
import { useOnboarding } from '@/contexts/onboarding-context'

export default function InvestmentPreferencePage() {
  const router = useRouter()
  const { data, updateData, submitData } = useOnboarding()
  
  const [riskTolerance, setRiskTolerance] = useState(data.risk_tolerance || '')
  const [investmentHorizon, setInvestmentHorizon] = useState(data.investment_horizon || '')
  const [expectedReturn, setExpectedReturn] = useState(data.expected_return_rate?.toString() || '')
  const [investmentStyle, setInvestmentStyle] = useState(data.investment_experience || '')

  const allOptionsSelected = () => {
    return riskTolerance !== '' && 
           investmentHorizon !== '' && 
           expectedReturn !== '' && 
           investmentStyle !== '';
  };

  const handleFinish = async () => {
    console.log('riskTolerance', riskTolerance)
    console.log('investmentHorizon', investmentHorizon)
    console.log('expectedReturn', expectedReturn)
    console.log('investmentStyle', investmentStyle)

    // 更新最终的投资偏好数据
    updateData({
      risk_tolerance: riskTolerance,
      investment_horizon: investmentHorizon,
      expected_return_rate: parseFloat(expectedReturn),
      investment_experience: investmentStyle,
      // 根据选择推断投资类型偏好
      preferred_investment_types: inferPreferredInvestmentTypes(riskTolerance, investmentStyle)
    })

    try {
      // 提交所有收集的数据
      await submitData()
      router.push('/profile')
    } catch (error) {
      console.error('Failed to submit onboarding data:', error)
    }
  }

  const inferPreferredInvestmentTypes = (risk: string, style: string): string[] => {
    const types: string[] = []
    
    // 根据风险承受能力推断
    switch (risk) {
      case '保守型':
        types.push('deposits', 'bonds')
        break
      case '稳健型':
        types.push('bonds', 'funds')
        break
      case '平衡型':
        types.push('funds', 'stocks', 'bonds')
        break
      case '进取型':
        types.push('stocks', 'funds', 'derivatives')
        break
      case '激进型':
        types.push('stocks', 'derivatives', 'crypto')
        break
    }

    // 根据投资风格调整
    if (style === '被动投资') {
      types.push('index_funds', 'etfs')
    }
    if (style === '价值投资') {
      types.push('value_stocks', 'dividend_stocks')
    }
    if (style === '积极投资') {
      types.push('growth_stocks', 'options')
    }

    // 修复 Set 类型错误
    const uniqueTypes = new Set(types)
    return Array.from(uniqueTypes)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100 via-blue-100 to-blue-50 opacity-70"></div>
      
      <div className="max-w-2xl mx-auto px-4 py-4 sm:py-8">
        <header className="flex items-center mb-4 sm:mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="mr-3"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">投资偏好</h1>
            <p className="text-xs sm:text-sm text-gray-500">选择您的风险承受能力、投资期限、预期回报和投资风格</p>
          </div>
        </header>

        <Card className="p-3 sm:p-6 backdrop-blur-xl bg-white/80 border-gray-200">
          <form className="space-y-4 sm:space-y-8">
            {/* Risk Tolerance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Label className="flex items-center text-sm sm:text-lg font-medium mb-2 sm:mb-4 text-blue-600">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                风险承受能力
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {[
                  { main: '保守型', sub: '低风险，低收益' },
                  { main: '稳健型', sub: '中风险，中收益' },
                  { main: '平衡型', sub: '中风险，中收益' },
                  { main: '进取型', sub: '高风险，高收益' },
                  { main: '激进型', sub: '高风险，高收益' }
                ].map((goal, index) => (
                  <RadioCard
                    key={`risk-tolerance-${index}`}
                    id={`risk-tolerance-${index}`}
                    mainLabel={goal.main}
                    subLabel={goal.sub}
                    colorScheme="blue"
                    name="riskTolerance"
                    value={goal.main}
                    checked={riskTolerance === goal.main}
                    onChange={(e) => setRiskTolerance(e.currentTarget.value)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Investment Horizon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Label className="flex items-center text-sm sm:text-lg font-medium mb-2 sm:mb-4 text-green-600">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                投资期限
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {[
                  { main: '短期', sub: '1年以内' },
                  { main: '中期', sub: '1-5年' },
                  { main: '长期', sub: '5年以上' },
                  { main: '灵活', sub: '灵活投资' },
                  { main: '定制', sub: '定制投资' }
                ].map((goal, index) => (
                  <RadioCard
                    key={`investment-horizon-${index}`}
                    id={`investment-horizon-${index}`}
                    mainLabel={goal.main}
                    subLabel={goal.sub}
                    colorScheme="green"
                    name="investmentHorizon"
                    value={goal.main}
                    checked={investmentHorizon === goal.main}
                    onChange={(e) => setInvestmentHorizon(e.currentTarget.value)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Expected Return */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Label className="flex items-center text-sm sm:text-lg font-medium mb-2 sm:mb-4 text-purple-600">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                预期回报
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {[
                  { main: '低', sub: '1-3%' },
                  { main: '中', sub: '3-6%' },
                  { main: '高', sub: '6-10%' },
                  { main: '灵活', sub: '灵活收益' },
                  { main: '定制', sub: '定制收益' }
                ].map((goal, index) => (
                  <RadioCard
                    key={`expected-return-${index}`}
                    id={`expected-return-${index}`}
                    mainLabel={goal.main}
                    subLabel={goal.sub}
                    colorScheme="purple"
                    name="expectedReturn"
                    value={goal.main}
                    checked={expectedReturn === goal.main}
                    onChange={(e) => setExpectedReturn(e.currentTarget.value)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Investment Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Label className="flex items-center text-sm sm:text-lg font-medium mb-2 sm:mb-4 text-red-600">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                投资风格
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {[
                  { main: '被动投资', sub: '指数基金，ETF' },
                  { main: '价值投资', sub: '价值股票，分红股票' },
                  { main: '积极投资', sub: '成长股票，期权' },
                  { main: '定制投资', sub: '定制投资' },
                  { main: '灵活投资', sub: '灵活投资' }
                ].map((goal, index) => (
                  <RadioCard
                    key={`investment-style-${index}`}
                    id={`investment-style-${index}`}
                    mainLabel={goal.main}
                    subLabel={goal.sub}
                    colorScheme="red"
                    name="investmentStyle"
                    value={goal.main}
                    checked={investmentStyle === goal.main}
                    onChange={(e) => setInvestmentStyle(e.currentTarget.value)}
                  />
                ))}
              </div>
            </motion.div>
          </form>
        </Card>

        <div className="flex justify-between mt-4 sm:mt-6">
          <Button
            variant="outline"
            onClick={() => router.push('/onboarding/step3')}
            className="w-1/2 mr-2 text-xs sm:text-sm h-9 sm:h-10"
          >
            上一步
          </Button>
          <Button
            className="w-1/2 ml-2 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm h-9 sm:h-10"
            onClick={handleFinish}
            disabled={!allOptionsSelected()}
          >
            完成
          </Button>
        </div>
      </div>
    </main>
  )
}

