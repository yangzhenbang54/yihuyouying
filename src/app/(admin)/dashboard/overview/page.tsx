'use client'

import React from 'react'
import { Card as AntCard, DatePicker, Table, Tag } from 'antd'
import { useApiData } from '@/hooks/useApiData'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import {
  ResponsiveContainer,
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { UserCheck, CreditCard, PhoneCall, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

const { RangePicker } = DatePicker

export default function DashboardOverviewPage() {
  const { data: kpiData, loading: kpiLoading, error: kpiError } = useApiData<any>('/api/dashboard')
  const { data: trendsData, loading: trendsLoading } = useApiData<any[]>('/api/dashboard/trends')
  const { data: auditLogs, loading: auditLoading } = useApiData<any[]>('/api/audit-logs?limit=10')

  const loading = kpiLoading || trendsLoading

  if (loading) return <LoadingSpinner text="加载数据看板..." />

  if (kpiError) {
    return <LoadingSpinner text={`加载失败: ${kpiError}`} />
  }

  const weeklyMetrics = trendsData || []
  const dischargeTasks = [
    { category: '出院接送', completed: 42, pending: 5 },
    { category: '用药提醒', completed: 38, pending: 12 },
    { category: '复诊安排', completed: 30, pending: 18 },
    { category: '探访安排', completed: 25, pending: 15 },
  ]
  const riskDistribution = [
    { name: '重点关注', value: 28, color: '#ef4444' },
    { name: '中等关注', value: 45, color: '#f59e0b' },
    { name: '一般关注', value: 55, color: '#0d9488' },
  ]
  const responseTimeData = [
    { date: '12/01', medianMinutes: 15, p90Minutes: 45 },
    { date: '12/03', medianMinutes: 12, p90Minutes: 38 },
    { date: '12/05', medianMinutes: 18, p90Minutes: 52 },
    { date: '12/07', medianMinutes: 10, p90Minutes: 30 },
    { date: '12/09', medianMinutes: 14, p90Minutes: 42 },
    { date: '12/11', medianMinutes: 20, p90Minutes: 55 },
    { date: '12/13', medianMinutes: 16, p90Minutes: 48 },
    { date: '12/15', medianMinutes: 11, p90Minutes: 35 },
    { date: '12/17', medianMinutes: 13, p90Minutes: 40 },
  ]

  const recentActions = (auditLogs || []).length > 0
    ? auditLogs!
    : [
        { id: 1, user: '王护士', action: '更新档案', target: '张建国', time: '2025-12-17 14:23', status: 'success' },
        { id: 2, user: '李医生', action: '创建工单', target: '李秀英', time: '2025-12-17 13:15', status: 'success' },
        { id: 3, user: '赵社工', action: '回访记录', target: '王德发', time: '2025-12-17 11:02', status: 'warning' },
        { id: 4, user: '刘管理员', action: '用户授权', target: '张医生', time: '2025-12-16 16:45', status: 'success' },
        { id: 5, user: '陈护士', action: '出院接续', target: '刘桂英', time: '2025-12-16 15:30', status: 'success' },
        { id: 6, user: '王护士', action: '风险评估', target: '赵建国', time: '2025-12-16 14:00', status: 'error' },
        { id: 7, user: '李医生', action: '编辑档案', target: '孙秀兰', time: '2025-12-16 10:20', status: 'success' },
        { id: 8, user: '赵社工', action: '发放联系卡', target: '周明德', time: '2025-12-15 09:45', status: 'success' },
        { id: 9, user: '张管理员', action: '系统配置', target: '通知模板', time: '2025-12-15 08:30', status: 'success' },
        { id: 10, user: '陈护士', action: '个案管理', target: '吴美芳', time: '2025-12-14 17:10', status: 'warning' },
      ]

  const completedFollowups = kpiData?.completedFollowups || 0
  const scheduledFollowups = kpiData?.scheduledFollowups || 0
  const followupRate = (completedFollowups + scheduledFollowups) > 0
    ? Math.round((completedFollowups / (completedFollowups + scheduledFollowups)) * 100)
    : 0

  const kpiCards = [
    { label: '建档总数', value: kpiData?.totalElders || 0, icon: <UserCheck size={22} className="text-brand-600" />, bg: 'bg-brand-50', change: '+12%' },
    { label: '发卡总数', value: kpiData?.activeCards || 0, icon: <CreditCard size={22} className="text-blue-600" />, bg: 'bg-blue-50', change: '+8%' },
    { label: '本月应急', value: kpiData?.openCases || 0, icon: <PhoneCall size={22} className="text-amber-600" />, bg: 'bg-amber-50', change: '+3' },
    { label: '回访完成率', value: `${followupRate}%`, icon: <TrendingUp size={22} className="text-green-600" />, bg: 'bg-green-50', change: '+5%' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">运营看板</h1>
          <p className="text-sm text-slate-400">数据截止到最新统计周期</p>
        </div>
        <RangePicker className="!rounded-xl" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <AntCard className="!rounded-card-lg !border !border-slate-100 !shadow-card hover:!shadow-card-hover transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                  <span className="text-xs text-green-600 mt-1 inline-block">{card.change} 较上月</span>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                  {card.icon}
                </div>
              </div>
            </AntCard>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Service Coverage */}
        <AntCard title="服务覆盖趋势" className="!rounded-card-lg !shadow-card">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={weeklyMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="profiles" stroke="#0d9488" strokeWidth={2} name="建档数" dot={false} />
              <Line type="monotone" dataKey="cards" stroke="#3b82f6" strokeWidth={2} name="发卡数" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </AntCard>

        {/* Response Time */}
        <AntCard title="应急响应时间趋势" className="!rounded-card-lg !shadow-card">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" unit="min" />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="medianMinutes" stroke="#0d9488" strokeWidth={2} name="中位数(分钟)" dot={false} />
              <Line type="monotone" dataKey="p90Minutes" stroke="#f59e0b" strokeWidth={2} name="P90(分钟)" strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </AntCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Risk Distribution */}
        <AntCard title="风险分层分布" className="!rounded-card-lg !shadow-card">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {riskDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} strokeWidth={2} stroke="#fff" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </AntCard>

        {/* Discharge tasks */}
        <AntCard title="出院接续任务完成情况" className="!rounded-card-lg !shadow-card">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dischargeTasks} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 12 }} stroke="#94a3b8" width={60} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Bar dataKey="completed" name="已完成" stackId="a" fill="#0d9488" radius={[0, 0, 0, 0]} />
              <Bar dataKey="pending" name="待处理" stackId="a" fill="#fcd34d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AntCard>
      </div>

      {/* Charts Row 3: Coverage Bar + Risk Pie (enhanced) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Service Coverage Bar Chart */}
        <AntCard title="服务覆盖柱状图" className="!rounded-card-lg !shadow-card">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Bar dataKey="profiles" name="建档数" fill="#0d9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cards" name="发卡数" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AntCard>

        {/* Response Time Line Chart (enhanced version) */}
        <AntCard title="响应时间趋势（P90 vs 中位数）" className="!rounded-card-lg !shadow-card">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" unit="min" />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="top" />
              <Line type="monotone" dataKey="medianMinutes" stroke="#0d9488" strokeWidth={2} name="中位数(分钟)" dot={{ r: 4, fill: '#0d9488' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="p90Minutes" stroke="#f59e0b" strokeWidth={2} name="P90(分钟)" strokeDasharray="5 5" dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </AntCard>
      </div>

      {/* Recent Actions */}
      <AntCard title="近期操作" className="!rounded-card-lg !shadow-card">
        <Table
          dataSource={recentActions}
          rowKey="id"
          loading={auditLoading}
          pagination={false}
          columns={[
            {
              title: '操作人',
              dataIndex: 'user',
              key: 'user',
              width: 100,
            },
            {
              title: '操作',
              dataIndex: 'action',
              key: 'action',
              width: 120,
            },
            {
              title: '对象',
              dataIndex: 'target',
              key: 'target',
              width: 120,
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              width: 100,
              render: (status: string) => {
                const colorMap: Record<string, string> = {
                  success: 'green',
                  warning: 'orange',
                  error: 'red',
                }
                const labelMap: Record<string, string> = {
                  success: '成功',
                  warning: '待审核',
                  error: '失败',
                }
                return <Tag color={colorMap[status] || 'default'}>{labelMap[status] || status}</Tag>
              },
            },
            {
              title: '时间',
              dataIndex: 'time',
              key: 'time',
              render: (text: string) => (
                <span className="text-slate-500 text-sm">{text}</span>
              ),
            },
          ]}
          className="!rounded-lg"
          size="middle"
        />
      </AntCard>
    </div>
  )
}
