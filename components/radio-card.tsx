import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from 'lucide-react'

interface RadioCardProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mainLabel: string
  subLabel: string
  colorScheme: 'blue' | 'green' | 'purple' | 'orange'
}

const RadioCard = React.forwardRef<HTMLInputElement, RadioCardProps>(
  ({ className, mainLabel, subLabel, colorScheme, ...props }, ref) => {
    const colorClasses = {
      blue: 'peer-checked:border-blue-500 peer-checked:bg-blue-50',
      green: 'peer-checked:border-green-500 peer-checked:bg-green-50',
      purple: 'peer-checked:border-purple-500 peer-checked:bg-purple-50',
      orange: 'peer-checked:border-orange-500 peer-checked:bg-orange-50',
    }

    const iconColorClasses = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      purple: 'text-purple-500',
      orange: 'text-orange-500',
    }

    return (
      <div className="relative">
        <input
          type="radio"
          className="peer sr-only"
          ref={ref}
          {...props}
        />
        <label
          htmlFor={props.id}
          className={cn(
            "flex cursor-pointer flex-col items-start justify-between rounded-xl border-2 border-gray-200 bg-white p-2 sm:p-4 transition-all hover:border-gray-300",
            colorClasses[colorScheme],
            "shadow-sm hover:shadow-md",
            className
          )}
        >
          <div className="w-full">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-base font-semibold leading-none">{mainLabel}</span>
              <Check className={cn(
                "h-3 w-3 sm:h-5 sm:w-5 opacity-0 transition-opacity peer-checked:opacity-100",
                iconColorClasses[colorScheme],
              )} />
            </div>
            <p className="text-[10px] sm:text-sm text-gray-500 mt-1 sm:mt-2">{subLabel}</p>
          </div>
        </label>
      </div>
    )
  }
)
RadioCard.displayName = "RadioCard"

export { RadioCard }

