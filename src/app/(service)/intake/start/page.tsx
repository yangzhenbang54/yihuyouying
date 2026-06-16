'use client'

import React from 'react'
import Link from 'next/link'
import { Mic, PenLine, Users } from 'lucide-react'
import { motion } from 'framer-motion'

const methods = [
  {
    key: 'voice',
    title: '语音建档',
    desc: '通过语音录入您的信息，AI会自动转录和整理',
    icon: Mic,
    href: '/intake/voice',
    color: 'bg-gradient-to-br from-brand-50 to-brand-100 border-brand-200',
    iconColor: 'text-brand-600',
  },
  {
    key: 'text',
    title: '文字建档',
    desc: '通过表单逐步填写信息，适合熟悉手机操作的老人或家属',
    icon: PenLine,
    href: '/intake/text',
    color: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
    iconColor: 'text-amber-600',
  },
  {
    key: 'assisted',
    title: '社区协助',
    desc: '由社区工作人员或志愿者协助完成建档',
    icon: Users,
    href: '/intake/assisted',
    color: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
    iconColor: 'text-blue-600',
  },
]

export default function IntakeStartPage() {
  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-3">
          开始建档
        </h1>
        <p className="text-slate-500 max-w-md mx-auto">
          选择适合您的建档方式。整个过程约需5-10分钟，请放心，您的信息将受到严格保护。
        </p>
      </motion.div>

      {/* Steps guide */}
      <div className="flex items-center justify-center gap-3 mb-10">
        {['填写资料', 'AI整理摘要', '确认发卡'].map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold text-sm flex items-center justify-center">
                {i + 1}
              </div>
              <span className="text-sm text-slate-500 hidden sm:inline">{step}</span>
            </div>
            {i < 2 && (
              <div className="w-8 h-0.5 bg-slate-200 rounded-full flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Method cards */}
      <div className="space-y-4">
        {methods.map((method, i) => {
          const Icon = method.icon
          return (
            <motion.div
              key={method.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
            >
              <Link href={method.href}>
                <div
                  className={`flex items-center gap-5 p-5 rounded-card-lg border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${method.color}`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon size={26} className={method.iconColor} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg mb-1">{method.title}</h3>
                    <p className="text-sm text-slate-500">{method.desc}</p>
                  </div>
                  <div className="text-brand-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom info */}
      <div className="mt-10 p-4 bg-slate-50 rounded-xl text-center text-sm text-slate-400">
        如遇困难，请拨打服务热线 400-XXX-XXXX，我们将安排工作人员协助建档
      </div>
    </div>
  )
}
