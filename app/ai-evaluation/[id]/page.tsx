"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ThumbsUp, ThumbsDown, Smartphone, Map, Utensils } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from '@/components/status-badge'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'text-green-600';
    case 'caution': return 'text-yellow-600';
    case 'warning': return 'text-orange-600';
    case 'rejected': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'approved': return '通过';
    case 'caution': return '谨慎';
    case 'warning': return '警告';
    case 'rejected': return '不通过';
    default: return '未知';
  }
};

const fetchEvaluationData = async (id: string) => {
  // 这里应该是一个实际的API调用
  const evaluations = {
    "1": {
      id: "1",
      purpose: '意外医疗',
      amount: 500,
      status: 'approved' as const,
      score: 90,
      pros: [
        "及时处理健康问题很重要",
        "金额相对较小，不会对财务造成重大影响",
        "可能防止未来更高的医疗费用"
      ],
      cons: [
        "可能影响当月其他预算",
        "如果频繁发生，需要考虑购买更好的医疗保险"
      ],
      evaluationPoints: [
        { point: "必要性高", description: "及时的医疗处理对健康至关重要，可能预防更严重的健康问题。" },
        { point: "紧急性", description: "医疗支出通常具有紧急性，不能轻易推迟。" },
        { point: "长期影响", description: "及时的医疗干预可能会降低未来的医疗成本。" },
      ],
      longTermImpact: "及时的医疗处理有利于长期健康，但也要注意平衡健康投资和其他财务目标。",
      boardDecision: "经过私董会讨论，认为该支出合理且必要。建议通过，但需要注意控制频率。",
      expertModels: [
        { name: "吴军", avatar: "/experts/wujun.jpg", status: 'approved', emoji: '🙋‍♂️' },
        { name: "刘擎", avatar: "/experts/liuqing.jpg", status: 'caution', emoji: '🤔' },
        { name: "冯唐", avatar: "/experts/fengtang.jpg", status: 'warning', emoji: '🤜' },
      ],
    },
    "2": {
      id: "2",
      purpose: '日常购物',
      amount: 200.5,
      status: 'approved' as const,
      score: 85,
      pros: [
        "金额适中，在日常预算范围内",
        "满足基本生活需求",
        "有助于维持生活质量"
      ],
      cons: [
        "需要确保不会频繁超出预算",
        "可能有更经济的购物选择"
      ],
      evaluationPoints: [
        { point: "必要性", description: "满足基本生活需求。" },
        { point: "经济性", description: "金额适中，在日常预算范围内。" },
        { point: "长期影响", description: "良好的日常消费习惯有助于长期财务健康。" },
      ],
      longTermImpact: "良好的日常消费习惯有助于长期财务健康，但要警惕小额消费累积带来的影响。",
      boardDecision: "经过私董会讨论，认为该支出合理且必要。建议通过，但需要注意控制频率。",
      expertModels: [
        { name: "吴军", avatar: "/experts/wujun.jpg", status: 'approved', emoji: '🙋‍♂️' },
        { name: "刘擎", avatar: "/experts/liuqing.jpg", status: 'caution', emoji: '🤔' },
        { name: "冯唐", avatar: "/experts/fengtang.jpg", status: 'warning', emoji: '🤜' },
      ],
    },
    "3": {
      id: "3",
      purpose: '娱乐消费',
      amount: 1000,
      status: 'caution' as const,
      score: 60,
      pros: [
        "有助于缓解压力，提高生活质量",
        "可能增进社交关系",
        "适度娱乐有利于工作效率的提升"
      ],
      cons: [
        "金额相对较大，可能超出娱乐预算",
        "可能影响其他更重要的财务目标",
        "需要警惕娱乐消费的频率和金额"
      ],
      evaluationPoints: [
        { point: "益处", description: "有助于缓解压力，提高生活质量，可能增进社交关系。" },
        { point: "风险", description: "金额相对较大，可能超出娱乐预算，影响其他财务目标。" },
        { point: "可持续性", description: "需要控制娱乐消费的频率和金额。" },
      ],
      longTermImpact: "适度的娱乐消费有利于生活平衡，但需要控制在合理范围内，避免影响长期财务规划。",
      boardDecision: "经过私董会讨论，认为该支出合理且必要。建议通过，但需要注意控制频率。",
      expertModels: [
        { name: "吴军", avatar: "/experts/wujun.jpg", status: 'approved', emoji: '🙋‍♂️' },
        { name: "刘擎", avatar: "/experts/liuqing.jpg", status: 'caution', emoji: '🤔' },
        { name: "冯唐", avatar: "/experts/fengtang.jpg", status: 'warning', emoji: '🤜' },
      ],
    },
    "4": {
      id: "4",
      purpose: '奢侈品购买',
      amount: 5000,
      status: 'warning' as const,
      score: 30,
      pros: [
        "可能提升个人满足感",
        "某些奢侈品可能具有收藏或增值价值",
        "在特定场合可能有社交价值"
      ],
      cons: [
        "金额较大，可能严重影响当前财务状况",
        "可能挤占其他重要的财务目标资金",
        "奢侈品通常快速贬值，不利于资产增值"
      ],
      evaluationPoints: [
        { point: "价值", description: "某些奢侈品可能具有收藏或增值价值，提升个人满足感。" },
        { point: "风险", description: "金额较大，可能严重影响当前财务状况，挤占其他重要财务目标。" },
        { point: "长期影响", description: "奢侈品通常快速贬值，不利于资产增值。" },
      ],
      longTermImpact: "频繁的奢侈品消费可能严重影响长期财务健康，建议谨慎考虑并控制这类支出。",
      boardDecision: "经过私董会讨论，认为该支出合理且必要。建议通过，但需要注意控制频率。",
      expertModels: [
        { name: "吴军", avatar: "/experts/wujun.jpg", status: 'approved', emoji: '🙋‍♂️' },
        { name: "刘擎", avatar: "/experts/liuqing.jpg", status: 'caution', emoji: '🤔' },
        { name: "冯唐", avatar: "/experts/fengtang.jpg", status: 'warning', emoji: '🤜' },
      ],
    }
  };

  return evaluations[id as keyof typeof evaluations] || null;
}

export default function AIEvaluationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [evaluationData, setEvaluationData] = useState<any>(null)

  useEffect(() => {
    const loadEvaluationData = async () => {
      const data = await fetchEvaluationData(params.id)
      setEvaluationData(data)
    }
    loadEvaluationData()
  }, [params.id])

  if (!evaluationData) {
    return <div>加载中...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">AI评估详情</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6 pb-16">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-4">
              <StatusBadge status={evaluationData.status} className="text-2xl px-6 py-2 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">{evaluationData.purpose}</h2>
              <p className="text-3xl font-bold text-blue-600">¥{evaluationData.amount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">费用可视化</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Smartphone, label: '手机', emoji: '📱', color: 'bg-blue-100', reference: 5000, quantity: 1 },
                { icon: Map, label: '旅行', emoji: '🗺️', color: 'bg-green-100', reference: 3000, quantity: 2 },
                { icon: Utensils, label: '餐饮', emoji: '🍽️', color: 'bg-yellow-100', reference: 200, quantity: 15 },
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <item.icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-800">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-sm text-gray-600">
                      参考价：¥{item.reference.toLocaleString()} x {item.quantity}
                    </span>
                  </div>
                  <div className={`w-full h-2 ${item.color} rounded-full overflow-hidden`}>
                    <div
                      className="h-full bg-gray-300"
                      style={{
                        width: `${Math.min(100, (evaluationData.amount / (item.reference * item.quantity)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">私董会决议情况</h3>
            <p className="text-sm text-gray-700 mb-4">{evaluationData.boardDecision}</p>
            <h4 className="text-md font-semibold text-gray-800 mt-6 mb-4">专家模型策略评估</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {evaluationData.expertModels.map((expert: any, index: number) => (
                <div key={index} className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-sm">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={expert.avatar} alt={expert.name} />
                    <AvatarFallback>{expert.name[0]}</AvatarFallback>
                  </Avatar>
                  <p className="font-medium text-sm text-center">{expert.name}模型</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{expert.emoji}</span>
                    <span className={`text-sm font-medium ${getStatusColor(expert.status)}`}>
                      {getStatusText(expert.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">评估内容</h3>
            <ul className="space-y-4">
              {evaluationData.evaluationPoints.map((point: { point: string; description: string }, index: number) => (
                <li key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-gray-800 mb-2">{point.point}</h4>
                  <p className="text-sm text-gray-600">{point.description}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">长期影响</h3>
            <p className="text-sm text-gray-700">{evaluationData.longTermImpact}</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

