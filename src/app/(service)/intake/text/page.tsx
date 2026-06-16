'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, message, Steps } from 'antd'
import { ArrowRight, ArrowLeft, User, Phone, MapPin, Heart, MessageCircle, AlertTriangle, HelpCircle, CheckCircle2, PenLine, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const defaultForm = {
  name: '', age: '', address: '', phone: '', community: '雨花社区',
  medicalHistory: '', emergencyNotes: '',
  contactName: '', contactRelation: '', contactPhone: '',
  communicationPref: '', carePref: '', aidNeeds: '',
}

function StyledInput({ label, value, onChange, icon: Icon, multiline = false, placeholder = '', required = false, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void
  icon?: React.ElementType; multiline?: boolean; placeholder?: string; required?: boolean; type?: string
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
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
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

export default function IntakeTextPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [formData, setFormData] = useState(defaultForm)
  const [loading, setLoading] = useState(false)

  const updateField = (f: string, v: string) => setFormData(prev => ({ ...prev, [f]: v }))

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      message.success('档案信息已保存')
      router.push('/intake/confirm')
    }, 800)
  }

  const steps = [
    { title: '基本信息', icon: <User size={18} /> },
    { title: '健康信息', icon: <Heart size={18} /> },
    { title: '联系人', icon: <Phone size={18} /> },
    { title: '照护偏好', icon: <MessageCircle size={18} /> },
  ]

  return (
    <div>
      <div className="mb-8 text-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full mb-3">
          <PenLine size={14} className="text-amber-600" />
          <span className="text-xs text-amber-700 font-medium">文字建档</span>
        </motion.div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">文字建档</h1>
        <p className="text-slate-500">分步骤填写，一目了然，适合熟悉手机的用户</p>
      </div>

      {/* Steps indicator */}
      <div className="mb-6">
        <Steps
          current={current}
          size="small"
          items={steps}
          onChange={setCurrent}
          className="[&_.ant-steps-item-active_.ant-steps-item-icon]:!bg-brand-600"
        />
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Basic info */}
        {current === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <SectionCard icon={User} title="基本信息" subtitle="填写老人的基础身份资料" color="bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="grid grid-cols-2 gap-4">
                <StyledInput icon={User} label="姓名" value={formData.name} onChange={v => updateField('name', v)} required placeholder="请填写真实姓名" />
                <StyledInput label="年龄" value={formData.age} onChange={v => updateField('age', v)} placeholder="如：76" />
              </div>
              <div className="mt-4">
                <StyledInput icon={MapPin} label="居住地址" value={formData.address} onChange={v => updateField('address', v)} placeholder="如：雨花新村1号101室" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <StyledInput icon={Phone} label="联系电话" value={formData.phone} onChange={v => updateField('phone', v)} type="tel" placeholder="如：13800001001" />
                <StyledInput icon={MapPin} label="所属社区" value={formData.community} onChange={v => updateField('community', v)} placeholder="如：雨花社区" />
              </div>
              <div className="flex justify-end mt-4">
                <Button type="primary" size="large" onClick={() => setCurrent(1)} icon={<ArrowRight size={18} />} iconPosition="end" className="!rounded-xl">
                  下一步
                </Button>
              </div>
            </SectionCard>
          </motion.div>
        )}

        {/* Step 1: Health */}
        {current === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <SectionCard icon={Heart} title="健康信息" subtitle="医疗历史和紧急注意事项（仅供紧急情况参考，不是医疗诊断）" color="bg-gradient-to-r from-red-50 to-red-100">
              <StyledInput icon={Heart} label="健康概况（既往病史、过敏史等）" value={formData.medicalHistory} onChange={v => updateField('medicalHistory', v)}
                multiline placeholder="如：高血压、糖尿病，对青霉素过敏" />
              <div className="mt-4">
                <StyledInput icon={AlertTriangle} label="紧急注意事项" value={formData.emergencyNotes} onChange={v => updateField('emergencyNotes', v)}
                  multiline placeholder="如：需按时吃降压药和降糖药，曾因低血糖晕倒过" />
              </div>
              <div className="flex justify-between mt-4">
                <Button size="large" onClick={() => setCurrent(0)} icon={<ArrowLeft size={18} />} className="!rounded-xl">上一步</Button>
                <Button type="primary" size="large" onClick={() => setCurrent(2)} icon={<ArrowRight size={18} />} iconPosition="end" className="!rounded-xl">下一步</Button>
              </div>
            </SectionCard>
          </motion.div>
        )}

        {/* Step 2: Contacts */}
        {current === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <SectionCard icon={Phone} title="可信联系人" subtitle="紧急情况下按优先级联系（请确保信息准确）" color="bg-gradient-to-r from-green-50 to-green-100">
              <div className="grid grid-cols-2 gap-4">
                <StyledInput icon={User} label="联系人姓名" value={formData.contactName} onChange={v => updateField('contactName', v)} required placeholder="如：张明" />
                <StyledInput icon={User} label="与本人关系" value={formData.contactRelation} onChange={v => updateField('contactRelation', v)} placeholder="如：女儿" />
              </div>
              <div className="mt-4">
                <StyledInput icon={Phone} label="联系人电话" value={formData.contactPhone} onChange={v => updateField('contactPhone', v)} type="tel" required placeholder="如：13900001001" />
              </div>
              <div className="flex justify-between mt-4">
                <Button size="large" onClick={() => setCurrent(1)} icon={<ArrowLeft size={18} />} className="!rounded-xl">上一步</Button>
                <Button type="primary" size="large" onClick={() => setCurrent(3)} icon={<ArrowRight size={18} />} iconPosition="end" className="!rounded-xl">下一步</Button>
              </div>
            </SectionCard>
          </motion.div>
        )}

        {/* Step 3: Preferences */}
        {current === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <SectionCard icon={MessageCircle} title="照护偏好" subtitle="您对医疗沟通和照护方式的意愿" color="bg-gradient-to-r from-amber-50 to-amber-100">
              <StyledInput icon={MessageCircle} label="沟通偏好" value={formData.communicationPref} onChange={v => updateField('communicationPref', v)}
                multiline placeholder="如：希望女儿代为沟通医疗事务，说话请慢一点" />
              <div className="mt-4">
                <StyledInput icon={Heart} label="照护偏好" value={formData.carePref} onChange={v => updateField('carePref', v)}
                  multiline placeholder="如：出院后希望回家休养，有社区上门服务更好" />
              </div>
              <div className="mt-4">
                <StyledInput icon={HelpCircle} label="救助需求" value={formData.aidNeeds} onChange={v => updateField('aidNeeds', v)}
                  multiline placeholder="如：担心护理费用，希望了解医疗救助政策" />
              </div>

              <div className="mt-6 bg-gradient-to-r from-brand-500 to-brand-700 rounded-2xl p-5 text-white">
                <p className="text-xs leading-relaxed text-white/90 mb-4">
                  确认信息准确后将生成安心联系卡。卡片上的二维码在紧急情况下可被授权人员扫描查看。
                </p>
                <div className="flex gap-3">
                  <Button size="large" onClick={() => setCurrent(2)} className="!rounded-xl !bg-white/20 !text-white !border-white/30 hover:!bg-white/30">
                    上一步
                  </Button>
                  <Button size="large" onClick={handleSave} loading={loading} icon={<CheckCircle2 size={18} />}
                    className="!rounded-xl !bg-white !text-brand-700 !border-none hover:!bg-brand-50 flex-1">
                    {loading ? '保存中...' : '确认并保存'}
                  </Button>
                </div>
              </div>
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
