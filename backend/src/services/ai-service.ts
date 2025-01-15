import { AIConfigModel } from '../models/ai-config'
import { config } from '../config'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatCompletionResponse {
  success: boolean
  data?: {
    choices: Array<{
      message: {
        content: string
      }
    }>
  }
  error?: string
}

export class AIService {
  static async getCompletion(userId: string, message: string): Promise<string> {
    try {
      const aiConfig = await AIConfigModel.findByUserId(userId)
      if (!aiConfig) {
        throw new Error('AI configuration not found')
      }

      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: aiConfig.systemPrompt || '你是一个专业的理财顾问助手'
        },
        {
          role: 'user',
          content: message
        }
      ]

      const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.arkApiKey}`
        },
        body: JSON.stringify({
          model: aiConfig.modelId || 'ep-20250114145526-j2hzq',
          messages,
          temperature: aiConfig.temperature || 0.7,
          max_tokens: aiConfig.maxTokens || 1000
        })
      })

      if (!response.ok) {
        const errorData = await response.json() as { error?: string }
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const responseText = await response.text()
      const data = JSON.parse(responseText) as ChatCompletionResponse

      if (!data.success || !data.data?.choices?.[0]?.message?.content) {
        throw new Error(data.error || 'Failed to get AI response')
      }

      return data.data.choices[0].message.content

    } catch (error) {
      console.error('AI Service Error:', error instanceof Error ? error.message : JSON.stringify(error))
      throw error instanceof Error ? error : new Error(JSON.stringify(error))
    }
  }
} 