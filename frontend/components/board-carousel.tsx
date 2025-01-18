"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/ui/status-badge"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface BoardMember {
  name: string
  role: string
  score: number
  comment: string
  emoji: string
  avatar?: string
}

interface BoardCarouselProps {
  members: BoardMember[]
}

export function BoardCarousel({ members }: BoardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(1)

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === members.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? members.length - 1 : prev - 1))
  }

  return (
    <div className="relative w-full py-4">
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 z-10 h-8 w-8"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center justify-center overflow-hidden h-[140px]">
          {members.map((member, index) => {
            const isActive = index === activeIndex
            const offset = index - activeIndex
            
            return (
              <motion.div
                key={member.name}
                className={`absolute flex-none transition-all duration-300 ease-in-out`}
                animate={{
                  scale: isActive ? 1.02 : 0.9,
                  opacity: Math.abs(offset) > 1 ? 0 : 1,
                  x: `${offset * 120}px`,
                  zIndex: isActive ? 10 : 5,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className={`w-[100px] text-center`}>
                  <Avatar className="w-12 h-12 mx-auto mb-2">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <h4 className="text-sm font-medium mb-1">{member.name}</h4>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-1">{member.role}</p>
                  <StatusBadge 
                    status={member.score >= 7 ? '通过' : member.score >= 4 ? '谨慎' : '拒绝'} 
                    className="text-xs px-2 py-0.5"
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 z-10 h-8 w-8"
          onClick={nextSlide}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex justify-center mt-4 space-x-1">
        {members.map((_, index) => (
          <button
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 
              ${index === activeIndex ? 'bg-blue-500 w-3' : 'bg-gray-300'}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

