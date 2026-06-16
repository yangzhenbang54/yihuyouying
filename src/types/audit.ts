export interface AuditLog {
  id: string
  actorId: string
  actorName: string
  actorRole: string
  action: string
  resourceType: string
  resourceId: string
  ip: string
  createdAt: string
  isAbnormal: boolean
}
