'use client'

import React, { useState } from 'react'
import { Table, Tag, Switch, Button, Modal, Form, Input, Select, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined } from '@ant-design/icons'
import { mockUsers } from '@/data/users'
import { User } from '@/types/user'
import { ROLE_LABELS } from '@/lib/constants'
import SearchInput from '@/components/ui/SearchInput'
import { formatDate } from '@/lib/utils'

const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }))

const columns: ColumnsType<User> = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render: (val, record) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-700">
          {val.charAt(0)}
        </div>
        <span className="font-medium text-sm">{val}</span>
      </div>
    ),
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    render: (val: string) => <Tag className="!rounded-lg !text-xs" color={val === 'admin' ? 'purple' : val === 'community' ? 'blue' : 'default'}>{ROLE_LABELS[val]}</Tag>,
  },
  {
    title: '组织',
    dataIndex: 'organization',
    key: 'organization',
    ellipsis: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (val: string) => <Tag color={val === 'active' ? 'success' : 'error'} className="!rounded-lg !text-xs">{val === 'active' ? '启用' : '禁用'}</Tag>,
  },
  {
    title: '注册时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (val: string) => formatDate(val),
  },
  {
    title: '最后登录',
    dataIndex: 'lastLogin',
    key: 'lastLogin',
    render: (val) => val ? formatDate(val) : '-',
  },
]

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()

  const filtered = mockUsers.filter(u => {
    if (!search) return true
    return u.name.includes(search) || u.phone.includes(search) || u.organization.includes(search)
  })

  const handleAddUser = () => {
    form.validateFields().then(() => {
      message.success('用户添加成功（演示环境）')
      setModalOpen(false)
      form.resetFields()
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">用户管理</h1>
          <p className="text-sm text-slate-400">管理平台用户和角色权限</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
          className="!rounded-xl"
        >
          添加用户
        </Button>
      </div>

      <div className="flex gap-3 mb-4">
        <SearchInput
          placeholder="搜索用户..."
          value={search}
          onChange={setSearch}
          className="min-w-[200px]"
        />
      </div>

      <div className="bg-white rounded-card-lg border border-slate-100 shadow-card overflow-hidden">
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: false }}
          scroll={{ x: 800 }}
        />
      </div>

      <Modal
        title="添加用户"
        open={modalOpen}
        onOk={handleAddUser}
        onCancel={() => setModalOpen(false)}
        okText="确认添加"
        cancelText="取消"
        className="[&_.ant-modal-content]:!rounded-2xl"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input placeholder="请输入姓名" className="!rounded-xl" />
          </Form.Item>
          <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
            <Input placeholder="请输入手机号" className="!rounded-xl" />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select options={roleOptions} placeholder="请选择角色" className="!rounded-xl" />
          </Form.Item>
          <Form.Item name="organization" label="所属组织">
            <Input placeholder="请输入组织名称" className="!rounded-xl" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
