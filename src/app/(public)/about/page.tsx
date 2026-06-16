import React from 'react'
import type { Metadata } from 'next'
import { Heart, Shield, Users, Target } from 'lucide-react'

export const metadata: Metadata = { title: '关于我们' }

const stats = [
  { value: '128', label: '已建档老人', icon: Users },
  { value: '105', label: '已发放联系卡', icon: Shield },
  { value: '8', label: '合作社区', icon: Target },
  { value: '36', label: '志愿者', icon: Heart },
]

const team = [
  { name: '项目负责人', role: '项目管理与资源协调', desc: '负责整体项目规划、资源对接与团队管理' },
  { name: '技术团队', role: '系统开发与维护', desc: '负责AI系统、网站平台和移动端的开发维护' },
  { name: '社区团队', role: '社区联络与实务', desc: '负责联系社区、建档入户、志愿者培训与督导' },
  { name: '研究团队', role: '数据分析与评估', desc: '负责项目效果评估、数据分析和学术论文撰写' },
]

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">关于医愿护</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          一个以AI辅助独居长者医疗意愿建档、应急联系与出院照护接续的公益系统，
          致力于让每一位老人的心愿被听见、被尊重、被落实。
        </p>
      </div>

      {/* Origin Story */}
      <div className="bg-white rounded-card-lg border border-slate-100 shadow-card p-8 mb-10">
        <h2 className="text-xl font-bold text-slate-800 mb-4">项目起源</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          在中国，超过1.3亿65岁以上老人中，相当比例处于独居或空巢状态。当他们突发疾病、住院治疗、面临出院时，
          往往因为信息不对称和沟通障碍，陷入&ldquo;没人知道、没法联系、没处接续&rdquo;的困境。
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          医愿护项目由大学生创新创业计划发起，联合社区、医院、公益组织和志愿者，
          运用AI技术辅助建档，以&ldquo;一档案、一张卡、一摘要、一响应、一接续&rdquo;的服务闭环，
          为独居长者的医疗照护提供信息支持和协作平台。
        </p>
        <p className="text-slate-600 leading-relaxed">
          我们不提供医疗服务，也不替代法律上的监护人或签字人。我们只做一件事：
          <strong className="text-brand-700">在关键时刻，让老人和他们的家人不再信息断联。</strong>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-card-lg border border-slate-100 shadow-card p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-3">
                <Icon size={20} className="text-brand-600" />
              </div>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Team */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">项目团队</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {team.map((member) => (
            <div key={member.name} className="bg-white rounded-card-lg border border-slate-100 shadow-card p-6 hover:shadow-card-hover transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center mb-3">
                <span className="text-brand-700 font-bold text-sm">{member.name.charAt(0)}</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-1">{member.name}</h3>
              <p className="text-xs text-brand-600 font-medium mb-2">{member.role}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{member.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
