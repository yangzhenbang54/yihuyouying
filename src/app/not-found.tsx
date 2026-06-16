'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { Frown } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
          <Frown size={36} className="text-slate-400" />
        </div>
        <h1 className="text-6xl font-extrabold text-slate-300 mb-2">404</h1>
        <p className="text-lg text-slate-500 mb-8">抱歉，您访问的页面不存在</p>
        <Link href="/">
          <Button type="primary" size="large" icon={<HomeOutlined />} className="!rounded-xl">
            返回首页
          </Button>
        </Link>
      </div>
    </div>
  )
}
