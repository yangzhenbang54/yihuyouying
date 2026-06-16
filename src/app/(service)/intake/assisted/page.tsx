'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, message, Select, Tag } from 'antd'
import { ArrowRight, Users, User, Phone, MapPin, Heart, MessageCircle, AlertTriangle, HelpCircle, CheckCircle2, ClipboardCheck } from 'lucide-react'
import { mockElders } from '@/data/elders'
import { motion } from 'framer-motion'

function StyledInput({ label, value, onChange, icon: Icon, multiline = false, placeholder = '', required = false }: {
  label: string; value: string; onChange: (v: string) => void
  icon?: React.ElementType; multiline?: boolean; placeholder?: string; required?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0
  return (
    <div className="relative group">
      <label className={`block text-xs font-semibold mb-1.5 pl-1 flex items-center gap-1.5 transition-colors duration-200 ${active ? 'text-brand-600' : 'text-slate-400'}`}>
        {Icon && <Icon size={13} />}{label}{required && <span className="text-red-400">*</span>}
      </label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} placeholder={placeholder}
          className={`w-full px-4 py-2.5 text-sm rounded-xl border-2 outline-none transition-all duration-300 resize-none bg-slate-50 ${
            active ? 'border-brand-400 bg-white shadow-sm' : 'border-slate-200 hover:border-slate-300'
          } focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 placeholder:text-slate-300`}
        />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full px-4 py-2.5 text-sm rounded-xl border-2 outline-none transition-all duration-300 bg-slate-50 ${
            active ? 'border-brand-400 bg-white shadow-sm' : 'border-slate-200 hover:border-slate-300'
          } focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 placeholder:text-slate-300`}
        />
      )}
    </div>
  )
}

function SectionCard({ icon: Icon, title, subtitle, color, children }: {
  icon: React.ElementType; title: string; subtitle: string; color: string; children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className={`${color} px-5 py-3 flex items-center gap-3 border-b border-white/20`}>
        <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center backdrop-blur-sm">
          <Icon size={16} className="text-slate-700" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

const elderOptions = mockElders.map(e => ({ value: e.id, label: `${e.name} · ${e.community} · ${e.age}岁` }))

export default function IntakeAssistedPage() {
  const router = useRouter()
  const [selectedElder, setSelectedElder] = useState<string | undefined>()
  const [formData, setFormData] = useState({
    name: '', age: '', address: '', phone: '', community: '',
    medicalHistory: '', emergencyNotes: '',
    contactName: '', contactRelation: '', contactPhone: '',
    communicationPref: '', carePref: '', aidNeeds: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSelectElder = (id: string) => {
    setSelectedElder(id)
    const elder = mockElders.find(e => e.id === id)
    if (elder) {
      setFormData({
        name: elder.name, age: String(elder.age), address: elder.address, phone: elder.phone || '', community: elder.community,
        medicalHistory: elder.medicalHistory || '', emergencyNotes: '',
        contactName: '', contactRelation: '', contactPhone: '',
        communicationPref: elder.communicationPref || '', carePref: elder.carePref || '', aidNeeds: elder.aidNeeds || '',
      })
    }
  }

  const updateField = (f: string, v: string) => setFormData(prev => ({ ...prev, [f]: v }))

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      message.success('协助建档完成，档案已保存')
      router.push('/intake/confirm')
    }, 800)
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full mb-3">
          <Users size={14} className="text-blue-600" />
          <span className="text-xs text-blue-700 font-medium">社区协助建档</span>
        </motion.div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">社区协助建档</h1>
        <p className="text-slate-500">由社区工作人员或志愿者代老人完成建档</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Elder selector */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-5 mb-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <ClipboardCheck size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">选择服务对象</h3>
              <p className="text-xs text-slate-500">从已有名单中选择，或创建新档案</p>
            </div>
          </div>
          <Select
            showSearch
            placeholder="搜索并选择老人..."
            value={selectedElder}
            onChange={handleSelectElder}
            options={elderOptions}
            size="large"
            className="!w-full [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!h-12"
            filterOption={(input, option) => (option?.label as string)?.includes(input)}
            allowClear
          />
        </div>

        {/* Form sections */}
        <div className="space-y-4">
          <SectionCard icon={User} title="基本信息" subtitle="代理填写老人基础资料" color="bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="grid grid-cols-2 gap-4">
              <StyledInput icon={User} label="姓名" value={formData.name} onChange={v => updateField('name', v)} required />
              <StyledInput label="年龄" value={formData.age} onChange={v => updateField('age', v)} />
            </div>
            <div className="mt-4"><StyledInput icon={MapPin} label="居住地址" value={formData.address} onChange={v => updateField('address', v)} /></div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <StyledInput icon={Phone} label="联系电话" value={formData.phone} onChange={v => updateField('phone', v)} />
              <StyledInput icon={MapPin} label="所属社区" value={formData.community} onChange={v => updateField('community', v)} />
            </div>
          </SectionCard>

          <SectionCard icon={Heart} title="健康信息" subtitle="代理记录健康情况" color="bg-gradient-to-r from-red-50 to-red-100">
            <StyledInput icon={Heart} label="健康概况" value={formData.medicalHistory} onChange={v => updateField('medicalHistory', v)} multiline placeholder="如：高血压、糖尿病，对青霉素过敏" />
            <div className="mt-4">
              <StyledInput icon={AlertTriangle} label="紧急注意事项" value={formData.emergencyNotes} onChange={v => updateField('emergencyNotes', v)} multiline placeholder="如：需按时服用降压药和降糖药" />
            </div>
          </SectionCard>

          <SectionCard icon={Phone} title="可信联系人" subtitle="代理记录紧急联系信息" color="bg-gradient-to-r from-green-50 to-green-100">
            <div className="grid grid-cols-2 gap-4">
              <StyledInput icon={User} label="联系人姓名" value={formData.contactName} onChange={v => updateField('contactName', v)} required />
              <StyledInput icon={User} label="与本人关系" value={formData.contactRelation} onChange={v => updateField('contactRelation', v)} />
            </div>
            <div className="mt-4"><StyledInput icon={Phone} label="联系人电话" value={formData.contactPhone} onChange={v => updateField('contactPhone', v)} required /></div>
          </SectionCard>

          <SectionCard icon={MessageCircle} title="照护偏好" subtitle="代理了解照护意愿" color="bg-gradient-to-r from-amber-50 to-amber-100">
            <StyledInput icon={MessageCircle} label="沟通偏好" value={formData.communicationPref} onChange={v => updateField('communicationPref', v)} multiline placeholder="如：希望女儿代为沟通，说话请慢一点" />
            <div className="mt-4"><StyledInput icon={Heart} label="照护偏好" value={formData.carePref} onChange={v => updateField('carePref', v)} multiline placeholder="如：出院后希望回家休养，有社区上门服务更好" /></div>
            <div className="mt-4"><StyledInput icon={HelpCircle} label="救助需求" value={formData.aidNeeds} onChange={v => updateField('aidNeeds', v)} multiline placeholder="如：担心护理费用，希望了解医疗救助政策" /></div>
          </SectionCard>

          <div className="pt-2 pb-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-5 text-white">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle size={14} />
                </div>
                <p className="text-xs leading-relaxed text-white/90">
                  确认信息准确后提交。作为协助建档人员，您对信息的准确性负有核实责任。
                </p>
              </div>
              <Button size="large" block onClick={handleSave} loading={loading} icon={<CheckCircle2 size={18} />}
                className="!h-14 !rounded-xl !text-lg !font-medium !bg-white !text-blue-700 !border-none hover:!bg-blue-50">
                {loading ? '提交中...' : '确认提交档案'}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
