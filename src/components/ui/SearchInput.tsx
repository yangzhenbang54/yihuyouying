'use client'

import React from 'react'
import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  className?: string
  size?: 'small' | 'default' | 'large'
}

export default function SearchInput({
  placeholder = '搜索...',
  value,
  onChange,
  onSearch,
  className,
  size = 'default',
}: SearchInputProps) {
  const heightMap = { small: 'h-10', default: 'h-11', large: 'h-13' }

  return (
    <div className={cn('relative', className)}>
      <SearchOutlined
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"
        style={{ fontSize: 16 }}
      />
      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onPressEnter={() => onSearch?.(value || '')}
        placeholder={placeholder}
        className={cn(
          '!pl-10 !pr-4 !rounded-input bg-slate-50 border-slate-200',
          'hover:border-brand-300 focus:border-brand-500 transition-all duration-300',
          heightMap[size]
        )}
        allowClear
      />
    </div>
  )
}
