'use client'

import React, { useState } from 'react'
import { Table, Tag, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { mockAudits } from '@/data/audits'
import { AuditLog } from '@/types/audit'
import SearchInput from '@/components/ui/SearchInput'
import { formatDateTime } from '@/lib/utils'
import { WarningOutlined } from '@ant-design/icons'

const columns: ColumnsType<AuditLog> = [
  {
    title: '时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 160,
    render: (val: string) => <span className="text-sm">{formatDateTime(val)}</span>,
  },
  {
    title: '操作人',
    dataIndex: 'actorName',
    key: 'actorName',
    width: 120,
    render: (val, record) => (
      <div className="flex items-center gap-2">
        {record.isAbnormal && <WarningOutlined className="text-red-500" />}
        <span className="font-medium text-sm">{val}</span>
      </div>
    ),
  },
  {
    title: '角色',
    dataIndex: 'actorRole',
    key: 'actorRole',
    width: 100,
    render: (val: string) => (
      <Tag className="!rounded-lg !text-xs">{val === 'admin' ? '管理员' : val === 'community' ? '社工' : val === 'hospital_sw' ? '医院社工' : val}</Tag>
    ),
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 120,
  },
  {
    title: '资源类型',
    dataIndex: 'resourceType',
    key: 'resourceType',
    width: 100,
  },
  {
    title: '资源ID',
    dataIndex: 'resourceId',
    key: 'resourceId',
    width: 100,
    ellipsis: true,
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    key: 'ip',
    width: 130,
  },
  {
    title: '状态',
    key: 'isAbnormal',
    width: 80,
    render: (_, record) => (
      record.isAbnormal
        ? <Tag color="error" className="!rounded-lg !text-xs" icon={<WarningOutlined />}>异常</Tag>
        : <Tag color="success" className="!rounded-lg !text-xs">正常</Tag>
    ),
  },
]

export default function AuditPage() {
  const [search, setSearch] = useState('')

  const filtered = mockAudits.filter(a => {
    if (!search) return true
    return a.actorName.includes(search) || a.action.includes(search) || a.resourceId.includes(search)
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">审计日志</h1>
          <p className="text-sm text-slate-400">所有操作留痕记录 · 异常访问自动标记</p>
        </div>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <SearchInput
          placeholder="搜索操作人或资源..."
          value={search}
          onChange={setSearch}
          className="min-w-[200px]"
        />
        <Select defaultValue="all" className="!w-28 !rounded-xl" options={[
          { value: 'all', label: '全部操作' },
          { value: '查看', label: '查看档案' },
          { value: '扫描', label: '扫描查看' },
          { value: '修改', label: '修改档案' },
          { value: '导出', label: '导出报表' },
        ]} />
      </div>

      <div className="bg-white rounded-card-lg border border-slate-100 shadow-card overflow-hidden">
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: false }}
          scroll={{ x: 900 }}
          onRow={(record) => ({
            className: record.isAbnormal ? 'bg-red-50/50' : '',
          })}
        />
      </div>
    </div>
  )
}
