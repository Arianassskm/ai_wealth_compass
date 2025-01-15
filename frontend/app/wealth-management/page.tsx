"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AssistantLayout } from '@/components/assistant-layout'
import { motion } from 'framer-motion'
import { ArrowLeft, PlusCircle, Edit2, Save, PieChart, Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { config } from '@/config'
import { useAuthContext } from '@/providers/auth-provider'
import { fetchApi } from '@/lib/api'
import { useAccounts } from '@/hooks/useAccounts'
import { toast } from 'react-hot-toast'

type Account = {
  id: string;
  name: string;
  balance: number;
  purpose: string;
  description: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const PURPOSE_DESCRIPTIONS = {
  '固定支出': '房租、水电、通勤、餐食',
  '冲动消费': '请客、奶茶、衣服、鞋子',
  '意外消费': '医疗、随礼、应急',
  '储蓄投资': '长期储蓄、投资理财',
  '日常消费': '日常开销、零食、娱乐'
};

interface AIEvaluationResponse {
  success: boolean
  data: {
    ai_evaluation_details?: {
      wealth_management?: Account[]
    }
  }
}

const useEvaluation = () => {
  const { token } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createEvaluation = async (accounts: Account[]) => {
    try {
      setLoading(true)
      
      // 计算关键指标
      const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
      const savingsAccounts = accounts.filter(acc => acc.purpose === '储蓄投资')
      const savingsBalance = savingsAccounts.reduce((sum, acc) => sum + acc.balance, 0)
      const savingsRatio = totalBalance > 0 ? savingsBalance / totalBalance : 0

      // 确定风险等级
      let riskLevel: 'low' | 'medium' | 'high' = 'medium'
      if (savingsRatio >= 0.3) riskLevel = 'low'
      else if (savingsRatio <= 0.1) riskLevel = 'high'

      const response = await fetchApi(config.apiEndpoints.evaluations.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'wealth_management',
          accounts,
          analysis: {
            totalBalance,
            savingsRatio,
            riskLevel,
            suggestions: [] // 由后端 AI 服务填充
          }
        }),
        token
      })

      if (!response.success) {
        throw new Error(response.error || '评估失败')
      }

      return response.data
    } catch (err) {
      console.error('Evaluation error:', err)
      setError(err instanceof Error ? err.message : '评估失败')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createEvaluation, loading, error }
}

export default function WealthManagementPage() {
  const router = useRouter();
  const { token, logout } = useAuthContext()
  const { 
    accounts, 
    loading, 
    error, 
    createAccount, 
    updateAccount, 
    deleteAccount,
    totalBalance 
  } = useAccounts()
  const [newAccount, setNewAccount] = useState({ name: '', balance: 0, purpose: '', description: '' });
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const { createEvaluation, loading: evaluating } = useEvaluation()

  const addAccount = async () => {
    if (newAccount.name && newAccount.purpose) {
      try {
        await createAccount({
          name: newAccount.name,
          balance: newAccount.balance,
          purpose: newAccount.purpose,
          description: PURPOSE_DESCRIPTIONS[newAccount.purpose as keyof typeof PURPOSE_DESCRIPTIONS] || ''
        })
        setNewAccount({ name: '', balance: 0, purpose: '', description: '' })
      } catch (error) {
        toast.error('添加账户失败')
      }
    }
  }

  const handleUpdateAccount = async (account: Account) => {
    try {
      await updateAccount(account.id, account)
      setEditingAccount(null)
    } catch (error) {
      toast.error('更新账户失败')
    }
  }

  const handleDeleteAccount = async (id: string) => {
    try {
      await deleteAccount(id)
      setEditingAccount(null)
    } catch (error) {
      toast.error('删除账户失败')
    }
  }

  const analyzeWealthStatus = () => {
    const status = [];
    if (totalBalance < 10000) {
      status.push("您的总余额较低，建议增加收入或减少支出。");
    } else if (totalBalance < 50000) {
      status.push("您的总余额状况良好，但仍有提升空间。");
    } else {
      status.push("您的总余额状况优秀，继续保持良好的理财习惯。");
    }

    const savingsRatio = accounts.find(a => a.purpose === '储蓄投资')?.balance || 0 / totalBalance;
    if (savingsRatio < 0.2) {
      status.push("建议增加储蓄比例，以应对未来可能的财务挑战。");
    }

    return status.join(" ");
  };

  const handleGenerateReport = async () => {
    try {
      if (accounts.length === 0) {
        toast.error('请先添加账户')
        return
      }

      const evaluation = await createEvaluation(accounts)
      toast.success('报告生成成功')
      router.push(`/ai-evaluation/${evaluation.id}`)
    } catch (error) {
      console.error('Generate report error:', error)
      toast.error('生成报告失败')
    }
  }

  return (
    <AssistantLayout
      title="反向财富管理"
      description="通过分类管理不同账户来掌控您的财富"
      avatarSrc="/images/placeholder.svg"
      onBack={() => router.push('/')}
      sections={[
        {
          id: 'wealth-overview',
          title: '财富概览',
          content: (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-lg font-semibold text-gray-700">总余额</p>
                  <motion.p 
                    className="text-3xl font-bold text-green-600"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    ¥{totalBalance.toLocaleString()}
                  </motion.p>
                </div>
                <div className="w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsChart>
                      <Pie
                        data={accounts}
                        dataKey="balance"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={40}
                        innerRadius={25}
                      >
                        {accounts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <Card className="p-3 bg-blue-50">
                <p className="text-sm text-blue-800">{analyzeWealthStatus()}</p>
              </Card>
            </motion.div>
          ),
          defaultOpen: true,
        },
        {
          id: 'account-management',
          title: '账户用途管理',
          content: (
            <div className="space-y-4">
              {accounts.map((account, index) => (
                <motion.div 
                  key={account.id} 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {editingAccount?.id === account.id ? (
                    <Card className="p-4">
                      <div className="space-y-2">
                        <Input
                          value={editingAccount.name}
                          onChange={(e) => setEditingAccount({...editingAccount, name: e.target.value})}
                          placeholder="账户名称"
                        />
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">¥</span>
                          </div>
                          <Input
                            type="number"
                            value={editingAccount.balance}
                            onChange={(e) => setEditingAccount({...editingAccount, balance: Number(e.target.value)})}
                            className="pl-7"
                            placeholder="账户余额"
                          />
                        </div>
                        <select
                          value={editingAccount.purpose}
                          onChange={(e) => setEditingAccount({...editingAccount, purpose: e.target.value, description: PURPOSE_DESCRIPTIONS[e.target.value as keyof typeof PURPOSE_DESCRIPTIONS] || ''})}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        >
                          <option value="">选择用途</option>
                          {Object.keys(PURPOSE_DESCRIPTIONS).map((purpose) => (
                            <option key={purpose} value={purpose}>{purpose}</option>
                          ))}
                        </select>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setEditingAccount(null)}>取消</Button>
                          <Button onClick={() => handleUpdateAccount(editingAccount)}>保存</Button>
                          <Button variant="destructive" onClick={() => handleDeleteAccount(editingAccount.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-lg">{account.name}余额</h3>
                          <p className="text-sm text-gray-500">{account.purpose}</p>
                        </div>
                        <p className="text-xl font-bold">¥{account.balance.toLocaleString()}</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{account.description}</p>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm" onClick={() => setEditingAccount(account)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          编辑
                        </Button>
                      </div>
                    </Card>
                  )}
                </motion.div>
              ))}
              <Card className="p-4">
                <h3 className="font-medium mb-2">添加新账户</h3>
                <div className="space-y-2">
                  <Input
                    placeholder="账户名称"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  />
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">¥</span>
                    </div>
                    <Input
                      type="number"
                      placeholder="账户余额"
                      value={newAccount.balance}
                      onChange={(e) => setNewAccount({ ...newAccount, balance: Number(e.target.value) })}
                      className="pl-7"
                    />
                  </div>
                  <select
                    value={newAccount.purpose}
                    onChange={(e) => setNewAccount({ ...newAccount, purpose: e.target.value, description: PURPOSE_DESCRIPTIONS[e.target.value as keyof typeof PURPOSE_DESCRIPTIONS] || '' })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="">选择用途</option>
                    {Object.keys(PURPOSE_DESCRIPTIONS).map((purpose) => (
                      <option key={purpose} value={purpose}>{purpose}</option>
                    ))}
                  </select>
                  <Button onClick={addAccount} className="w-full">
                    <PlusCircle className="h-4 w-4 mr-2" /> 添加账户
                  </Button>
                </div>
              </Card>
            </div>
          ),
          defaultOpen: true,
        },
      ]}
    >
      <motion.div 
        className="mt-8 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleGenerateReport}
          disabled={evaluating || accounts.length === 0}
        >
          {evaluating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <PieChart className="h-4 w-4 mr-2" />
              生成详细报告
            </>
          )}
        </Button>
        <Button variant="secondary" className="w-full" onClick={() => router.push('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回主页
        </Button>
      </motion.div>
    </AssistantLayout>
  )
}

