import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export interface Account {
  id: string
  userId: string
  name: string
  balance: number
  purpose: string
  description: string
  createdAt: string
  updatedAt: string
}

interface Schema {
  accounts: Account[]
}

const dbFile = path.join(__dirname, '../../db/accounts.json')
const adapter = new FileSync<Schema>(dbFile)
const db = lowdb(adapter)

// 确保数据库文件存在
db.defaults({ accounts: [] }).write()

export class AccountModel {
  static async findByUserId(userId: string): Promise<Account[]> {
    return db.get('accounts')
      .filter({ userId })
      .value()
  }

  static async create(data: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const account: Account = {
      id: uuidv4(),  // 使用 uuid 替代 timestamp
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // 确保写入成功
    db.get('accounts')
      .push(account)
      .write()

    return account
  }

  static async update(id: string, data: Partial<Account>): Promise<Account | null> {
    const account = db.get('accounts')
      .find({ id })
      .value()

    if (!account) {
      return null
    }

    const updatedAccount = {
      ...account,
      ...data,
      updatedAt: new Date().toISOString()
    }

    // 替换整个对象以确保更新成功
    db.get('accounts')
      .find({ id })
      .assign(updatedAccount)
      .write()

    return updatedAccount
  }

  static async delete(id: string): Promise<boolean> {
    const removed = db.get('accounts')
      .remove({ id })
      .write()

    return removed.length > 0
  }
} 