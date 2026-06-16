'use client'

import React from 'react'
import { Tooltip } from 'antd'
import { cn } from '@/lib/utils'

interface TooltipWrapperProps {
  children: React.ReactNode
  title: React.ReactNode
  className?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

export default function TooltipWrapper({
  children,
  title,
  className,
  placement = 'top',
}: TooltipWrapperProps) {
  return (
    <Tooltip
      title={title}
      placement={placement}
      overlayClassName={cn(
        '[&_.ant-tooltip-inner]:rounded-xl [&_.ant-tooltip-inner]:px-4 [&_.ant-tooltip-inner]:py-2.5 [&_.ant-tooltip-inner]:text-sm',
        className
      )}
    >
      <span className="cursor-help inline-flex">
        {children}
      </span>
    </Tooltip>
  )
}
