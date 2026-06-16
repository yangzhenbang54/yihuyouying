'use client'

import React from 'react'
import { Tag, Progress } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { useApiData } from '@/hooks/useApiData'
import EmptyState from '@/components/ui/EmptyState'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorState from '@/components/ui/ErrorState'
import { formatDate } from '@/lib/utils'
import { motion } from 'framer-motion'

const statusIcons = {
  completed: <CheckCircleOutlined className="text-green-500" />,
  pending: <ClockCircleOutlined className="text-amber-500" />,
  not_needed: <CloseCircleOutlined className="text-slate-300" />,
}

const statusColors = {
  completed: 'success',
  pending: 'warning',
  not_needed: 'default',
}

export default function DischargePage() {
  const { data: discharges, loading, error, refetch } = useApiData<any[]>('/api/discharges')

  const getCompletionRate = (plan: any) => {
    const items = [plan.pickupStatus, plan.medicationReminderStatus, plan.revisitStatus, plan.visitStatus]
    const completed = items.filter(i => i === 'completed' || i === 'not_needed').length
    return Math.round((completed / 4) * 100)
  }

  if (loading) return <LoadingSpinner text="加载出院接续数据..." />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  const planList = discharges || []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-800">出院接续</h1>
        <span className="text-sm text-slate-400">共 {planList.length} 个接续计划</span>
      </div>

      <div className="space-y-4">
        {planList.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="bg-white rounded-card-lg border border-slate-100 shadow-card p-5 hover:shadow-card-hover transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-800 text-lg">{plan.elderName}</h3>
                    <Tag className="!rounded-lg !text-xs">{plan.hospitalName}</Tag>
                  </div>
                  <p className="text-xs text-slate-400">出院日期：{formatDate(plan.dischargeDate)} · 负责人：{plan.assigneeName}</p>
                </div>
                <Progress
                  type="circle"
                  percent={getCompletionRate(plan)}
                  size={52}
                  strokeColor="#0d9488"
                  trailColor="#f1f5f9"
                  format={(p) => <span className="text-xs font-bold">{p}%</span>}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: '出院接送', status: plan.pickupStatus },
                  { label: '用药提醒', status: plan.medicationReminderStatus },
                  { label: '复诊安排', status: plan.revisitStatus },
                  { label: '探访安排', status: plan.visitStatus },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-50 rounded-xl p-3 text-center">
                    <div className="mb-1">{statusIcons[item.status as keyof typeof statusIcons]}</div>
                    <div className="text-xs text-slate-500 mb-0.5">{item.label}</div>
                    <Tag color={statusColors[item.status as keyof typeof statusColors] as any} className="!rounded-lg !text-[11px] !leading-tight">
                      {item.status === 'completed' ? '已完成' : item.status === 'pending' ? '待处理' : '不需要'}
                    </Tag>
                  </div>
                ))}
              </div>

              {plan.notes && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500">{plan.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {planList.length === 0 && <EmptyState title="暂无出院接续记录" />}
    </div>
  )
}
