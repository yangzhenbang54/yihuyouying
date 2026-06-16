'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarCollapsed: boolean
  fontSize: 'normal' | 'large'
  highContrast: boolean
  toggleSidebar: () => void
  toggleFontSize: () => void
  toggleHighContrast: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      fontSize: 'normal',
      highContrast: false,

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      toggleFontSize: () => set((s) => ({ fontSize: s.fontSize === 'normal' ? 'large' : 'normal' })),
      toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
    }),
    {
      name: 'yihuyouying-ui',
    }
  )
)
