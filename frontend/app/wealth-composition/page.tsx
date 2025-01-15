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

export default function WealthCompositionPage() {
 const router = useRouter()
 const { token } = useAuthContext()
 const [wealthComponents, setWealthComponents] = useState<WealthComponent[]>([])

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
                   <div className="flex justify-between items-center mb-4" onClick={(e) => e.stopPropagation()}>
                     <div className="flex items-center gap-2">
                       {React.createElement(icons[component.icon], { className: "w-5 h-5 text-gray-600" })}
                       {editing.id === component.id && editing.field === 'name' ? (
                         <Input
                           ref={inputRef}
                           type="text"
                           value={component.name}
                           onChange={(e) => handleUpdateComponent(component.id, { name: e.target.value })}
                           onBlur={() => handleBlur('name')}
                           className="w-32"
                         />
                       ) : (
                         <h3 
                           className="font-semibold text-lg text-gray-900 cursor-pointer" 
                           onClick={() => setEditing({ id: component.id, field: 'name' })}
                         >
                           {component.name}
                         </h3>
                       )}
                     </div>
                     <div className="flex items-center gap-2">
                       {editing.id === component.id && editing.field === 'value' ? (
                         <Input
                           type="number"
                           value={component.value}
                           onChange={(e) => {
                             const newValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
                             handleUpdateComponent(component.id, { value: newValue });
                           }}
                           onBlur={() => handleBlur('value')}
                           className="w-32 text-right"
                         />
                       ) : (
                         <p 
                           className="text-xl font-bold cursor-pointer"
                           onClick={() => setEditing({ id: component.id, field: 'value' })}
                         >
                           ¥{component.value.toLocaleString()}
                         </p>
                       )}
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
             <Button onClick={handleAddComponent} className="w-full mb-4">
               <Plus className="w-4 h-4 mr-2" />
               添加其他资产
             </Button>
             <div className="flex justify-end">
               <Button 
                 onClick={handleSaveAll}
                 className="bg-blue-600 hover:bg-blue-700 text-white"
               >
                 <Save className="w-4 h-4 mr-2" />
                 保存到数据库
               </Button>
             </div>
           </div>
         ),
         defaultOpen: true,
       },
     ]}
   >
   </AssistantLayout>
 )
}

