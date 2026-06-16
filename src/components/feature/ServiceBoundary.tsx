'use client'

import React from 'react'
import { Shield, ShieldAlert } from 'lucide-react'
import { SERVICE_BOUNDARY } from '@/lib/constants'

export default function ServiceBoundary() {
  const canDo = [
    '建立老人医疗意愿与照护偏好档案',
    '生成并管理安心联系卡',
    'AI辅助生成照护信息摘要',
    '紧急情况联系家属和社区',
    '协助安排出院接续照护',
    '定期回访更新档案信息',
  ]

  return (
    <section id="boundary" className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            清晰的服务边界
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            医愿护只做信息支持与照护协调，绝不越界的服务承诺
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Can do */}
          <div className="bg-white rounded-card-lg border border-slate-100 shadow-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <Shield size={22} className="text-green-600" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">我们能做的</h3>
            </div>
            <ul className="space-y-3">
              {canDo.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-sm text-slate-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cannot do */}
          <div className="bg-amber-50/50 rounded-card-lg border border-amber-200 shadow-card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <ShieldAlert size={22} className="text-red-500" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">我们不做的</h3>
            </div>
            <ul className="space-y-3">
              {SERVICE_BOUNDARY.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  <span className="text-sm text-amber-800 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
