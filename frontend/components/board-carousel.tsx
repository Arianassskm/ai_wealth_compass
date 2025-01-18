"use client"

import { useState, useEffect, useRef } from "react"
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

  const carouselContainerRef = useRef<HTMLDivElement>(null);
  let currentIndex = 0;

  useEffect(() => {
    const rotateCarousel = () => {
      currentIndex =  (currentIndex + 1) % 6;
      if (carouselContainerRef.current) {
        carouselContainerRef.current.style.transform = `rotateY(${currentIndex * 60}deg)`;
      }
    };

    const intervalId = setInterval(rotateCarousel, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (

      <div className="carousel">
        <div className="carousel-container"  ref={carouselContainerRef}>
          {members.map((member, index) => {
            const isActive = index === activeIndex
            const offset = index - activeIndex
            return (
                <div className="card">
                  <img src={member.avatar} alt="Image 1"/>
                  <div className="cardinfo">
                    <div className="info-value info-value-name">{member.name}</div>
                    <div className="info-value info-value-role">{member.role}</div>
                    <StatusBadge
                        status={member.score >= 7 ? '通过' : member.score >= 4 ? '谨慎' : '拒绝'}
                        className="text-xs px-2 py-0.5"
                    />
                  </div>
                </div>
            )
          })}
        </div>
      </div>

  )
}

