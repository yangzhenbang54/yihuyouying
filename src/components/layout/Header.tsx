'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MenuOutlined, CloseOutlined, UserOutlined, LogoutOutlined, CameraOutlined } from '@ant-design/icons'
import { Button, Dropdown, Avatar, Badge, Drawer, Modal } from 'antd'
import { useAuthStore } from '@/store/auth-store'
import { useUIStore } from '@/store/ui-store'
import { ROLE_LABELS } from '@/lib/constants'
import Logo from '@/components/Logo'
import { cn } from '@/lib/utils'

const AVATAR_GRADIENTS = [
  'from-brand-500 to-brand-700',
  'from-amber-500 to-orange-600',
  'from-blue-500 to-indigo-600',
  'from-green-500 to-emerald-600',
  'from-purple-500 to-pink-600',
  'from-rose-500 to-red-600',
  'from-cyan-500 to-blue-600',
  'from-violet-500 to-purple-600',
]

const AVATAR_EMOJIS = ['👤', '😊', '👵', '👴', '👩‍⚕️', '🧑‍💼', '💪', '🌟', '❤️', '🤝', '🏠', '🌸']

const navLinks = [
  { href: '/#capabilities', label: '服务能力' },
  { href: '/#scenarios', label: '使用场景' },
  { href: '/about', label: '关于我们' },
  { href: '/faq', label: '常见问题' },
]

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const { user, isLoggedIn, logout, updateAvatar } = useAuthStore()
  const { fontSize, toggleFontSize, toggleHighContrast } = useUIStore()
  const router = useRouter()

  const avatarColor = user?.avatarColor || 'from-brand-500 to-brand-700'
  const avatarEmoji = user?.avatarEmoji

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: `${user?.name || ''} (${ROLE_LABELS[user?.role || ''] || ''})`,
      disabled: true,
    },
    {
      key: 'avatar',
      icon: <CameraOutlined />,
      label: '更换头像',
      onClick: () => setAvatarModalOpen(true),
    },
    { type: 'divider' as const },
    ...(user?.role === 'admin'
      ? [
          { key: 'dashboard', label: '数据看板', onClick: () => router.push('/dashboard/overview') },
          { key: 'admin', label: '管理后台', onClick: () => router.push('/admin/users') },
        ]
      : []),
    ...(user?.role === 'community' || user?.role === 'provider'
      ? [
          { key: 'workspace', label: '协作工作台', onClick: () => router.push('/workspace/tasks') },
        ]
      : []),
    ...(user?.role === 'elderly'
      ? [
          { key: 'intake', label: '我的档案', onClick: () => router.push('/intake/start') },
        ]
      : []),
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: () => {
        logout()
        router.push('/')
      },
    },
  ]

  return (
    <header className={cn(
      'sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-100',
      'transition-all duration-300'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo size={36} />
          </Link>

          {/* Nav (desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-slate-600 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Accessibility toggles */}
            <button
              onClick={toggleFontSize}
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              title={fontSize === 'large' ? '标准字号' : '大字版'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 7 4 4 20 4 20 7"></polyline>
                <line x1="9" y1="20" x2="15" y2="20"></line>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
            </button>

            {isLoggedIn && user ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                <div className="flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <Badge dot status="success" offset={[-2, 6]}>
                    <Avatar size={34} className={`bg-gradient-to-br ${avatarColor} flex items-center justify-center`}>
                      {avatarEmoji || user.name.charAt(0)}
                    </Avatar>
                  </Badge>
                  <span className="hidden md:inline text-sm font-medium text-slate-700">{user.name}</span>
                </div>
              </Dropdown>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth/login">
                  <Button type="text" className="text-slate-600 hover:text-brand-600">登录</Button>
                </Link>
                <Link href="/auth/register">
                  <Button type="primary" className="bg-brand-600">注册</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden touch-target rounded-lg text-slate-600 hover:bg-slate-100"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuOutlined style={{ fontSize: 22 }} />
            </button>
          </div>
        </div>
      </div>

      {/* Avatar Edit Modal */}
      <Modal
        open={avatarModalOpen}
        onCancel={() => setAvatarModalOpen(false)}
        footer={null}
        width={360}
        centered
        title="更换头像"
        className="[&_.ant-modal-content]:!rounded-2xl"
      >
        <p className="text-xs text-slate-400 mb-4">选择配色和图标来个性化您的头像</p>

        <p className="text-sm font-medium text-slate-600 mb-2">配色方案</p>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {AVATAR_GRADIENTS.map((grad, i) => (
            <button
              key={i}
              onClick={() => updateAvatar(grad, avatarEmoji || user?.name?.charAt(0) || '👤')}
              className={`w-full h-10 rounded-xl bg-gradient-to-br ${grad} transition-transform hover:scale-105 ${
                avatarColor === grad ? 'ring-3 ring-brand-400 ring-offset-2' : ''
              }`}
            />
          ))}
        </div>

        <p className="text-sm font-medium text-slate-600 mb-2">图标</p>
        <div className="grid grid-cols-6 gap-2">
          {AVATAR_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => updateAvatar(avatarColor, emoji)}
              className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-all hover:scale-110 ${
                avatarEmoji === emoji ? 'border-brand-400 bg-brand-50' : 'border-slate-100 bg-slate-50 hover:border-slate-300'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <Button block onClick={() => setAvatarModalOpen(false)} className="!rounded-xl !mt-6">
          完成
        </Button>
      </Modal>

      {/* Mobile Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="right"
        width={280}
        closeIcon={<CloseOutlined />}
        styles={{ body: { padding: 16 } }}
      >
        <div className="flex flex-col gap-2">
          <Logo size={32} className="mb-6" />

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setDrawerOpen(false)}
              className="flex items-center px-4 py-3 rounded-xl text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors text-base"
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t border-slate-100 mt-4 pt-4">
            <button
              onClick={() => { toggleFontSize(); setDrawerOpen(false) }}
              className="flex items-center w-full px-4 py-3 rounded-xl text-slate-700 hover:bg-brand-50 transition-colors text-base"
            >
              {fontSize === 'large' ? '切换标准字号' : '切换大字版'}
            </button>

            {isLoggedIn ? (
              <>
                <Link
                  href="/workspace/tasks"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-brand-600 font-medium hover:bg-brand-50 transition-colors text-base"
                >
                  进入工作台
                </Link>
                <button
                  onClick={() => { logout(); setDrawerOpen(false); }}
                  className="flex items-center w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-base"
                >
                  退出登录
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-slate-700 hover:bg-brand-50 transition-colors text-base"
                >
                  登录
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-brand-600 font-medium hover:bg-brand-50 transition-colors text-base"
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      </Drawer>
    </header>
  )
}
