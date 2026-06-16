import { prisma } from '@/lib/prisma'

export const auditService = {
  async list(params: {
    page: number
    pageSize: number
    action?: string
    actorId?: string
    resourceType?: string
  }) {
    const { page, pageSize, action, actorId, resourceType } = params
    const skip = (page - 1) * pageSize

    const where: Record<string, unknown> = {}

    if (action) {
      where.action = action
    }
    if (actorId) {
      where.actorId = actorId
    }
    if (resourceType) {
      where.resourceType = resourceType
    }

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count({ where }),
    ])

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  },

  async create(data: {
    actorId: string
    actorName: string
    actorRole: string
    action: string
    resourceType: string
    resourceId: string
    ip?: string
    isAbnormal?: boolean
  }) {
    const log = await prisma.auditLog.create({
      data: {
        actorId: data.actorId,
        actorName: data.actorName,
        actorRole: data.actorRole,
        action: data.action,
        resourceType: data.resourceType,
        resourceId: data.resourceId,
        ip: data.ip ?? '',
        isAbnormal: data.isAbnormal ?? false,
      },
    })

    return log
  },
}
