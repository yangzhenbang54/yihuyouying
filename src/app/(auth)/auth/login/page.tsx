'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input, Button, Form, message } from 'antd'
import { PhoneOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/store/auth-store'
import { UserRole } from '@/types/common'
import { ROLE_LABELS } from '@/lib/constants'
import {
  User, Users, Building2, Stethoscope, HeartHandshake, Shield,
} from 'lucide-react'

const roles = [
  { role: UserRole.ELDERLY, label: '老人本人', icon: User, color: 'bg-amber-100 text-amber-600', desc: '查看档案与联系卡' },
  { role: UserRole.FAMILY, label: '家属/联系人', icon: Users, color: 'bg-blue-100 text-blue-600', desc: '协助管理老人信息' },
  { role: UserRole.COMMUNITY, label: '社区社工/志愿者', icon: Building2, color: 'bg-brand-100 text-brand-600', desc: '建档、回访与服务' },
  { role: UserRole.HOSPITAL_SW, label: '医院社工', icon: Stethoscope, color: 'bg-green-100 text-green-600', desc: '扫码查看应急信息' },
  { role: UserRole.PROVIDER, label: '护理合作资源', icon: HeartHandshake, color: 'bg-purple-100 text-purple-600', desc: '接收任务与回执' },
  { role: UserRole.ADMIN, label: '管理员/督导', icon: Shield, color: 'bg-slate-200 text-slate-600', desc: '数据看板与系统管理' },
]

// Seed demo users (phone + password 123456)
const DEMO_CREDENTIALS: Record<UserRole, string> = {
  [UserRole.ELDERLY]: '13800001001',    // 张奶奶
  [UserRole.FAMILY]: '13800001003',     // 王阿姨
  [UserRole.COMMUNITY]: '13800001005',  // 刘社工
  [UserRole.HOSPITAL_SW]: '13800001008', // 周医生
  [UserRole.PROVIDER]: '13800001010',   // 康护护理站
  [UserRole.ADMIN]: '13800001012',      // 马管理员
}

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const handleLogin = async (values: { phone: string; password: string }) => {
    setLoading(true)
    try {
      await login(values.phone, values.password)
      message.success('登录成功')
      // Redirect based on user role
      const user = useAuthStore.getState().user
      if (user) {
        if (user.role === UserRole.ADMIN) router.push('/dashboard/overview')
        else if (user.role === UserRole.COMMUNITY || user.role === UserRole.PROVIDER) router.push('/workspace/tasks')
        else if (user.role === UserRole.HOSPITAL_SW) router.push('/workspace/cases')
        else router.push('/intake/start')
      }
    } catch (err: any) {
      message.error(err.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleLogin = async (role: UserRole) => {
    setLoading(true)
    try {
      const phone = DEMO_CREDENTIALS[role]
      await login(phone, '123456')
      message.success(`已以"${ROLE_LABELS[role]}"身份登录`)
      if (role === UserRole.ADMIN) router.push('/dashboard/overview')
      else if (role === UserRole.COMMUNITY || role === UserRole.PROVIDER) router.push('/workspace/tasks')
      else if (role === UserRole.HOSPITAL_SW) router.push('/workspace/cases')
      else router.push('/intake/start')
    } catch (err: any) {
      message.error(err.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Flip toggle */}
      <div className="flex items-center justify-center gap-4 mb-2">
        <span className={`text-sm font-medium transition-all ${!flipped ? 'text-brand-700 underline' : 'text-slate-400'}`}>
          账号登录
        </span>
        <button
          onClick={() => setFlipped(!flipped)}
          className="relative w-12 h-6 bg-slate-200 rounded-full transition-colors duration-300 hover:bg-brand-200"
          style={flipped ? { backgroundColor: '#d1fae5' } : {}}
        >
          <span
            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300"
            style={{ transform: flipped ? 'translateX(24px)' : 'translateX(0)' }}
          />
        </button>
        <span className={`text-sm font-medium transition-all ${flipped ? 'text-brand-700 underline' : 'text-slate-400'}`}>
          快速体验
        </span>
      </div>

      {/* Flip card container */}
      <div className="flip-card" style={{ perspective: '1000px' }}>
        <div
          className="flip-card-inner relative"
          style={{
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front: Login form */}
          <div
            className="bg-white rounded-card-lg border border-slate-100 shadow-card p-8"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-slate-800">欢迎回来</h1>
              <p className="text-sm text-slate-400 mt-1">登录您的医愿护账号</p>
            </div>

            <Form form={form} onFinish={handleLogin} layout="vertical" size="large">
              <Form.Item
                name="phone"
                rules={[{ required: true, message: '请输入手机号' }]}
              >
                <Input
                  prefix={<PhoneOutlined className="text-slate-400 mr-2" />}
                  placeholder="手机号"
                  className="!rounded-xl"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-slate-400 mr-2" />}
                  placeholder="密码"
                  className="!rounded-xl"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  className="!h-12 !rounded-xl !text-base !font-medium"
                >
                  登录
                </Button>
              </Form.Item>
            </Form>

            <p className="text-center text-xs text-slate-400">
              这是演示环境，请点击右上角切换按钮快速登录
            </p>
          </div>

          {/* Back: Role selector */}
          <div
            className="bg-white rounded-card-lg border border-slate-100 shadow-card p-6"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="text-center mb-5">
              <h1 className="text-xl font-bold text-slate-800">快速体验</h1>
              <p className="text-xs text-slate-400 mt-1">选择一个角色直接登录（演示环境）</p>
            </div>

            <div className="space-y-2.5">
              {roles.map(({ role, label, icon: Icon, color, desc }) => (
                <button
                  key={role}
                  onClick={() => handleRoleLogin(role)}
                  disabled={loading}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-brand-300 hover:bg-brand-50/50 transition-all duration-200 hover:shadow-sm disabled:opacity-50"
                >
                  <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={20} />
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium text-slate-700">{label}</div>
                    <div className="text-xs text-slate-400">{desc}</div>
                  </div>
                  <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>

            <p className="text-center text-xs text-slate-400 mt-4">
              点击切换按钮返回标准登录
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
