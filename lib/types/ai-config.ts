export interface AIModelConfig {
  model: string
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  systemPrompt: string
}

export const DEFAULT_AI_CONFIG: AIModelConfig = {
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 2000,
  topP: 0.9,
  frequencyPenalty: 0.5,
  presencePenalty: 0.5,
  systemPrompt: '我是您的智能理财助手，可以为您提供个性化的理财建议。'
} 