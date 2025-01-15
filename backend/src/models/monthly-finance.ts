import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'

interface MonthlyFinance {
  id: string
  userId: string
  year: number
  month: number
  disposableIncome: number  // 可支配收入
  totalIncome: number      // 总收入
  totalExpenses: number    // 总支出
  savings: number         // 储蓄
  investments: number     // 投资
  createdAt: string
  categories: {
    salary: number
    bonus: number
    rent: number
    food: number
    transport: number
    utilities: number
    entertainment: number
    others: number
  }
  investmentDetails: {
    stocks: number
    funds: number
    deposits: number
  }
}

interface Schema {
  monthlyFinances: MonthlyFinance[]
}

const dbFile = path.join(__dirname, '../../db/monthly_finances.json')
const adapter = new FileSync<Schema>(dbFile)
const db = lowdb(adapter)

export class MonthlyFinanceModel {
  static async initDB() {
    db.defaults({ monthlyFinances: [] }).write()
  }

  // 获取指定月份的财务数据
  static async findByUserIdAndMonth(userId: string, year: number, month: number): Promise<MonthlyFinance | null> {
    const finance = db.get('monthlyFinances')
      .find({ userId, year, month })
      .value()
    return finance || null
  }

  // 获取上个月的财务数据
  static async findLastMonth(userId: string): Promise<MonthlyFinance | null> {
    const today = new Date()
    // 获取上个月的月份和年份
    let lastMonth = today.getMonth() // getMonth() 返回 0-11
    let lastMonthYear = today.getFullYear()
    
    if (lastMonth === 0) { // 如果当前是1月
      lastMonth = 12
      lastMonthYear--
    }
    
    // 查找上个月的数据
    const lastMonthData = await this.findByUserIdAndMonth(userId, lastMonthYear, lastMonth)
    
    // 如果没有找到上个月的数据，自动生成一条
    if (!lastMonthData) {
      // 获取最近3个月的数据来计算平均值
      const recentMonths = db.get('monthlyFinances')
        .filter({ userId })
        .sortBy('createdAt')
        .takeRight(3)
        .value()

      // 计算平均值或使用默认值
      const averageIncome = recentMonths.length > 0
        ? recentMonths.reduce((sum, m) => sum + m.totalIncome, 0) / recentMonths.length
        : 0
      const averageExpenses = recentMonths.length > 0
        ? recentMonths.reduce((sum, m) => sum + m.totalExpenses, 0) / recentMonths.length
        : 0

      // 创建上个月的数据记录
      const newLastMonthData: MonthlyFinance = {
        id: Date.now().toString(),
        userId,
        year: lastMonthYear,
        month: lastMonth,
        disposableIncome: averageIncome - averageExpenses,
        totalIncome: averageIncome,
        totalExpenses: averageExpenses,
        savings: (averageIncome - averageExpenses) * 0.3, // 假设30%用于储蓄
        investments: (averageIncome - averageExpenses) * 0.2, // 假设20%用于投资
        createdAt: new Date(lastMonthYear, lastMonth - 1).toISOString(),
        categories: {
          salary: 0,
          bonus: 0,
          rent: 0,
          food: 0,
          transport: 0,
          utilities: 0,
          entertainment: 0,
          others: 0
        },
        investmentDetails: {
          stocks: 0,
          funds: 0,
          deposits: 0
        }
      }

      // 保存到数据库
      await this.upsertMonthlyFinance(newLastMonthData)
      return newLastMonthData
    }

    return lastMonthData
  }

  // 创建或更新月度财务数据
  static async upsertMonthlyFinance(data: Partial<MonthlyFinance>): Promise<MonthlyFinance> {
    const { userId, year, month } = data
    const existing = await this.findByUserIdAndMonth(userId!, year!, month!)

    const monthlyFinance: MonthlyFinance = {
      id: existing?.id || Date.now().toString(),
      userId: userId!,
      year: year!,
      month: month!,
      disposableIncome: data.disposableIncome || 0,
      totalIncome: data.totalIncome || 0,
      totalExpenses: data.totalExpenses || 0,
      savings: data.savings || 0,
      investments: data.investments || 0,
      createdAt: existing?.createdAt || new Date().toISOString(),
      categories: data.categories || {
        salary: 0,
        bonus: 0,
        rent: 0,
        food: 0,
        transport: 0,
        utilities: 0,
        entertainment: 0,
        others: 0
      },
      investmentDetails: data.investmentDetails || {
        stocks: 0,
        funds: 0,
        deposits: 0
      }
    }

    if (existing) {
      db.get('monthlyFinances')
        .find({ id: existing.id })
        .assign(monthlyFinance)
        .write()
    } else {
      db.get('monthlyFinances')
        .push(monthlyFinance)
        .write()
    }

    return monthlyFinance
  }

  // 计算环比增长
  static async calculateGrowthRate(userId: string): Promise<{
    currentAmount: number
    growthRate: number
    lastMonthAmount: number  // 添加上月数据
  }> {
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth() + 1

    // 获取当月数据
    let currentFinance = await this.findByUserIdAndMonth(userId, currentYear, currentMonth)
    
    // 如果当月没有数据，基于上月数据生成
    if (!currentFinance) {
      const lastMonthFinance = await this.findLastMonth(userId)
      const estimatedIncrease = 0.05 // 假设5%的月增长率
      
      currentFinance = await this.upsertMonthlyFinance({
        userId,
        year: currentYear,
        month: currentMonth,
        disposableIncome: (lastMonthFinance?.disposableIncome || 0) * (1 + estimatedIncrease),
        totalIncome: (lastMonthFinance?.totalIncome || 0) * (1 + estimatedIncrease),
        totalExpenses: (lastMonthFinance?.totalExpenses || 0),
        savings: (lastMonthFinance?.savings || 0) * (1 + estimatedIncrease),
        investments: (lastMonthFinance?.investments || 0) * (1 + estimatedIncrease)
      })
    }

    // 获取上月数据
    const lastMonthFinance = await this.findLastMonth(userId)

    const currentAmount = currentFinance.disposableIncome
    const lastAmount = lastMonthFinance?.disposableIncome || 0

    const growthRate = lastAmount === 0 ? 0 : ((currentAmount - lastAmount) / lastAmount) * 100

    return {
      currentAmount,
      growthRate,
      lastMonthAmount: lastAmount
    }
  }

  static async getCurrentMonthData(userId: string): Promise<MonthlyFinance> {
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth() + 1

    let currentData = await this.findByUserIdAndMonth(userId, currentYear, currentMonth)
    
    if (!currentData) {
      // 如果没有当月数据，基于上月数据生成
      const lastMonthData = await this.findLastMonth(userId)
      const estimatedIncrease = 0.05 // 假设5%的月增长率
      
      // 生成当月数据
      currentData = await this.upsertMonthlyFinance({
        userId,
        year: currentYear,
        month: currentMonth,
        disposableIncome: (lastMonthData?.disposableIncome || 0) * (1 + estimatedIncrease),
        totalIncome: (lastMonthData?.totalIncome || 0) * (1 + estimatedIncrease),
        totalExpenses: lastMonthData?.totalExpenses || 0,
        savings: (lastMonthData?.savings || 0) * (1 + estimatedIncrease),
        investments: (lastMonthData?.investments || 0) * (1 + estimatedIncrease),
        categories: lastMonthData?.categories || {
          salary: 0,
          bonus: 0,
          rent: 0,
          food: 0,
          transport: 0,
          utilities: 0,
          entertainment: 0,
          others: 0
        },
        investmentDetails: lastMonthData?.investmentDetails || {
          stocks: 0,
          funds: 0,
          deposits: 0
        }
      })
    }

    return currentData
  }
}

export type { MonthlyFinance } 