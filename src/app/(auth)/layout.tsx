import React from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-amber-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Logo size={44} />
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
