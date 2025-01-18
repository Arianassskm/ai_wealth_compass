"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface CardProps {
  title: string
  content: string
}

interface CardCarouselProps {
  cards: CardProps[]
}

export function CardCarousel({ cards }: CardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const rotateToCard = (index: number) => {
    setActiveIndex(index)
  }

  const nextCard = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % cards.length)
  }

  const prevCard = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length)
  }

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      <div className="relative w-[300px] h-[400px] perspective-[1000px]">
        {cards.map((card, index) => {
          const rotation = ((index - activeIndex) / cards.length) * -360
          const translateZ = 400
          return (
            <motion.div
              key={index}
              className="absolute w-full h-full"
              style={{
                rotateY: `${rotation}deg`,
                translateZ: `${translateZ}px`,
                transformStyle: 'preserve-3d',
              }}
              animate={{ rotateY: `${rotation}deg` }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute w-full h-full bg-white rounded-lg shadow-lg p-6 backface-hidden">
                <h2 className="text-2xl font-bold mb-4">{card.title}</h2>
                <p className="text-gray-600">{card.content}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 z-10"
        onClick={prevCard}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 z-10"
        onClick={nextCard}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  )
}

