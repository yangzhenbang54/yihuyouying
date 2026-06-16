import { prisma } from '@/lib/prisma'
import { NotFoundError } from '@/lib/errors'

export const followupService = {
  async list(params: {
    page: number
    pageSize: number
    status?: string
  }) {
    const { page, pageSize, status } = params
    const skip = (page - 1) * pageSize

    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status
    }

    const [data, total] = await Promise.all([
      prisma.followupRecord.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          elder: true,
        },
      }),
      prisma.followupRecord.count({ where }),
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
    const record = await prisma.followupRecord.findUnique({
      where: { id },
      include: { elder: true },
    })

    if (!record) {
      throw new NotFoundError('回访记录不存在')
    }

    return record
  },

  async create(data: {
    elderId: string
    type: string
    scheduledDate: string
    assigneeId: string
    caseId?: string
    nextAction?: string
    note?: string
  }) {
    const elder = await prisma.elderProfile.findUnique({ where: { id: data.elderId } })
    if (!elder) {
      throw new NotFoundError('老人档案不存在')
    }

    const record = await prisma.followupRecord.create({
      data: {
        elderId: data.elderId,
        type: data.type,
        scheduledDate: data.scheduledDate,
        assigneeId: data.assigneeId,
        caseId: data.caseId ?? null,
        nextAction: data.nextAction ?? '',
        result: '',
        status: 'scheduled',
      },
    })

    return record
  },

  async complete(id: string, result: string, satisfaction?: number) {
    const record = await prisma.followupRecord.findUnique({ where: { id } })
    if (!record) {
      throw new NotFoundError('回访记录不存在')
    }

    const updated = await prisma.followupRecord.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date().toISOString(),
        result,
        satisfaction: satisfaction ?? null,
      },
    })

    return updated
  },

  async markMissed(id: string) {
    const record = await prisma.followupRecord.findUnique({ where: { id } })
    if (!record) {
      throw new NotFoundError('回访记录不存在')
    }

    const updated = await prisma.followupRecord.update({
      where: { id },
      data: { status: 'missed' },
    })

    return updated
  },
}
