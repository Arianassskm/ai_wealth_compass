"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/ui/status-badge"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import './css/board-carousel.css'

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

  const [currentIndex,setCurrentIndex] = useState(0)
  const [carouselContainer,setCarouselContainer] = useState(null)

  const rotateCarousel = () => {
    setCurrentIndex((currentIndex+1) % 6);
    console.log('==========',currentIndex);
    carouselContainer.style.transform = `rotateY(${currentIndex * 60}deg)`;
  }


  useEffect(() => {
    setCurrentIndex(currentIndex+13)
    setCarouselContainer(document.querySelector('.carousel-container'));
    //console.log('==========',currentIndex)
    const timer =setInterval(rotateCarousel, 2000);
    // 如果这些代码只应该在组件挂载时执行一次，可以返回一个清理函数
    return () => {
      console.log('组件即将卸载，这里是清理代码');
      //clearInterval(timer);
    };
  }, []); // 空数组[]意味着effect只在组件挂载时执行一次


  const nextSlide = () => {
    setActiveIndex((prev) => (prev === members.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? members.length - 1 : prev - 1))
  }

  return (

      <div className="carousel">
        <div className="carousel-container">
          {members.map((member, index) => {
            const isActive = index === activeIndex
            const offset = index - activeIndex
            return (
                <div className="card">
                  <img src={member.avatar} alt={member.name}/>
                  <div>{member.name[0]}</div>
                  <div>{member.role[0]}</div>
                  <StatusBadge
                      status={member.score >= 7 ? '通过' : member.score >= 4 ? '谨慎' : '拒绝'}
                      className="text-xs px-2 py-0.5"
                  />
                </div>
            )
          })}
        </div>
      </div>

  )
}

