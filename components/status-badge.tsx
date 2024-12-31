import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-6 py-2 text-2xl font-bold",
  {
    variants: {
      variant: {
        approved: "bg-green-100 text-green-800",
        caution: "bg-yellow-100 text-yellow-800",
        warning: "bg-orange-100 text-orange-800",
        rejected: "bg-red-100 text-red-800",
      },
    },
    defaultVariants: {
      variant: "caution",
    },
  }
)

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  status: 'approved' | 'caution' | 'warning' | 'rejected'
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const statusText = {
    approved: '通过',
    caution: '谨慎',
    warning: '警告',
    rejected: '不通过'
  }

  return (
    <span className={cn(statusBadgeVariants({ variant: status }), className)} {...props}>
      {statusText[status]}
    </span>
  )
}

