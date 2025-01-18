'use client'

import { useState, useEffect, useRef } from 'react'
import React from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AssistantLayout } from '@/components/assistant-layout'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Save, FileText, ArrowLeft, Info, Edit2, Wallet, CreditCard, Building, Briefcase, Car, DollarSign, BookOpen, ShoppingCart, PiggyBank, Gift, Image, TrendingUp, X, Trash2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { fetchApi } from '@/lib/api'
import { config } from '@/config'
import { useAuthContext } from '@/providers/auth-provider'
import {
 HoverCard,
 HoverCardContent,
 HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { AssetCard } from "@/components/asset-card"
import { SummaryCard } from "@/components/summary-card"
import { Asset, AssetSummary } from "../../types/asset"

interface WealthComponent {
 id: string;
 name: string;
 value: number;
 icon: keyof typeof icons;
}

const icons = {
 Wallet,
 CreditCard,
 Building,
 Briefcase,
 Car,
 DollarSign,
 BookOpen,
 ShoppingCart,
 PiggyBank,
 Gift,
 Image,
 TrendingUp
}

interface EditingState {
  id: string | null;
  field: 'name' | 'value' | null;
}

const mockAssets: Asset[] = [
  {
    id: '1',
    name: '即梦会员',
    category: '软件订阅',
    price: 199,
    dailyDepreciation: 0.55,
    purchaseDate: '2024-01-01',
    expiryDate: '2024-12-31',
    status: '使用中',
    usageCount: 15,
    icon: '/placeholder.svg?height=32&width=32',
    secondHandPrice: 85,
    discount: 0.15
  },
  {
    id: '2',
    name: '扣子专业版',
    category: '软件订阅',
    price: 1,
    dailyDepreciation: 0.02,
    purchaseDate: '2024-01-15',
    expiryDate: '2025-01-14',
    status: '使用中',
    usageCount: 1,
    icon: '/placeholder.svg?height=32&width=32',
    secondHandPrice: 0.5,
    discount: 0.5
  },
  {
    id: '3',
    name: '苹果M4pro',
    category: '电脑',
    price: 15999,
    dailyDepreciation: 13.15,
    purchaseDate: '2024-03-01',
    status: '使用中',
    usageCount: 1,
    icon: '/placeholder.svg?height=32&width=32',
    secondHandPrice: 13500,
  },
  {
    id: '4',
    name: 'iPhone14promax',
    category: '手机',
    price: 7999,
    dailyDepreciation: 6.58,
    purchaseDate: '2023-09-15',
    status: '使用中',
    usageCount: 123,
    icon: '/placeholder.svg?height=32&width=32',
    secondHandPrice: 6200
  },
  {
    id: '5',
    name: 'Surface Book 2',
    category: '电脑',
    price: 8999,
    dailyDepreciation: 7.40,
    purchaseDate: '2023-06-01',
    status: '使用中',
    usageCount: 228,
    icon: '/placeholder.svg?height=32&width=32',
    secondHandPrice: 5800
  },
  {
    id: '6',
    name: 'AirPods 3',
    category: '配件',
    price: 1099,
    dailyDepreciation: 0.90,
    purchaseDate: '2023-12-01',
    status: '使用中',
    usageCount: 46,
    icon: '/placeholder.svg?height=32&width=32',
    secondHandPrice: 850
  }
]

const mockSummary: AssetSummary = {
  totalAssetValue: 34594,
  assetCount: 6,
  dailyDepreciation: 29.40,
  date: '2025/01/15',
  recommendedRenewal: 'Surface Book 2'
}

export default function WealthCompositionPage() {
 const router = useRouter()
 const { token } = useAuthContext()
 const [wealthComponents, setWealthComponents] = useState<WealthComponent[]>([])
 const [sortBy, setSortBy] = useState<'price' | 'date'>('price')
 const [filterCategory, setFilterCategory] = useState<string>('all')
 const [filterStatus, setFilterStatus] = useState<string>('all')

 const [editing, setEditing] = useState<EditingState>({ id: null, field: null });
 const inputRef = useRef<HTMLInputElement>(null)

 const totalAssetValue = wealthComponents.reduce((sum, component) => sum + component.value, 0)
 const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6', '#14B8A6', '#F43F5E', '#22C55E']

 useEffect(() => {
   if (editing.id && inputRef.current) {
     inputRef.current.focus()
   }
 }, [editing.id])

 const formatPercentage = (value: number, total: number) => {
   return ((value / total) * 100).toFixed(1) + '%'
 }

 const handleUpdateComponent = (id: string, updates: Partial<WealthComponent>) => {
   setWealthComponents(prev =>
     prev.map(c => {
       if (c.id === id) {
         if ('value' in updates && typeof updates.value === 'string') {
           updates.value = parseFloat(updates.value) || 0;
         }
         return { ...c, ...updates };
       }
       return c;
     })
   );
 };

 const handleBlur = (field: 'name' | 'value') => {
   setEditing(prev => ({ ...prev, field: null }));
   toast({
     title: "更新成功",
     description: `资产数据已成功更新。`,
   });
 };

 const handleDeleteComponent = (id: string) => {
   setWealthComponents(prev => prev.filter(c => c.id !== id))
   toast({
     title: "删除成功",
     description: `资产项目已成功删除。`,
   })
 }

 const handleAddComponent = () => {
   const newComponent: WealthComponent = {
     id: Date.now().toString(),
     name: '新资产项目',
     value: 0,
     icon: 'Wallet'
   }
   setWealthComponents(prev => [...prev, newComponent])
   setEditing({ id: newComponent.id, field: 'name' })
 }

 useEffect(() => {
   const fetchWealthData = async () => {
     try {
       const response = await fetchApi(config.apiEndpoints.user.profile, { token });
       const data = await response.data;
       
       if (data.ai_evaluation_details?.wealth_composition?.components) {
         const transformedComponents = data.ai_evaluation_details.wealth_composition.components.map((comp: any, index: number) => ({
           id: index.toString(),
           name: comp.type,
           value: comp.amount,
           icon: getIconForAssetType(comp.type)
         }));
         setWealthComponents(transformedComponents);
       }
     } catch (error) {
       console.error('获取财富构成数据失败:', error);
       toast({
         title: "获取数据失败",
         description: "无法加载财富构成数据，请稍后重试",
         variant: "destructive"
       });
     }
   };

   fetchWealthData();
 }, [token]);

 const getIconForAssetType = (type: string): keyof typeof icons => {
   const iconMap: Record<string, keyof typeof icons> = {
     cash: 'Wallet',
     stocks: 'TrendingUp',
     bonds: 'BookOpen',
     real_estate: 'Building',
     other_investments: 'Briefcase'
   } as const;
   
   return iconMap[type.toLowerCase()] || 'Wallet';
 };

 const updateWealthComposition = async (wealthData: WealthComposition) => {
   try {
     const response = await fetchApi(config.apiEndpoints.user.wealthComposition, {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
       },
       token,
       body: JSON.stringify(wealthData)
     });

     if (!response.success) {
       throw new Error(response.error || '更新财富构成失败');
     }
     
     return response.data;
   } catch (error) {
     console.error('更新财富构成失败:', error);
     throw error;
   }
 };

 const handleSaveAll = async () => {
   try {
     const wealthData: WealthComposition = {
       last_updated: new Date().toISOString(),
       components: wealthComponents.map(comp => ({
         type: comp.name,
         percentage: (comp.value / totalAssetValue) * 100,
         amount: comp.value,
         risk_level: "medium",
         liquidity: "medium"
       })),
       analysis: {
         risk_score: 65,
         diversification_score: 80,
         liquidity_score: 70,
         recommendations: []
       }
     };

     await updateWealthComposition(wealthData);
     toast({
       title: "保存成功",
       description: "财富构成数据已更新到数据库",
     });
   } catch (error) {
     console.error('保存财富构成失败:', error);
     toast({
       title: "保存失败",
       description: "请稍后重试",
       variant: "destructive"
     });
   }
 };

 const sortedAndFilteredAssets = mockAssets
   .filter(asset => filterCategory === 'all' || asset.category === filterCategory)
   .filter(asset => filterStatus === 'all' || asset.status === filterStatus)
   .sort((a, b) => sortBy === 'price' ? b.price - a.price : new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())

 return (
   <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 text-gray-800">
     <div className="w-full max-w-[420px] mx-auto px-4 space-y-6 pt-6 pb-20">
       <SummaryCard summary={mockSummary} onAddAsset={() => {/* 处理添加资产的逻辑 */}} />

       <div className="flex gap-2 overflow-x-auto py-2 -mx-4 px-4">
         <Button 
           variant={sortBy === 'price' ? 'default' : 'outline'}
           onClick={() => setSortBy('price')}
           size="sm"
           className="whitespace-nowrap bg-white/80 backdrop-blur-md text-gray-800 hover:bg-white/90 border border-gray-200"
         >
           价格降序 ▼
         </Button>
         <Button 
           variant={filterCategory === 'all' ? 'default' : 'outline'}
           onClick={() => setFilterCategory('all')}
           size="sm"
           className="whitespace-nowrap bg-white/80 backdrop-blur-md text-gray-800 hover:bg-white/90 border border-gray-200"
         >
           全部类别
         </Button>
         <Button 
           variant={filterStatus === 'all' ? 'default' : 'outline'}
           onClick={() => setFilterStatus('all')}
           size="sm"
           className="whitespace-nowrap bg-white/80 backdrop-blur-md text-gray-800 hover:bg-white/90 border border-gray-200"
         >
           全部状态
         </Button>
       </div>

       <div className="space-y-4">
         {sortedAndFilteredAssets.map(asset => (
           <AssetCard key={asset.id} asset={asset} />
         ))}
       </div>

       <Button onClick={handleAddComponent} className="w-full mb-4">
         <Plus className="w-4 h-4 mr-2" />
         添加其他资产
       </Button>
       <div className="flex justify-end">
         <Button 
           onClick={handleSaveAll}
           className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors flex items-center gap-2 px-4 py-2 rounded-md"
         >
           <Save className="w-4 h-4" />
           保存更改
         </Button>
       </div>
     </div>
   </div>
 )
}

