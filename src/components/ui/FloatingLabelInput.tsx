'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface FloatingLabelInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
  multiline?: boolean
  className?: string
}

export default function FloatingLabelInput({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  multiline = false,
  className,
}: FloatingLabelInputProps) {
  const [focused, setFocused] = useState(false)
  const isActive = focused || value.length > 0

  return (
    <div className={cn('relative', className)}>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          rows={3}
          className={cn(
            'w-full px-4 py-3 pt-5 text-base rounded-input border-2 outline-none transition-all duration-300 resize-none',
            'bg-transparent',
            isActive ? 'border-brand-500' : 'border-slate-200',
            'hover:border-brand-300 focus:border-brand-500',
            'focus:ring-3 focus:ring-brand-500/15'
          )}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          className={cn(
            'w-full px-4 py-3 pt-5 text-base rounded-input border-2 outline-none transition-all duration-300',
            'bg-transparent',
            isActive ? 'border-brand-500' : 'border-slate-200',
            'hover:border-brand-300 focus:border-brand-500',
            'focus:ring-3 focus:ring-brand-500/15'
          )}
        />
      )}
      <label
        className={cn(
          'absolute left-4 transition-all duration-300 pointer-events-none',
          isActive
            ? 'top-1 text-xs text-brand-600 scale-90 -translate-y-0'
            : 'top-3 text-base text-slate-400 translate-y-0'
        )}
      >
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
    </div>
  )
}
