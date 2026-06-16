'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { usePathname } from 'next/navigation'
import Logo from '@/components/Logo'

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStart = pathname === '/intake/start'

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/50 to-white">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          {isStart ? (
            <Link href="/" className="flex items-center gap-1.5 text-slate-500 hover:text-brand-600 transition-colors">
              <HomeOutlined />
              <span className="text-sm">首页</span>
            </Link>
          ) : (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => window.history.back()}
              className="text-slate-500 hover:text-brand-600"
            >
              返回
            </Button>
          )}
          <Link href="/" className="md:hidden">
            <Logo size={28} withText={false} />
          </Link>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6 md:py-10">
        {children}
      </main>
    </div>
  )
}
