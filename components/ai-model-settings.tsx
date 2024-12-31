"use client"

import { useState } from 'react'
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

interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  isSelected?: boolean
}

const availableModels: AIModel[] = [
  {
    id: 'tongyi-14b',
    name: '通义千问',
    provider: '阿里云',
    description: '阿里云开发的大语言模型，支持中英双语对话'
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
  const [models, setModels] = useState<AIModel[]>(availableModels)
  const [isExpanded, setIsExpanded] = useState(false)
  const [apiConfigs, setApiConfigs] = useState<{[key: string]: APIConfig}>({
    'aliyun': {
      provider: '阿里云',
      apiKey: '',
      baseUrl: 'https://api.aliyun.com/v1',
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

  const handleModelToggle = (modelId: string) => {
    setModels(models.map(model => 
      model.id === modelId 
        ? { ...model, isSelected: !model.isSelected }
        : model
    ))
  }

  const handleApiConfigUpdate = (provider: string, field: keyof APIConfig, value: string | boolean) => {
    setApiConfigs(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value
      }
    }))
  }

  const handleSaveSettings = () => {
    // Here you would typically save the settings to your backend
    toast({
      title: "设置已保存",
      description: "AI模型配置已更新",
    })
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

