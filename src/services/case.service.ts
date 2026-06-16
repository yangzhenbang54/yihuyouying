import { prisma } from '@/lib/prisma'
import { NotFoundError } from '@/lib/errors'

export const caseService = {
  async list(params: {
    page: number
    pageSize: number
    status?: string
    community?: string
  }) {
    const { page, pageSize, status, community } = params
    const skip = (page - 1) * pageSize

    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status
    }
    if (community) {
      where.elder = { community }
    }

    const [data, total] = await Promise.all([
      prisma.caseEvent.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          elder: true,
        },
      }),
      prisma.caseEvent.count({ where }),
    ])

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  },

  async getById(id: string) {
    const caseEvent = await prisma.caseEvent.findUnique({
      where: { id },
      include: { elder: true },
    })

    if (!caseEvent) {
      throw new NotFoundError('应急事件不存在')
    }

    return caseEvent
  },

  async create(data: {
    elderId: string
    triggerType: string
    description: string
    severity: number
    assigneeId: string
  }) {
    // Fetch elder to get community info
    const elder = await prisma.elderProfile.findUnique({ where: { id: data.elderId } })
    if (!elder) {
      throw new NotFoundError('老人档案不存在')
    }

    const caseEvent = await prisma.caseEvent.create({
      data: {
        elderId: data.elderId,
        triggerType: data.triggerType,
        description: data.description,
        severity: data.severity,
        assigneeId: data.assigneeId,
        status: 'open',
      },
    })

    return caseEvent
  },

  async update(
    id: string,
    data: {
      description?: string
      severity?: number
      assigneeId?: string
    }
  ) {
    const caseEvent = await prisma.caseEvent.findUnique({ where: { id } })
    if (!caseEvent) {
      throw new NotFoundError('应急事件不存在')
    }

    const updated = await prisma.caseEvent.update({
      where: { id },
      data,
    })

    return updated
  },

  async resolve(id: string) {
    const caseEvent = await prisma.caseEvent.findUnique({ where: { id } })
    if (!caseEvent) {
      throw new NotFoundError('应急事件不存在')
    }

    const updated = await prisma.caseEvent.update({
      where: { id },
      data: {
        status: 'resolved',
        resolvedAt: new Date().toISOString(),
      },
    })

    return updated
  },

  async escalate(id: string) {
    const caseEvent = await prisma.caseEvent.findUnique({ where: { id } })
    if (!caseEvent) {
      throw new NotFoundError('应急事件不存在')
    }

    const updated = await prisma.caseEvent.update({
      where: { id },
      data: { status: 'escalated' },
    })

    return updated
  },
}
