import type { ThemeConfig } from 'antd'

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#0d9488',
    colorInfo: '#0d9488',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    borderRadius: 12,
    fontFamily: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
    fontSize: 16,
    controlHeight: 44,
    colorBgContainer: '#ffffff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
    wireframe: false,
  },
  components: {
    Card: {
      paddingLG: 24,
      borderRadiusLG: 16,
    },
    Button: {
      borderRadius: 12,
      controlHeight: 44,
      fontWeight: 500,
    },
    Input: {
      borderRadius: 12,
      controlHeight: 44,
      paddingInline: 16,
    },
    Select: {
      borderRadius: 12,
      controlHeight: 44,
    },
    Table: {
      borderRadius: 12,
      headerBg: '#f8fafc',
      headerColor: '#475569',
      cellPaddingBlock: 12,
    },
    Modal: {
      borderRadiusLG: 16,
    },
    Tabs: {
      inkBarColor: '#0d9488',
      itemActiveColor: '#0d9488',
      itemHoverColor: '#0d9488',
    },
    Menu: {
      itemBorderRadius: 8,
      itemActiveBg: 'rgba(13, 148, 136, 0.08)',
      itemSelectedColor: '#0d9488',
    },
    Tag: {
      borderRadiusSM: 6,
    },
    Form: {
      itemMarginBottom: 20,
      labelColor: '#475569',
    },
  },
}
