'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Steps, Button, Form, Input, Select, Checkbox, message } from 'antd'
import { UserOutlined, PhoneOutlined, TeamOutlined, SafetyOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/store/auth-store'
import { UserRole } from '@/types/common'
import { ROLE_LABELS } from '@/lib/constants'
import RadioToggle from '@/components/ui/RadioToggle'
import { User, Users, Building2, Stethoscope, HeartHandshake, Shield } from 'lucide-react'

const roleOptions = [
  { value: UserRole.ELDERLY, label: '老人本人', icon: User },
  { value: UserRole.FAMILY, label: '家属/联系人', icon: Users },
  { value: UserRole.COMMUNITY, label: '社工/志愿者', icon: Building2 },
  { value: UserRole.HOSPITAL_SW, label: '医院社工', icon: Stethoscope },
  { value: UserRole.PROVIDER, label: '护理合作资源', icon: HeartHandshake },
  { value: UserRole.ADMIN, label: '管理员', icon: Shield },
]

export default function RegisterPage() {
  const router = useRouter()
  const register = useAuthStore(s => s.register)
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<string>('')
  const [savedValues, setSavedValues] = useState<any>({})
  const [form] = Form.useForm()

  const steps = [
    { title: '选择角色', icon: <TeamOutlined /> },
    { title: '填写信息', icon: <UserOutlined /> },
    { title: '确认同意', icon: <SafetyOutlined /> },
  ]

  const handleRoleSelect = () => {
    if (!role) {
      message.warning('请先选择您的角色')
      return
    }
    setCurrent(1)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSavedValues(values)
      setCurrent(2)
    } catch {
      message.warning('请完善必填信息')
    }
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await register({
        name: savedValues.name,
        phone: savedValues.phone,
        password: savedValues.password,
        role: role as UserRole,
        organization: savedValues.organization || '',
      })
      message.success('注册成功！已自动登录')
      router.push('/')
    } catch (err: any) {
      message.error(err.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-card-lg border border-slate-100 shadow-card p-6 md:p-8">
      <Steps
        current={current}
        items={steps}
        size="small"
        className="mb-8"
      />

      {/* Step 1: Choose role */}
      {current === 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4 text-center">请选择您的角色</h2>
          <RadioToggle
            options={roleOptions}
            value={role}
            onChange={setRole}
            className="flex-col gap-2"
          />
          <Button
            type="primary"
            block
            size="large"
            onClick={handleRoleSelect}
            className="!h-12 !rounded-xl !mt-6 !text-base !font-medium"
          >
            下一步
          </Button>
        </div>
      )}

      {/* Step 2: Fill info */}
      {current === 1 && (
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4 text-center">
            {ROLE_LABELS[role] || ''} - 基本信息
          </h2>
          <Form form={form} layout="vertical" size="large" initialValues={{ role }}>
            <Form.Item name="name" rules={[{ required: true, message: '请输入姓名' }]} label="姓名">
              <Input prefix={<UserOutlined className="text-slate-400" />} placeholder="请输入真实姓名" className="!rounded-xl" />
            </Form.Item>
            <Form.Item name="phone" rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
            ]} label="手机号">
              <Input prefix={<PhoneOutlined className="text-slate-400" />} placeholder="请输入手机号" className="!rounded-xl" />
            </Form.Item>
            {role !== UserRole.ELDERLY && role !== UserRole.FAMILY && (
              <Form.Item name="organization" label="所属组织">
                <Input placeholder="如：雨花社区服务中心、市中心医院" className="!rounded-xl" />
              </Form.Item>
            )}
            <Form.Item name="password" rules={[
              { required: true, message: '请设置密码' },
              { min: 6, message: '密码至少6位' },
            ]} label="设置密码">
              <Input.Password placeholder="设置登录密码" className="!rounded-xl" />
            </Form.Item>
          </Form>
          <div className="flex gap-3 mt-6">
            <Button size="large" onClick={() => setCurrent(0)} className="!rounded-xl flex-1">
              上一步
            </Button>
            <Button type="primary" size="large" onClick={handleSubmit} className="!rounded-xl flex-1">
              查看同意声明
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Consent */}
      {current === 2 && (
        <div>
          <div className="text-center mb-6">
            <CheckCircleOutlined className="text-4xl text-green-500 mb-3" />
            <h2 className="text-lg font-bold text-slate-800">知情同意与隐私声明</h2>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 text-sm text-slate-600 leading-relaxed mb-6 max-h-64 overflow-y-auto">
            <p className="font-medium text-slate-700 mb-2">请您仔细阅读以下内容：</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>医愿护是公益项目，不向您收取任何费用，也不涉及任何金融交易。</li>
              <li>我们仅采集为您提供服务所必需的最少个人信息，不会超范围收集。</li>
              <li>您的信息将受到分层访问控制：公开扫码页面仅显示紧急联系所必需的最少信息；完整档案仅授权工作人员在权限范围内可查看。</li>
              <li>AI仅辅助生成信息摘要，所有内容都需人工核验和本人/家属确认后归档。</li>
              <li>所有对您信息的查看、修改、导出操作都会留下审计记录。</li>
              <li>您可以随时联系工作人员查询、更正或要求删除您的信息。</li>
              <li>医愿护不会代签任何法律文件，不会提供医疗诊断，不会替代依法有权主体作决定。</li>
            </ol>
          </div>

          <Form form={form} onFinish={handleConfirm}>
            <Form.Item
              name="consent"
              valuePropName="checked"
              rules={[{ required: true, message: '请阅读并同意以上声明' }]}
              className="mb-6"
            >
              <Checkbox>
                <span className="text-sm text-slate-700">
                  我已阅读并理解以上内容，同意医愿护收集和使用我的上述信息用于公益服务
                </span>
              </Checkbox>
            </Form.Item>

            <div className="flex gap-3">
              <Button size="large" onClick={() => setCurrent(1)} className="!rounded-xl flex-1">
                返回修改
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                className="!rounded-xl flex-1"
              >
                确认注册
              </Button>
            </div>
          </Form>
        </div>
      )}
    </div>
  )
}
