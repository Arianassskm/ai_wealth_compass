"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { EnhancedBackground } from '@/components/enhanced-background'

interface Section {
  id: string
  title: string
  content: React.ReactNode
  defaultOpen?: boolean
}

interface AssistantLayoutProps {
  title: string
  description: string
  avatarSrc: string
  sections: Section[]
  children?: React.ReactNode
  onBack: () => void;
}

export function AssistantLayout({
  title,
  description,
  avatarSrc,
  sections,
  children,
  onBack
}: AssistantLayoutProps) {
  const router = useRouter()
  const [openSections, setOpenSections] = useState<string[]>(
    sections.filter(section => section.defaultOpen).map(section => section.id)
  )

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <EnhancedBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={onBack}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
        {/* Assistant Introduction */}
        <Card className="relative bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl p-8">
          <div className="w-28 h-28 mx-auto mb-4">
            <Image
              src={avatarSrc}
              alt="Assistant Avatar"
              width={112}
              height={112}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="bg-white rounded-2xl p-4 max-w-[90%] mx-auto">
            <h2 className="font-bold mb-2 text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600">
              {description}
            </p>
          </div>
        </Card>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <Card
              key={section.id}
              className="overflow-hidden backdrop-blur-xl bg-white/80 border-gray-200"
            >
              <motion.button
                className="w-full px-6 py-4 flex items-center justify-between text-left"
                onClick={() => toggleSection(section.id)}
              >
                <span className="font-medium text-gray-900">{section.title}</span>
                <motion.div
                  animate={{ rotate: openSections.includes(section.id) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {openSections.includes(section.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-4">
                      {section.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>

        {/* Additional Content */}
        {children}
      </div>
    </main>
  )
}

