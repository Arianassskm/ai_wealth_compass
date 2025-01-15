"use client"

import { useState, useEffect, useRef } from 'react'
import React from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AssistantLayout } from '@/components/assistant-layout'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Save, FileText, ArrowLeft, Info, Edit2, Wallet, CreditCard, Building, Briefcase, Car, DollarSign, BookOpen, ShoppingCart, PiggyBank, Gift, Image, TrendingUp, X, Trash2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import {
 HoverCard,
 HoverCardContent,
 HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

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

export default function WealthCompositionPage() {
 const router = useRouter()
 const [wealthComponents, setWealthComponents] = useState([
   { id: '1', name: '收入', value: 150000, icon: 'Briefcase' },
   { id: '2', name: '固定资产', value: 1000000, icon: 'Building' },
   { id: '3', name: '金融资产', value: 500000, icon: 'CreditCard' },
   { id: '4', name: '储蓄', value: 250000, icon: 'PiggyBank' },
 ])

 const [editingId, setEditingId] = useState<string | null>(null)
 const inputRef = useRef<HTMLInputElement>(null)

 const totalAssetValue = wealthComponents.reduce((sum, component) => sum + component.value, 0)
 const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6', '#14B8A6', '#F43F5E', '#22C55E']

 useEffect(() => {
   if (editingId && inputRef.current) {
     inputRef.current.focus()
   }
 }, [editingId])

 const formatPercentage = (value: number, total: number) => {
   return ((value / total) * 100).toFixed(1) + '%'
 }

 const handleUpdateComponent = (id: string, newValue: number) => {
   setWealthComponents(prev =>
     prev.map(c => c.id === id ? { ...c, value: newValue } : c)
   )
   setEditingId(null)
   toast({
     title: "更新成功",
     description: `资产数据已成功更新。`,
   })
 }

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
   setEditingId(newComponent.id)
 }

 useEffect(() => {
   const fetchAIEstimation = async () => {
     try {
       const response = await fetch('/api/v1/user/profile')
       const data = await response.json()
       
       if (data.ai_evaluation_details?.wealth_composition) {
         setWealthComponents(data.ai_evaluation_details.wealth_composition)
       }
     } catch (error) {
       console.error('Error fetching AI estimation:', error)
     }
   }

   fetchAIEstimation()
 }, [])

 return (
   <AssistantLayout
     title="财富构成"
     description="查看和管理您的财富组成"
     avatarSrc="/placeholder.svg"
     onBack={() => router.push('/')}
     sections={[
       {
         id: 'wealth-overview',
         title: '财富概览',
         content: (
           <motion.div 
             className="space-y-4"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
           >
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <div className="text-left">
                 <p className="text-lg font-semibold text-gray-700">总资产</p>
                 <motion.p 
                   className="text-3xl font-bold text-blue-600"
                   initial={{ scale: 0.5 }}
                   animate={{ scale: 1 }}
                   transition={{ type: "spring", stiffness: 260, damping: 20 }}
                 >
                   ¥{totalAssetValue.toLocaleString()}
                 </motion.p>
               </div>
               <div className="w-full sm:w-[300px] h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={wealthComponents}
                       dataKey="value"
                       nameKey="name"
                       cx="50%"
                       cy="50%"
                       outerRadius={100}
                       label={({ name, value }) => `${name} ${formatPercentage(value, totalAssetValue)}`}
                     >
                       {wealthComponents.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip 
                       formatter={(value: number) => `¥${value.toLocaleString()}`}
                     />
                     <Legend />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
             </div>
           </motion.div>
         ),
         defaultOpen: true,
       },
       {
         id: 'wealth-details',
         title: '财富明细',
         content: (
           <div className="space-y-6">
             {wealthComponents.map((component, index) => (
               <motion.div 
                 key={component.id} 
                 className="space-y-2"
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.3, delay: index * 0.1 }}
               >
                 <Card className="p-4">
                   <div className="flex justify-between items-center mb-4">
                     <div className="flex items-center gap-2">
                       {React.createElement(icons[component.icon], { className: "w-5 h-5 text-gray-600" })}
                       <h3 className="font-semibold text-lg text-gray-900">
                         {component.name}
                         {component.name === '收入' && (
                           <span className="text-xs text-gray-500 ml-1">(每月)</span>
                         )}
                       </h3>
                     </div>
                     <div className="flex items-center gap-2">
                       {editingId === component.id ? (
                         <Input
                           ref={inputRef}
                           type="number"
                           value={component.value}
                           onChange={(e) => {
                             const newValue = parseFloat(e.target.value);
                             if (!isNaN(newValue)) {
                               handleUpdateComponent(component.id, newValue);
                             }
                           }}
                           onBlur={() => setEditingId(null)}
                           className="w-32 text-right"
                         />
                       ) : (
                         <p className="text-xl font-bold">¥{component.value.toLocaleString()}</p>
                       )}
                       <Button variant="ghost" size="sm" onClick={() => setEditingId(component.id)}>
                         <Edit2 className="w-4 h-4" />
                       </Button>
                       <Button variant="ghost" size="sm" onClick={() => handleDeleteComponent(component.id)}>
                         <Trash2 className="w-4 h-4 text-red-500" />
                       </Button>
                     </div>
                   </div>
                   <div className="space-y-2">
                     <div className="flex justify-between text-sm text-gray-600">
                       <span>占总资产比例</span>
                       <span>{formatPercentage(component.value, totalAssetValue)}</span>
                     </div>
                     <Progress value={(component.value / totalAssetValue) * 100} className="h-2" />
                   </div>
                 </Card>
               </motion.div>
             ))}
             <Button onClick={handleAddComponent} className="w-full">
               <Plus className="w-4 h-4 mr-2" />
               添加其他资产
             </Button>
           </div>
         ),
         defaultOpen: true,
       },
     ]}
   >
   </AssistantLayout>
 )
}

