'use client'

import React from 'react'
import { Card as AntCard, CardProps as AntCardProps } from 'antd'
import { cn } from '@/lib/utils'

interface CardProps extends Omit<AntCardProps, 'variant'> {
  variant?: 'default' | 'glass' | 'ghost' | 'hover-lift'
}

export default function Card({ variant = 'default', className, children, ...props }: CardProps) {
  const variantClasses = {
    default: '!rounded-card-lg !border !border-slate-200 !shadow-card',
    glass: 'glass-panel !rounded-card-lg !border-white/30',
    ghost: '!rounded-card-lg !border-transparent !bg-transparent !shadow-none',
    'hover-lift': '!rounded-card-lg !border !border-slate-200 !shadow-card hover:!shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer',
  }

  return (
    <AntCard
      className={cn('transition-shadow duration-300', variantClasses[variant], className)}
      {...props}
    >
      {children}
    </AntCard>
  )
}
