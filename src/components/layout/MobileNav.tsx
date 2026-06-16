'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { CheckSquareOutlined, FileTextOutlined, HomeOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons'

interface MobileNavProps {
  type: 'workspace' | 'admin' | 'service'
}

const workspaceTabs = [
  { href: '/workspace/tasks', icon: CheckSquareOutlined, label: '任务' },
  { href: '/workspace/cases', icon: FileTextOutlined, label: '个案' },
  { href: '/workspace/discharge', icon: HomeOutlined, label: '接续' },
  { href: '/workspace/followups', icon: PhoneOutlined, label: '回访' },
]

const adminTabs = [
  { href: '/dashboard/overview', icon: HomeOutlined, label: '看板' },
  { href: '/dashboard/audit', icon: FileTextOutlined, label: '审计' },
  { href: '/admin/users', icon: UserOutlined, label: '用户' },
]

export default function MobileNav({ type }: MobileNavProps) {
  const pathname = usePathname()
  const tabs = type === 'workspace' ? workspaceTabs : adminTabs

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 safe-area-bottom">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-3 min-h-touch min-w-touch',
                'transition-colors duration-200',
                isActive ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <Icon style={{ fontSize: 20 }} />
              <span className="text-xs mt-0.5 font-medium">{tab.label}</span>
              {isActive && (
                <span className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-brand-500 rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
