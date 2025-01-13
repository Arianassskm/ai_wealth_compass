import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import bcrypt from 'bcryptjs'

// 定义用户接口
interface User {
  id: string
  email: string
  password: string
  name: string
  avatar: string
  
  // 基本信息
  life_stage: string
  age_group: string
  gender: string
  employment_status: string
  estimated_monthly_income: number
  
  // 财务状况
  monthly_expenses: number
  savings: number
  debt_amount: number
  debt_type: string[]
  assets: {
    cash: number
    stock: number
    fund: number
    insurance: number
    real_estate: number
    other: number
  }
  
  // 投资偏好
  risk_tolerance: string
  investment_experience: string
  preferred_investment_types: string[]
  investment_horizon: string
  
  // 财务目标
  short_term_goal: string
  mid_term_goal: string
  long_term_goal: string
  monthly_investment_amount: number
  expected_return_rate: number
  
  // AI 评估结果
  risk_score: number
  investment_advice: string
  portfolio_suggestion: {
    cash: number
    bond: number
    stock: number
    gold: number
    real_estate: number
  }
  
  // 系统数据
  createdAt: string
  updatedAt: string
  lastAssessmentAt: string
  
  // 生活方式信息
  financial_status: string
  housing_status: string
  lifestyle_status: string
}

// 定义数据库结构
interface Schema {
  users: User[]
}

// 配置数据库
const dbFile = path.join(__dirname, '../../db/users.json')
const adapter = new FileSync<Schema>(dbFile)
const db = lowdb(adapter)

// 初始化数据库
export async function initDB() {
  db.defaults({ users: [] }).write()
}

// 用户模型
class UserModel {
  static async findById(id: string): Promise<User | null> {
    const user = db.get('users').find({ id }).value()
    if (!user) return null

    return user
  }

  static async findByEmail(email: string): Promise<User | undefined> {
    return db.get('users').find({ email }).value()
  }

  static async create(userData: Partial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password || '', 10)

    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email || '',
      password: hashedPassword,
      name: userData.name || '',
      avatar: userData.avatar || '/placeholder.svg',
      
      // 基本信息
      life_stage: userData.life_stage || '未知',
      age_group: userData.age_group || '',
      gender: userData.gender || '',
      employment_status: userData.employment_status || '未知',
      estimated_monthly_income: userData.estimated_monthly_income || 0,
      
      // 财务状况
      monthly_expenses: userData.monthly_expenses || 0,
      savings: userData.savings || 0,
      debt_amount: userData.debt_amount || 0,
      debt_type: userData.debt_type || [],
      assets: userData.assets || {
        cash: 0,
        stock: 0,
        fund: 0,
        insurance: 0,
        real_estate: 0,
        other: 0
      },
      
      // 投资偏好
      risk_tolerance: userData.risk_tolerance || 'moderate',
      investment_experience: userData.investment_experience || 'beginner',
      preferred_investment_types: userData.preferred_investment_types || [],
      investment_horizon: userData.investment_horizon || 'medium',
      
      // 财务目标
      short_term_goal: userData.short_term_goal || '',
      mid_term_goal: userData.mid_term_goal || '',
      long_term_goal: userData.long_term_goal || '',
      monthly_investment_amount: userData.monthly_investment_amount || 0,
      expected_return_rate: userData.expected_return_rate || 0,
      
      // AI 评估结果
      risk_score: userData.risk_score || 0,
      investment_advice: userData.investment_advice || '',
      portfolio_suggestion: userData.portfolio_suggestion || {
        cash: 0,
        bond: 0,
        stock: 0,
        gold: 0,
        real_estate: 0
      },
      
      // 系统数据
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastAssessmentAt: new Date().toISOString(),
      
      // 生活方式信息
      financial_status: userData.financial_status || '',
      housing_status: userData.housing_status || '',
      lifestyle_status: userData.lifestyle_status || ''
    }
    
    db.get('users').push(newUser).write()
    
    const { password, ...userWithoutPassword } = newUser
    return userWithoutPassword as User
  }

  static async updateProfile(id: string, profileData: Partial<User>): Promise<User | null> {
    const user = db.get('users').find({ id }).value()
    if (!user) return null

    const updatedUser = {
      ...user,
      ...profileData,
      updatedAt: new Date().toISOString()
    }
    
    db.get('users').find({ id }).assign(updatedUser).write()
    
    const { password, ...userWithoutPassword } = updatedUser
    return userWithoutPassword as User
  }

  static async updateOnboardingData(userId: string, data: Partial<User>): Promise<User | null> {
    const user = db.get('users').find({ id: userId }).value()
    if (!user) return null

    const updatedUser = {
      ...user,
      ...data,
      updatedAt: new Date().toISOString(),
      lastAssessmentAt: new Date().toISOString()
    }
    
    db.get('users')
      .find({ id: userId })
      .assign(updatedUser)
      .write()
    
    const { password, ...userWithoutPassword } = updatedUser
    return userWithoutPassword as User
  }
}

export { UserModel, User } 