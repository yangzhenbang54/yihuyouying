'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface FlipCardProps {
  front: React.ReactNode
  back: React.ReactNode
  className?: string
  defaultFlipped?: boolean
}

export default function FlipCard({ front, back, className, defaultFlipped = false }: FlipCardProps) {
  const [flipped, setFlipped] = useState(defaultFlipped)

  return (
    <div
      className={cn('flip-card cursor-pointer select-none', className)}
      onClick={() => setFlipped(!flipped)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setFlipped(!flipped)
        }
      }}
      style={{ perspective: '1000px' }}
    >
      <div
        className={cn(
          'flip-card-inner relative w-full h-full',
          flipped && 'flipped'
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="flip-card-front absolute inset-0 rounded-card-lg"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        <div
          className="flip-card-back absolute inset-0 rounded-card-lg"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </div>
      </div>
    </div>
  )
}
