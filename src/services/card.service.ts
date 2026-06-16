import { prisma } from '@/lib/prisma'
import { NotFoundError } from '@/lib/errors'
import crypto from 'crypto'

function generateCardNo(): string {
  const year = new Date().getFullYear().toString()
  const random = Math.floor(1000 + Math.random() * 9000).toString()
  return `YHY${year}${random}`
}

function generateQrToken(): string {
  return crypto.randomUUID()
}

export const cardService = {
  async getByElder(elderId: string) {
    const card = await prisma.emergencyCard.findFirst({
      where: {
        elderId,
        status: 'active',
      },
      orderBy: { createdAt: 'desc' },
    })

    return card
  },

  async getById(id: string) {
    const card = await prisma.emergencyCard.findUnique({
      where: { id },
      include: {
        elder: true,
        qrCode: true,
      },
    })

    if (!card) {
      throw new NotFoundError('安心联系卡不存在')
    }

    return card
  },

  async create(
    elderId: string,
    data?: {
      visibilityLevel?: string
      emergencyNote?: string
    }
  ) {
    const elder = await prisma.elderProfile.findUnique({ where: { id: elderId } })
    if (!elder) {
      throw new NotFoundError('老人档案不存在')
    }

    const cardNo = generateCardNo()
    const qrToken = generateQrToken()

    const card = await prisma.emergencyCard.create({
      data: {
        elderId,
        cardNo,
        qrToken,
        visibilityLevel: data?.visibilityLevel ?? 'contact',
        emergencyNote: data?.emergencyNote ?? '',
        status: 'active',
      },
    })

    // Create associated QrCode record
    await prisma.qrCode.create({
      data: {
        token: qrToken,
        cardId: card.id,
        scanCount: 0,
      },
    })

    return card
  },

  async revoke(id: string) {
    const card = await prisma.emergencyCard.findUnique({ where: { id } })
    if (!card) {
      throw new NotFoundError('安心联系卡不存在')
    }

    const updated = await prisma.emergencyCard.update({
      where: { id },
      data: { status: 'revoked' },
    })

    return updated
  },

  async listAll(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize
    const [data, total] = await Promise.all([
      prisma.emergencyCard.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { elder: true },
      }),
      prisma.emergencyCard.count(),
    ])
    return { data, total, page, pageSize }
  },

  async delete(id: string) {
    const card = await prisma.emergencyCard.findUnique({ where: { id } })
    if (!card) throw new NotFoundError('安心联系卡不存在')
    // Delete associated QR code first
    await prisma.qrCode.deleteMany({ where: { cardId: id } })
    return prisma.emergencyCard.delete({ where: { id } })
  },

  async regenerate(elderId: string) {
    const elder = await prisma.elderProfile.findUnique({ where: { id: elderId } })
    if (!elder) {
      throw new NotFoundError('老人档案不存在')
    }

    // Revoke any existing active cards
    await prisma.emergencyCard.updateMany({
      where: { elderId, status: 'active' },
      data: { status: 'revoked' },
    })

    // Create new card (same logic as create)
    const cardNo = generateCardNo()
    const qrToken = generateQrToken()

    const card = await prisma.emergencyCard.create({
      data: {
        elderId,
        cardNo,
        qrToken,
        visibilityLevel: 'contact',
        emergencyNote: '',
        status: 'active',
      },
    })

    await prisma.qrCode.create({
      data: {
        token: qrToken,
        cardId: card.id,
        scanCount: 0,
      },
    })

    return card
  },
}
