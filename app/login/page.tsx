"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { config } from '@/config'

export default function LoginPage() {
  const router = useRouter()
  const { setToken } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const endpoint = isLogin ? config.apiEndpoints.auth.login : config.apiEndpoints.auth.register
      const response = await fetch(`${config.apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || '操作失败')
      }

      setToken(data.data.token)
      toast.success(isLogin ? '登录成功' : '注册成功')
      router.push('/profile')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '操作失败')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isLogin ? '登录' : '注册'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            {isLogin ? '登录' : '注册'}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? '没有账号？去注册' : '已有账号？去登录'}
          </button>
        </div>
      </Card>
    </div>
  )
}

