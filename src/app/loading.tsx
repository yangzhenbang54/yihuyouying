import React from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="large" text="页面加载中..." />
    </div>
  )
}
