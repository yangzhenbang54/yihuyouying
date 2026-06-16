'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface GlassPanelProps {
  children: React.ReactNode
  className?: string
  variant?: 'light' | 'medium'
  hoverEffect?: boolean
  onClick?: () => void
}

export default function GlassPanel({
  children,
  className,
  variant = 'medium',
  hoverEffect = false,
  onClick,
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        'rounded-card-lg border transition-all duration-300',
        variant === 'light'
          ? 'glass-panel-light'
          : 'glass-panel',
        hoverEffect && 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
