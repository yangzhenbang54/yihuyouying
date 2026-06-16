'use client'

import React from 'react'
import { Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { AlertTriangle } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={36} className="text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">页面出错了</h1>
        <p className="text-slate-500 mb-8">
          {error.message || '抱歉，页面加载过程中出现了意外错误。请稍后重试。'}
        </p>
        <Button
          type="primary"
          size="large"
          icon={<ReloadOutlined />}
          onClick={reset}
          className="!rounded-xl"
        >
          重试
        </Button>
      </div>
    </div>
  )
}
