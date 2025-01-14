import express from 'express'
import cors from 'cors'
import { initDB } from './models/user'
import profileRoutes from './routes/profile'
import { config } from './config'
import userRoutes from './routes/user'
import authRoutes from './routes/auth'
import onboardingRoutes from './routes/onboarding'

const app = express()

// 中间件
app.use(cors({
  origin: config.cors.origin
}))
app.use(express.json())

// 路由
app.use('/api/profile', profileRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/v1/onboarding', onboardingRoutes)

// 初始化数据库
initDB().catch(console.error)

// 错误处理
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: config.env === 'development' ? err.message : undefined
  })
})

// 启动服务器
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`)
})

export default app 