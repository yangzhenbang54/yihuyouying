'use client'

import React, { useState } from 'react'
import { Select, Drawer, Tag } from 'antd'
import { mockContacts } from '@/data/contacts'
import { mockCards } from '@/data/cards'
import { useApiData } from '@/hooks/useApiData'
import SearchInput from '@/components/ui/SearchInput'
import StatusBadge from '@/components/ui/StatusBadge'
import EmptyState from '@/components/ui/EmptyState'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorState from '@/components/ui/ErrorState'
import { PROFILE_STATUS_LABELS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { MapPin, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CasesPage() {
  const [search, setSearch] = useState('')
  const [community, setCommunity] = useState('all')
  const [riskFilter, setRiskFilter] = useState('all')
  const [selectedElder, setSelectedElder] = useState<any | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { data: elders, loading, error, refetch } = useApiData<any[]>('/api/elders')

  const riskColors: Record<string, string> = {
    high: 'red',
    medium: 'orange',
    low: 'green',
  }

  const items = elders || []
  const filtered = items.filter(e => {
    const matchSearch = !search || e.name.includes(search) || e.community.includes(search)
    const matchCommunity = community === 'all' || e.community === community
    const matchRisk = riskFilter === 'all' || e.riskLevel === riskFilter
    return matchSearch && matchCommunity && matchRisk
  })

  const communities = Array.from(new Set(items.map(e => e.community)))

  const openElder = (elder: any) => {
    setSelectedElder(elder)
    setDrawerOpen(true)
  }

  if (loading) return <LoadingSpinner text="加载个案数据..." />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-800">个案中心</h1>
        <span className="text-sm text-slate-400">共 {filtered.length} 例</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <SearchInput
          placeholder="搜索老人姓名..."
          value={search}
          onChange={setSearch}
          className="flex-1 min-w-[200px]"
        />
        <Select
          value={community}
          onChange={setCommunity}
          className="!w-36 !rounded-xl"
          options={[{ value: 'all', label: '全部社区' }, ...communities.map(c => ({ value: c, label: c }))]}
        />
        <Select
          value={riskFilter}
          onChange={setRiskFilter}
          className="!w-32 !rounded-xl"
          options={[
            { value: 'all', label: '全部风险' },
            { value: 'high', label: '重点关注' },
            { value: 'medium', label: '中等关注' },
            { value: 'low', label: '一般关注' },
          ]}
        />
      </div>

      {/* Case cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((elder, i) => {
          const card = mockCards.find(c => c.elderId === elder.id)
          return (
            <motion.div
              key={elder.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div
                className="bg-white rounded-card-lg border border-slate-100 shadow-card p-5 hover:shadow-card-hover transition-all duration-200 cursor-pointer"
                onClick={() => openElder(elder)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                      elder.riskLevel === 'high' ? 'bg-red-50 text-red-600' :
                      elder.riskLevel === 'medium' ? 'bg-amber-50 text-amber-600' :
                      'bg-brand-50 text-brand-600'
                    }`}>
                      {elder.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{elder.name}</h3>
                      <p className="text-xs text-slate-400">{elder.gender === 'male' ? '男' : '女'} · {elder.age}岁</p>
                    </div>
                  </div>
                  <Tag color={riskColors[elder.riskLevel]} className="!rounded-lg !text-xs">
                    {elder.riskLevel === 'high' ? '重点' : elder.riskLevel === 'medium' ? '中等' : '一般'}
                  </Tag>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-400 mb-2">
                  <MapPin size={12} />
                  <span>{elder.community}</span>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-50">
                  <StatusBadge status={elder.status} label={PROFILE_STATUS_LABELS[elder.status]} />
                  {card && <Tag className="!rounded-lg !text-xs" color="blue">已有联系卡</Tag>}
                  {elder.riskLevel === 'high' && (
                    <AlertTriangle size={14} className="text-red-400" />
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filtered.length === 0 && <EmptyState title="未找到匹配个案" />}

      {/* Detail Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="个案详情"
        width={400}
        styles={{ body: { padding: 20 } }}
      >
        {selectedElder && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center text-3xl font-bold text-brand-700">
                {selectedElder.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{selectedElder.name}</h2>
                <p className="text-sm text-slate-500">
                  {selectedElder.gender === 'male' ? '男' : '女'} · {selectedElder.age}岁 · {selectedElder.livingStatus === 'alone' ? '独居' : selectedElder.livingStatus === 'with_spouse' ? '与配偶同住' : selectedElder.livingStatus === 'with_family' ? '与家人同住' : '机构居住'}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">社区</span><span className="text-slate-700">{selectedElder.community}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">地址</span><span className="text-slate-700">{selectedElder.address}</span>
              </div>
              {selectedElder.medicalHistory && (
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400">健康概况</span><span className="text-slate-700 text-right max-w-[60%]">{selectedElder.medicalHistory}</span>
                </div>
              )}
            </div>

            {/* Contacts */}
            <h3 className="font-bold text-slate-800 mt-6 mb-3">可信联系人</h3>
            {mockContacts.filter(c => c.elderId === selectedElder.id).map(c => (
              <div key={c.id} className="flex items-center justify-between bg-slate-50 rounded-xl p-3 mb-2">
                <div>
                  <p className="text-sm font-medium text-slate-700">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.relation}</p>
                </div>
                <Tag color={c.verifiedStatus === 'verified' ? 'success' : c.verifiedStatus === 'pending' ? 'warning' : 'error'} className="!rounded-lg !text-xs">
                  {c.verifiedStatus === 'verified' ? '已验证' : c.verifiedStatus === 'pending' ? '待验证' : '无效'}
                </Tag>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  )
}
