'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Table, Button, Modal, Form, Input, Select, InputNumber, message, Space, Tag, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import type { TablePaginationConfig } from 'antd/es/table'
import { ElderProfile } from '@/types/elder'
import { PROFILE_STATUS_LABELS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'

const { TextArea } = Input

const GENDER_OPTIONS = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
]

const LIVING_STATUS_OPTIONS = [
  { value: 'alone', label: '独居' },
  { value: 'with_spouse', label: '与配偶同住' },
  { value: 'with_family', label: '与家人同住' },
  { value: 'institution', label: '养老机构' },
]

const RISK_LEVEL_OPTIONS = [
  { value: 'high', label: '高风险' },
  { value: 'medium', label: '中风险' },
  { value: 'low', label: '低风险' },
]

const RISK_COLOR_MAP: Record<string, string> = {
  high: 'red',
  medium: 'orange',
  low: 'green',
}

const RISK_LABEL_MAP: Record<string, string> = {
  high: '高风险',
  medium: '中风险',
  low: '低风险',
}

interface PaginationInfo {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export default function EldersPage() {
  const [data, setData] = useState<ElderProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, page: 1, pageSize: 10, totalPages: 0 })
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ElderProfile | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()

  const fetchData = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/elders?page=${page}&pageSize=${pageSize}`)
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
  }, [fetchData])

  const handleCreate = () => {
    setEditingRecord(null)
    form.resetFields()
    setModalOpen(true)
  }

  const handleEdit = (record: ElderProfile) => {
    setEditingRecord(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/elders/${id}`, { method: 'DELETE' })
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

      const url = editingRecord ? `/api/elders/${editingRecord.id}` : '/api/elders'
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
      // validation failed, do nothing
    } finally {
      setSubmitting(false)
    }
  }

  const handleTableChange = (pag: TablePaginationConfig) => {
    fetchData(pag.current || 1, pag.pageSize || 10)
  }

  const columns: ColumnsType<ElderProfile> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      render: (val: string) => <span className="font-medium">{val}</span>,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      render: (val: string) => (val === 'male' ? '男' : '女'),
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
    {
      title: '社区',
      dataIndex: 'community',
      key: 'community',
      width: 120,
    },
    {
      title: '居住状况',
      dataIndex: 'livingStatus',
      key: 'livingStatus',
      width: 120,
      render: (val: string) => {
        const label = LIVING_STATUS_OPTIONS.find((o) => o.value === val)?.label || val
        return label
      },
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: 100,
      render: (val: string) => (
        <Tag color={RISK_COLOR_MAP[val] || 'default'} className="!rounded-lg">
          {RISK_LABEL_MAP[val] || val}
        </Tag>
      ),
    },
    {
      title: '档案状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (val: string) => {
        const colorMap: Record<string, string> = {
          draft: 'default',
          pending_confirm: 'orange',
          completed: 'green',
          expired: 'red',
        }
        return (
          <Tag color={colorMap[val] || 'default'} className="!rounded-lg">
            {PROFILE_STATUS_LABELS[val] || val}
          </Tag>
        )
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 140,
      render: (_: unknown, record: ElderProfile) => (
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
            description={`确定删除 "${record.name}" 的档案吗？`}
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
          <h1 className="text-xl font-bold text-slate-800">老人档案管理</h1>
          <p className="text-sm text-slate-400">管理独居长者基本信息与健康状况</p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => fetchData(pagination.page, pagination.pageSize)}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            添加老人
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
            emptyText: '暂无老人档案数据',
          }}
        />
      </div>

      <Modal
        title={editingRecord ? '编辑老人档案' : '添加老人档案'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setModalOpen(false)
          form.resetFields()
        }}
        confirmLoading={submitting}
        okText={editingRecord ? '保存' : '创建'}
        cancelText="取消"
        width={640}
        className="[&_.ant-modal-content]:!rounded-2xl"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
              <Input placeholder="请输入姓名" className="!rounded-xl" />
            </Form.Item>
            <Form.Item name="gender" label="性别" rules={[{ required: true, message: '请选择性别' }]}>
              <Select options={GENDER_OPTIONS} placeholder="请选择性别" className="!rounded-xl" />
            </Form.Item>
            <Form.Item name="age" label="年龄" rules={[{ required: true, message: '请输入年龄' }]}>
              <InputNumber min={0} max={150} className="!w-full !rounded-xl" placeholder="请输入年龄" />
            </Form.Item>
            <Form.Item name="livingStatus" label="居住状况" rules={[{ required: true, message: '请选择居住状况' }]}>
              <Select options={LIVING_STATUS_OPTIONS} placeholder="请选择居住状况" className="!rounded-xl" />
            </Form.Item>
            <Form.Item name="community" label="社区" rules={[{ required: true, message: '请输入社区' }]}>
              <Input placeholder="请输入社区名称" className="!rounded-xl" />
            </Form.Item>
            <Form.Item name="riskLevel" label="风险等级" rules={[{ required: true, message: '请选择风险等级' }]}>
              <Select options={RISK_LEVEL_OPTIONS} placeholder="请选择风险等级" className="!rounded-xl" />
            </Form.Item>
          </div>
          <Form.Item name="address" label="地址">
            <Input placeholder="请输入详细地址" className="!rounded-xl" />
          </Form.Item>
          <Form.Item name="phone" label="电话">
            <Input placeholder="请输入联系电话" className="!rounded-xl" />
          </Form.Item>
          <Form.Item name="medicalHistory" label="病史">
            <TextArea rows={2} placeholder="请输入病史信息" className="!rounded-xl" />
          </Form.Item>
          <Form.Item name="emergencyNotes" label="紧急备注">
            <TextArea rows={2} placeholder="请输入紧急情况备注" className="!rounded-xl" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
