'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface RadioOption {
  value: string
  label: string
  icon?: LucideIcon
  description?: string
}

interface RadioToggleProps {
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function RadioToggle({ options, value, onChange, className }: RadioToggleProps) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {options.map((option) => {
        const isSelected = value === option.value
        const Icon = option.icon

        return (
          <label
            key={option.value}
            className={cn(
              'relative flex items-center gap-3 px-5 py-3 rounded-xl border-2 cursor-pointer transition-all duration-300 min-h-touch',
              'hover:border-brand-400 hover:shadow-md',
              isSelected
                ? 'border-brand-500 bg-brand-50 shadow-md scale-[1.02]'
                : 'border-slate-200 bg-white'
            )}
            onClick={() => onChange(option.value)}
          >
            {isSelected && (
              <span className="absolute top-2 right-2 w-3 h-3 rounded-full bg-brand-500 animate-scale-in" />
            )}
            {Icon && (
              <Icon
                size={20}
                className={cn(
                  'flex-shrink-0 transition-colors duration-300',
                  isSelected ? 'text-brand-600' : 'text-slate-400'
                )}
              />
            )}
            <div>
              <span
                className={cn(
                  'font-medium text-sm transition-colors duration-300',
                  isSelected ? 'text-brand-700' : 'text-slate-700'
                )}
              >
                {option.label}
              </span>
              {option.description && (
                <p className="text-xs text-slate-400 mt-0.5">{option.description}</p>
              )}
            </div>
          </label>
        )
      })}
    </div>
  )
}
