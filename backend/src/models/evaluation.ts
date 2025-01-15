import { readJSON, writeJSON } from '../utils/json'
import { v4 as uuidv4 } from 'uuid'

export interface Evaluation {
  id: string
  userId: string
  expenseType: string
  amount: number
  result: string
  description: string
  createdAt: string
  paymentMethod: 'one-time' | 'installment'
  installmentInfo?: {
    value: number
    unit: 'month' | 'year'
    monthlyPayment: number
  }
  boardDecisions: {
    [key: string]: {
      score: number
      comment: string
      emoji: string
    }
  }
  finalSuggestion: string
  financialAssessment: {
    necessity: number
    urgency: number
    shortTermImpact: string
    longTermImpact: string
    riskLevel: string
  }
  valueComparisons: Array<{
    category: string
    quantity: string
    price?: string
  }>
}

class EvaluationModelClass {
  private readonly dbPath = './db/evaluation_histories.json'

  async create(data: Omit<Evaluation, 'id' | 'createdAt'>): Promise<Evaluation> {
    const evaluations = await this.getAll()
    
    const newEvaluation: Evaluation = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    }

    evaluations.push(newEvaluation)
    await writeJSON(this.dbPath, { histories: evaluations })
    
    return newEvaluation
  }

  async getAll(): Promise<Evaluation[]> {
    const data = await readJSON(this.dbPath)
    return data.histories || []
  }

  async getByUserId(userId: string): Promise<Evaluation[]> {
    const evaluations = await this.getAll()
    return evaluations.filter(e => e.userId === userId)
  }

  async getById(id: string): Promise<Evaluation | null> {
    const evaluations = await this.getAll()
    return evaluations.find(e => e.id === id) || null
  }
}

export const EvaluationModel = new EvaluationModelClass() 