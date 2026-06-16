'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Table, Button, Modal, Form, Input, Select, InputNumber, Switch, message, Space, Tag, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import type { TablePaginationConfig } from 'antd/es/table'
import { TrustedContact } from '@/types/contact'
import { ElderProfile } from '@/types/elder'

const RELATION_OPTIONS = [
  { value: '儿子', label: '儿子' },
  { value: '女儿', label: '女儿' },
  { value: '丈夫', label: '丈夫' },
  { value: '妻子', label: '妻子' },
  { value: '社区工作人员', label: '社区工作人员' },
  { value: '机构管理人员', label: '机构管理人员' },
  { value: '邻居', label: '邻居' },
  { value: '其他', label: '其他' },
]

const VERIFIED_STATUS_OPTIONS = [
  { value: 'verified', label: '已验证' },
  { value: 'pending', label: '待核验' },
  { value: 'invalid', label: '无效' },
]

const VERIFIED_COLOR_MAP: Record<string, string> = {
  verified: 'green',
  pending: 'orange',
  invalid: 'red',
}

const VERIFIED_LABEL_MAP: Record<string, string> = {
  verified: '已验证',
  pending: '待核验',
  invalid: '无效',
}

interface PaginationInfo {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export default function ContactsPage() {
  const [data, setData] = useState<TrustedContact[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, pageSize: 10, totalPages: 0 })
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<TrustedContact | null>(null)
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
      // silenty fail, elders list is optional for initial load
    }
  }, [])

  const fetchData = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/contacts?page=${page}&pageSize=${pageSize}`)
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

  const handleEdit = (record: TrustedContact) => {
    setEditingRecord(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
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

      // Extract elderId for the create endpoint, include it in body for update
      const { elderId, ...body } = values
      const url = editingRecord
        ? `/api/contacts/${editingRecord.id}`
        : `/api/elders/${elderId}/contacts`
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

  const getElderName = (elderId: string) => {
    const elder = elders.find((e) => e.id === elderId)
    return elder?.name || elderId
  }

  const columns: ColumnsType<TrustedContact> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 110,
      render: (val: string) => <span className="font-medium">{val}</span>,
    },
    {
      title: '关系',
      dataIndex: 'relation',
      key: 'relation',
      width: 130,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
    },
    {
      title: '绑定老人',
      dataIndex: 'elderId',
      key: 'elderId',
      width: 110,
      render: (val: string) => getElderName(val),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (val: number) => (
        <Tag color={val === 1 ? 'red' : val === 2 ? 'orange' : 'blue'} className="!rounded-lg">
          第{val}优先
        </Tag>
      ),
    },
    {
      title: '核验状态',
      dataIndex: 'verifiedStatus',
      key: 'verifiedStatus',
      width: 90,
      render: (val: string) => (
        <Tag color={VERIFIED_COLOR_MAP[val] || 'default'} className="!rounded-lg">
          {VERIFIED_LABEL_MAP[val] || val}
        </Tag>
      ),
    },
    {
      title: '能否决策',
      dataIndex: 'canMakeDecision',
      key: 'canMakeDecision',
      width: 90,
      render: (val: boolean) =>
        val ? (
          <Tag color="green" className="!rounded-lg">是</Tag>
        ) : (
          <Tag color="default" className="!rounded-lg">否</Tag>
        ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 140,
      render: (_: unknown, record: TrustedContact) => (
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
            description={`确定删除联系人 "${record.name}" 吗？`}
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
          <h1 className="text-xl font-bold text-slate-800">联系人管理</h1>
          <p className="text-sm text-slate-400">管理老人的可信联系人信息</p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => fetchData(pagination.page, pagination.pageSize)}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            添加联系人
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
          scroll={{ x: 900 }}
          locale={{
            emptyText: '暂无联系人数据',
          }}
        />
      </div>

      <Modal
        title={editingRecord ? '编辑联系人' : '添加联系人'}
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
            <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
              <Input placeholder="请输入联系人姓名" className="!rounded-xl" />
            </Form.Item>
            <Form.Item name="relation" label="关系" rules={[{ required: true, message: '请选择关系' }]}>
              <Select options={RELATION_OPTIONS} placeholder="请选择关系" className="!rounded-xl" />
            </Form.Item>
            <Form.Item name="phone" label="电话" rules={[{ required: true, message: '请输入电话' }]}>
              <Input placeholder="请输入联系电话" className="!rounded-xl" />
            </Form.Item>
            <Form.Item name="priority" label="优先级(1-5)" rules={[{ required: true, message: '请输入优先级' }]}>
              <InputNumber min={1} max={5} className="!w-full !rounded-xl" placeholder="1-5" />
            </Form.Item>
            <Form.Item name="verifiedStatus" label="核验状态" rules={[{ required: true, message: '请选择核验状态' }]}>
              <Select options={VERIFIED_STATUS_OPTIONS} placeholder="请选择核验状态" className="!rounded-xl" />
            </Form.Item>
            <Form.Item
              name="canMakeDecision"
              label="能否决策"
              valuePropName="checked"
            >
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
