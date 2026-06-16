'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Layout, Menu, Button } from 'antd'
import {
  CheckSquareOutlined,
  UserOutlined,
  FileTextOutlined,
  PhoneOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  AuditOutlined,
  SettingOutlined,
  TeamOutlined,
  LogoutOutlined,
  ContactsOutlined,
  IdcardOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useAuthStore } from '@/store/auth-store'
import { useUIStore } from '@/store/ui-store'
import Logo from '@/components/Logo'
import { cn } from '@/lib/utils'

const { Sider } = Layout

const workspaceMenu = [
  { key: '/workspace/tasks', icon: <CheckSquareOutlined />, label: '我的任务' },
  { key: '/workspace/cases', icon: <FileTextOutlined />, label: '个案中心' },
  { key: '/workspace/discharge', icon: <HomeOutlined />, label: '出院接续' },
  { key: '/workspace/followups', icon: <PhoneOutlined />, label: '回访中心' },
]

const adminMenu: MenuProps['items'] = [
  {
    type: 'group',
    label: '数据管理',
    children: [
      { key: '/admin/elders', icon: <UserOutlined />, label: '老人档案' },
      { key: '/admin/contacts', icon: <ContactsOutlined />, label: '联系人' },
      { key: '/admin/cards', icon: <IdcardOutlined />, label: '联系卡' },
      { key: '/admin/tasks', icon: <CheckSquareOutlined />, label: '工单任务' },
      { key: '/admin/cases', icon: <FileTextOutlined />, label: '个案管理' },
      { key: '/admin/discharges', icon: <HomeOutlined />, label: '出院接续' },
      { key: '/admin/followups', icon: <PhoneOutlined />, label: '回访记录' },
    ],
  },
  { type: 'divider' },
  {
    type: 'group',
    label: '系统管理',
    children: [
      { key: '/dashboard/overview', icon: <DashboardOutlined />, label: '运营看板' },
      { key: '/dashboard/audit', icon: <AuditOutlined />, label: '审计日志' },
      { key: '/admin/users', icon: <TeamOutlined />, label: '用户管理' },
      { key: '/admin/settings', icon: <SettingOutlined />, label: '系统配置' },
    ],
  },
]

interface SidebarProps {
  type: 'workspace' | 'admin'
}

export default function Sidebar({ type }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { logout } = useAuthStore()

  const menuItems = type === 'workspace' ? workspaceMenu : adminMenu

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key)
  }

  return (
    <Sider
      collapsible
      collapsed={sidebarCollapsed}
      onCollapse={toggleSidebar}
      width={240}
      collapsedWidth={64}
      trigger={null}
      className={cn(
        '!bg-white !border-r !border-slate-100',
        'hidden md:block'
      )}
      style={{ minHeight: '100vh' }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
          {!sidebarCollapsed && (
            <Link href="/">
              <Logo size={32} />
            </Link>
          )}
          <Button
            type="text"
            icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
            className="text-slate-500 hover:text-brand-600"
          />
        </div>

        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={type === 'workspace' ? workspaceMenu : adminMenu}
          onClick={handleMenuClick}
          className="flex-1 !border-r-0 py-3"
          style={{ fontSize: 15 }}
        />

        <div className="p-3 border-t border-slate-100">
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={() => { logout(); router.push('/') }}
            danger
            className="w-full justify-start"
          >
            {!sidebarCollapsed && '退出登录'}
          </Button>
        </div>
      </div>
    </Sider>
  )
}
