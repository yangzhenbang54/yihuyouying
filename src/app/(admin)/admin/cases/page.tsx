'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Space, Tag, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, CheckCircleOutlined, ArrowUpOutlined } from '@ant-design/icons'
import type { TablePaginationConfig } from 'antd/es/table'
import { CaseEvent } from '@/types/case'
import { ElderProfile } from '@/types/elder'
import { CASE_STATUS_LABELS, PRIORITY_LABELS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'

const { TextArea } = Input

const TRIGGER_TYPE_OPTIONS = [
  { value: 'scan', label: '扫码触发' },
  { value: 'manual', label: '手动上报' },
  { value: 'followup', label: '回访触发' },
  { value: 'other', label: '其他' },
]

const TRIGGER_TYPE_LABEL_MAP: Record<string, string> = {
  scan: '扫码触发',
  manual: '手动上报',
  followup: '回访触发',
  other: '其他',
}

const TRIGGER_TYPE_COLOR_MAP: Record<string, string> = {
  scan: 'purple',
  manual: 'orange',
  followup: 'blue',
  other: 'default',
}

const CASE_STATUS_OPTIONS = [
  { value: 'open', label: '处理中' },
  { value: 'resolved', label: '已解决' },
  { value: 'closed', label: '已关闭' },
  { value: 'escalated', label: '已上报' },
]

const CASE_STATUS_COLOR_MAP: Record<string, string> = {
  open: 'red',
  resolved: 'green',
  closed: 'default',
  escalated: 'orange',
}

const SEVERITY_OPTIONS = [
  { value: 4, label: '紧急' },
  { value: 3, label: '高' },
  { value: 2, label: '中' },
  { value: 1, label: '低' },
]

const SEVERITY_COLOR_MAP: Record<number, string> = {
  4: 'red',
  3: 'orange',
  2: 'blue',
  1: 'green',
}

interface PaginationInfo {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export default function CasesPage() {
  const [data, setData] = useState<CaseEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, pageSize: 10, totalPages: 0 })
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<CaseEvent | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [elders, setElders] = useState<ElderProfile[]>([])
  const [form] = Form.useForm()

  const fetchElders = useCallback(async () => {
    try {
      const res = await fetch('/api/elders?pageSize=200')
      const result = await res.json()
      if (result.success) {
        setElders(result.data)
      }
    } catch {
      // silent
    }
  }, [])

  const fetchData = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/cases?page=${page}&pageSize=${pageSize}`)
      const result = await res.json()
      if (result.success) {
        setData(result.data)
        setPagination(result.pagination)
      } else {
        message.error(result.error || '加载失败')
      }
    } catch {
      message.error('网络错误，加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    fetchElders()
  }, [fetchData, fetchElders])

  const handleCreate = () => {
    setEditingRecord(null)
    form.resetFields()
    setModalOpen(true)
  }

  const handleEdit = (record: CaseEvent) => {
    setEditingRecord(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/cases/${id}`, { method: 'DELETE' })
      const result = await res.json()
      if (result.success) {
        message.success('删除成功')
        fetchData(pagination.page, pagination.pageSize)
      } else {
        message.error(result.error || '删除失败')
      }
    } catch {
      message.error('网络错误，删除失败')
    }
  }

  const handleAction = async (id: string, action: 'resolve' | 'escalate') => {
    const actionLabel = action === 'resolve' ? '解决' : '上报'
    try {
      const res = await fetch(`/api/cases/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const result = await res.json()
      if (result.success) {
        message.success(`案件已${actionLabel}`)
        fetchData(pagination.page, pagination.pageSize)
      } else {
        message.error(result.error || '操作失败')
      }
    } catch {
      message.error('网络错误，操作失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)

      const url = editingRecord ? `/api/cases/${editingRecord.id}` : '/api/cases'
      const method = editingRecord ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const result = await res.json()

      if (result.success) {
        message.success(editingRecord ? '更新成功' : '创建成功')
        setModalOpen(false)
        form.resetFields()
        fetchData(pagination.page, pagination.pageSize)
      } else {
        message.error(result.error || '操作失败')
      }
    } catch {
      // validation failed
    } finally {
      setSubmitting(false)
    }
  }

  const handleTableChange = (pag: TablePaginationConfig) => {
    fetchData(pag.current || 1, pag.pageSize || 10)
  }

  const columns: ColumnsType<CaseEvent> = [
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 260,
      ellipsis: true,
      render: (val: string) => <span className="text-sm">{val}</span>,
    },
    {
      title: '绑定老人',
      dataIndex: 'elderName',
      key: 'elderName',
      width: 100,
      render: (val: string) => <span className="font-medium">{val}</span>,
    },
    {
      title: '触发方式',
      dataIndex: 'triggerType',
      key: 'triggerType',
      width: 100,
      render: (val: string) => (
        <Tag color={TRIGGER_TYPE_COLOR_MAP[val] || 'default'} className="!rounded-lg">
          {TRIGGER_TYPE_LABEL_MAP[val] || val}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (val: string) => (
        <Tag color={CASE_STATUS_COLOR_MAP[val] || 'default'} className="!rounded-lg">
          {CASE_STATUS_LABELS[val] || val}
        </Tag>
      ),
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 80,
      render: (val: number) => (
        <Tag color={SEVERITY_COLOR_MAP[val] || 'default'} className="!rounded-lg">
          {PRIORITY_LABELS[val] || val}
        </Tag>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'assigneeName',
      key: 'assigneeName',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
      render: (val: string) => formatDate(val),
    },
    {
      title: '操作',
      key: 'actions',
      width: 220,
      render: (_: unknown, record: CaseEvent) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          {record.status === 'open' && (
            <>
              <Popconfirm
                title="确认解决"
                description="确定将此案件标记为已解决？"
                onConfirm={() => handleAction(record.id, 'resolve')}
                okText="确认"
                cancelText="取消"
              >
                <Button
                  type="link"
                  size="small"
                  icon={<CheckCircleOutlined />}
                  style={{ color: '#52c41a' }}
                >
                  解决
                </Button>
              </Popconfirm>
              <Popconfirm
                title="确认上报"
                description="确定将此案件上报？"
                onConfirm={() => handleAction(record.id, 'escalate')}
                okText="确认"
                cancelText="取消"
              >
                <Button
                  type="link"
                  size="small"
                  icon={<ArrowUpOutlined />}
                  style={{ color: '#fa8c16' }}
                >
                  上报
                </Button>
              </Popconfirm>
            </>
          )}
          <Popconfirm
            title="确认删除"
            description="确定删除此案件吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">事件管理</h1>
          <p className="text-sm text-slate-400">管理老人相关的应急事件和案件</p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => fetchData(pagination.page, pagination.pageSize)}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            创建事件
          </Button>
        </Space>
      </div>

      <div className="bg-white rounded-card-lg border border-slate-100 shadow-card overflow-hidden">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1100 }}
          locale={{
            emptyText: '暂无事件数据',
          }}
        />
      </div>

      <Modal
        title={editingRecord ? '编辑事件' : '创建事件'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setModalOpen(false)
          form.resetFields()
        }}
        confirmLoading={submitting}
        okText={editingRecord ? '保存' : '创建'}
        cancelText="取消"
        width={600}
        className="[&_.ant-modal-content]:!rounded-2xl"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="elderId"
            label="绑定老人"
            rules={[{ required: true, message: '请选择老人' }]}
          >
            <Select
              showSearch
              placeholder="搜索并选择老人"
              optionFilterProp="label"
              options={elders.map((e) => ({ value: e.id, label: `${e.name} (${e.community})` }))}
              className="!rounded-xl"
            />
          </Form.Item>
          <Form.Item name="description" label="事件描述" rules={[{ required: true, message: '请输入事件描述' }]}>
            <TextArea rows={3} placeholder="请输入事件描述" className="!rounded-xl" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item name="triggerType" label="触发方式" rules={[{ required: true, message: '请选择触发方式' }]}>
              <Select options={TRIGGER_TYPE_OPTIONS} placeholder="请选择触发方式" className="!rounded-xl" />
            </Form.Item>
            <Form.Item name="severity" label="严重程度" rules={[{ required: true, message: '请选择严重程度' }]}>
              <Select options={SEVERITY_OPTIONS} placeholder="请选择严重程度" className="!rounded-xl" />
            </Form.Item>
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
              <Select options={CASE_STATUS_OPTIONS} placeholder="请选择状态" className="!rounded-xl" />
            </Form.Item>
            <Form.Item name="assigneeName" label="负责人">
              <Input placeholder="请输入负责人姓名" className="!rounded-xl" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
