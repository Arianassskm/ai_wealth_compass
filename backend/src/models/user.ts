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
  basic_salary: number
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
  necessary_expenses: number
  
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
  
  // AI 配置
  aiConfig: {
    model: string
    temperature: number
    maxTokens: number
    topP: number
    frequencyPenalty: number
    presencePenalty: number
    systemPrompt: string
  }
  
  // AI 评估详情
  ai_evaluation_details: {
    budget_settings: {
      total_budget: number;
      categories: Array<{
        name: string;
        percentage: number;
        color: string;
        amount: number;
      }>;
      monthly_budget: {
        income: number;
        expenses: {
          fixed: Record<string, number>;
          variable: Record<string, number>;
          savings: number;
        };
        current_month: string;
        history: Array<{
          month: string;
          actual_expenses: number;
          budget_compliance: number;
        }>;
      };
    };
    wealth_composition: {
      last_updated: string;
      components: Array<{
        type: string;
        percentage: number;
        amount: number;
        risk_level: string;
        liquidity: string;
      }>;
      analysis: {
        risk_score: number;
        diversification_score: number;
        liquidity_score: number;
        recommendations: string[];
      };
    };
    last_updated: string;
  };
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

    // 确保返回的用户对象包含 AI 配置
    if (!user.aiConfig) {
      user.aiConfig = {
        model: 'doubao',
        temperature: 0.7,
        maxTokens: 2000,
        topP: 0.9,
        frequencyPenalty: 0.5,
        presencePenalty: 0.5,
        systemPrompt: '我是您的智能理财助手，可以为您提供个性化的理财建议。'
      }
    }

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
      necessary_expenses: userData.necessary_expenses || 0,
      // 基本信息
      life_stage: userData.life_stage || '未知',
      basic_salary: userData.basic_salary || 0,
      age_group: userData.age_group || '',
      gender: userData.gender || '',
      employment_status: userData.employment_status || '未知',
      estimated_monthly_income: userData.estimated_monthly_income || 0,
      // necessary_expenses: userData.necessary_expenses || 0,
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
      lifestyle_status: userData.lifestyle_status || '',
      
      // AI 配置
      aiConfig: userData.aiConfig || {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 2000,
        topP: 0.9,
        frequencyPenalty: 0.5,
        presencePenalty: 0.5,
        systemPrompt: '我是您的智能理财助手，可以为您提供个性化的理财建议。'
      },
      
      ai_evaluation_details: {
        budget_settings: {
          total_budget: 0,
          categories: [],
          monthly_budget: {
            income: 0,
            expenses: { fixed: {}, variable: {}, savings: 0 },
            current_month: new Date().toISOString().slice(0, 7),
            history: []
          }
        },
        wealth_composition: {
          last_updated: new Date().toISOString(),
          components: [],
          analysis: {
            risk_score: 0,
            diversification_score: 0,
            liquidity_score: 0,
            recommendations: []
          }
        },
        last_updated: new Date().toISOString()
      }
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

  static async updateAIConfig(userId: string, aiConfig: Partial<User['aiConfig']>): Promise<User | null> {
    const user = await this.findById(userId)
    if (!user) return null

    const updatedUser = {
      ...user,
      aiConfig: {
        ...user.aiConfig,
        model: aiConfig.model || user.aiConfig.model,
        temperature: aiConfig.temperature || user.aiConfig.temperature,
        maxTokens: aiConfig.maxTokens || user.aiConfig.maxTokens,
        topP: aiConfig.topP || user.aiConfig.topP,
        frequencyPenalty: aiConfig.frequencyPenalty || user.aiConfig.frequencyPenalty,
        presencePenalty: aiConfig.presencePenalty || user.aiConfig.presencePenalty,
        systemPrompt: aiConfig.systemPrompt || user.aiConfig.systemPrompt
      },
      updatedAt: new Date().toISOString()
    }

    db.get('users')
      .find({ id: userId })
      .assign(updatedUser)
      .write()

    return updatedUser
  }
}

export { UserModel, User } 