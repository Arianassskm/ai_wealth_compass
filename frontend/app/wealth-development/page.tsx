"use client"

import { useState,useEffect } from 'react'
import Image from 'next/image'
import { Send, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthContext } from '@/providers/auth-provider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import { FormattedMessage } from '@/components/formatted-message'
import type { ChatMessage } from '@/components/chat/message'
import { v4 as uuidv4 } from 'uuid'
import { CollapsibleSection } from "@/components/collapsible-section"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { toast } from 'sonner'
import { fetchApi } from '@/lib/api'
import { config } from '@/config'

const remindText =`你是一位专业的财富开发顾问。你的任务是根据用户提供的信息，分析其财富增长机会并提供专业的建议。请遵循以下指示：

1. 首先接收用户的输入信息：

<development_info>
开发类型：{$DEVELOPMENT_TYPE}
当前月收入：{$CURRENT_INCOME}
目标月收入：{$TARGET_INCOME}
计划时间周期：{$TIME_FRAME}
主要技能：{$KEY_SKILLS}
</development_info>

2. 在提供建议之前，请在<analysis>标签中进行以下分析：
- 计算收入差距和所需月度增长率
- 评估目标的可行性
- 根据开发类型和技能匹配最佳发展路径
- 识别潜在风险和机会

3. 在<recommendation>标签中提供建议，建议必须包含：
- 💡 发展策略概述
- 📈 阶段性目标设定
- 💪 技能提升建议
- ⚠️ 风险提示
- 📝 具体行动计划

4. 输出格式要求：
- 使用清晰的分节标题
- 每个重要点配备适当的emoji
- 使用要点符号提高可读性
- 重要数据或建议要加粗显示

5. 最后在<summary>标签中提供简短的总结，包括：
- 目标可行性评级（⭐1-5颗星）
- 建议执行周期
- 关键成功要素

确保建议具有实操性和针对性，避免泛泛而谈。所有内容必须用中文回答，注重专业性和可行性。

请以如下格式输出你的分析和建议：

<wealth_advisor_response>
<analysis>
[详细分析内容]
</analysis>

<recommendation>
[分节建议内容]
</recommendation>

<summary>
[总结内容]
</summary>
</wealth_advisor_response>

`
const wealthDevelopmentTypes = [
  { title: "被动收入", value: "passive_income" },
  { title: "技能变现", value: "skill_monetization" },
  { title: "副业创业", value: "side_business" },
  { title: "知识付费", value: "knowledge_payment" },
  { title: "资产配置", value: "asset_allocation" },
]
// 添加处理标签的工具函数
const processContent = (content: any) => {
  // 从 response 中提取实际的消息内容
  const extractContent = (response: any) => {
    if (response?.choices?.[0]?.message?.content) {
      return response.choices[0].message.content;
    }
    if (typeof response === 'string') {
      return response;
    }
    return '';
  };

  try {
    const messageContent = extractContent(content);
    if (!messageContent) return '';

    // 处理所有标签
    const contentSections = messageContent
      .split(/(<\/?wealth_advisor_response>|<\/?analysis>|<\/?recommendation>|<\/?summary>)/g)
      .filter(section => section.trim() && !section.match(/<\/?wealth_advisor_response>|<\/?analysis>|<\/?recommendation>|<\/?summary>/));

    // 定义段落顺序和存储结构
    const sectionGroups: Record<string, string[]> = {
      '🔍 分析': [],
      '💡 发展策略': [],
      '📈 目标规划': [],
      '💪 技能提升': [],
      '⚠️ 风险提示': [],
      '📝 行动计划': [],
      '📊 总结': []
    };

    // 分段处理不同部分的内容
    contentSections.forEach(section => {
      // 处理 Markdown 格式
      const processedText = section
        .replace(/\*\*(.*?)\*\*/g, '$1')  // 移除加粗标记
        .replace(/\n+/g, '\n')            // 规范化换行
        .replace(/\$(.+?)\$/g, '$1')      // 移除数学公式标记
        .trim();

      // 根据内容特征添加标题和分段
      let sectionTitle = '';
      if (section.includes('收入差距计算') || section.includes('目标可行性评估')) {
        sectionTitle = '🔍 分析';
      } else if (section.includes('发展策略概述')) {
        sectionTitle = '💡 发展策略';
      } else if (section.includes('阶段性目标设定')) {
        sectionTitle = '📈 目标规划';
      } else if (section.includes('技能提升建议')) {
        sectionTitle = '💪 技能提升';
      } else if (section.includes('风险提示')) {
        sectionTitle = '⚠️ 风险提示';
      } else if (section.includes('具体行动计划')) {
        sectionTitle = '📝 行动计划';
      } else if (section.includes('目标可行性评级')) {
        sectionTitle = '📊 总结';
      }

      if (sectionTitle && sectionGroups[sectionTitle]) {
        sectionGroups[sectionTitle].push(processedText);
      }
    });

    // 按顺序组合所有段落
    return Object.entries(sectionGroups)
      .filter(([_, content]) => content.length > 0)
      .map(([title, content]) => `${title}\n${content.join('\n')}`)
      .join('\n\n');

  } catch (error) {
    console.error('Error processing content:', error);
    return typeof content === 'string' ? content : '';
  }
};
export default function WealthDevelopmentPage() {
  const router = useRouter()
  const { token } = useAuthContext()
  const [message, setMessage] = useState('')
  const [developmentType, setDevelopmentType] = useState('')
  const [currentIncome, setCurrentIncome] = useState('')
  const [targetIncome, setTargetIncome] = useState('')
  const [timeframe, setTimeframe] = useState('')
  const [skills, setSkills] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      content: "你好！我是财富开发助手。请告诉我你的具体情况，我会帮你分析并提供建议。",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormExpanded, setIsFormExpanded] = useState(true)

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      content,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsSubmitting(true);

    try {
      const messageHistory = [
        {
          role: 'system',
          content: remindText
        },
        ...messages.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content
        })),
        {
          role: 'user',
          content
        }
      ];

      const response = await fetchApi(
        config.apiEndpoints.ai.chat,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: messageHistory
          })
        }
      );

      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        content: processContent(response.choices?.[0]?.message?.content || ''),
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Send message error:', error);
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: "抱歉，处理消息时出现错误，请稍后重试。",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitInfo = async () => {
    if (!developmentType || !currentIncome || !targetIncome || !timeframe || !skills) {
      toast.error('请填写完整信息');
      return;
    }

    setIsSubmitting(true);
    setIsFormExpanded(false);

    try {
      // 构建提示词
      const prompt = remindText.replace(
        /{(\$[A-Z_]+)}/g,
        (match) => {
          const key = match.slice(2, -1);
          const valueMap: Record<string, string> = {
            DEVELOPMENT_TYPE: developmentType,
            CURRENT_INCOME: currentIncome,
            TARGET_INCOME: targetIncome,
            TIME_FRAME: timeframe,
            KEY_SKILLS: skills
          };
          return valueMap[key] || match;
        }
      );

      const userMessage: ChatMessage = {
        id: uuidv4(),
        content: `我计划通过${developmentType}来开发财富。我当前的收入是${currentIncome}元，目标是在${timeframe}内达到${targetIncome}元的收入。我的主要技能是${skills}。请为我分析可行性并提供建议。`,
        isUser: true,
        timestamp: new Date()
      };

      const messageHistory = [
        {
          role: 'system',
          content: prompt
        },
        {
          role: 'user',
          content: userMessage.content
        }
      ];

      setMessages(prev => [...prev, userMessage]);

      const response = await fetchApi(
        config.apiEndpoints.ai.chat,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: messageHistory
          })
        }
      );

      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        content: processContent(response.choices?.[0]?.message?.content || ''),
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: "抱歉，分析过程出现错误，请稍后重试。",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error(error instanceof Error ? error.message : '分析失败');
      setIsFormExpanded(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  const loadingMessages = [
    "请求正在跑向服务器...",
    "正在头脑风暴中...",
    "内容疯狂展示中...",
  ];

  const [currentLoadingMessageIndex, setCurrentLoadingMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2000); // 每2秒切换一次文案

    return () => clearInterval(interval);
  }, []);
 // 监听 currentMessageIndex 的变化

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-100 to-teal-200 flex flex-col">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-3"
              onClick={() => router.push('/decisions')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-base font-medium">财富开发助手</h1>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto pb-16">
          <div className="max-w-md mx-auto px-4 pt-16">
            {/* Assistant Introduction */}
            <div className="mt-6 mb-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src="/images/placeholder.svg"
                    alt="Assistant"
                  />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              </div>
              <div className="bg-white rounded-2xl p-4 mx-auto max-w-[280px] shadow-sm">
                <h2 className="font-medium mb-1 text-sm">我是财富开发智能助手</h2>
                <p className="text-xs text-gray-600">
                  我会帮您分析财富开发机会，提供专业建议，助您实现财务增长目标~
                </p>
              </div>
            </div>

            {/* Input Form */}
            <CollapsibleSection
              title="开发信息"
              isExpanded={isFormExpanded}
              onToggle={() => setIsFormExpanded(!isFormExpanded)}
              previewContent={
                <div className="space-y-4">
                  <h3 className="text-base font-medium">开发信息</h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>开发类型: {developmentType || '未设置'}</span>
                    <span>目标收入: {targetIncome ? `¥${targetIncome}` : '未设置'}</span>
                  </div>
                </div>
              }
            >
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">开发类型</label>
                  <Select onValueChange={setDevelopmentType}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="选择开发类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {wealthDevelopmentTypes.map(type => (
                        <SelectItem key={type.value} value={type.title}>
                          {type.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">当前收入</label>
                  <Input
                    placeholder="输入当前月收入..."
                    value={currentIncome}
                    onChange={(e) => setCurrentIncome(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">目标收入</label>
                  <Input
                    placeholder="输入目标月收入..."
                    value={targetIncome}
                    onChange={(e) => setTargetIncome(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">预计时间</label>
                  <Input
                    placeholder="输入预计达成时间..."
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">主要技能</label>
                  <Input
                    placeholder="输入您的主要技能..."
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="h-10"
                  />
                </div>

                <Button
                  className="w-full mt-6 bg-gradient-to-r from-green-400 to-teal-400 text-white h-10"
                  onClick={handleSubmitInfo}
                  disabled={isSubmitting}
                >
                  开始分析
                </Button>
              </div>
            </CollapsibleSection>

            {/* Chat Messages */}
            <div className="space-y-4 mt-6">
              {messages.map((msg) => (
                <FormattedMessage
                  key={msg.id}
                  message={msg}
                  assistantImage="/images/placeholder.svg"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="bg-white border-t border-gray-100 fixed bottom-0 left-0 right-0">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center space-x-2">
            <Input
              type="text"
              placeholder="输入你的问题..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(message)
                }
              }}
              className="flex-grow h-10"
            />
            <Button
              size="icon"
              className="bg-gradient-to-r from-green-400 to-teal-400 text-white h-10 w-10 shrink-0"
              onClick={() => handleSendMessage(message)}
              disabled={isSubmitting || !message.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-t-transparent border-green-500 rounded-full animate-spin" />
            <span className="text-sm text-gray-600">
            {loadingMessages[currentLoadingMessageIndex]}
            </span>
          </div>
        </div>
      )}
    </main>
  )
}

