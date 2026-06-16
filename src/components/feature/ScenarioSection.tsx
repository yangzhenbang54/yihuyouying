'use client'

import React from 'react'
import { SCENARIOS } from '@/lib/constants'
import { Hospital, Users, Truck, RefreshCw } from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  hospital: <Hospital size={28} className="text-red-500" />,
  communication: <Users size={28} className="text-blue-500" />,
  discharge: <Truck size={28} className="text-green-500" />,
  followup: <RefreshCw size={28} className="text-amber-500" />,
}

export default function ScenarioSection() {
  return (
    <section id="scenarios" className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            典型使用场景
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            从日常建档到应急响应，医愿护陪伴老人和家庭的每一个关键时刻
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SCENARIOS.map((scenario) => (
            <div
              key={scenario.title}
              className="h-full p-6 bg-white rounded-card-lg border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                {iconMap[scenario.icon]}
              </div>
              <h3 className="font-bold text-slate-800 mb-2 text-base">{scenario.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{scenario.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
