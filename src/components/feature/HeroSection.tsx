'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRightOutlined, SafetyOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { SITE_TAGLINE } from '@/lib/constants'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-white">
      {/* Decorative blobs */}
      <div className="absolute top-20 -left-32 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl animate-float" />
      <div className="absolute top-40 -right-32 w-80 h-80 bg-amber-200/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-teal-200/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-200 rounded-full mb-6">
            <SafetyOutlined className="text-brand-600 text-sm" />
            <span className="text-xs text-brand-700 font-medium">公益系统 · AI辅助 · 不作医疗决定</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight mb-6 tracking-tight">
            让老人关键时刻
            <br />
            <span className="text-gradient-brand">有人联系、信息可查、照护可接</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto mb-10">
            {SITE_TAGLINE}。医愿护以AI辅助建档、应急联系与出院接续，不替代医生决策，不替代依法有权主体签署。
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/intake/start">
              <Button
                type="primary"
                size="large"
                className="!h-14 !px-8 !text-lg !rounded-full !shadow-lg !shadow-brand-500/25 hover:!shadow-xl hover:!shadow-brand-500/35 transition-all duration-300 hover:-translate-y-0.5 !bg-gradient-to-r !from-brand-500 !to-brand-700 !border-none"
              >
                立即建档
                <ArrowRightOutlined className="ml-2" />
              </Button>
            </Link>
            <Link href="/boundary">
              <Button
                size="large"
                className="!h-14 !px-8 !text-lg !rounded-full !border-2 !border-slate-200 !text-slate-600 hover:!border-brand-300 hover:!text-brand-600 transition-all duration-300"
              >
                了解项目边界
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
