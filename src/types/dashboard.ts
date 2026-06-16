export interface KpiData {
  totalProfiles: number
  totalCards: number
  activeContactsRate: number
  monthlyEmergencies: number
  responseRate: number
  followupRate: number
  dischargeCompletionRate: number
}

export interface WeeklyMetric {
  week: string
  profiles: number
  cards: number
  cases: number
}

export interface RiskDistribution {
  name: string
  value: number
  color: string
}

export interface DischargeTaskMetric {
  category: string
  completed: number
  pending: number
}

export interface ResponseTimeData {
  date: string
  medianMinutes: number
  p90Minutes: number
}
