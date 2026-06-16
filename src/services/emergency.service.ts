import { prisma } from '@/lib/prisma'
import { NotFoundError } from '@/lib/errors'

export const emergencyService = {
  async getByToken(token: string) {
    // Find QR code by token
    const qrCode = await prisma.qrCode.findUnique({
      where: { token },
      include: {
        card: {
          include: {
            elder: {
              include: {
                contacts: {
                  orderBy: { priority: 'asc' },
                },
              },
            },
          },
        },
      },
    })

    if (!qrCode) {
      throw new NotFoundError('无效的二维码')
    }

    // Increment scan count and update lastScannedAt
    await prisma.qrCode.update({
      where: { id: qrCode.id },
      data: {
        scanCount: qrCode.scanCount + 1,
        lastScannedAt: new Date().toISOString(),
      },
    })

    const { card } = qrCode
    if (!card || !card.elder) {
      throw new NotFoundError('关联数据不存在')
    }

    const { elder } = card

    // Return only emergency-safe data (no sensitive medical details)
    return {
      cardNo: card.cardNo,
      emergencyNote: card.emergencyNote,
      elder: {
        name: elder.name,
        community: elder.community,
        carePref: elder.carePref || '',
      },
      contacts: elder.contacts.map((c) => ({
        name: c.name,
        relation: c.relation,
        phone: c.phone,
        priority: c.priority,
      })),
    }
  },
}
