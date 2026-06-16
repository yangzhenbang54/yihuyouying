'use client'

import React from 'react'
import { SERVICE_CAPABILITIES } from '@/lib/constants'
import { FileText, CreditCard, FileCheck, PhoneCall, HeartHandshake } from 'lucide-react'

const gradients: Record<string, string> = {
  archive:    'linear-gradient(135deg, #3b82f6, #2563eb)',
  card:       'linear-gradient(135deg, #10b981, #0d9488)',
  summary:    'linear-gradient(135deg, #f59e0b, #ea580c)',
  response:   'linear-gradient(135deg, #f43f5e, #dc2626)',
  continuity: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
}

const icons: Record<string, React.ElementType> = {
  archive: FileText,
  card: CreditCard,
  summary: FileCheck,
  response: PhoneCall,
  continuity: HeartHandshake,
}

export default function CapabilityCards() {
  return (
    <section id="capabilities" className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            五大核心能力
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            以AI为连接，不替人做决定。围绕&ldquo;一档案、一张卡、一摘要、一响应、一接续&rdquo;构建完整公益服务闭环。
          </p>
        </div>

        <div className="cards-group flex flex-nowrap justify-between gap-3 w-full">
          {SERVICE_CAPABILITIES.map((cap) => {
            const Icon = icons[cap.key]
            return (
              <div
                key={cap.key}
                className="card-item flex flex-col items-center justify-center text-center flex-1 mx-1
                  min-w-0 min-h-[150px] px-3 sm:px-4 py-5 rounded-2xl
                  text-white cursor-pointer select-none shadow-lg"
                style={{ background: gradients[cap.key] }}
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                  <Icon size={26} />
                </div>
                <p className="text-[15px] font-bold mb-1">{cap.title}</p>
                <p className="text-[12px] text-white/75 leading-relaxed">{cap.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
