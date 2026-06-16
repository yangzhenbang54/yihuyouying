import React from 'react'
import type { Metadata } from 'next'
import { ShieldAlert, Eye, Lock, FileText, Scale } from 'lucide-react'

export const metadata: Metadata = { title: '服务边界' }

const redLines = [
  { icon: Scale, title: '不代签任何法律文件', desc: '医愿护不是法律服务平台，不替代任何法定监护人、授权代理人签署任何医疗、法律或金融文件。我们只提供信息支持。' },
  { icon: ShieldAlert, title: '不提供医疗诊断', desc: 'AI只做信息整理和风险提示，所有医疗决策必须由有资质的医护人员作出。我们不替代医生。' },
  { icon: Lock, title: '不接触老人财产', desc: '平台不涉及任何金融交易、资金托管、保险销售或财产管理。不向老人收取任何费用。' },
  { icon: Eye, title: '不替代依法有权主体作决定', desc: '关于老人的医疗、照护、财产、人身安排等所有决定权，始终归属于法律规定的有权主体，平台不代为行使。' },
  { icon: FileText, title: '最小化采集、分层授权、操作留痕', desc: '仅采集服务必需信息；扫码公开页仅显示最小必要信息；所有查看、修改、导出均留痕可审计。' },
]

export default function BoundaryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={28} className="text-amber-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">明确的服务边界</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          清晰的边界是专业和信任的基石。了解医愿护能做什么、不做什么，让我们更好地服务每一位老人。
        </p>
      </div>

      {/* Red lines */}
      <div className="space-y-4 mb-12">
        {redLines.map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} className="bg-white rounded-card-lg border border-slate-100 shadow-card p-6 flex gap-5 items-start hover:shadow-card-hover transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <Icon size={22} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1.5">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Privacy note */}
      <div className="bg-brand-50 rounded-card-lg border border-brand-200 p-8">
        <h2 className="font-bold text-brand-800 text-lg mb-3">隐私与合规承诺</h2>
        <ul className="space-y-2 text-sm text-brand-700 leading-relaxed">
          <li>我们严格遵守《个人信息保护法》关于医疗健康等敏感个人信息的规定。</li>
          <li>数据存储于安全环境中，仅授权角色可在权限范围内访问。</li>
          <li>您有权随时查询、更正或要求删除您的个人信息。</li>
          <li>如发生信息泄露等安全事件，我们将依法及时通知并采取补救措施。</li>
        </ul>
      </div>
    </div>
  )
}
