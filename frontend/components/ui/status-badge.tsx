import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  className?: string
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
    case '通过':
      return 'bg-green-100 text-green-800'
    case 'caution':
    case '谨慎':
      return 'bg-yellow-100 text-yellow-800'
    case 'warning':
    case '警告':
      return 'bg-orange-100 text-orange-800'
    case 'rejected':
    case '不通过':
      return 'bg-red-100 text-red-800'
    case 'pending':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-blue-100 text-blue-800'
  }
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
        getStatusColor(status),
        className
      )}
    >
      {status}
    </span>
  )
} 