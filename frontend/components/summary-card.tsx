import { AssetSummary } from "../types/asset"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'

export function SummaryCard({ summary, onAddAsset }: { summary: AssetSummary; onAddAsset: () => void }) {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">资产概览</h2>
        <Button onClick={onAddAsset} size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          添加资产
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">总资产价值</p>
          <p className="text-lg font-semibold">¥{summary.totalAssetValue.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">资产数量</p>
          <p className="text-lg font-semibold">{summary.assetCount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">每日折旧</p>
          <p className="text-lg font-semibold text-red-500">-¥{summary.dailyDepreciation.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">建议更新</p>
          <p className="text-lg font-semibold text-blue-500">{summary.recommendedRenewal}</p>
        </div>
      </div>
    </Card>
  )
}

