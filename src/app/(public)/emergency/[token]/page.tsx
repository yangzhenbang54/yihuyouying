'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useApiData } from '@/hooks/useApiData'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Shield, Phone, AlertCircle } from 'lucide-react'

interface EmergencyContact {
  name: string; relation: string; phone: string; priority: number
}
interface EmergencyElder {
  name: string; community: string; emergencyNote?: string; carePref?: string
}
interface EmergencyData {
  elder: EmergencyElder; contacts: EmergencyContact[]; cardNo?: string
}

export default function EmergencyPage() {
  const params = useParams()
  const token = params.token as string

  const { data, loading, error } = useApiData<EmergencyData>(`/api/emergency/${token}`)

  if (loading) {
    return <LoadingSpinner fullPage text="加载紧急信息..." />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-800 mb-2">加载失败</h1>
          <p className="text-slate-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-800 mb-2">卡片无效</h1>
          <p className="text-slate-500">此安心联系卡已失效或不存在，请联系社区工作人员。</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Emergency header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={22} />
          </div>
          <div>
            <h1 className="font-bold text-lg">紧急联系信息</h1>
            <p className="text-xs text-white/80">以下为最小必要信息，仅用于紧急联系</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Elder info card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center text-2xl">
              {data.elder.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{data.elder.name}</h2>
              <p className="text-sm text-slate-500">
                {data.elder.community}
              </p>
            </div>
          </div>

          {data.elder.emergencyNote && (
            <div className="bg-amber-50 rounded-xl p-3 flex items-start gap-2 mb-4">
              <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">{data.elder.emergencyNote}</p>
            </div>
          )}

          {data.elder.carePref && (
            <div className="bg-red-50 rounded-xl p-3 flex items-start gap-2">
              <Shield size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{data.elder.carePref}</p>
            </div>
          )}
        </div>

        {/* Emergency Contacts */}
        <h3 className="font-bold text-slate-800 mb-3 text-lg">紧急联系人（按优先级排列）</h3>
        <div className="space-y-3 mb-8">
          {data.contacts.map((contact, i) => (
            <div
              key={`contact-${i}`}
              className="bg-white rounded-2xl border border-slate-100 shadow p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {i === 0 && (
                    <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                      首
                    </span>
                  )}
                  <div>
                    <p className="font-medium text-slate-800">{contact.name}</p>
                    <p className="text-xs text-slate-400">{contact.relation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-600">
                    已验证
                  </span>
                  <a
                    href={`tel:${contact.phone}`}
                    className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30 active:scale-95"
                  >
                    <Phone size={20} className="text-white" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Privacy notice */}
        <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-400">
          <p>此页面仅显示紧急联系所必需的最少信息。完整档案仅授权工作人员可查看。</p>
          <p className="mt-1">医愿护 · 卡片编号：{data.cardNo} · 仅供紧急情况使用</p>
        </div>
      </div>
    </div>
  )
}
