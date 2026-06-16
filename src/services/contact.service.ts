import { prisma } from '@/lib/prisma'
import { NotFoundError } from '@/lib/errors'

export const contactService = {
  async listAll(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize
    const [data, total] = await Promise.all([
      prisma.trustedContact.findMany({
        skip,
        take: pageSize,
        orderBy: { priority: 'asc' },
      }),
      prisma.trustedContact.count(),
    ])
    return { data, total, page, pageSize }
  },

  async listByElder(elderId: string) {
    const contacts = await prisma.trustedContact.findMany({
      where: { elderId },
      orderBy: { priority: 'asc' },
    })
    return contacts
  },

  async create(
    elderId: string,
    data: {
      name: string
      relation: string
      phone: string
      priority: number
      canMakeDecision?: boolean
    }
  ) {
    const elder = await prisma.elderProfile.findUnique({ where: { id: elderId } })
    if (!elder) {
      throw new NotFoundError('老人档案不存在')
    }

    const contact = await prisma.trustedContact.create({
      data: {
        elderId,
        name: data.name,
        relation: data.relation,
        phone: data.phone,
        priority: data.priority,
        canMakeDecision: data.canMakeDecision ?? false,
        verifiedStatus: 'pending',
      },
    })

    return contact
  },

  async update(
    id: string,
    data: {
      name?: string
      relation?: string
      phone?: string
      priority?: number
      canMakeDecision?: boolean
    }
  ) {
    const contact = await prisma.trustedContact.findUnique({ where: { id } })
    if (!contact) {
      throw new NotFoundError('联系人不存在')
    }

    const updated = await prisma.trustedContact.update({
      where: { id },
      data,
    })

    return updated
  },

  async delete(id: string) {
    const contact = await prisma.trustedContact.findUnique({ where: { id } })
    if (!contact) {
      throw new NotFoundError('联系人不存在')
    }

    await prisma.trustedContact.delete({ where: { id } })
  },

  async verify(id: string, status: 'verified' | 'invalid') {
    const contact = await prisma.trustedContact.findUnique({ where: { id } })
    if (!contact) {
      throw new NotFoundError('联系人不存在')
    }

    const updated = await prisma.trustedContact.update({
      where: { id },
      data: { verifiedStatus: status },
    })

    return updated
  },
}
