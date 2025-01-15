import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export interface EvaluationHistory {
  id: string
  userId: string
  type: 'wealth_management' | 'risk_assessment' | 'investment_advice'
  accounts: Array<{
    id: string
    name: string
    balance: number
    purpose: string
    description: string
  }>
  analysis: {
    totalBalance: number
    savingsRatio: number
    suggestions: string[]
    riskLevel: 'low' | 'medium' | 'high'
  }
  createdAt: string
}

interface Schema {
  evaluations: EvaluationHistory[]
}

const dbFile = path.join(__dirname, '../../db/evaluation_histories.json')
const adapter = new FileSync<Schema>(dbFile)
const db = lowdb(adapter)

// 确保数据库文件存在
db.defaults({ evaluations: [] }).write()

export class EvaluationHistoryModel {
  static async findByUserId(userId: string): Promise<EvaluationHistory[]> {
    return db.get('evaluations')
      .filter({ userId })
      .value()
  }

  static async create(data: Omit<EvaluationHistory, 'id' | 'createdAt'>): Promise<EvaluationHistory> {
    const evaluation: EvaluationHistory = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString()
    }

    db.get('evaluations')
      .push(evaluation)
      .write()

    return evaluation
  }

  static async findById(id: string): Promise<EvaluationHistory | null> {
    return db.get('evaluations')
      .find({ id })
      .value() || null
  }
} 