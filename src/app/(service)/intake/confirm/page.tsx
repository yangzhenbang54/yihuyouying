'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Checkbox, message } from 'antd'
import { CheckCircleOutlined, FileTextOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

const mockSummary = {
  name: '张秀英',
  gender: '女',
  age: 76,
  livingStatus: '独居',
  community: '雨花社区',
  address: '雨花新村1号101室',
  medicalHistory: '高血压、糖尿病',
  emergencyNotes: '需按时服用降压药和降糖药，对青霉素过敏',
  contacts: [
    { name: '张明', relation: '女儿', phone: '13900001001', priority: 1 },
  ],
  communicationPref: '希望由女儿协助沟通医疗事务',
  carePref: '出院后希望回家休养，有上门护理更好',
  aidNeeds: '担心长期护理费用，希望了解医疗救助政策',
  versionNo: 'v1.0-20241217',
}

export default function IntakeConfirmPage() {
  const router = useRouter()
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!confirmed) {
      message.warning('请勾选确认声明')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    message.success('确认成功！正在生成安心联系卡...')
    router.push('/card/card1')
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-3">
          <FileTextOutlined className="text-3xl text-green-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">建档确认</h1>
        <p className="text-slate-500">请仔细核对以下信息，确认无误后即可生成安心联系卡</p>
        <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-brand-50 rounded-full">
          <Shield size={14} className="text-brand-600" />
          <span className="text-xs text-brand-700 font-medium">版本号：{mockSummary.versionNo}</span>
        </div>
      </div>

      {/* Summary sections */}
      <div className="space-y-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white rounded-card-lg border border-slate-100 shadow-card p-5">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <UserOutlined className="text-brand-600" />
              基本信息
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div><span className="text-slate-400">姓名：</span><span className="text-slate-700 font-medium">{mockSummary.name}</span></div>
              <div><span className="text-slate-400">性别：</span><span className="text-slate-700">{mockSummary.gender}</span></div>
              <div><span className="text-slate-400">年龄：</span><span className="text-slate-700">{mockSummary.age}岁</span></div>
              <div><span className="text-slate-400">居住状况：</span><span className="text-slate-700">{mockSummary.livingStatus}</span></div>
              <div className="col-span-2"><span className="text-slate-400">社区：</span><span className="text-slate-700">{mockSummary.community}</span></div>
              <div className="col-span-2"><span className="text-slate-400">地址：</span><span className="text-slate-700">{mockSummary.address}</span></div>
              <div className="col-span-2"><span className="text-slate-400">健康概况：</span><span className="text-slate-700">{mockSummary.medicalHistory}</span></div>
              <div className="col-span-2">
                <span className="text-slate-400">紧急备注：</span>
                <span className="text-red-600 font-medium">{mockSummary.emergencyNotes}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-white rounded-card-lg border border-slate-100 shadow-card p-5">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <PhoneOutlined className="text-brand-600" />
              可信联系人
            </h3>
            {mockSummary.contacts.map((c, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <span className="text-slate-700 font-medium">{c.name}</span>
                  <span className="text-slate-400 text-xs ml-2">({c.relation})</span>
                </div>
                <span className="text-sm text-slate-600">{c.phone}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="bg-white rounded-card-lg border border-slate-100 shadow-card p-5">
            <h3 className="font-bold text-slate-800 mb-3">照护偏好</h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-slate-400">沟通偏好：</span><span className="text-slate-700">{mockSummary.communicationPref}</span></div>
              <div><span className="text-slate-400">照护偏好：</span><span className="text-slate-700">{mockSummary.carePref}</span></div>
              <div><span className="text-slate-400">救助需求：</span><span className="text-slate-700">{mockSummary.aidNeeds}</span></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Consent */}
      <div className="bg-amber-50 rounded-xl p-5 mt-6 mb-6">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-800 font-medium mb-1">重要提示</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              以上信息由AI辅助生成并经过人工核验。确认后将生成安心联系卡，卡片上的二维码在紧急情况下可被授权人员扫描查看。
              完整档案仅授权工作人员在权限范围内可见。您随时有权修改或撤回以上信息。
            </p>
          </div>
        </div>
      </div>

      <Checkbox
        checked={confirmed}
        onChange={(e) => setConfirmed(e.target.checked)}
        className="mb-4 text-sm"
      >
        本人已阅读并确认以上内容的真实性和准确性
      </Checkbox>

      <div className="flex gap-3">
        <Button size="large" className="!rounded-xl flex-1" onClick={() => window.history.back()}>
          返回修改
        </Button>
        <Button
          type="primary"
          size="large"
          className="!rounded-xl flex-1"
          onClick={handleConfirm}
          loading={loading}
          disabled={!confirmed}
          icon={<CheckCircleOutlined />}
        >
          {loading ? '生成中...' : '确认并生成联系卡'}
        </Button>
      </div>
    </div>
  )
}
