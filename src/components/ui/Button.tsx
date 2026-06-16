'use client'

import React, { forwardRef } from 'react'
import { Button as AntButton, ButtonProps as AntButtonProps, Tooltip } from 'antd'
import { cn } from '@/lib/utils'

export interface ButtonProps extends Omit<AntButtonProps, 'type' | 'variant'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger'
  tooltip?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, tooltip, children, ...props }, ref) => {
    const baseClasses = cn(
      'font-medium !rounded-[14px] transition-all duration-300',
      'active:scale-[0.97] hover:-translate-y-0.5',
      className
    )

    const variantClasses = {
      primary: 'bg-gradient-to-br from-brand-500 to-brand-700 !text-white !border-none !shadow-button hover:!shadow-lg hover:from-brand-600 hover:to-brand-800',
      secondary: '!border-brand-300 !text-brand-700 hover:!text-brand-800 hover:!border-brand-400 hover:!bg-brand-50',
      ghost: '!text-brand-600 hover:!bg-brand-50 !border-none !shadow-none',
      glass: '!bg-white/60 backdrop-blur-md !border-white/40 !text-brand-700 !shadow-card hover:!bg-white/80 hover:!shadow-card-hover',
      danger: '!bg-red-500 !text-white !border-none hover:!bg-red-600',
    }

    const button = (
      <AntButton
        ref={ref}
        className={cn(baseClasses, variantClasses[variant])}
        {...props}
      >
        {children}
      </AntButton>
    )

    if (tooltip) {
      return <Tooltip title={tooltip}>{button}</Tooltip>
    }

    return button
  }
)

Button.displayName = 'Button'

export default Button
