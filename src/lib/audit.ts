import { prisma } from './prisma'

export interface AuditLogInput {
  actorId: string
  actorName: string
  actorRole: string
  action: string
  resourceType: string
  resourceId: string
  ip?: string
  isAbnormal?: boolean
}

export async function writeAuditLog(params: AuditLogInput): Promise<void> {
  const {
    actorId,
    actorName,
    actorRole,
    action,
    resourceType,
    resourceId,
    ip = '',
    isAbnormal = false,
  } = params

  await prisma.auditLog.create({
    data: {
      actorId,
      actorName,
      actorRole,
      action,
      resourceType,
      resourceId,
      ip,
      isAbnormal,
    },
  })
}
