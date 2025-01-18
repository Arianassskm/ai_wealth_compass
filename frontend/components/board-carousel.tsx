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
  const [activeIndex, setActiveIndex] = useState(0)

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
        
        <div className="relative w-[200px] h-[160px] perspective-[1200px]">
          {members.map((member, index) => {
            const rotation = ((index - activeIndex) / members.length) * -360
            const translateZ = 200 // Increased from 150 to 200
            const opacity = Math.abs(index - activeIndex) <= 1 ? 1 : 0 // Show only adjacent cards
            
            return (
              <motion.div
                key={member.name}
                className="absolute w-full h-full"
                style={{
                  rotateY: `${rotation}deg`,
                  translateZ: `${translateZ}px`,
                  transformStyle: 'preserve-3d',
                }}
                animate={{ 
                  rotateY: `${rotation}deg`,
                  opacity
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute w-full h-full bg-white rounded-lg p-4 backface-hidden flex flex-col items-center justify-center">
                  <Avatar className="w-12 h-12 mb-2">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <h4 className="text-sm font-medium mb-1">{member.name}</h4>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-1">{member.role}</p>
                  <StatusBadge 
                    status={member.score >= 7 ? '通过' : member.score >= 4 ? '谨慎' : '不通过'} 
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
      
      <div className="flex justify-center mt-4 space-x-2">
        {members.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 
              ${index === activeIndex ? 'bg-blue-500' : 'bg-gray-200'}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

