"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface ChatMessage {
 id: string
 content: string
 isUser: boolean
 timestamp: Date
}

interface MessageProps {
 message: ChatMessage
 assistantImage?: string
}

export function Message({ message, assistantImage = "/placeholder.svg" }: MessageProps) {
 return (
   <motion.div
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     className={`flex items-start gap-3 ${message.isUser ? 'flex-row-reverse' : ''}`}
   >
     <Avatar className="w-8 h-8">
       {message.isUser ? (
         <>
           <AvatarImage src="/placeholder.svg" alt="User" />
           <AvatarFallback>U</AvatarFallback>
         </>
       ) : (
         <>
           <AvatarImage src={assistantImage} alt="Assistant" />
           <AvatarFallback>A</AvatarFallback>
         </>
       )}
     </Avatar>
     <div
       className={`max-w-[80%] rounded-2xl px-4 py-2 ${
         message.isUser
           ? 'bg-blue-500 text-white'
           : 'bg-white/70 backdrop-blur-sm text-gray-900'
       }`}
     >
       <p className="text-sm">{message.content}</p>
       <time className={`text-xs mt-1 block ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
         {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
       </time>
     </div>
   </motion.div>
 )
}

