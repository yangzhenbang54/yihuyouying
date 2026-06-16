'use client'

import React from 'react'
import { Empty } from 'antd'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export default function EmptyState({
  title = '暂无数据',
  description = '',
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16', className)}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div>
            <p className="text-slate-600 font-medium text-base mb-1">{title}</p>
            {description && <p className="text-slate-400 text-sm">{description}</p>}
          </div>
        }
      >
        {action}
      </Empty>
    </div>
  )
}
