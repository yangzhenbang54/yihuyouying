'use client'

import React from 'react'

interface LogoProps {
  size?: number
  withText?: boolean
  className?: string
}

export default function Logo({ size = 40, withText = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#logoGrad)" />
        <path
          d="M16 28c0-4 3-8 8-10s8 6 8 10c0 4-3 6-5 7s-3 0-3 0-1 1-3 1v-1c-2-1-5-3-5-7z"
          fill="white"
          opacity="0.95"
        />
        <path
          d="M28 22c-1 1.5-3 3-4 4"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M20 28c2 2 4 3 4 3"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <circle cx="28" cy="18" r="1.5" fill="white" opacity="0.8" />
        <circle cx="32" cy="22" r="1" fill="white" opacity="0.6" />
        <circle cx="24" cy="15" r="0.8" fill="white" opacity="0.5" />
      </svg>
      {withText && (
        <span
          className="font-bold tracking-tight whitespace-nowrap"
          style={{
            background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: size * 0.55,
          }}
        >
          医愿护
        </span>
      )}
    </div>
  )
}
