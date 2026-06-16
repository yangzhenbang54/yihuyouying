'use client'

import { create } from 'zustand'
import { User } from '@/types/user'
import { UserRole } from '@/types/common'

interface AuthState {
  user: User | null
  isLoggedIn: boolean
  loading: boolean
  login: (phone: string, password: string) => Promise<void>
  register: (data: { name: string; phone: string; password: string; role: UserRole; organization?: string }) => Promise<void>
  fetchMe: () => Promise<void>
  updateAvatar: (avatarColor: string, avatarEmoji: string) => void
  logout: () => Promise<void>
  hasRole: (...roles: UserRole[]) => boolean
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isLoggedIn: false,
  loading: false,

  fetchMe: async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (!res.ok) {
        set({ user: null, isLoggedIn: false, loading: false })
        return
      }
      const json = await res.json()
      if (json.success && json.data) {
        set({ user: json.data, isLoggedIn: true, loading: false })
      } else {
        set({ user: null, isLoggedIn: false, loading: false })
      }
    } catch {
      set({ user: null, isLoggedIn: false, loading: false })
    }
  },

  login: async (phone: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    })
    const json = await res.json()
    if (!json.success) {
      throw new Error(json.error || '登录失败')
    }
    set({ user: json.data, isLoggedIn: true, loading: false })
  },

  register: async (data) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!json.success) {
      throw new Error(json.error || '注册失败')
    }
    set({ user: json.data, isLoggedIn: true, loading: false })
  },

  updateAvatar: (avatarColor: string, avatarEmoji: string) => {
    const { user } = get()
    if (user) {
      set({ user: { ...user, avatarColor, avatarEmoji } })
    }
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    set({ user: null, isLoggedIn: false, loading: false })
  },

  hasRole: (...roles: UserRole[]) => {
    const { user } = get()
    return !!user && roles.includes(user.role)
  },
}))
