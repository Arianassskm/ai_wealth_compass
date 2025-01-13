"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronDown, ChevronUp, Save, RefreshCw, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { toast } from "@/components/ui/use-toast"
import { useAuthContext } from '@/providers/auth-provider'
import { fetchApi } from '@/lib/api'
import { config } from '@/config'

interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  isSelected?: boolean
}

const availableModels: AIModel[] = [
  {
    "id": "doubao",
    "name": "豆包",
    "provider": "字节跳动",
    "description": "字节跳动开发的人工智能，能帮用户解答各类疑问、进行文本创作等多方面的语言交互服务"
  },
  {
    id: 'kimi-v1',
    name: 'Kimi',
    provider: 'Moonshot AI',
    description: '月之暗面AI开发的对话模型，擅长中文创作与理解'
  },
  {
    id: 'deepseek-chat',
    name: 'Deepseek',
    provider: 'Deepseek',
    description: '专注于深度学习的AI模型，支持多语言对话'
  },
  {
    id: 'baichuan-2',
    name: '百川2',
    provider: '百川智能',
    description: '强大的中文理解与生成能力'
  },
  {
    id: 'zhipu-chat',
    name: '智谱清言',
    provider: '智谱AI',
    description: '针对中文场景优化的对话模型'
  }
]

interface APIConfig {
  provider: string
  apiKey: string
  baseUrl: string
  isEnabled: boolean
}

export function AIModelSettings() {
  const { token } = useAuthContext()
  const [models, setModels] = useState<AIModel[]>(availableModels)
  const [isExpanded, setIsExpanded] = useState(false)
  const [apiConfigs, setApiConfigs] = useState<{[key: string]: APIConfig}>({
    'bytedance': {
      provider: '字节跳动',
      apiKey: '',
      baseUrl: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
      isEnabled: false
    },
    'moonshot': {
      provider: 'Moonshot AI',
      apiKey: '',
      baseUrl: 'https://api.moonshot.cn/v1',
      isEnabled: false
    },
    'deepseek': {
      provider: 'Deepseek',
      apiKey: '',
      baseUrl: 'https://api.deepseek.com/v1',
      isEnabled: false
    }
  })
  const [isSaving, setIsSaving] = useState(false)

  // 加载配置
  useEffect(() => {
    const loadConfig = async () => {
      if (!token) return

      try {
        const response = await fetchApi(config.apiEndpoints.user.aiConfig, {
          token
        })

        if (response.success && response.data) {
          const config = response.data
          // 根据 provider 更新对应的配置
          const providerMap: { [key: string]: string } = {
            '字节跳动': 'bytedance',
            'Moonshot AI': 'moonshot',
            'Deepseek': 'deepseek'
          }
          
          const providerKey = providerMap[config.provider]
          if (providerKey && apiConfigs[providerKey]) {
            setApiConfigs(prev => ({
              ...prev,
              [providerKey]: {
                provider: config.provider,
                apiKey: config.apiKey || '',
                baseUrl: config.baseUrl || '',
                isEnabled: config.isEnabled || false
              }
            }))

            // 更新模型选择状态
            setModels(models.map(model => ({
              ...model,
              isSelected: model.provider === config.provider
            })))
          }
        }
      } catch (error) {
        console.error('Error loading AI config:', error)
        toast({
          title: "加载失败",
          description: "无法加载AI配置",
          variant: "destructive"
        })
      }
    }

    loadConfig()
  }, [token])

  const handleModelToggle = async (modelId: string) => {
    // 先更新本地状态
    const newModels = models.map(model => ({
      ...model,
      isSelected: model.id === modelId ? !model.isSelected : false
    }))
    setModels(newModels)

    // 获取选中的模型
    const selectedModel = newModels.find(m => m.isSelected)
    
    try {
      const selectedProvider = selectedModel?.provider || '豆包'
      const aiModelConfig: APIConfig = {
        provider: selectedProvider,
        apiKey: apiConfigs[selectedProvider.toLowerCase()]?.apiKey || '',
        baseUrl: apiConfigs[selectedProvider.toLowerCase()]?.baseUrl || '',
        isEnabled: true
      }

      await fetchApi(config.apiEndpoints.user.aiConfig, {
        method: 'PUT',
        token,
        body: JSON.stringify({ aiConfig: aiModelConfig })
      })

      toast({
        title: "已更新",
        description: `已切换至${selectedModel?.name || '默认'}模型`,
      })
    } catch (error) {
      setModels(models)
      toast({
        title: "更新失败",
        description: error instanceof Error ? error.message : "请稍后重试",
        variant: "destructive"
      })
    }
  }

  const handleApiConfigUpdate = async (provider: string, field: keyof APIConfig, value: string | boolean) => {
    // 先更新本地状态
    const newConfigs = {
      ...apiConfigs,
      [provider]: {
        ...apiConfigs[provider],
        [field]: value
      }
    }
    setApiConfigs(newConfigs)

    // 如果是修改 enabled 状态或 API 相关字段，立即保存到服务器
    if (field === 'isEnabled' || field === 'apiKey' || field === 'baseUrl') {
      try {
        const currentConfig = newConfigs[provider]
        const aiModelConfig: APIConfig = {
          provider: currentConfig.provider,
          apiKey: currentConfig.apiKey,
          baseUrl: currentConfig.baseUrl,
          isEnabled: currentConfig.isEnabled
        }

        await fetchApi(config.apiEndpoints.user.aiConfig, {
          method: 'PUT',
          token,
          body: JSON.stringify({ aiConfig: aiModelConfig })
        })

        toast({
          title: "已更新",
          description: field === 'isEnabled' 
            ? `已${value ? '启用' : '禁用'}${currentConfig.provider}`
            : `已更新${currentConfig.provider}的${field === 'apiKey' ? 'API密钥' : 'API地址'}`,
        })
      } catch (error) {
        // 如果保存失败，回滚本地状态
        setApiConfigs(apiConfigs)
        toast({
          title: "更新失败",
          description: error instanceof Error ? error.message : "请稍后重试",
          variant: "destructive"
        })
      }
    }
  }

  const handleSaveSettings = async () => {
    if (!token) {
      toast({
        title: "未登录",
        description: "请先登录后再保存设置",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSaving(true)
      const selectedModel = models.find(m => m.isSelected)
      const selectedProvider = selectedModel?.provider || '豆包'
      
      const aiModelConfig: APIConfig = {
        provider: selectedProvider,
        apiKey: apiConfigs[selectedProvider.toLowerCase()]?.apiKey || '',
        baseUrl: apiConfigs[selectedProvider.toLowerCase()]?.baseUrl || '',
        isEnabled: true
      }

      const response = await fetchApi(config.apiEndpoints.user.aiConfig, {
        method: 'PUT',
        token,
        body: JSON.stringify({ aiConfig: aiModelConfig })
      })

      if (response.success) {
        toast({
          title: "设置已保存",
          description: "AI模型配置已更新",
        })
      } else {
        throw new Error(response.error || '保存失败')
      }
    } catch (error) {
      console.error('Error saving AI config:', error)
      toast({
        title: "保存失败",
        description: error instanceof Error ? error.message : "请稍后重试",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="w-full">
      <Collapsible
        open={isExpanded}
        onOpenChange={setIsExpanded}
        className="w-full"
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">AI模型设置</h3>
              <p className="text-sm text-gray-500">配置您偏好的AI助手模型</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-6 pb-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">可用模型</h4>
              <div className="grid gap-4">
                {models.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center space-x-4 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <Switch
                      checked={model.isSelected}
                      onCheckedChange={() => handleModelToggle(model.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">{model.name}</h5>
                        <span className="text-sm text-muted-foreground">{model.provider}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{model.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">API配置</h4>
              {Object.entries(apiConfigs).map(([key, config]) => (
                <div key={key} className="space-y-4 p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">{config.provider}</Label>
                    <Switch
                      checked={config.isEnabled}
                      onCheckedChange={(checked) => handleApiConfigUpdate(key, 'isEnabled', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`${key}-apikey`}>API密钥</Label>
                    <div className="relative">
                      <Input
                        id={`${key}-apikey`}
                        type="password"
                        value={config.apiKey}
                        onChange={(e) => handleApiConfigUpdate(key, 'apiKey', e.target.value)}
                        className="pr-20"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => handleApiConfigUpdate(key, 'apiKey', '')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${key}-baseurl`}>API地址</Label>
                    <div className="relative">
                      <Input
                        id={`${key}-baseurl`}
                        value={config.baseUrl}
                        onChange={(e) => handleApiConfigUpdate(key, 'baseUrl', e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => handleApiConfigUpdate(key, 'baseUrl', '')}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={handleSaveSettings} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              保存设置
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

