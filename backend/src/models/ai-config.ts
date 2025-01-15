import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export interface AIConfig {
  id: string
  userId: string
  provider: string
  apiKey: string
  baseUrl: string
  isEnabled: boolean
  systemPrompt: string
  modelId: string
  temperature: number
  maxTokens: number
  createdAt: string
  updatedAt: string
}

interface Schema {
  configs: AIConfig[]
}

const dbFile = path.join(__dirname, '../../db/ai_configs.json')
const adapter = new FileSync<Schema>(dbFile)
const db = lowdb(adapter)

export class AIConfigModel {
  static async initDB() {
    db.defaults({ configs: [] }).write()
  }

  static async findByUserId(userId: string): Promise<AIConfig | null> {
    const config = db.get('configs').find({ userId }).value()
    return config || null
  }

  static async updateConfig(userId: string, configData: Partial<AIConfig>): Promise<AIConfig> {
    const existingConfig = await this.findByUserId(userId)
    
    const newConfig: AIConfig = {
      id: existingConfig?.id || uuidv4(),
      userId,
      provider: configData.provider || existingConfig?.provider || '豆包',
      apiKey: configData.apiKey || existingConfig?.apiKey || '',
      baseUrl: configData.baseUrl || existingConfig?.baseUrl || 'https://api.aliyun.com/v1',
      isEnabled: configData.isEnabled ?? existingConfig?.isEnabled ?? false,
      systemPrompt: configData.systemPrompt || existingConfig?.systemPrompt || '你是一个专业的理财顾问助手',
      modelId: configData.modelId || existingConfig?.modelId || 'ep-20250114145526-j2hzq',
      temperature: configData.temperature || existingConfig?.temperature || 0.7,
      maxTokens: configData.maxTokens || existingConfig?.maxTokens || 1000,
      createdAt: existingConfig?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (existingConfig) {
      db.get('configs')
        .find({ userId })
        .assign(newConfig)
        .write()
    } else {
      db.get('configs')
        .push(newConfig)
        .write()
    }

    return newConfig
  }
} 