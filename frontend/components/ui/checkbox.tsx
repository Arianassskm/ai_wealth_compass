"use client"

import * as React from "react"
import { Check } from 'lucide-react'
import { cn } from "@/lib/utils"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, ...props }, ref) => {
    return (
      <label className="flex items-center space-x-2 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            className="peer sr-only"
            ref={ref}
            checked={checked}
            {...props}
          />
          <div
            className={cn(
              "w-4 h-4 border border-gray-300 rounded",
              "transition-colors duration-200 ease-in-out",
              "peer-checked:bg-blue-500 peer-checked:border-blue-500",
              className
            )}
          >
            {checked && (
              <Check className="h-3 w-3 text-white" />
            )}
          </div>
        </div>
        {label && <span className="text-sm text-gray-700">{label}</span>}
      </label>
    )
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox }

