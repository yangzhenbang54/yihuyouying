import { CaseStatus, Priority } from './common'

export interface CaseEvent {
  id: string
  elderId: string
  elderName: string
  community: string
  triggerType: 'scan' | 'manual' | 'followup' | 'other'
  description: string
  status: CaseStatus
  severity: Priority
  assigneeId: string
  assigneeName: string
  createdAt: string
  resolvedAt?: string
}
