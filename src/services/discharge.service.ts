import { prisma } from '@/lib/prisma'
import { NotFoundError } from '@/lib/errors'

export const dischargeService = {
  async list(params: {
    page: number
    pageSize: number
    status?: string
    assigneeId?: string
  }) {
    const { page, pageSize, status, assigneeId } = params
    const skip = (page - 1) * pageSize

    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status
    }
    if (assigneeId) {
      where.assigneeId = assigneeId
    }

    const [data, total] = await Promise.all([
      prisma.dischargePlan.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          elder: true,
        },
      }),
      prisma.dischargePlan.count({ where }),
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
    const plan = await prisma.dischargePlan.findUnique({
      where: { id },
      include: { elder: true },
    })

    if (!plan) {
      throw new NotFoundError('出院计划不存在')
    }

    return plan
  },

  async create(data: {
    elderId: string
    caseId?: string
    hospitalName: string
    dischargeDate: string
    assigneeId: string
    notes?: string
    pickupStatus?: string
    medicationReminderStatus?: string
    revisitStatus?: string
    visitStatus?: string
  }) {
    const elder = await prisma.elderProfile.findUnique({ where: { id: data.elderId } })
    if (!elder) {
      throw new NotFoundError('老人档案不存在')
    }

    const plan = await prisma.dischargePlan.create({
      data: {
        elderId: data.elderId,
        caseId: data.caseId ?? '',
        hospitalName: data.hospitalName,
        dischargeDate: data.dischargeDate,
        assigneeId: data.assigneeId,
        notes: data.notes ?? '',
        pickupStatus: data.pickupStatus ?? 'pending',
        medicationReminderStatus: data.medicationReminderStatus ?? 'pending',
        revisitStatus: data.revisitStatus ?? 'pending',
        visitStatus: data.visitStatus ?? 'pending',
      },
    })

    return plan
  },

  async update(
    id: string,
    data: {
      hospitalName?: string
      dischargeDate?: string
      notes?: string
      pickupStatus?: string
      medicationReminderStatus?: string
      revisitStatus?: string
      visitStatus?: string
      assigneeId?: string
    }
  ) {
    const plan = await prisma.dischargePlan.findUnique({ where: { id } })
    if (!plan) {
      throw new NotFoundError('出院计划不存在')
    }

    const updated = await prisma.dischargePlan.update({
      where: { id },
      data,
    })

    return updated
  },

  async updateStatus(id: string, field: string, value: string) {
    const plan = await prisma.dischargePlan.findUnique({ where: { id } })
    if (!plan) {
      throw new NotFoundError('出院计划不存在')
    }

    const updated = await prisma.dischargePlan.update({
      where: { id },
      data: {
        [field]: value,
      },
    })

    return updated
  },
}
