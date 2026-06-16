'use client'

import React from 'react'
import { Tag } from 'antd'
import { cn } from '@/lib/utils'

const colorMap: Record<string, string> = {
  // Profile status
  draft: 'default',
  pending_confirm: 'processing',
  completed: 'success',
  expired: 'warning',
  // Task status
  todo: 'default',
  in_progress: 'processing',
  done: 'success',
  overdue: 'error',
  cancelled: 'default',
  // Case status
  open: 'processing',
  resolved: 'success',
  closed: 'default',
  escalated: 'warning',
  // Priority
  '1': 'default',
  '2': 'warning',
  '3': 'orange',
  '4': 'red',
  // Contact verified
  verified: 'success',
  pending: 'warning',
  invalid: 'error',
  // Card status
  active: 'success',
  revoked: 'error',
  // Followup
  scheduled: 'processing',
  missed: 'error',
}

interface StatusBadgeProps {
  status: string
  label?: string
  className?: string
}

export default function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <Tag
      color={colorMap[status] || 'default'}
      className={cn('rounded-lg px-3 py-0.5 text-xs font-medium', className)}
    >
      {label || status}
    </Tag>
  )
}
