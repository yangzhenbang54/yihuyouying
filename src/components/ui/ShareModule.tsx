'use client'

import React, { useState } from 'react'
import { Share2, MessageCircle, Mail, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShareModuleProps {
  title?: string
  url?: string
  className?: string
}

export default function ShareModule({ title = '分享给更多人', url, className }: ShareModuleProps) {
  const [show, setShow] = useState(false)
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      // fallback
    }
  }

  return (
    <div className={cn('relative inline-block', className)}>
      <button
        onClick={() => setShow(!show)}
        className={cn(
          'flex items-center gap-2 px-5 py-3 rounded-full text-white font-medium text-sm',
          'bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700',
          'shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/35',
          'transition-all duration-300 hover:scale-105 hover:-translate-y-0.5',
          'active:scale-95'
        )}
      >
        <Share2 size={18} />
        <span>分享</span>
      </button>

      {show && (
        <div
          className={cn(
            'absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50',
            'bg-white/95 backdrop-blur-lg rounded-2xl p-5',
            'shadow-xl border border-slate-100',
            'animate-scale-in'
          )}
        >
          <div className="flex gap-3">
            <button
              className="flex flex-col items-center gap-1.5 group"
              onClick={() => { copyLink(); setShow(false) }}
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-brand-100 group-hover:text-brand-600 transition-all duration-300 group-hover:scale-110">
                <Link2 size={20} />
              </div>
              <span className="text-xs text-slate-500">复制链接</span>
            </button>
            <button
              className="flex flex-col items-center gap-1.5 group"
              onClick={() => setShow(false)}
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-green-100 group-hover:text-green-600 transition-all duration-300 group-hover:scale-110">
                <MessageCircle size={20} />
              </div>
              <span className="text-xs text-slate-500">微信</span>
            </button>
            <button
              className="flex flex-col items-center gap-1.5 group"
              onClick={() => setShow(false)}
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-all duration-300 group-hover:scale-110">
                <Mail size={20} />
              </div>
              <span className="text-xs text-slate-500">邮件</span>
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center mt-3">{title}</p>
        </div>
      )}
    </div>
  )
}
