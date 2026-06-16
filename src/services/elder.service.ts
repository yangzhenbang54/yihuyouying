import { prisma } from '@/lib/prisma'
import { NotFoundError, ForbiddenError } from '@/lib/errors'

export const elderService = {
  async list(params: {
    page: number
    pageSize: number
    community?: string
    riskLevel?: string
    userId?: string
    role?: string
  }) {
    const { page, pageSize, community, riskLevel, userId, role } = params
    const skip = (page - 1) * pageSize

    // Build where clause with role-based filtering
    const where: Record<string, unknown> = {}

    // Community workers see only their community's elders
    if (role === 'community' && userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (user?.community) {
        where.community = user.community
      }
    }

    // Explicit community filter (overrides role-based if admin)
    if (community) {
      where.community = community
    }

    if (riskLevel) {
      where.riskLevel = riskLevel
    }

    const [data, total] = await Promise.all([
      prisma.elderProfile.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
        include: {
          contacts: true,
          cards: true,
        },
      }),
      prisma.elderProfile.count({ where }),
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
    const elder = await prisma.elderProfile.findUnique({
      where: { id },
      include: {
        contacts: true,
        cards: true,
        caseEvents: true,
        tasks: true,
      },
    })

    if (!elder) {
      throw new NotFoundError('老人档案不存在')
    }

    return elder
  },

  async create(
    data: {
      name: string
      gender: string
      age: number
      livingStatus: string
      community: string
      address: string
      phone?: string
      medicalHistory?: string
      emergencyNotes?: string
      communicationPref?: string
      carePref?: string
      aidNeeds?: string
    },
    userId: string
  ) {
    const elder = await prisma.elderProfile.create({
      data: {
        ...data,
        status: 'draft',
        riskLevel: 'medium',
        createdById: userId,
      },
    })

    return elder
  },

  async update(
    id: string,
    data: {
      name?: string
      gender?: string
      age?: number
      livingStatus?: string
      community?: string
      address?: string
      phone?: string
      medicalHistory?: string
      emergencyNotes?: string
      communicationPref?: string
      carePref?: string
      aidNeeds?: string
      status?: string
      riskLevel?: string
    }
  ) {
    const elder = await prisma.elderProfile.findUnique({ where: { id } })
    if (!elder) {
      throw new NotFoundError('老人档案不存在')
    }

    const updated = await prisma.elderProfile.update({
      where: { id },
      data,
    })

    return updated
  },

  async softDelete(id: string) {
    const elder = await prisma.elderProfile.findUnique({ where: { id } })
    if (!elder) {
      throw new NotFoundError('老人档案不存在')
    }

    const updated = await prisma.elderProfile.update({
      where: { id },
      data: { status: 'expired' },
    })

    return updated
  },
}
