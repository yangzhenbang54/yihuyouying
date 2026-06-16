'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button, message } from 'antd'
import { PrinterOutlined, DownloadOutlined } from '@ant-design/icons'
import { useApiData } from '@/hooks/useApiData'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { QRCodeSVG } from 'qrcode.react'
import ShareModule from '@/components/ui/ShareModule'
import { Shield, Phone } from 'lucide-react'

export default function CardPage() {
  const params = useParams()
  const cardId = params.id as string
  const [flipped, setFlipped] = useState(false)

  const { data: cardData, loading: cardLoading, error: cardError } = useApiData<any>(`/api/cards/${cardId}`)
  const elderId = cardData?.elderId
  const { data: contactsData } = useApiData<any[]>(`/api/elders/${elderId}/contacts`, !!elderId)

  const contacts = contactsData || []

  if (cardLoading) {
    return <LoadingSpinner fullPage text="加载卡片信息..." />
  }

  if (cardError) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 text-lg">加载失败: {cardError}</p>
      </div>
    )
  }

  if (!cardData || !cardData.elder) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 text-lg">卡片不存在或已失效</p>
        <Button type="primary" className="mt-4 !rounded-xl" onClick={() => window.location.href = '/intake/start'}>
          重新建档
        </Button>
      </div>
    )
  }

  const cardUrl = typeof window !== 'undefined' && cardData ? `${window.location.origin}/emergency/${cardData.qrToken}` : ''

  const handlePrint = () => {
    message.info('正在准备打印...')
    window.print()
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">安心联系卡</h1>
        <p className="text-slate-500">卡片编号：{cardData.cardNo}</p>
      </div>

      {/* Card preview */}
      <div className="max-w-sm mx-auto mb-8">
        <div className="flip-card" style={{ perspective: '1000px' }}>
          <div
            className="flip-card-inner relative cursor-pointer"
            style={{
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
            onClick={() => setFlipped(!flipped)}
          >
            {/* Front */}
            <div
              className="bg-white rounded-2xl shadow-xl border-2 border-brand-100 p-6"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-brand-100">
                <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center text-2xl font-bold text-brand-700">
                  {cardData.elder.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{cardData.elder.name}</h2>
                  <p className="text-sm text-slate-400">{cardData.elder.gender === 'male' ? '男' : '女'} · {cardData.elder.age}岁</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-slate-400 mb-1">所属社区</p>
                <p className="text-sm font-medium text-slate-700">{cardData.elder.community}</p>
              </div>

              {cardData.emergencyNote && (
                <div className="bg-amber-50 rounded-xl p-3 mb-4 flex items-start gap-2">
                  <Shield size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">{cardData.emergencyNote}</p>
                </div>
              )}

              <div className="flex justify-center mb-3">
                <div className="bg-white p-3 rounded-xl border-2 border-brand-100">
                  <QRCodeSVG value={cardUrl} size={120} level="H" />
                </div>
              </div>

              <p className="text-xs text-slate-400 text-center">
                扫描二维码获取紧急联系信息
              </p>
              <p className="text-xs text-slate-300 text-center mt-1">点击卡片查看联系人详情</p>
            </div>

            {/* Back */}
            <div
              className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl shadow-xl border-2 border-brand-200 p-6"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <h3 className="font-bold text-slate-800 text-center mb-4">紧急联系人</h3>
              <div className="space-y-3">
                {contacts.map((c, i) => (
                  <div key={c.id} className="flex items-center justify-between bg-white rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      {i === 0 && (
                        <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">首选</span>
                      )}
                      <div>
                        <p className="text-sm font-medium text-slate-700">{c.name}</p>
                        <p className="text-xs text-slate-400">{c.relation}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">{c.phone}</span>
                      <a
                        href={`tel:${c.phone}`}
                        className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone size={14} className="text-green-600" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 text-center mt-4">点击卡片返回正面</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <Button
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          className="!rounded-xl"
        >
          打印卡片
        </Button>
        <Button
          icon={<DownloadOutlined />}
          className="!rounded-xl"
        >
          下载PDF
        </Button>
        <ShareModule title="分享安���联系卡" url={cardUrl} />
      </div>

      {/* Notes */}
      <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-400 space-y-2">
        <p>卡片正面仅显示必要信息。联系人详情需点击翻转卡片查看。</p>
        <p>扫码公开页面仅显示最小必要信息，完整档案仅授权人员可见。</p>
        <p>如需挂���或更新卡片，请联系社区工作人员：400-XXX-XXXX</p>
      </div>
    </div>
  )
}
