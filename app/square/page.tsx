"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronRight, Star, Flame } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { BottomNav } from "@/components/bottom-nav"
import { EnhancedBackground } from '@/components/enhanced-background'
import { FloatingAssistant } from '@/components/floating-assistant'

// Updated mock data for Expert Model Strategies
const expertModelStrategies = [
 { id: 1, name: "财富决策模型", expert: "吴军", avatar: "/experts/wujun.jpg", description: "基于大数据的个人财富决策框架", field: "财富管理", price: "？？", popularity: 95 },
 { id: 2, name: "超省决策模型", expert: "黑马情侣", avatar: "/experts/heimaqinglv.jpg", description: "适合年轻人的极简理财策略", field: "日常理财", price: "？？", popularity: 98 },
 { id: 3, name: "精英大女主模型", expert: "章小蕙", avatar: "/experts/zhangxiaohui.jpg", description: "女性职场与财务自由指南", field: "职业发展", price: "？？", popularity: 92 },
 { id: 4, name: "价值投资模型", expert: "李录", avatar: "/experts/lilu.jpg", description: "基于公司基本面的长期投资策略", field: "股票投资", price: "？？", popularity: 89 },
 { id: 5, name: "创业财务模型", expert: "王兴", avatar: "/experts/wangxing.jpg", description: "互联网创业公司的财务规划", field: "创业", price: "？？", popularity: 91 },
 { id: 6, name: "退休规划模型", expert: "陈志武", avatar: "/experts/chenzhiwu.jpg", description: "长期财富积累与退休生活规划", field: "退休规划", price: "？？", popularity: 87 },
]

// Mock data for Prompt Marketplace (unchanged)
const promptMarketplace = [
 { id: 1, name: "理财小助手", description: "日常理财建议和预算管理", rating: 4.8 },
 { id: 2, name: "投资顾问", description: "个性化投资组合建议", rating: 4.9 },
 { id: 3, name: "债务管理专家", description: "债务减免和信用修复策略", rating: 4.7 },
 { id: 4, name: "税务规划师", description: "税收优化和合法避税建议", rating: 4.6 },
 { id: 5, name: "创业财务顾问", description: "创业公司财务规划和风险管理", rating: 4.8 },
]

export default function SquarePage() {
 const [searchTerm, setSearchTerm] = useState('')

 return (
   <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
     <EnhancedBackground />

     <div className="max-w-xl mx-auto px-4 pt-8 sm:pt-12 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
       {/* Search Bar */}
       <div className="relative">
         <Input
           type="text"
           placeholder="搜索策略、提示词或专家"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="pl-8 sm:pl-10 pr-4 py-2 w-full rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
         />
         <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
       </div>

       {/* Expert Model Strategies Section */}
       <section>
         <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-semibold text-gray-900">专家模型策略</h2>
           <Button variant="ghost" size="sm" className="text-blue-600">
             查看全部 <ChevronRight className="ml-1 h-4 w-4" />
           </Button>
         </div>
         <ScrollArea className="w-full">
           <div className="grid grid-rows-2 grid-flow-col gap-4" style={{ width: 'max-content' }}>
             {expertModelStrategies.map((strategy) => (
               <motion.div
                 key={strategy.id}
                 whileHover={{ scale: 1.03 }}
                 whileTap={{ scale: 0.98 }}
                 className="w-[calc(40vw-1rem)] sm:w-[calc(50vw-2rem)] max-w-[240px]"
               >
                 <Card className="p-2 sm:p-4 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors h-full flex flex-col justify-between">
                   <div>
                     <div className="flex items-center mb-2 sm:mb-3">
                       <Avatar className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3">
                         <AvatarImage src={strategy.avatar} alt={strategy.expert} />
                         <AvatarFallback>{strategy.expert[0]}</AvatarFallback>
                       </Avatar>
                       <div>
                         <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-1">{strategy.name}</h3>
                         <p className="text-xs text-gray-500">{strategy.expert}</p>
                       </div>
                     </div>
                     <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">{strategy.description}</p>
                   </div>
                   <div>
                     <div className="flex justify-between items-center mb-2">
                       <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                         {strategy.field}
                       </span>
                       <span className="text-red-600 font-semibold">¥{strategy.price}</span>
                     </div>
                     <div className="flex items-center justify-end">
                       <Flame className="w-4 h-4 text-orange-500 mr-1" />
                       <span className="text-sm font-medium text-gray-600">热度 {strategy.popularity}%</span>
                     </div>
                   </div>
                 </Card>
               </motion.div>
             ))}
           </div>
           <ScrollBar orientation="horizontal" />
         </ScrollArea>
       </section>

       {/* Prompt Marketplace Section */}
       <section>
         <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-semibold text-gray-900">AI助手集市</h2>
           <Button variant="ghost" size="sm" className="text-blue-600">
             查看全部 <ChevronRight className="ml-1 h-4 w-4" />
           </Button>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           {promptMarketplace.map((prompt) => (
             <motion.div
               key={prompt.id}
               whileHover={{ scale: 1.03 }}
               whileTap={{ scale: 0.98 }}
             >
               <Card className="p-3 sm:p-4 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors">
                 <div className="flex justify-between items-start">
                   <div>
                     <h3 className="font-semibold text-sm sm:text-base text-gray-900">{prompt.name}</h3>
                     <p className="text-xs sm:text-sm text-gray-500 mt-1">{prompt.description}</p>
                   </div>
                   <div className="flex items-center">
                     <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-1" />
                     <span className="text-xs sm:text-sm font-medium text-gray-600">{prompt.rating}</span>
                   </div>
                 </div>
               </Card>
             </motion.div>
           ))}
         </div>
       </section>
     </div>

     <BottomNav activePage="square" />
     <FloatingAssistant />
   </main>
 )
}

