'use client'

import React from 'react'
import { Result, Button } from 'antd'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export default function ErrorState({
  title = '加载失败',
  message = '数据加载过程中出现了问题，请稍后重试',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex items-center justify-center py-16', className)}>
      <Result
        status="error"
        title={title}
        subTitle={message}
        extra={
          onRetry && (
            <Button
              type="primary"
              onClick={onRetry}
              className="bg-brand-600 hover:bg-brand-700"
            >
              重试
            </Button>
          )
        }
      />
    </div>
  )
}
