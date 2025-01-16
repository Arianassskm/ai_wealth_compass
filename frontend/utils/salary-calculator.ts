import { LifeStage, AgeGroup } from '@/types/onboarding'

// 年龄段基础薪资系数
const AGE_SALARY_COEFFICIENTS: Record<string, number> = {
  '10后': 0.3,  // 实习/兼职
  '05后': 0.4,  // 实习/兼职
  '00后': 0.8,  // 刚步入职场
  '95后': 1.0,  // 职场中坚
  '90后': 1.2,  // 较为资深
  '85后': 1.3,  // 资深
  '80后': 1.3,  // 资深
  '75后': 1.2,  // 资深但可能变动
  '70后': 1.1,  // 可能转型
  '65后': 0.9,  // 可能退休过渡
  '60后': 0.7,  // 可能退休
}

// 职业阶段基础薪资范围（单位：元/月）
const LIFE_STAGE_SALARY_RANGES: Record<string, { min: number; max: number }> = {
  'student': { min: 1000, max: 3000 },
  'fresh_graduate': { min: 4000, max: 8000 },
  'career_start': { min: 6000, max: 12000 },
  'career_growth': { min: 12000, max: 25000 },
  'single': { min: 8000, max: 20000 },
  'relationship': { min: 10000, max: 22000 },
  'married': { min: 15000, max: 30000 },
  'parent': { min: 18000, max: 35000 },
  'midlife': { min: 20000, max: 40000 },
  'retirement': { min: 10000, max: 25000 },
}

interface SalaryRange {
  min: number;
  max: number;
}

export function calculateBasicSalary(ageGroup: string, lifeStage: string): SalaryRange {
  const ageCoefficient = AGE_SALARY_COEFFICIENTS[ageGroup] || 1.0
  const stageRange = LIFE_STAGE_SALARY_RANGES[lifeStage] || { min: 5000, max: 10000 }

  return {
    min: Math.round(stageRange.min * ageCoefficient),
    max: Math.round(stageRange.max * ageCoefficient)
  }
}

// 生活方式与必需开支比例的映射
export enum LifeStyle {
  FRUGAL = 'frugal',      // 省吃俭用
  MODERATE = 'moderate',   // 小有盈余
  QUALITY = 'quality',     // 品质生活
  LUXURIOUS = 'luxurious' // 精致生活
}

interface ExpenseRatio {
  min: number;
  max: number;
}

const LIFESTYLE_EXPENSE_RATIOS: Record<LifeStyle, ExpenseRatio> = {
  [LifeStyle.FRUGAL]: { min: 0.6, max: 0.8 },     // 60-80%
  [LifeStyle.MODERATE]: { min: 0.4, max: 0.6 },    // 40-60%
  [LifeStyle.QUALITY]: { min: 0.3, max: 0.4 },     // 30-40%
  [LifeStyle.LUXURIOUS]: { min: 0.2, max: 0.3 }    // 20-30%
}

export interface ExpenseRange {
  min: number;
  max: number;
  average: number;
}

export function calculateNecessaryExpenses(
  income: number,
  lifestyle: LifeStyle = LifeStyle.MODERATE
): ExpenseRange {
  const ratio = LIFESTYLE_EXPENSE_RATIOS[lifestyle]
  
  return {
    min: Math.round(income * ratio.min),
    max: Math.round(income * ratio.max),
    average: Math.round(income * ((ratio.min + ratio.max) / 2))
  }
} 