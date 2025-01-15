"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface CollapsibleSectionProps {
  children: React.ReactNode;
  previewContent: React.ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function CollapsibleSection({ 
  children, 
  previewContent, 
  isExpanded: expanded = true, 
  onToggle 
}: CollapsibleSectionProps) {
  return (
    <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4">
        {previewContent}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              variants={{
                expanded: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 }
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-4"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button
        className="w-full py-2 px-4 bg-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors flex items-center justify-center"
        onClick={onToggle}
      >
        {expanded ? (
          <>
            收起 <ChevronUp size={16} className="ml-1" />
          </>
        ) : (
          <>
            显示更多 <ChevronDown size={16} className="ml-1" />
          </>
        )}
      </button>
    </div>
  )
}

