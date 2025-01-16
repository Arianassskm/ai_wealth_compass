import express from 'express'
import cors from 'cors'
import { initDB } from './models/user'
import profileRoutes from './routes/profile'
import { config } from './config'
import userRoutes from './routes/user'
import authRoutes from './routes/auth'
import onboardingRoutes from './routes/onboarding'
import accountRouter from './routes/account'
import evaluationRouter from './routes/evaluation'
import aiProxyRouter from './routes/ai-proxy'
import financialGoalsRouter from './routes/financial-goals'

const app = express()

// 中间件
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))
app.use(express.json())

// 添加请求日志
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// 路由
app.use('/api/profile', profileRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/v1/onboarding', onboardingRoutes)
app.use('/api/v1/accounts', accountRouter)
app.use('/api/v1/evaluations', evaluationRouter)
app.use('/api/v3', aiProxyRouter)
app.use('/api/v1/financial-goals', financialGoalsRouter)

// 初始化数据库
initDB().catch(console.error)

// 错误处理
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', err)
  res.status(500).json({
    success: false,
    error: '服务器错误',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// 添加未捕获异常处理
process.on('uncaughtException', (error) => {
  console.error('未捕获异常:', error)
})

process.on('unhandledRejection', (error) => {
  console.error('未处理拒绝:', error)
})

try {
  app.listen(config.port, () => {
    console.log('=================================')
    console.log(`环境: ${process.env.NODE_ENV}`)
    console.log(`服务端口: ${config.port}`)
    console.log(`服务地址: http://localhost:${config.port}/api`)
    console.log('=================================')
  })
} catch (error) {
  console.error('服务启动失败:', error)
}

export default app 