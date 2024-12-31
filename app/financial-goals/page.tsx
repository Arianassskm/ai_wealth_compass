"use client"

import { useState } from 'react'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AssistantLayout } from '@/components/assistant-layout'
import { PlusCircle, Trophy, Target, Trash2, Edit2, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'

type Goal = {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: Date
}

export default function FinancialGoalsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', name: '购买新车', targetAmount: 200000, currentAmount: 50000, deadline: new Date(2024, 11, 31) },
    { id: '2', name: '环球旅行', targetAmount: 100000, currentAmount: 30000, deadline: new Date(2025, 5, 30) },
    { id: '3', name: '创业资金', targetAmount: 500000, currentAmount: 100000, deadline: new Date(2026, 0, 1) },
  ])
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: 0, deadline: '' })
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  const addGoal = () => {
    if (newGoal.name && newGoal.targetAmount && newGoal.deadline) {
      const newGoalItem: Goal = {
        id: Date.now().toString(),
        name: newGoal.name,
        targetAmount: newGoal.targetAmount,
        currentAmount: 0,
        deadline: new Date(newGoal.deadline),
      }
      setGoals([...goals, newGoalItem])
      setNewGoal({ name: '', targetAmount: 0, deadline: '' })
      toast({
        title: "目标已添加",
        description: `${newGoal.name} 已成功添加到您的财务目标列表。`,
      })
    }
  }

  const removeGoal = (id: string) => {
    const goalToRemove = goals.find(g => g.id === id)
    setGoals(goals.filter(goal => goal.id !== id))
    if (goalToRemove) {
      toast({
        title: "目标已删除",
        description: `${goalToRemove.name} 已从您的财务目标列表中删除。`,
      })
    }
  }

  const editGoal = (goal: Goal) => {
    setEditingGoal(goal)
  }

  const updateGoal = () => {
    if (editingGoal) {
      setGoals(goals.map(g => g.id === editingGoal.id ? editingGoal : g))
      setEditingGoal(null)
      toast({
        title: "目标已更新",
        description: `${editingGoal.name} 的信息已成功更新。`,
      })
    }
  }

  const getProgress = (goal: Goal) => (goal.currentAmount / goal.targetAmount) * 100

  return (
    <AssistantLayout
      title="财务目标"
      description="设置和跟踪您的财务目标"
      avatarSrc="/placeholder.svg"
      sections={[
        {
          id: 'current-goals',
          title: '当前目标',
          content: (
            <AnimatePresence>
              <div className="space-y-6">
                {goals.map((goal, index) => (
                  <motion.div 
                    key={goal.id} 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{goal.name}</h3>
                      <div className="space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => editGoal(goal)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => removeGoal(goal.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Progress value={getProgress(goal)} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>¥{goal.currentAmount.toLocaleString()} / ¥{goal.targetAmount.toLocaleString()}</span>
                      <span>{getProgress(goal).toFixed(1)}%</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      目标日期: {goal.deadline.toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          ),
          defaultOpen: true,
        },
        {
          id: 'add-goal',
          title: '添加新目标',
          content: (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-2">
                <Label htmlFor="goal-name">目标名称</Label>
                <Input
                  id="goal-name"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-amount">目标金额</Label>
                <Input
                  id="goal-amount"
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-deadline">目标日期</Label>
                <Input
                  id="goal-deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
              <Button onClick={addGoal} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> 添加目标
              </Button>
            </motion.div>
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
        <Button className="w-full">
          <Trophy className="mr-2 h-4 w-4" /> 查看已完成的目标
        </Button>
        <Button variant="outline" className="w-full">
          <Target className="mr-2 h-4 w-4" /> 设置提醒
        </Button>
        <Button variant="secondary" className="w-full" onClick={() => router.push('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回主页
        </Button>
      </motion.div>
    </AssistantLayout>
  )
}

