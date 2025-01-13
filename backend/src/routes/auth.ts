import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/user'
import { config } from '../config'
import { ApiResponse } from '../types'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body

    // 检查邮箱是否已存在
    const existingUser = await UserModel.findByEmail(email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: '该邮箱已被注册'
      })
    }

    // 创建新用户
    const user = await UserModel.create({
      email,
      password,
      name,
      avatar: '/placeholder.svg',
      life_stage: '奋斗期',
      risk_tolerance: 'moderate',
      age_group: '26-35',
      employment_status: '未知',
      estimated_monthly_income: 0,
      short_term_goal: '',
      mid_term_goal: '',
      long_term_goal: ''
    })

    // 生成 token
    const token = jwt.sign({ id: user.id }, config.jwtSecret, {
      expiresIn: '7d'
    })

    const response: ApiResponse<{ token: string }> = {
      success: true,
      data: { token }
    }
    res.status(201).json(response)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '注册失败',
      message: error instanceof Error ? error.message : '未知错误'
    })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // 查找用户
    const user = await UserModel.findByEmail(email)
    if (!user) {
      return res.status(401).json({
        success: false,
        error: '邮箱或密码错误'
      })
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: '邮箱或密码错误'
      })
    }

    // 生成 token
    const token = jwt.sign({ id: user.id }, config.jwtSecret, {
      expiresIn: '7d'
    })

    const response: ApiResponse<{ token: string }> = {
      success: true,
      data: { token }
    }
    res.json(response)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '登录失败',
      message: error instanceof Error ? error.message : '未知错误'
    })
  }
})

export default router 