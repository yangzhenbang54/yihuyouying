export interface TrustedContact {
  id: string
  elderId: string
  name: string
  relation: string
  phone: string
  priority: number
  verifiedStatus: 'verified' | 'pending' | 'invalid'
  canMakeDecision: boolean
}
