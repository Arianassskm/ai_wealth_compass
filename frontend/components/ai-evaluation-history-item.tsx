import Link from 'next/link'
import { StatusBadge } from '@/components/ui/status-badge'

interface Props {
  id: string
  label: string
  time: string
  amount: string
  decision: string
}

export function AIEvaluationHistoryItem({ id, label, time, amount, decision }: Props) {
  return (
    <Link href={`/ai-evaluation/${id}`}>
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex-1">
          <div className="font-medium text-gray-900">{label}</div>
          <div className="text-sm text-gray-500">{time}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-medium text-gray-900">¥{amount}</div>
          </div>
          <StatusBadge status={decision} />
        </div>
      </div>
    </Link>
  )
} 