import React from 'react'
import HeroSection from '@/components/feature/HeroSection'
import CapabilityCards from '@/components/feature/CapabilityCards'
import ScenarioSection from '@/components/feature/ScenarioSection'
import ServiceBoundary from '@/components/feature/ServiceBoundary'
import Link from 'next/link'
import { Button } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CapabilityCards />
      <ScenarioSection />
      <ServiceBoundary />

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-brand-600 to-brand-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            加入医愿护，为独居长者点亮一盏灯
          </h2>
          <p className="text-brand-100 mb-8 max-w-lg mx-auto">
            无论是作为志愿者、社区工作者还是合作资源方，您的参与都能让老人的关键时刻不再孤单
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register">
              <Button
                size="large"
                className="!h-14 !px-8 !text-lg !rounded-full !bg-white !text-brand-700 !border-none hover:!bg-brand-50 hover:!shadow-lg transition-all duration-300"
              >
                加入我们
                <ArrowRightOutlined className="ml-2" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="large"
                className="!h-14 !px-8 !text-lg !rounded-full !border-2 !border-white/50 !bg-white/15 !text-white hover:!bg-white/25 hover:!border-white/70 hover:!shadow-lg transition-all duration-300"
              >
                了解更多
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
