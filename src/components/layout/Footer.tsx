'use client'

import React from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { SITE_NAME, SITE_TAGLINE, SERVICE_BOUNDARY } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo size={36} withText className="mb-4 [&_span]:!bg-gradient-to-br [&_span]:from-teal-400 [&_span]:to-teal-300 [&_span]:!text-transparent [&_span]:!bg-clip-text" />
            <p className="text-sm text-slate-400 leading-relaxed">{SITE_TAGLINE}</p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4">快速入口</h3>
            <div className="flex flex-col gap-2">
              <Link href="/intake/start" className="text-sm text-slate-400 hover:text-teal-400 transition-colors">立即建档</Link>
              <Link href="/about" className="text-sm text-slate-400 hover:text-teal-400 transition-colors">项目介绍</Link>
              <Link href="/boundary" className="text-sm text-slate-400 hover:text-teal-400 transition-colors">服务边界</Link>
              <Link href="/faq" className="text-sm text-slate-400 hover:text-teal-400 transition-colors">常见问题</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">联系我们</h3>
            <div className="flex flex-col gap-2 text-sm text-slate-400">
              <p>服务热线：400-XXX-XXXX</p>
              <p>邮箱：yihuyouying@example.com</p>
              <p>地址：南京市XX区XX路XX号</p>
              <p>服务时间：周一至周五 9:00-17:00</p>
            </div>
          </div>

          {/* Boundary */}
          <div>
            <h3 className="text-white font-semibold mb-4">服务边界</h3>
            <ul className="flex flex-col gap-1.5">
              {SERVICE_BOUNDARY.map((item, i) => (
                <li key={i} className="text-sm text-amber-400/80 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-amber-400/60 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} {SITE_NAME} 公益项目. 保留所有权利.
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <Link href="/boundary" className="hover:text-slate-300 transition-colors">隐私政策</Link>
            <Link href="/boundary" className="hover:text-slate-300 transition-colors">使用条款</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
