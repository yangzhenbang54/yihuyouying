'use client'

import React, { useState } from 'react'
import { Collapse, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { FAQ_DATA } from '@/lib/constants'

const categories = [
  { key: 'all', label: '全部' },
  { key: 'general', label: '综合问题' },
  { key: 'intake', label: '建档相关' },
  { key: 'card', label: '联系卡' },
  { key: 'privacy', label: '隐私安全' },
]

export default function FAQPage() {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('all')

  const filtered = FAQ_DATA.filter((item) => {
    const matchSearch = !search || item.q.includes(search) || item.a.includes(search)
    const matchCat = activeCat === 'all' || item.cat === activeCat
    return matchSearch && matchCat
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">常见问题</h1>
        <p className="text-slate-500">关于医愿护的使用方式、隐私保护和参与方式</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          prefix={<SearchOutlined className="text-slate-400" />}
          placeholder="搜索问题..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="large"
          className="!rounded-xl"
          allowClear
        />
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCat(cat.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeCat === cat.key
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:text-brand-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ items */}
      <Collapse
        accordion
        className="!bg-transparent !border-none [&_.ant-collapse-item]:!mb-3 [&_.ant-collapse-item]:!border-none"
        items={filtered.map((item, i) => ({
          key: i.toString(),
          label: (
            <span className="font-medium text-slate-800 text-base">{item.q}</span>
          ),
          children: (
            <p className="text-slate-600 leading-relaxed">{item.a}</p>
          ),
          className: '!bg-white !rounded-card-lg !border !border-slate-100 !shadow-card !overflow-hidden',
        }))}
      />

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p>没有找到匹配的问题</p>
          <p className="text-sm mt-1">请尝试其他关键词搜索</p>
        </div>
      )}
    </div>
  )
}
