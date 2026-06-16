'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Space, Tag, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, StopOutlined } from '@ant-design/icons'
import type { TablePaginationConfig } from 'antd/es/table'
import { EmergencyCard } from '@/types/card'
import { ElderProfile } from '@/types/elder'
import { formatDate } from '@/lib/utils'

const { TextArea } = Input

const VISIBILITY_OPTIONS = [
  { value: 'minimal', label: '最小信息' },
  { value: 'contact', label: '联系人信息' },
  { value: 'full', label: '完整档案' },
]

const VISIBILITY_LABEL_MAP: Record<string, string> = {
  minimal: '最小信息',
  contact: '联系人信息',
  full: '完整档案',
}

const VISIBILITY_COLOR_MAP: Record<string, string> = {
  minimal: 'default',
  contact: 'blue',
  full: 'purple',
}

const STATUS_COLOR_MAP: Record<string, string> = {
  active: 'green',
  revoked: 'red',
  expired: 'gray',
}

const STATUS_LABEL_MAP: Record<string, string> = {
  active: '启用',
  revoked: '已注销',
  expired: '已过期',
}

interface PaginationInfo {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export default function CardsPage() {
  const [data, setData] = useState<EmergencyCard[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, pageSize: 10, totalPages: 0 })
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<EmergencyCard | null>(null)
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
      const res = await fetch(`/api/cards?page=${page}&pageSize=${pageSize}`)
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

  const handleEdit = (record: EmergencyCard) => {
    setEditingRecord(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/cards/${id}`, { method: 'DELETE' })
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

  const handleRevoke = async (id: string) => {
    try {
      const res = await fetch(`/api/cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revoke' }),
      })
      const result = await res.json()
      if (result.success) {
        message.success('卡片已注销')
        fetchData(pagination.page, pagination.pageSize)
      } else {
        message.error(result.error || '注销失败')
      }
    } catch {
      message.error('网络错误，操作失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)

      const url = editingRecord ? `/api/cards/${editingRecord.id}` : '/api/cards'
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

  const columns: ColumnsType<EmergencyCard> = [
    {
      title: '卡片编号',
      dataIndex: 'cardNo',
      key: 'cardNo',
      width: 140,
      render: (val: string) => <span className="font-mono text-sm">{val}</span>,
    },
    {
      title: '绑定老人',
      dataIndex: 'elderName',
      key: 'elderName',
      width: 110,
      render: (val: string) => <span className="font-medium">{val}</span>,
    },
    {
      title: '社区',
      dataIndex: 'community',
      key: 'community',
      width: 110,
    },
    {
      title: '可见级别',
      dataIndex: 'visibilityLevel',
      key: 'visibilityLevel',
      width: 100,
      render: (val: string) => (
        <Tag color={VISIBILITY_COLOR_MAP[val] || 'default'} className="!rounded-lg">
          {VISIBILITY_LABEL_MAP[val] || val}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (val: string) => (
        <Tag color={STATUS_COLOR_MAP[val] || 'default'} className="!rounded-lg">
          {STATUS_LABEL_MAP[val] || val}
        </Tag>
      ),
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
      width: 200,
      render: (_: unknown, record: EmergencyCard) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          {record.status === 'active' && (
            <Popconfirm
              title="确认注销"
              description="确定要注销此卡片吗？"
              onConfirm={() => handleRevoke(record.id)}
              okText="确认"
              cancelText="取消"
            >
              <Button type="link" size="small" danger icon={<StopOutlined />}>
                注销
              </Button>
            </Popconfirm>
          )}
          <Popconfirm
            title="确认删除"
            description={`确定删除卡片 "${record.cardNo}" 吗？`}
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
          <h1 className="text-xl font-bold text-slate-800">联系卡管理</h1>
          <p className="text-sm text-slate-400">管理老人的安心联系卡</p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => fetchData(pagination.page, pagination.pageSize)}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            创建卡片
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
            showTotal: (total) => `共 ${total} 张`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 900 }}
          locale={{
            emptyText: '暂无联系卡数据',
          }}
        />
      </div>

      <Modal
        title={editingRecord ? '编辑联系卡' : '创建联系卡'}
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
          <Form.Item
            name="visibilityLevel"
            label="可见级别"
            rules={[{ required: true, message: '请选择可见级别' }]}
          >
            <Select options={VISIBILITY_OPTIONS} placeholder="请选择可见级别" className="!rounded-xl" />
          </Form.Item>
          <Form.Item name="emergencyNote" label="紧急备注">
            <TextArea rows={3} placeholder="请输入紧急备注信息（可选）" className="!rounded-xl" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
