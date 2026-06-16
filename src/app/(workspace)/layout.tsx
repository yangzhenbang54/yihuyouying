'use client'

import React from 'react'
import { Layout } from 'antd'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import { useAuthStore } from '@/store/auth-store'
import { redirect } from 'next/navigation'

const { Content } = Layout

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuthStore()

  if (!isLoggedIn) {
    redirect('/auth/login')
  }

  return (
    <Layout className="min-h-screen bg-slate-50" hasSider>
      <Sidebar type="workspace" />
      <Layout>
        <Content className="p-4 md:p-6 pb-20 md:pb-6 overflow-auto">
          {children}
        </Content>
      </Layout>
      <MobileNav type="workspace" />
    </Layout>
  )
}
