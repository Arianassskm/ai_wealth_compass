import React, { useState } from 'react';
import { Asset } from "../types/asset";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function AssetCard({ asset }: { asset: Asset }) {
  const depreciation = asset.price - asset.secondHandPrice;
  const discount = asset.discount * 100;
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
    // 这里可以添加点击按钮后的逻辑
  };

  return (
    <Card className="p-4 space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={asset.icon || "/placeholder.svg"} alt={asset.name} className="w-8 h-8" />
          <div>
            <h3 className="font-semibold text-lg">{asset.name}</h3>
            <p className="text-sm text-gray-500">{asset.category}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-xl font-bold">¥{asset.price.toLocaleString()}</p>
          <p className="text-sm text-gray-600">预计折损:&nbsp;¥{depreciation.toLocaleString()}</p>
          <p className="text-sm text-red-500">-¥{asset.dailyDepreciation.toFixed(2)}/天</p>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-gray-600">
          <span>购买日期:&nbsp;&nbsp;{asset.purchaseDate}</span>
          <span>使用次数:&nbsp;&nbsp;{asset.usageCount}</span>
        </div>
        {asset.category === "软件订阅" && (
          <div className="flex justify-normal text-sm text-gray-600">
            <span>到期日期:&nbsp;&nbsp;</span>
            <span>{asset.expiryDate}</span>
          </div>
        )}
      </div>
      {asset.secondHandPrice && (
        <div className="pt-2">
          
            {asset.category !== "软件订阅" && (
              <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span className="text-blue-500 font-bold">甩包二手市场价值:&nbsp;&nbsp;{asset.secondHandPrice} 元</span>
            <button className="text-blue-600 bg-transparent hover:bg-blue-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2 border border-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-blue-800">转卖回血</button>
            </div>
            )}
            {asset.category === "软件订阅" && (
              <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span className="text-blue-500 font-bold">现时折扣:&nbsp;&nbsp;{discount}&nbsp;%</span>
            <button className="text-green-600 bg-transparent hover:bg-green-200 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2 border border-green-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-green-800">去充值</button>
           </div>
            )}
            </div>
       )} 
    </Card>
  );
}

