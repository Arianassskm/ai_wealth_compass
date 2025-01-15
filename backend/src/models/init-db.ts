import { UserModel } from './user'
import { AIConfigModel } from './ai-config'
import { MonthlyFinanceModel } from './monthly-finance'
import { AccountModel } from './account'

export async function initDB() {
  await UserModel.initDB()
  await AIConfigModel.initDB()
  await MonthlyFinanceModel.initDB()
  await AccountModel.initDB()
} 