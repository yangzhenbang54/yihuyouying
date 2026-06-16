'use client'

import React from 'react'
import { Form, Input, Button, Select, Switch, message, Card as AntCard, Divider } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

export default function SettingsPage() {
  const handleSave = (section: string) => {
    message.success(`${section} 保存成功（演示环境）`)
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-6">系统配置</h1>

      <div className="space-y-5 max-w-2xl">
        {/* General settings */}
        <AntCard title="基本设置" className="!rounded-card-lg !shadow-card">
          <Form layout="vertical" onFinish={() => handleSave('基本设置')}>
            <Form.Item label="项目名称" name="projectName" initialValue="医愿护">
              <Input className="!rounded-xl" />
            </Form.Item>
            <Form.Item label="服务热线" name="hotline" initialValue="400-XXX-XXXX">
              <Input className="!rounded-xl" />
            </Form.Item>
            <Form.Item label="联系邮箱" name="email" initialValue="yihuyouying@example.com">
              <Input className="!rounded-xl" />
            </Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} className="!rounded-xl">
              保存设置
            </Button>
          </Form>
        </AntCard>

        {/* Card visibility settings */}
        <AntCard title="联系卡公开级别设置" className="!rounded-card-lg !shadow-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-slate-700">最小信息模式</p>
                <p className="text-xs text-slate-400">扫码仅显示姓名、社区和紧急备注</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Divider className="!m-0" />
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-slate-700">联系人详情二次验证</p>
                <p className="text-xs text-slate-400">查看联系人信息需二次验证</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Divider className="!m-0" />
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-slate-700">完整档案访问</p>
                <p className="text-xs text-slate-400">仅社区工作人员和管理员可见</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </AntCard>

        {/* Notification settings */}
        <AntCard title="通知设置" className="!rounded-card-lg !shadow-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-slate-700">站内通知</p>
                <p className="text-xs text-slate-400">通过平台内消息推送</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Divider className="!m-0" />
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-slate-700">短信通知</p>
                <p className="text-xs text-slate-400">紧急情况发送短信（需配置短信服务）</p>
              </div>
              <Switch />
            </div>
            <Divider className="!m-0" />
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-slate-700">电话通知</p>
                <p className="text-xs text-slate-400">首选联系人未接通时自动拨打（需配置）</p>
              </div>
              <Switch />
            </div>
          </div>
          <Button type="primary" className="!rounded-xl mt-4" icon={<SaveOutlined />} onClick={() => handleSave('通知设置')}>
            保存设置
          </Button>
        </AntCard>

        {/* Data policy */}
        <AntCard title="数据保留策略" className="!rounded-card-lg !shadow-card">
          <Form layout="vertical" onFinish={() => handleSave('数据策略')}>
            <Form.Item label="档案保留期限" name="retention" initialValue="永久">
              <Select
                className="!rounded-xl"
                options={[
                  { value: '1year', label: '1年' },
                  { value: '3years', label: '3年' },
                  { value: '5years', label: '5年' },
                  { value: 'permanent', label: '永久' },
                ]}
              />
            </Form.Item>
            <Form.Item label="审计日志保留" name="auditRetention" initialValue="3years">
              <Select
                className="!rounded-xl"
                options={[
                  { value: '1year', label: '1年' },
                  { value: '3years', label: '3年' },
                  { value: '5years', label: '5年' },
                ]}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} className="!rounded-xl">
              保存设置
            </Button>
          </Form>
        </AntCard>
      </div>
    </div>
  )
}
