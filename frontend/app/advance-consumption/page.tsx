"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Send, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { config } from '@/config'
import { toast } from 'sonner'
import { fetchApi } from '@/lib/api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import { Message, type ChatMessage } from '@/components/chat/message'
import { v4 as uuidv4 } from 'uuid'
import { CollapsibleSection } from "@/components/collapsible-section"
import { useAuthContext } from '@/providers/auth-provider'
import { FormattedMessage } from '@/components/formatted-message'

const remindText = `你是一个专业的提前消费分析助手。你的任务是根据用户提供的信息，分析提前消费的合理性并提供建议。请按照以下步骤进行分析：

首先，这是用户提供的信息：
<consumption_info>
消费类型：{$CONSUMPTION_TYPE}
预计金额：{$PLANNED_AMOUNT}
计划时间：{$PLANNED_TIME}
月收入：{$MONTHLY_INCOME}
当前储蓄：{$CURRENT_SAVINGS}
筹资方式：{$FUNDING_METHOD}
</consumption_info>

请在<analysis>标签中进行以下分析：
1. 计算关键财务指标：
   - 消费占月收入比例
   - 消费占当前储蓄比例
   - 如选择贷款/分期，计算月供压力

2. 评估风险等级：
   低风险：消费金额<3个月收入，且月供<月收入30%
   中等风险：消费金额在3-6个月收入之间，或月供在30%-50%之间
   高风险：消费金额>6个月收入，或月供>50%

3. 针对不同筹资方式的具体分析：
   - 信用卡：关注分期利率和总成本
   - 贷款：评估还款压力和期限
   - 储蓄：分析对流动性的影响

在<recommendation>标签中提供建议，包括：
1. 总体建议：是否建议进行这笔消费
2. 风险提示：可能面临的财务风险
3. 优化方案：如何优化支出计划
4. 替代方案：如有必要，提供替代性建议

遵循以下输出格式：
1. 使用清晰的分隔符和emoji
2. 重要数据使用加粗格式
3. 风险等级使用醒目的符号标识
4. 建议部分使用要点符号列表

在输出时，使用以下emoji：
- 分析：🔍
- 财务指标：💰
- 风险评估：⚠️
- 建议：💡
- 优化方案：✨
- 警告：❗
- 正面评价：✅
- 负面评价：❌

记住要避免过于专业的金融术语，使用通俗易懂的语言。如果发现极端的财务风险，要明确给出警告。所有数字计算要准确，建议要具体且可执行。

根据用户的消费类型采取不同的分析重点：
- 旅游：关注季节性价格差异和可替代方案
- 教育：分析投资回报周期和职业发展契合度
- 购物：评估必要性和折旧情况
- 其他：根据具体类型调整分析维度
`

const consumptionTypes = [
  { title: "结婚", value: "wedding" },
  { title: "子女教育", value: "education" },
  { title: "购房", value: "house" },
  { title: "购车", value: "car" },
  { title: "旅游", value: "travel" },
  { title: "其他大额消费", value: "other" },
]

const financingMethods = [
  { title: "储蓄", value: "savings" },
  { title: "贷款", value: "loan" },
  { title: "分期付款", value: "installment" },
  { title: "投资收益", value: "investment" },
]

// 添加接口类型定义
interface ConsumptionAnalysisRequest {
  consumption_type: string;
  planned_amount: number;
  planned_time: string;
  monthly_income: number;
  current_savings: number;
  funding_method: string;
}

interface ConsumptionAnalysisResponse {
  analysis: {
    income_ratio: number;
    savings_ratio: number;
    monthly_payment?: number;
    risk_level: 'low' | 'medium' | 'high';
  };
  recommendation: {
    overall: string;
    risks: string[];
    optimizations: string[];
    alternatives: string[];
  };
}

// 添加处理标签的工具函数
const processContent = (content: any) => {
  // 从 response 中提取实际的消息内容
  const extractContent = (response: any) => {
    if (response?.choices?.[0]?.message?.content) {
      return response.choices[0].message.content;
    }
    // 如果已经是字符串，直接返回
    if (typeof response === 'string') {
      return response;
    }
    return '';
  };

  try {
    const messageContent = extractContent(content);
    if (!messageContent) return '';

    // 处理 <analysis> 和 <recommendation> 标签
    const sections = messageContent
      .split(/(<\/?analysis>|<\/?recommendation>)/g)
      .filter(section => section.trim() && !section.match(/<\/?analysis>|<\/?recommendation>/));

    return sections.map(section => {
      // 处理 Markdown 格式
      return section
        .replace(/\*\*(.*?)\*\*/g, '$1')  // 移除加粗标记
        .replace(/\n+/g, '\n')            // 规范化换行
        .trim();
    }).join('\n\n');
  } catch (error) {
    console.error('Error processing content:', error);
    return typeof content === 'string' ? content : '';
  }
};

export default function AdvanceConsumptionPage() {
  const router = useRouter()
  const { token } = useAuthContext()
  const [message, setMessage] = useState('')
  const [consumptionType, setConsumptionType] = useState('')
  const [amount, setAmount] = useState('')
  const [timeframe, setTimeframe] = useState('')
  const [income, setIncome] = useState('')
  const [financingMethod, setFinancingMethod] = useState('')
  const [currentSavings, setCurrentSavings] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      content: "你好！我是消费规划助手。请告诉我你的具体情况，我会帮你分析消费计划。",
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
        content: processContent(response.choices?.[0]?.message?.content || ''), // 直接传入消息内容
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
    if (!consumptionType || !amount || !timeframe || !income || !financingMethod || !currentSavings) {
      toast.error('请填写完整信息');
      return;
    }

    setIsFormExpanded(false);
    setIsSubmitting(true);

    try {
      const userMessage: ChatMessage = {
        id: uuidv4(),
        content: `我计划${consumptionType}，预计需要${amount}元，希望在${timeframe}内实现。我的月收入是${income}元，当前储蓄${currentSavings}元，计划通过${financingMethod}方式筹集资金。`,
        isUser: true,
        timestamp: new Date()
      };

      const messageHistory = [
        {
          role: 'system',
          content: remindText
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
        content: processContent(response.choices?.[0]?.message?.content || ''), // 直接传入消息内容
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-200 flex flex-col relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 shadow-lg flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600">分析中...</span>
          </div>
        </div>
      )}

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
            <h1 className="text-base font-medium">提前消费助手</h1>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto pb-16">
          <div className="max-w-md mx-auto px-4 pt-16">
            {/* Assistant Introduction */}
            <div className="mt-6 mb-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                <Image
                  src="/images/placeholder.svg"
                  alt="Assistant"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              </div>
              <div className="bg-white rounded-2xl p-4 mx-auto max-w-[280px] shadow-sm">
                <h2 className="font-medium mb-1 text-sm">我是提前消费智能助手</h2>
                <p className="text-xs text-gray-600">
                  我会帮您合理安排提前消费，平衡当前享受和未来财务，确保您在提升生活品质的同时保持财务健康~
                </p>
              </div>
            </div>

            {/* Input Form */}
            <CollapsibleSection
              isExpanded={isFormExpanded}
              onToggle={() => setIsFormExpanded(!isFormExpanded)}
              previewContent={
                <div className="space-y-4">
                  <h3 className="text-base font-medium">消费信息</h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>消费类型: {consumptionType || '未设置'}</span>
                    <span>金额: {amount ? `¥${amount}` : '未设置'}</span>
                  </div>
                </div>
              }
            >
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">消费类型</label>
                  <Select onValueChange={setConsumptionType}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="选择消费类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {consumptionTypes.map(type => (
                        <SelectItem key={type.value} value={type.title}>
                          {type.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">预计金额</label>
                  <Input
                    placeholder="输入金额..."
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">计划时间</label>
                  <Input
                    placeholder="输入计划时间..."
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">月收入</label>
                  <Input
                    placeholder="输入月收入..."
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">当前储蓄</label>
                  <Input
                    placeholder="输入当前储蓄..."
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">筹资方式</label>
                  <Select onValueChange={setFinancingMethod}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="选择筹资方式" />
                    </SelectTrigger>
                    <SelectContent>
                      {financingMethods.map(method => (
                        <SelectItem key={method.value} value={method.title}>
                          {method.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full mt-6 bg-gradient-to-r from-amber-400 to-orange-400 text-white h-10"
                  onClick={handleSubmitInfo}
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
                  assistantImage="/images/placeholder.svg?height=32&width=32"
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
              className="bg-gradient-to-r from-amber-400 to-orange-400 text-white h-10 w-10 shrink-0"
              onClick={() => handleSendMessage(message)}
              disabled={isSubmitting || !message.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

