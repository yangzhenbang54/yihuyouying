'use client'

import React, { useState } from 'react'
import { Tabs, Badge, Rate, Tag } from 'antd'
import { PhoneOutlined, HomeOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { useApiData } from '@/hooks/useApiData'
import StatusBadge from '@/components/ui/StatusBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorState from '@/components/ui/ErrorState'
import EmptyState from '@/components/ui/EmptyState'
import { formatDate } from '@/lib/utils'
import { motion } from 'framer-motion'

const typeIcons: Record<string, React.ReactNode> = {
  phone: <PhoneOutlined />,
  visit: <HomeOutlined />,
  video: <VideoCameraOutlined />,
}

const typeLabels: Record<string, string> = {
  phone: '电话回访',
  visit: '上门回访',
  video: '视频回访',
}

export default function FollowupsPage() {
  const [activeTab, setActiveTab] = useState('scheduled')

  const { data: followups, loading, error, refetch } = useApiData<any[]>('/api/followups')
  const items = followups || []

  const scheduled = items.filter(f => f.status === 'scheduled')
  const completed = items.filter(f => f.status === 'completed')
  const missed = items.filter(f => f.status === 'missed')

  const filtered = activeTab === 'scheduled' ? scheduled : activeTab === 'completed' ? completed : missed

  const tabItems = [
    { key: 'scheduled', label: <span>待回访 <Badge count={scheduled.length} size="small" /></span> },
    { key: 'completed', label: <span>已完成 <Badge count={completed.length} size="small" /></span> },
    { key: 'missed', label: <span>未完成 <Badge count={missed.length} size="small" /></span> },
  ]

  if (loading) return <LoadingSpinner text="加载回访数据..." />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-800">回访中心</h1>
        <span className="text-sm text-slate-400">共 {items.length} 条记录</span>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} className="mb-4" />

      <div className="space-y-3">
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className={`bg-white rounded-card-lg border shadow-card p-5 transition-all duration-200 ${
              item.status === 'missed' ? 'border-red-200' : 'border-slate-100'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.type === 'visit' ? 'bg-blue-50 text-blue-600' :
                    item.type === 'phone' ? 'bg-green-50 text-green-600' :
                    'bg-purple-50 text-purple-600'
                  }`}>
                    {typeIcons[item.type]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800">{item.elderName}</h3>
                      <Tag className="!rounded-lg !text-xs">{typeLabels[item.type]}</Tag>
                      <StatusBadge status={item.status} label={
                        item.status === 'scheduled' ? '待回访' :
                        item.status === 'completed' ? '已完成' : '未完成'
                      } />
                    </div>
                    <p className="text-xs text-slate-400">计划日期：{formatDate(item.scheduledDate)} · 负责人：{item.assigneeName}</p>
                    {item.result && (
                      <p className="text-sm text-slate-600 mt-2 bg-slate-50 rounded-xl p-3">{item.result}</p>
                    )}
                  </div>
                </div>

                {item.satisfaction && (
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-400 mb-1">满意度</p>
                    <Rate disabled defaultValue={item.satisfaction} className="text-sm" />
                  </div>
                )}
              </div>

              {item.nextAction && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <span className="text-xs text-slate-400">下一步：</span>
                  <span className="text-xs text-slate-700 font-medium">{item.nextAction}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && <EmptyState title={`暂无${activeTab === 'scheduled' ? '待' : activeTab === 'completed' ? '已完成' : '未完成'}回访记录`} />}
    </div>
  )
}
