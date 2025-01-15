import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  },
  env: process.env.NODE_ENV || 'development',
  arkApiKey: process.env.ARK_API_KEY || '095413e9-f942-4689-b5ad-e9b207960330'
} as const 