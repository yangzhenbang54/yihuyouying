'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button, message, Modal } from 'antd'
import {
  Mic, ArrowRight, User, Users, Phone, MapPin, Heart, MessageCircle,
  AlertTriangle, HelpCircle, ChevronRight, CheckCircle2, Volume2,
} from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { motion, AnimatePresence } from 'framer-motion'

const defaultForm = {
  name: '张秀英', gender: 'female', age: '76', community: '雨花社区',
  address: '雨花新村1号101室', phone: '13800001001',
  medicalHistory: '高血压、糖尿病',
  emergencyNotes: '需按时服用降压药和降糖药，对青霉素过敏',
  contactName: '张明', contactRelation: '女儿', contactPhone: '13900001001',
  communicationPref: '希望由女儿协助沟通医疗事务',
  carePref: '出院后希望回家休养，有上门护理更好',
  aidNeeds: '担心长期护理费用，希望了解医疗救助政策',
}

/* ========== 转录结果徽章 ========== */
function AiBadge({ done }: { done: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${
      done ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-slate-50 text-slate-400 border border-slate-200'
    }`}>
      <Volume2 size={11} />
      {done ? 'AI已转录' : '待录入'}
    </span>
  )
}

/* ========== 录音弹窗 ========== */
function RecordModal({
  open, fieldLabel, promptText, recording, transcript,
  onStart, onClose,
}: {
  open: boolean
  fieldLabel: string
  promptText: string
  recording: boolean
  transcript: string
  onStart: () => void
  onClose: () => void
}) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={420}
      centered
      className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:!overflow-hidden"
      closable={!recording}
      maskClosable={!recording}
    >
      <div className="bg-gradient-to-br from-brand-50 via-white to-amber-50 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-brand-100 flex items-center justify-center">
            <Mic size={20} className="text-brand-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">录入：{fieldLabel}</h3>
            <p className="text-xs text-slate-400">请按提示说出对应信息</p>
          </div>
        </div>

        {/* Prompt card */}
        <div className="bg-white rounded-xl border-2 border-brand-200 p-5 mb-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <MessageCircle size={15} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-amber-700 font-medium mb-1">请这样说：</p>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">{promptText}</p>
            </div>
          </div>
        </div>

        {/* Recording button or transcript */}
        {!recording && !transcript && (
          <button
            onClick={onStart}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-base flex items-center justify-center gap-3 hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-lg shadow-brand-500/20"
          >
            <Mic size={20} />
            点击开始录音
          </button>
        )}

        {recording && (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 border-4 border-red-200 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Mic size={32} className="text-red-500" />
            </div>
            <p className="text-red-500 font-medium text-sm">正在录音中...</p>
            <div className="flex items-center justify-center gap-1 mt-4 h-8">
              {[3, 7, 11, 5, 9, 13, 7, 11, 5].map((h, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-gradient-to-t from-brand-500 to-amber-400 rounded-full"
                  animate={{ height: [3, h * 1.5, 3] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.07 }}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">
              {`录音中，请说出"${promptText}"`}
            </p>
          </div>
        )}

        {transcript && (
          <div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={16} className="text-green-600" />
                <span className="text-xs text-green-700 font-medium">转录完成</span>
              </div>
              <p className="text-sm text-slate-700">{transcript}</p>
            </div>
            <Button
              type="primary"
              block
              size="large"
              onClick={onClose}
              className="!rounded-xl !h-12"
            >
              <CheckCircle2 size={16} className="mr-1.5" />
              确认，填入表单
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}

/* ========== 主组件 ========== */
export default function IntakeVoicePage() {
  const router = useRouter()
  const [step, setStep] = useState<'guide' | 'field_recording' | 'review'>('guide')
  const [formData, setFormData] = useState(defaultForm)
  const [loading, setLoading] = useState(false)

  // Recording state
  const [recordField, setRecordField] = useState<string | null>(null)
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [doneFields, setDoneFields] = useState<Set<string>>(new Set())

  // Define recording steps (exclude basic fields like name/gender/age)
  const recordingSteps = [
    { field: 'medicalHistory', label: '健康概况', group: 'health', prompt: '请说出您的主要健康问题，比如有什么慢性病、对什么药物过敏、做过什么大手术', icon: Heart },
    { field: 'emergencyNotes', label: '紧急注意事项', group: 'health', prompt: '请说出在紧急情况下，医护人员最需要知道的注意事项，比如需要随身携带什么药物、有什么特殊体质', icon: AlertTriangle },
    { field: 'contactName', label: '联系人姓名', group: 'contacts', prompt: '请说出您最信赖的联系人的姓名，比如您的子女或老伴的名字', icon: User },
    { field: 'contactRelation', label: '联系人关系', group: 'contacts', prompt: '请说出这个联系人与您的关系，比如女儿、儿子、老伴', icon: Users },
    { field: 'contactPhone', label: '联系人电话', group: 'contacts', prompt: '请说出这个联系人的手机号码，最好能重复一遍确保准确', icon: Phone },
    { field: 'communicationPref', label: '沟通偏好', group: 'preferences', prompt: '请说出您希望怎样跟医生沟通，比如希望谁来帮您说话、说话要不要慢一点', icon: MessageCircle },
    { field: 'carePref', label: '照护偏好', group: 'preferences', prompt: '请说出如果生病住院后，您希望怎么安排照护，比如回家休养还是去养老院、希望有人上门帮忙', icon: Heart },
    { field: 'aidNeeds', label: '救助需求', group: 'preferences', prompt: '请说出您在生活或看病方面有没有什么困难，比如担心费用、需要物资帮助、不了解相关政策', icon: HelpCircle },
  ]

  const currentStepIndex = recordingSteps.findIndex(s => s.field === recordField)
  const allDone = recordingSteps.every(s => doneFields.has(s.field))

  const startRecording = (field: string) => {
    setRecordField(field)
    setTranscript('')
    setStep('field_recording')
  }

  const recognitionRef = useRef<any>(null)
  const [speechSupported, setSpeechSupported] = useState(true)

  const beginFieldRecording = (forField: string) => {
    setRecording(true)
    setTranscript('')

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSpeechSupported(false)
      message.warning('当前浏览器不支持语音识别，请使用Chrome浏览器或手动录入')
      setRecording(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'zh-CN'
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      const result = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('')
      setTranscript(result)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      if (event.error !== 'no-speech') {
        message.error(`语音识别出错: ${event.error}`)
      }
      setRecording(false)
    }

    recognition.onend = () => {
      setRecording(false)
    }

    recognition.start()
    recognitionRef.current = recognition
  }

  const acceptTranscript = async () => {
    const step = recordingSteps.find(s => s.field === recordField)
    if (step && recordField) {
      const value = transcript || formData[recordField as keyof typeof formData] || ''
      setFormData(prev => ({ ...prev, [recordField]: value }))
      setDoneFields(prev => {
        const next = new Set(prev)
        next.add(recordField)
        return next
      })
      // Save transcript to API (fire and forget)
      try {
        await fetch('/api/voice/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ elderId: `demo-${Date.now()}`, fieldName: recordField, transcript: value }),
        })
      } catch {}
    }
    setRecordField(null)
    setTranscript('')
    setStep('guide')
  }

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      message.success('档案信息已保存')
      router.push('/intake/confirm')
    }, 800)
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const openStep = recordingSteps.find(s => s.field === recordField)

  /* ========== 精美输入框 ========== */
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
        <div className="relative">
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
      </div>
    )
  }

  /* ========== 章节卡片 ========== */
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

  return (
    <div>
      <div className="mb-8 text-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-200 rounded-full mb-3">
          <Mic size={14} className="text-brand-600" />
          <span className="text-xs text-brand-700 font-medium">AI 语音建档</span>
        </motion.div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">语音建档</h1>
        <p className="text-slate-500">逐项语音录入，AI自动转录，轻松完成建档</p>
        {allDone && doneFields.size > 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-sm text-green-600 font-medium mt-2">
            <CheckCircle2 size={14} className="inline mr-1" />
            所有字段已录入完毕，请核对后保存
          </motion.p>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* ============== 逐项录入引导 ============== */}
        {step === 'guide' && (
          <motion.div key="guide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="space-y-4">
              {/* 基本信息 - 手动填写（不录音） */}
              <SectionCard icon={User} title="基本信息" subtitle="请手动填写（无需录音）" color="bg-gradient-to-r from-blue-50 to-blue-100">
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

              {/* 健康信息 - 语音录入 */}
              <SectionCard icon={Heart} title="健康信息" subtitle="点击麦克风逐项录音录入" color="bg-gradient-to-r from-red-50 to-red-100">
                <div className="space-y-3">
                  {[0, 1].map(i => {
                    const step = recordingSteps[i]
                    const done = doneFields.has(step.field)
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <step.icon size={14} className={done ? 'text-green-600' : 'text-slate-400'} />
                            <span className={`text-sm font-medium ${done ? 'text-green-700' : 'text-slate-600'}`}>{step.label}</span>
                            <AiBadge done={done} />
                          </div>
                          {done && (
                            <p className="text-xs text-slate-400 ml-6 truncate max-w-[200px]">
                              {formData[step.field as keyof typeof formData]}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => startRecording(step.field)}
                          className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            done
                              ? 'bg-green-50 text-green-600 hover:bg-green-100'
                              : 'bg-brand-50 text-brand-600 hover:bg-brand-100 hover:scale-105'
                          }`}
                        >
                          {done ? <CheckCircle2 size={18} /> : <Mic size={18} />}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </SectionCard>

              {/* 联系人 - 语音录入 */}
              <SectionCard icon={Phone} title="可信联系人" subtitle="点击麦克风逐项录音录入" color="bg-gradient-to-r from-green-50 to-green-100">
                <div className="space-y-3">
                  {[2, 3, 4].map(i => {
                    const step = recordingSteps[i]
                    const done = doneFields.has(step.field)
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <step.icon size={14} className={done ? 'text-green-600' : 'text-slate-400'} />
                            <span className={`text-sm font-medium ${done ? 'text-green-700' : 'text-slate-600'}`}>{step.label}</span>
                            <AiBadge done={done} />
                          </div>
                          {done && (
                            <p className="text-xs text-slate-400 ml-6 truncate max-w-[200px]">
                              {formData[step.field as keyof typeof formData]}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => startRecording(step.field)}
                          className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            done
                              ? 'bg-green-50 text-green-600 hover:bg-green-100'
                              : 'bg-green-100 text-green-600 hover:bg-green-200 hover:scale-105'
                          }`}
                        >
                          {done ? <CheckCircle2 size={18} /> : <Mic size={18} />}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </SectionCard>

              {/* 照护偏好 - 语音录入 */}
              <SectionCard icon={MessageCircle} title="照护偏好" subtitle="点击麦克风逐项录音录入" color="bg-gradient-to-r from-amber-50 to-amber-100">
                <div className="space-y-3">
                  {[5, 6, 7].map(i => {
                    const step = recordingSteps[i]
                    const done = doneFields.has(step.field)
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <step.icon size={14} className={done ? 'text-green-600' : 'text-slate-400'} />
                            <span className={`text-sm font-medium ${done ? 'text-green-700' : 'text-slate-600'}`}>{step.label}</span>
                            <AiBadge done={done} />
                          </div>
                          {done && (
                            <p className="text-xs text-slate-400 ml-6 truncate max-w-[200px]">
                              {formData[step.field as keyof typeof formData]}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => startRecording(step.field)}
                          className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            done
                              ? 'bg-green-50 text-green-600 hover:bg-green-100'
                              : 'bg-amber-100 text-amber-600 hover:bg-amber-200 hover:scale-105'
                          }`}
                        >
                          {done ? <CheckCircle2 size={18} /> : <Mic size={18} />}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </SectionCard>

              {/* 保存按钮 */}
              <div className="pt-2 pb-4">
                <div className="bg-gradient-to-r from-brand-500 to-brand-700 rounded-2xl p-5 text-white">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertTriangle size={14} />
                    </div>
                    <p className="text-xs leading-relaxed text-white/90">
                      确认信息准确后将生成安心联系卡。卡片上的二维码在紧急情况下可被授权人员扫描查看。
                    </p>
                  </div>
                  <Button size="large" block onClick={handleSave} loading={loading} icon={<ArrowRight size={18} />}
                    className="!h-14 !rounded-xl !text-lg !font-medium !bg-white !text-brand-700 !border-none hover:!bg-brand-50">
                    {loading ? '保存中...' : '确认信息，保存并下一步'}
                  </Button>
                </div>
                <p className="text-center text-xs text-slate-400 mt-4">
                  * 以上为演示数据。实际使用时，AI会根据语音转录结果自动填充。
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ============== 录音弹窗 ============== */}
        {step === 'field_recording' && openStep && (
          <RecordModal
            open={true}
            fieldLabel={openStep.label}
            promptText={openStep.prompt}
            recording={recording}
            transcript={transcript}
            onStart={() => beginFieldRecording(openStep.field)}
            onClose={() => {
              if (!recording) {
                if (transcript) {
                  acceptTranscript()
                } else {
                  setRecordField(null)
                  setStep('guide')
                }
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
