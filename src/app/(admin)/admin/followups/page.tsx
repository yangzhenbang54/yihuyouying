'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Table, Button, Modal, Form, Input, Select, InputNumber, Rate, message, Space, Tag, Popconfirm, DatePicker } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import type { TablePaginationConfig } from 'antd/es/table'
import { ElderProfile } from '@/types/elder'
import { formatDate } from '@/lib/utils'
import dayjs from 'dayjs'

const { TextArea } = Input

const FOLLOWUP_TYPE_OPTIONS = [
  { value: 'phone', label: '电话回访' },
  { value: 'visit', label: '上门探访' },
  { value: 'video', label: '视频回访' },
]

const FOLLOWUP_TYPE_LABEL_MAP: Record<string, string> = {
  phone: '电话回访',
  visit: '上门探访',
  video: '视频回访',
}

const FOLLOWUP_STATUS_OPTIONS = [
  { value: 'scheduled', label: '待执行' },
  { value: 'completed', label: '已完成' },
  { value: 'missed', label: '已错过' },
]

const FOLLOWUP_STATUS_COLOR_MAP: Record<string, string> = {
  scheduled: 'processing',
  completed: 'green',
  missed: 'red',
}

const FOLLOWUP_STATUS_LABEL_MAP: Record<string, string> = {
  scheduled: '待执行',
  completed: '已完成',
  missed: '已错过',
}

interface PaginationInfo {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

interface FollowupRecord {
  id: string
  elderId: string
  elderName: string
  caseId?: string
  type: 'phone' | 'visit' | 'video'
  status: 'scheduled' | 'completed' | 'missed'
  scheduledDate: string
  completedAt?: string
  result: string
  satisfaction?: number
  nextAction: string
  assigneeId: string
  assigneeName: string
  createdAt: string
}

export default function FollowupsPage() {
  const [data, setData] = useState<FollowupRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, pageSize: 10, totalPages: 0 })
  const [modalOpen, setModalOpen] = useState(false)
  const [completeModalOpen, setCompleteModalOpen] = useState(false)
  const [completingRecord, setCompletingRecord] = useState<FollowupRecord | null>(null)
  const [editingRecord, setEditingRecord] = useState<FollowupRecord | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [elders, setElders] = useState<ElderProfile[]>([])
  const [form] = Form.useForm()
  const [completeForm] = Form.useForm()

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
      const res = await fetch(`/api/followups?page=${page}&pageSize=${pageSize}`)
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

  const handleEdit = (record: FollowupRecord) => {
    setEditingRecord(record)
    form.setFieldsValue({
      ...record,
      scheduledDate: record.scheduledDate ? dayjs(record.scheduledDate) : undefined,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/followups/${id}`, { method: 'DELETE' })
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

  const handleCompleteOpen = (record: FollowupRecord) => {
    setCompletingRecord(record)
    completeForm.resetFields()
    setCompleteModalOpen(true)
  }

  const handleCompleteSubmit = async () => {
    if (!completingRecord) return
    try {
      const values = await completeForm.validateFields()
      setSubmitting(true)

      const res = await fetch(`/api/followups/${completingRecord.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          status: 'completed',
          completedAt: dayjs().format('YYYY-MM-DD'),
        }),
      })
      const result = await res.json()

      if (result.success) {
        message.success('回访已完成')
        setCompleteModalOpen(false)
        setCompletingRecord(null)
        completeForm.resetFields()
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

  const handleMarkMissed = async (id: string) => {
    try {
      const res = await fetch(`/api/followups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'missed' }),
      })
      const result = await res.json()
      if (result.success) {
        message.success('已标记为错过')
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

      const body = {
        ...values,
        scheduledDate: values.scheduledDate
          ? dayjs(values.scheduledDate).format('YYYY-MM-DD')
          : undefined,
      }

      const url = editingRecord ? `/api/followups/${editingRecord.id}` : '/api/followups'
      const method = editingRecord ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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

  const columns: ColumnsType<FollowupRecord> = [
    {
      title: '老人',
      dataIndex: 'elderName',
      key: 'elderName',
      width: 100,
      render: (val: string) => <span className="font-medium">{val}</span>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (val: string) => (
        <Tag className="!rounded-lg">{FOLLOWUP_TYPE_LABEL_MAP[val] || val}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (val: string) => (
        <Tag color={FOLLOWUP_STATUS_COLOR_MAP[val] || 'default'} className="!rounded-lg">
          {FOLLOWUP_STATUS_LABEL_MAP[val] || val}
        </Tag>
      ),
    },
    {
      title: '计划日期',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
      width: 110,
      render: (val: string) => (val ? formatDate(val) : '-'),
    },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      width: 200,
      ellipsis: true,
      render: (val: string) => val || '-',
    },
    {
      title: '满意度',
      dataIndex: 'satisfaction',
      key: 'satisfaction',
      width: 120,
      render: (val: number | undefined) =>
        val ? (
          <span className="text-amber-500">{'⭐'.repeat(val)}</span>
        ) : (
          '-'
        ),
    },
    {
      title: '下一步',
      dataIndex: 'nextAction',
      key: 'nextAction',
      width: 160,
      ellipsis: true,
      render: (val: string) => val || '-',
    },
    {
      title: '负责人',
      dataIndex: 'assigneeName',
      key: 'assigneeName',
      width: 100,
    },
    {
      title: '操作',
      key: 'actions',
      width: 240,
      render: (_: unknown, record: FollowupRecord) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          {record.status === 'scheduled' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<CheckCircleOutlined />}
                style={{ color: '#52c41a' }}
                onClick={() => handleCompleteOpen(record)}
              >
                完成
              </Button>
              <Popconfirm
                title="确认标记"
                description="确定将此回访标记为已错过？"
                onConfirm={() => handleMarkMissed(record.id)}
                okText="确认"
                cancelText="取消"
              >
                <Button
                  type="link"
                  size="small"
                  icon={<CloseCircleOutlined />}
                  style={{ color: '#ff4d4f' }}
                >
                  错过
                </Button>
              </Popconfirm>
            </>
          )}
          <Popconfirm
            title="确认删除"
            description={`确定删除此回访记录吗？`}
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
          <h1 className="text-xl font-bold text-slate-800">回访管理</h1>
          <p className="text-sm text-slate-400">管理老人的定期回访和跟进记录</p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => fetchData(pagination.page, pagination.pageSize)}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            创建回访
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
          scroll={{ x: 1200 }}
          locale={{
            emptyText: '暂无回访数据',
          }}
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        title={editingRecord ? '编辑回访' : '创建回访'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setModalOpen(false)
          form.resetFields()
        }}
        confirmLoading={submitting}
        okText={editingRecord ? '保存' : '创建'}
        cancelText="取消"
        width={560}
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
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item name="type" label="回访类型" rules={[{ required: true, message: '请选择回访类型' }]}>
              <Select options={FOLLOWUP_TYPE_OPTIONS} placeholder="请选择回访类型" className="!rounded-xl" />
            </Form.Item>
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
              <Select options={FOLLOWUP_STATUS_OPTIONS} placeholder="请选择状态" className="!rounded-xl" />
            </Form.Item>
            <Form.Item
              name="scheduledDate"
              label="计划日期"
              rules={[{ required: true, message: '请选择计划日期' }]}
            >
              <DatePicker className="!w-full !rounded-xl" placeholder="请选择计划日期" />
            </Form.Item>
            <Form.Item name="assigneeName" label="负责人">
              <Input placeholder="请输入负责人姓名" className="!rounded-xl" />
            </Form.Item>
          </div>
          <Form.Item name="nextAction" label="下一步计划">
            <Input placeholder="请输入后续计划（可选）" className="!rounded-xl" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Complete Modal */}
      <Modal
        title="完成回访"
        open={completeModalOpen}
        onOk={handleCompleteSubmit}
        onCancel={() => {
          setCompleteModalOpen(false)
          setCompletingRecord(null)
          completeForm.resetFields()
        }}
        confirmLoading={submitting}
        okText="确认完成"
        cancelText="取消"
        width={500}
        className="[&_.ant-modal-content]:!rounded-2xl"
      >
        <div className="mt-4">
          {completingRecord && (
            <p className="text-sm text-slate-500 mb-4">
              正在完成对 <strong>{completingRecord.elderName}</strong> 的回访记录
            </p>
          )}
          <Form form={completeForm} layout="vertical">
            <Form.Item
              name="result"
              label="回访结果"
              rules={[{ required: true, message: '请输入回访结果' }]}
            >
              <TextArea rows={3} placeholder="请输入回访结果" className="!rounded-xl" />
            </Form.Item>
            <Form.Item name="satisfaction" label="满意度评价">
              <Rate allowHalf />
            </Form.Item>
            <Form.Item name="nextAction" label="下一步计划">
              <Input placeholder="请输入后续跟进计划" className="!rounded-xl" />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  )
}
