'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Space, Tag, Popconfirm, DatePicker } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import type { TablePaginationConfig } from 'antd/es/table'
import { Task } from '@/types/task'
import { ElderProfile } from '@/types/elder'
import { TASK_STATUS_LABELS, PRIORITY_LABELS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import dayjs from 'dayjs'

const { TextArea } = Input

const TASK_TYPE_OPTIONS = [
  { value: 'intake_review', label: '建档审核' },
  { value: 'emergency_response', label: '应急响应' },
  { value: 'discharge_pickup', label: '出院接送' },
  { value: 'medication_reminder', label: '用药提醒' },
  { value: 'revisit', label: '上门探访' },
  { value: 'followup', label: '回访' },
  { value: 'other', label: '其他' },
]

const TASK_TYPE_LABEL_MAP: Record<string, string> = {
  intake_review: '建档审核',
  emergency_response: '应急响应',
  discharge_pickup: '出院接送',
  medication_reminder: '用药提醒',
  revisit: '上门探访',
  followup: '回访',
  other: '其他',
}

const TASK_STATUS_OPTIONS = [
  { value: 'todo', label: '待办' },
  { value: 'in_progress', label: '进行中' },
  { value: 'done', label: '已完成' },
  { value: 'overdue', label: '已超时' },
  { value: 'cancelled', label: '已取消' },
]

const TASK_STATUS_COLOR_MAP: Record<string, string> = {
  todo: 'default',
  in_progress: 'processing',
  done: 'green',
  overdue: 'red',
  cancelled: 'gray',
}

const PRIORITY_OPTIONS = [
  { value: 4, label: '紧急' },
  { value: 3, label: '高' },
  { value: 2, label: '中' },
  { value: 1, label: '低' },
]

const PRIORITY_COLOR_MAP: Record<number, string> = {
  4: 'red',
  3: 'orange',
  2: 'blue',
  1: 'green',
}

const STATUS_TABS = [
  { key: '', label: '全部' },
  { key: 'todo', label: '待办' },
  { key: 'in_progress', label: '进行中' },
  { key: 'done', label: '已完成' },
  { key: 'overdue', label: '已超时' },
]

interface PaginationInfo {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export default function TasksPage() {
  const [data, setData] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, pageSize: 10, totalPages: 0 })
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<Task | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
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
      let url = `/api/tasks?page=${page}&pageSize=${pageSize}`
      if (statusFilter) {
        url += `&status=${statusFilter}`
      }
      const res = await fetch(url)
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
  }, [statusFilter])

  useEffect(() => {
    fetchData()
    fetchElders()
  }, [fetchData, fetchElders])

  const handleCreate = () => {
    setEditingRecord(null)
    form.resetFields()
    setModalOpen(true)
  }

  const handleEdit = (record: Task) => {
    setEditingRecord(record)
    form.setFieldsValue({
      ...record,
      dueDate: record.dueDate ? dayjs(record.dueDate) : undefined,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)

      const body = {
        ...values,
        dueDate: values.dueDate ? dayjs(values.dueDate).format('YYYY-MM-DD') : undefined,
      }

      const url = editingRecord ? `/api/tasks/${editingRecord.id}` : '/api/tasks'
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

  const columns: ColumnsType<Task> = [
    {
      title: '任务标题',
      dataIndex: 'title',
      key: 'title',
      width: 160,
      render: (val: string) => <span className="font-medium">{val}</span>,
    },
    {
      title: '绑定老人',
      dataIndex: 'elderName',
      key: 'elderName',
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'taskType',
      key: 'taskType',
      width: 100,
      render: (val: string) => (
        <Tag className="!rounded-lg">{TASK_TYPE_LABEL_MAP[val] || val}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (val: string) => (
        <Tag color={TASK_STATUS_COLOR_MAP[val] || 'default'} className="!rounded-lg">
          {TASK_STATUS_LABELS[val] || val}
        </Tag>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (val: number) => (
        <Tag color={PRIORITY_COLOR_MAP[val] || 'default'} className="!rounded-lg">
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
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 110,
      render: (val: string) => (val ? formatDate(val) : '-'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 140,
      render: (_: unknown, record: Task) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description={`确定删除任务 "${record.title}" 吗？`}
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
          <h1 className="text-xl font-bold text-slate-800">任务管理</h1>
          <p className="text-sm text-slate-400">管理和分配老人服务任务</p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => fetchData(pagination.page, pagination.pageSize)}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            创建任务
          </Button>
        </Space>
      </div>

      <div className="flex gap-2 mb-4">
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab.key}
            type={statusFilter === tab.key ? 'primary' : 'default'}
            size="small"
            onClick={() => {
              setStatusFilter(tab.key)
              fetchData(1, pagination.pageSize)
            }}
            className="!rounded-xl"
          >
            {tab.label}
          </Button>
        ))}
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
          scroll={{ x: 900 }}
          locale={{
            emptyText: '暂无任务数据',
          }}
        />
      </div>

      <Modal
        title={editingRecord ? '编辑任务' : '创建任务'}
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
          <Form.Item name="title" label="任务标题" rules={[{ required: true, message: '请输入任务标题' }]}>
            <Input placeholder="请输入任务标题" className="!rounded-xl" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item name="taskType" label="任务类型" rules={[{ required: true, message: '请选择任务类型' }]}>
              <Select options={TASK_TYPE_OPTIONS} placeholder="请选择任务类型" className="!rounded-xl" />
            </Form.Item>
            <Form.Item name="priority" label="优先级" rules={[{ required: true, message: '请选择优先级' }]}>
              <Select options={PRIORITY_OPTIONS} placeholder="请选择优先级" className="!rounded-xl" />
            </Form.Item>
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
              <Select options={TASK_STATUS_OPTIONS} placeholder="请选择状态" className="!rounded-xl" />
            </Form.Item>
            <Form.Item name="assigneeName" label="负责人">
              <Input placeholder="请输入负责人姓名" className="!rounded-xl" />
            </Form.Item>
          </div>
          <Form.Item name="dueDate" label="截止日期">
            <DatePicker className="!w-full !rounded-xl" placeholder="请选择截止日期" />
          </Form.Item>
          <Form.Item name="description" label="任务描述">
            <TextArea rows={3} placeholder="请输入任务描述（可选）" className="!rounded-xl" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
