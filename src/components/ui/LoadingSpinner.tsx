'use client'

import React from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large'
  text?: string
  fullPage?: boolean
  className?: string
}

export default function LoadingSpinner({
  size = 'default',
  text = '加载中...',
  fullPage = false,
  className,
}: LoadingSpinnerProps) {
  const sizeMap = { small: 28, default: 40, large: 56 }

  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-4', fullPage && 'min-h-[400px]', className)}>
      <Spin
        indicator={
          <LoadingOutlined
            style={{ fontSize: sizeMap[size], color: '#0d9488' }}
            spin
          />
        }
      />
      {text && (
        <p className="text-sm text-slate-500 animate-pulse">{text}</p>
      )}
    </div>
  )

  return spinner
}
