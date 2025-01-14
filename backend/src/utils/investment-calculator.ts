// 根据项目中实际使用的生命阶段更新字典
const LIFE_STAGE_MAP: Record<string, string> = {
  'student': '学生',
  'fresh_graduate': '应届毕业生',
  'career_start': '职场新人',
  'career_growth': '职业发展期',
  'single': '单身贵族',
  'relationship': '恋爱阶段',
  'married': '新婚阶段',
  'parent': '为人父母',
  'midlife': '中年阶段',
  'retirement': '退休准备'
}

interface OnboardingData {
  // 基本信息
  age_group: string
  financial_status: string
  housing_status: string
  employment_status: string
  estimated_monthly_income: number
  lifestyle_status: string
  life_stage: string
  
  // 投资相关
  risk_tolerance: string
  investment_horizon: string
  investment_experience: string
  expected_return_rate: number
}

// 更新生命阶段评分
const lifeStageScores: Record<string, number> = {
  'student': 8,
  'fresh_graduate': 7,
  'career_start': 6,
  'career_growth': 5,
  'single': 7,
  'relationship': 5,
  'married': 4,
  'parent': 3,
  'midlife': 2,
  'retirement': 1
}

// 更新生命阶段建议
const stageAdvice: Record<string, string> = {
  'student': '正在学习，为未来做准备。建议先积累理财知识，从小额定投起步。',
  'fresh_graduate': '刚毕业，寻找人生方向。建议先做好资金规划，建立应急基金。',
  'career_start': '刚开始工作，建立事业。可以开始尝试更多样化的投资组合。',
  'career_growth': '专注事业发展和晋升。可以考虑配置一些进取型投资产品。',
  'single': '独立生活，专注个人发展。可以进行更积极的投资。',
  'relationship': '与伴侣共同规划未来。需要平衡短期消费和长期投资。',
  'married': '开始家庭生活。建议增加稳健型投资比例。',
  'parent': '抚养子女，平衡工作与家庭。建议配置更多保障型产品。',
  'midlife': '事业稳定，考虑未来规划。需要平衡子女教育和养老储备。',
  'retirement': '为退休生活做准备。建议提高固定收益类产品比例。'
}

export function calculateRiskScore(data: OnboardingData): number {
  let score = 50 // 基础分数
  
  // 根据生命阶段调整
  score += lifeStageScores[data.life_stage] || 5

  // 根据年龄调整
  const ageScores: Record<string, number> = {
    '18-25': 10,
    '26-35': 8,
    '36-45': 6,
    '46-55': 4,
    '56-65': 2,
    '65+': 0
  }
  score += ageScores[data.age_group] || 5

  // 根据风险承受能力调整
  const riskScores: Record<string, number> = {
    '保守型': -10,
    '稳健型': 0,
    '平衡型': 5,
    '进取型': 10,
    '激进型': 15
  }
  score += riskScores[data.risk_tolerance] || 0

  // 根据投资经验调整
  const experienceScores: Record<string, number> = {
    '被动投资': 0,
    '价值投资': 5,
    '积极投资': 10
  }
  score += experienceScores[data.investment_experience] || 0

  return Math.min(Math.max(score, 0), 100) // 确保分数在0-100之间
}

export function generateInvestmentAdvice(data: OnboardingData, riskScore: number): string {
  let advice = ''
  const lifeStage = LIFE_STAGE_MAP[data.life_stage] || data.life_stage
  
  // 根据生命阶段添加特定建议
  advice = `${stageAdvice[data.life_stage] || ''} `
  
  // 添加原有的风险评分建议
  if (riskScore < 30) {
    advice += '建议采取保守的投资策略，以保本为主。可以考虑配置更多的固定收益类产品，如债券基金和货币基金。'
  } else if (riskScore < 60) {
    advice += '建议采取稳健的投资策略，平衡风险和收益。可以考虑配置一定比例的股票基金，但仍以固定收益类产品为主。'
  } else if (riskScore < 80) {
    advice += '可以采取相对积极的投资策略，增加权益类资产的配置比例。建议关注优质成长股和行业龙头。'
  } else {
    advice += '可以采取进取的投资策略，以追求较高收益为主。但建议做好风险控制，适当分散投资。'
  }

  return advice
}

export function generatePortfolioSuggestion(riskScore: number): {
  cash: number
  bond: number
  stock: number
  gold: number
  real_estate: number
} {
  // 根据风险分数生成资产配置建议
  if (riskScore < 30) {
    return {
      cash: 30,
      bond: 50,
      stock: 10,
      gold: 5,
      real_estate: 5
    }
  } else if (riskScore < 60) {
    return {
      cash: 20,
      bond: 40,
      stock: 30,
      gold: 5,
      real_estate: 5
    }
  } else if (riskScore < 80) {
    return {
      cash: 10,
      bond: 20,
      stock: 50,
      gold: 10,
      real_estate: 10
    }
  } else {
    return {
      cash: 5,
      bond: 15,
      stock: 60,
      gold: 10,
      real_estate: 10
    }
  }
}

// 导出字典以供其他模块使用
export { LIFE_STAGE_MAP } 