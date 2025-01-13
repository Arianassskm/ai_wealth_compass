import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'

interface UserProfile {
  id: string
  email: string
  password: string
  name: string
  avatar: string
  life_stage: string
  risk_tolerance: string
  age_group: string
  employment_status: string
  estimated_monthly_income: number
  short_term_goal: string
  mid_term_goal: string
  long_term_goal: string
  createdAt: string
  updatedAt: string
}

interface Schema {
  users: UserProfile[]
}

const dbFile = path.join(__dirname, '../../db/users.json')
const adapter = new FileSync<Schema>(dbFile)
const db = lowdb(adapter)

// 初始化示例数据
const sampleUsers: UserProfile[] = [
  {
    id: '1',
    email: 'test@example.com',
    password: '$2a$10$IiUB2GUXe8bWVQj7Jk7q1O5hpyFz7V3v5YzF1Q9X9X9X9X9X9X',  // "password123"
    name: '张三',
    avatar: '/placeholder.svg',
    life_stage: '奋斗期',
    risk_tolerance: 'moderate',
    age_group: '26-35',
    employment_status: '工程师',
    estimated_monthly_income: 25000,
    short_term_goal: '攒够首付',
    mid_term_goal: '子女教育',
    long_term_goal: '养老储备',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// 初始化数据库
async function initDB() {
  try {
    // 设置默认数据
    db.defaults({ users: [] }).write()
    
    // 清空现有数据
    db.get('users').remove().write()
    
    // 写入示例数据
    db.get('users').push(...sampleUsers).write()
    
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}

// 运行初始化
initDB() 