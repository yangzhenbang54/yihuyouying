'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Space, Tag, Popconfirm, DatePicker } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import type { TablePaginationConfig } from 'antd/es/table'
import { DischargePlan } from '@/data/discharges'
import { ElderProfile } from '@/types/elder'
import { formatDate } from '@/lib/utils'
import dayjs from 'dayjs'

const { TextArea } = Input

const STATUS_OPTIONS = [
  { value: 'pending', label: '待处理' },
  { value: 'completed', label: '已完成' },
  { value: 'not_needed', label: '无需处理' },
]

const STATUS_COLOR_MAP: Record<string, string> = {
  completed: 'green',
  pending: 'orange',
  not_needed: 'gray',
}

const STATUS_LABEL_MAP: Record<string, string> = {
  completed: '已完成',
  pending: '待处理',
  not_needed: '无需',
}

interface PaginationInfo {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export default function DischargesPage() {
  const [data, setData] = useState<DischargePlan[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, pageSize: 10, totalPages: 0 })
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<DischargePlan | null>(null)
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
      const res = await fetch(`/api/discharges?page=${page}&pageSize=${pageSize}`)
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

  const handleEdit = (record: DischargePlan) => {
    setEditingRecord(record)
    form.setFieldsValue({
      ...record,
      dischargeDate: record.dischargeDate ? dayjs(record.dischargeDate) : undefined,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/discharges/${id}`, { method: 'DELETE' })
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
        dischargeDate: values.dischargeDate
          ? dayjs(values.dischargeDate).format('YYYY-MM-DD')
          : undefined,
      }

      const url = editingRecord ? `/api/discharges/${editingRecord.id}` : '/api/discharges'
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

  const renderStatusTag = (val: string) => (
    <Tag color={STATUS_COLOR_MAP[val] || 'default'} className="!rounded-lg">
      {STATUS_LABEL_MAP[val] || val}
    </Tag>
  )

  const columns: ColumnsType<DischargePlan> = [
    {
      title: '老人',
      dataIndex: 'elderName',
      key: 'elderName',
      width: 100,
      render: (val: string) => <span className="font-medium">{val}</span>,
    },
    {
      title: '医院',
      dataIndex: 'hospitalName',
      key: 'hospitalName',
      width: 130,
    },
    {
      title: '出院日期',
      dataIndex: 'dischargeDate',
      key: 'dischargeDate',
      width: 110,
      render: (val: string) => (val ? formatDate(val) : '-'),
    },
    {
      title: '接送',
      dataIndex: 'pickupStatus',
      key: 'pickupStatus',
      width: 80,
      render: renderStatusTag,
    },
    {
      title: '用药提醒',
      dataIndex: 'medicationReminderStatus',
      key: 'medicationReminderStatus',
      width: 90,
      render: renderStatusTag,
    },
    {
      title: '复诊',
      dataIndex: 'revisitStatus',
      key: 'revisitStatus',
      width: 80,
      render: renderStatusTag,
    },
    {
      title: '探访',
      dataIndex: 'visitStatus',
      key: 'visitStatus',
      width: 80,
      render: renderStatusTag,
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
      width: 140,
      render: (_: unknown, record: DischargePlan) => (
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
            description={`确定删除 ${record.elderName} 的出院计划吗？`}
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
          <h1 className="text-xl font-bold text-slate-800">出院计划管理</h1>
          <p className="text-sm text-slate-400">管理老人出院接送、用药提醒及后续照护</p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => fetchData(pagination.page, pagination.pageSize)}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            创建出院计划
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
          scroll={{ x: 1000 }}
          locale={{
            emptyText: '暂无出院计划数据',
          }}
        />
      </div>

      <Modal
        title={editingRecord ? '编辑出院计划' : '创建出院计划'}
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
          <Form.Item name="hospitalName" label="医院名称" rules={[{ required: true, message: '请输入医院名称' }]}>
            <Input placeholder="请输入医院名称" className="!rounded-xl" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item name="dischargeDate" label="出院日期" rules={[{ required: true, message: '请选择出院日期' }]}>
              <DatePicker className="!w-full !rounded-xl" placeholder="请选择出院日期" />
            </Form.Item>
            <Form.Item name="assigneeName" label="负责人">
              <Input placeholder="请输入负责人姓名" className="!rounded-xl" />
            </Form.Item>
            <Form.Item name="pickupStatus" label="接送状态">
              <Select options={STATUS_OPTIONS} placeholder="请选择状态" className="!rounded-xl" />
            </Form.Item>
            <Form.Item name="medicationReminderStatus" label="用药提醒状态">
              <Select options={STATUS_OPTIONS} placeholder="请选择状态" className="!rounded-xl" />
            </Form.Item>
            <Form.Item name="revisitStatus" label="复诊状态">
              <Select options={STATUS_OPTIONS} placeholder="请选择状态" className="!rounded-xl" />
            </Form.Item>
            <Form.Item name="visitStatus" label="探访状态">
              <Select options={STATUS_OPTIONS} placeholder="请选择状态" className="!rounded-xl" />
            </Form.Item>
          </div>
          <Form.Item name="notes" label="备注">
            <TextArea rows={3} placeholder="请输入备注信息（可选）" className="!rounded-xl" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
