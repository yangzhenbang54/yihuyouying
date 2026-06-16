import { CardStatus, CardVisibility } from './common'

export interface EmergencyCard {
  id: string
  elderId: string
  elderName: string
  community: string
  cardNo: string
  qrToken: string
  visibilityLevel: CardVisibility
  emergencyNote?: string
  status: CardStatus
  createdAt: string
  printedAt?: string
}
