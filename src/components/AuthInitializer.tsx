'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const fetchMe = useAuthStore(s => s.fetchMe)

  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  return <>{children}</>
}
