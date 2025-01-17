"use client"

import { useState } from "react"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ImageIcon } from 'lucide-react'

interface ComparisonItem {
  category: string
  quantity: string
  price?: string
  image?: string
  originalPrice?: string
  tags?: string[]
}

interface ShoppingComparisonProps {
  items: ComparisonItem[]
}

export function ShoppingComparison({ items }: ShoppingComparisonProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({})

  const toggleItem = (category: string) => {
    setSelectedItems(prev => 
      prev.includes(category) 
        ? prev.filter(item => item !== category)
        : [...prev, category]
    )
  }

  const handleImageError = (category: string) => {
    setImageError(prev => ({
      ...prev,
      [category]: true
    }))
  }

  const total = items
    .filter(item => selectedItems.includes(item.category))
    .reduce((sum, item) => sum + (parseFloat(item.price?.replace(/[^\d.]/g, '') || '0')), 0)

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-100">
          <Checkbox
            checked={selectedItems.includes(item.category)}
            onChange={() => toggleItem(item.category)}
            className="mt-1"
          />
          <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
            {imageError[item.category] ? (
              <ImageIcon className="w-6 h-6 text-gray-400" />
            ) : (
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.category}
                fill
                className="object-cover"
                onError={() => handleImageError(item.category)}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 mb-1">{item.category}</h4>
            <p className="text-sm text-gray-500">{item.quantity}</p>
            {item.tags && (
              <div className="flex flex-wrap gap-2 mt-2">
                {item.tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-600">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-lg font-medium text-blue-600">{item.price}</div>
            {item.originalPrice && (
              <div className="text-sm text-gray-400 line-through">{item.originalPrice}</div>
            )}
          </div>
        </div>
      ))}
      
      {selectedItems.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">已选 {selectedItems.length} 件</span>
            <span className="text-lg font-medium text-blue-600">¥{total.toFixed(2)}</span>
          </div>
          <Button className="w-full" size="lg">
            <ShoppingCart className="mr-2 h-4 w-4" />
            去付款购买套餐
          </Button>
        </div>
      )}
    </div>
  )
}

