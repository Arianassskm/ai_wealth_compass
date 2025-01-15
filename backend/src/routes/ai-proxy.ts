import { Router } from 'express'
import { auth } from '../middleware/auth'
import { AuthenticatedRequest } from '../types'
import fetch from 'node-fetch'
import { config } from '../config'

const router = Router()

router.post('/chat/completions', auth, async (req: AuthenticatedRequest, res) => {
  try {
    console.log('AI Proxy - Request Body:', req.body)
    
    if (!config.arkApiKey) {
      throw new Error('ARK_API_KEY is not configured')
    }

    const requestBody = {
      ...req.body,
      // 确保必要的字段存在
      model: req.body.model || 'ep-20250114145526-j2hzq',
      messages: req.body.messages || []
    }

    console.log('AI Proxy - Sending request to ARK API:', {
      url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ****' // 隐藏实际的 API key
      },
      body: requestBody
    })

    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.arkApiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    const responseText = await response.text()
    console.log('AI Proxy - Raw Response:', responseText)

    if (!response.ok) {
      throw new Error(`AI service responded with status ${response.status}: ${responseText}`)
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      throw new Error(`Failed to parse AI response: ${responseText}`)
    }

    console.log('AI Proxy - Parsed Response:', data)
    res.json(data)
  } catch (error) {
    console.error('AI Proxy - Error:', error)
    res.status(500).json({
      success: false,
      error: '调用 AI 服务失败',
      message: error instanceof Error ? error.message : '未知错误',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    })
  }
})

export default router 