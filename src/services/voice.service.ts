import { prisma } from '@/lib/prisma'
import { NotFoundError } from '@/lib/errors'

export const voiceService = {
  async saveTranscript(
    elderId: string,
    fieldName: string,
    transcript: string,
    confidence?: number,
    durationMs?: number
  ) {
    const elder = await prisma.elderProfile.findUnique({ where: { id: elderId } })
    if (!elder) {
      throw new NotFoundError('老人档案不存在')
    }

    const record = await prisma.voiceRecord.create({
      data: {
        elderId,
        fieldName,
        transcript,
        confidence: confidence ?? null,
        durationMs: durationMs ?? null,
      },
    })

    return record
  },

  async getByElder(elderId: string) {
    const records = await prisma.voiceRecord.findMany({
      where: { elderId },
      orderBy: { createdAt: 'desc' },
    })

    return records
  },
}
