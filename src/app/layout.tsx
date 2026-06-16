import type { Metadata } from 'next'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider, App as AntApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { antdTheme } from '@/lib/antd-theme'
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'
import AuthInitializer from '@/components/AuthInitializer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - ${SITE_DESCRIPTION}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `${SITE_NAME}是以AI辅助独居长者医疗意愿建档、应急联系与出院照护接续的公益系统。不替代医生决策，不代签法律文件，只做信息支持与照护协调。`,
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0d9488" />
      </head>
      <body className="min-h-screen bg-[#f8fafc] antialiased">
        <AntdRegistry>
          <ConfigProvider theme={antdTheme} locale={zhCN}>
            <AntApp>
              <AuthInitializer>
                {children}
              </AuthInitializer>
            </AntApp>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
