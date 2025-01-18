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
  const [selectedItems, setSelectedItems] = useState<string[]>(items.map(item => item.category));
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});

  const toggleItem = (category: string) => {
    setSelectedItems(prev => 
      prev.includes(category) 
        ? prev.filter(item => item !== category)
        : [...prev, category]
    );
  };

  const handleImageError = (category: string) => {
    setImageError(prev => ({
      ...prev,
      [category]: true
    }));
  };

  const total = items
    .filter(item => selectedItems.includes(item.category))
    .reduce((sum, item) => sum + (parseFloat(item.price?.replace(/[¥,]/g, '') || '0')), 0);
  return (
    <div className="space-y-2 bg-white rounded-lg">
      {items.map((item, index) => (
        <div key={index} className="flex items-start space-x-3 py-4 border-b border-gray-100 last:border-0">
          <Checkbox
            defaultChecked // 设置默认选中
            onClick={() => toggleItem(item.category)}
            className="mt-1"
          />
          <div className="w-20 h-20 relative rounded overflow-hidden bg-gray-50 flex items-center justify-center">
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
            <p className="text-sm text-gray-500 mb-2">{item.quantity}</p>
            {item.tags && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-600">
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
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <div className="text-gray-500">
              已选 <span className="text-gray-900">{selectedItems.length}</span> 件
            </div>
            <div className="text-xl font-medium text-blue-600">
              ¥{total.toFixed(2)}
            </div>
          </div>
          <Button className="w-full bg-gradient-to-r from-[#dd5382] to-[#dd5382] hover:bg-gradient-to-r hover:from-[#dd5382] hover:to-[#dd5382] !important" size="lg">
            去抖音商城购买
          </Button>
        </div>
      )}
    </div>
  );
}

