'use client'

import React, { useState } from 'react'
import { Tabs, Badge, Drawer, Progress, Tag, Button, Select } from 'antd'
import {
  CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined,
  FireOutlined, UserOutlined,
} from '@ant-design/icons'
import { useApiData } from '@/hooks/useApiData'
import { TASK_STATUS_LABELS, PRIORITY_LABELS } from '@/lib/constants'
import { TaskStatus } from '@/types/common'
import StatusBadge from '@/components/ui/StatusBadge'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { formatDate, relativeTime } from '@/lib/utils'
import { motion } from 'framer-motion'

const taskTypeLabels: Record<string, string> = {
  intake_review: '建档审核',
  emergency_response: '应急响应',
  discharge_pickup: '出院接送',
  medication_reminder: '用药提醒',
  revisit: '上门探访',
  followup: '回访',
  other: '其他',
}

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<string>('todo')
  const [selectedTask, setSelectedTask] = useState<any | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const { data: tasksData, loading, error, refetch } = useApiData<any[]>('/api/tasks')
  const tasks = tasksData || []

  const counts = {
    todo: tasks.filter(t => t.status === TaskStatus.TODO).length,
    in_progress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
    done: tasks.filter(t => t.status === TaskStatus.DONE).length,
    overdue: tasks.filter(t => t.status === TaskStatus.OVERDUE).length,
  }

  const filteredTasks = tasks.filter(t => t.status === activeTab)

  const openTask = (task: any) => {
    setSelectedTask(task)
    setDrawerOpen(true)
  }

  const tabItems = [
    { key: 'todo', label: <span>待办 <Badge count={counts.todo} size="small" className="ml-1" /></span> },
    { key: 'in_progress', label: <span>进行中 <Badge count={counts.in_progress} size="small" className="ml-1" /></span> },
    { key: 'done', label: <span>已完成 <Badge count={counts.done} size="small" className="ml-1" /></span> },
    { key: 'overdue', label: <span>已超时 <Badge count={counts.overdue} size="small" className="ml-1" /></span> },
  ]

  if (loading) return <LoadingSpinner text="加载任务列表..." />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div>
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: '今日待办', count: counts.todo, color: 'text-blue-600', bg: 'bg-blue-50', icon: <ClockCircleOutlined /> },
          { label: '进行中', count: counts.in_progress, color: 'text-brand-600', bg: 'bg-brand-50', icon: <FireOutlined /> },
          { label: '已完成', count: counts.done, color: 'text-green-600', bg: 'bg-green-50', icon: <CheckCircleOutlined /> },
          { label: '已超时', count: counts.overdue, color: 'text-red-600', bg: 'bg-red-50', icon: <ExclamationCircleOutlined /> },
        ].map((item) => (
          <div key={item.label} className={`${item.bg} rounded-xl p-4 flex items-center gap-3`}>
            <span className={`text-xl ${item.color}`}>{item.icon}</span>
            <div>
              <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
              <div className="text-xs text-slate-500">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Select defaultValue="all" className="!w-28 !rounded-xl" options={[
          { value: 'all', label: '全部类型' },
          { value: 'emergency_response', label: '应急响应' },
          { value: 'followup', label: '回访' },
          { value: 'discharge_pickup', label: '出院接送' },
        ]} />
        <Select defaultValue="all" className="!w-28 !rounded-xl" options={[
          { value: 'all', label: '全部优先级' },
          { value: '4', label: '紧急' },
          { value: '3', label: '高' },
          { value: '2', label: '中' },
          { value: '1', label: '低' },
        ]} />
      </div>

      {/* Tabs */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} className="mb-4" />

      {/* Task list */}
      <div className="space-y-3">
        {filteredTasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div
              className="bg-white rounded-card-lg border border-slate-100 shadow-card p-4 hover:shadow-card-hover transition-all duration-200 cursor-pointer"
              onClick={() => openTask(task)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={task.status} label={TASK_STATUS_LABELS[task.status]} />
                    <Tag className="!text-xs !rounded-lg">{taskTypeLabels[task.taskType] || task.taskType}</Tag>
                    <Tag color={['', 'blue', 'orange', 'volcano', 'red'][task.priority]} className="!text-xs !rounded-lg">
                      {PRIORITY_LABELS[task.priority]}
                    </Tag>
                  </div>
                  <h3 className="font-medium text-slate-800 text-base mb-1">{task.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-1">{task.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs text-slate-400">{relativeTime(task.createdAt)}</div>
                  <div className="text-xs text-slate-400 mt-1">截止 {formatDate(task.dueDate)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-50">
                <UserOutlined className="text-slate-400 text-xs" />
                <span className="text-xs text-slate-500">{task.assigneeName}</span>
                <span className="text-xs text-slate-300">·</span>
                <span className="text-xs text-slate-500">{task.elderName}</span>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredTasks.length === 0 && (
          <EmptyState title="暂无任务" description="当前分类下没有任务" />
        )}
      </div>

      {/* Detail Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="任务详情"
        placement="right"
        width={400}
        styles={{ body: { padding: 20 } }}
      >
        {selectedTask && (
          <div>
            <div className="flex gap-2 mb-4">
              <StatusBadge status={selectedTask.status} label={TASK_STATUS_LABELS[selectedTask.status]} />
              <Tag className="!rounded-lg">{taskTypeLabels[selectedTask.taskType]}</Tag>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">{selectedTask.title}</h2>
            <p className="text-slate-600 mb-6">{selectedTask.description}</p>

            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-400">老人</span>
                <span className="text-sm font-medium text-slate-700">{selectedTask.elderName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-400">负责人</span>
                <span className="text-sm font-medium text-slate-700">{selectedTask.assigneeName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-400">优先级</span>
                <span className="text-sm font-medium text-slate-700">{PRIORITY_LABELS[selectedTask.priority]}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-400">截止日期</span>
                <span className="text-sm font-medium text-slate-700">{formatDate(selectedTask.dueDate)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-400">创建时间</span>
                <span className="text-sm font-medium text-slate-700">{relativeTime(selectedTask.createdAt)}</span>
              </div>
            </div>

            {selectedTask.completionNote && (
              <div className="mt-6 bg-green-50 rounded-xl p-4">
                <p className="text-sm text-green-800 font-medium mb-1">完成备注</p>
                <p className="text-sm text-green-700">{selectedTask.completionNote}</p>
              </div>
            )}

            <div className="mt-8 space-y-3">
              {selectedTask.status === TaskStatus.TODO && (
                <Button type="primary" block className="!rounded-xl !h-12">
                  开始处理
                </Button>
              )}
              {selectedTask.status === TaskStatus.IN_PROGRESS && (
                <Button type="primary" block className="!rounded-xl !h-12">
                  标记完成
                </Button>
              )}
              <Button block className="!rounded-xl">转派给他人</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
