import { KpiData, WeeklyMetric, RiskDistribution, DischargeTaskMetric, ResponseTimeData } from '@/types/dashboard'

export const mockKpi: KpiData = {
  totalProfiles: 128,
  totalCards: 105,
  activeContactsRate: 87.5,
  monthlyEmergencies: 8,
  responseRate: 92.3,
  followupRate: 85.7,
  dischargeCompletionRate: 78.6,
}

export const mockWeeklyMetrics: WeeklyMetric[] = [
  { week: '第1周', profiles: 12, cards: 10, cases: 3 },
  { week: '第2周', profiles: 18, cards: 15, cases: 5 },
  { week: '第3周', profiles: 15, cards: 14, cases: 4 },
  { week: '第4周', profiles: 20, cards: 18, cases: 6 },
  { week: '第5周', profiles: 22, cards: 20, cases: 7 },
  { week: '第6周', profiles: 25, cards: 22, cases: 8 },
  { week: '第7周', profiles: 16, cards: 15, cases: 5 },
  { week: '第8周', profiles: 19, cards: 18, cases: 4 },
  { week: '第9周', profiles: 24, cards: 21, cases: 9 },
  { week: '第10周', profiles: 21, cards: 20, cases: 7 },
  { week: '第11周', profiles: 28, cards: 26, cases: 10 },
  { week: '第12周', profiles: 31, cards: 29, cases: 11 },
]

export const mockRiskDistribution: RiskDistribution[] = [
  { name: '重点关注', value: 28, color: '#ef4444' },
  { name: '中等关注', value: 45, color: '#f59e0b' },
  { name: '一般关注', value: 55, color: '#0d9488' },
]

export const mockDischargeTasks: DischargeTaskMetric[] = [
  { category: '出院接送', completed: 42, pending: 5 },
  { category: '用药提醒', completed: 38, pending: 12 },
  { category: '复诊安排', completed: 30, pending: 18 },
  { category: '探访安排', completed: 25, pending: 15 },
]

export const mockResponseTime: ResponseTimeData[] = [
  { date: '12/01', medianMinutes: 15, p90Minutes: 45 },
  { date: '12/03', medianMinutes: 12, p90Minutes: 38 },
  { date: '12/05', medianMinutes: 18, p90Minutes: 52 },
  { date: '12/07', medianMinutes: 10, p90Minutes: 30 },
  { date: '12/09', medianMinutes: 14, p90Minutes: 42 },
  { date: '12/11', medianMinutes: 20, p90Minutes: 55 },
  { date: '12/13', medianMinutes: 16, p90Minutes: 48 },
  { date: '12/15', medianMinutes: 11, p90Minutes: 35 },
  { date: '12/17', medianMinutes: 13, p90Minutes: 40 },
]
