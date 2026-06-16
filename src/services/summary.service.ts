import { prisma } from '@/lib/prisma'
import { NotFoundError, BadRequestError } from '@/lib/errors'

export const summaryService = {
  async generate(elderId: string) {
    const elder = await prisma.elderProfile.findUnique({ where: { id: elderId } })
    if (!elder) {
      throw new NotFoundError('老人档案不存在')
    }

    const contacts = await prisma.trustedContact.findMany({
      where: { elderId },
      orderBy: { priority: 'asc' },
    })

    // Rule engine: build structured summary JSON
    const content = {
      basicInfo: {
        name: elder.name,
        gender: elder.gender,
        age: elder.age,
        livingStatus: elder.livingStatus,
        community: elder.community,
        address: elder.address,
      },
      medicalProfile: {
        medicalHistory: elder.medicalHistory || '',
        emergencyNotes: elder.emergencyNotes || '',
        riskLevel: elder.riskLevel,
      },
      communication: {
        communicationPref: elder.communicationPref || '',
        carePref: elder.carePref || '',
        aidNeeds: elder.aidNeeds || '',
      },
      emergencyContacts: contacts.map((c) => ({
        name: c.name,
        relation: c.relation,
        phone: c.phone,
        priority: c.priority,
        verified: c.verifiedStatus === 'verified',
        canMakeDecision: c.canMakeDecision,
      })),
      generatedAt: new Date().toISOString(),
      status: elder.status,
    }

    // Determine version number
    const previousSummary = await prisma.summary.findFirst({
      where: { elderId },
      orderBy: { versionNo: 'desc' },
    })

    const newVersion = previousSummary ? parseInt(previousSummary.versionNo) + 1 : 1

    // Set review status based on rules:
    // - If riskLevel is 'high' or there are unverified contacts, set to 'draft'
    // - Otherwise set to 'pending_review'
    const hasUnverifiedContacts = contacts.some((c) => c.verifiedStatus !== 'verified')
    const reviewStatus =
      elder.riskLevel === 'high' || hasUnverifiedContacts ? 'draft' : 'pending_review'

    const summary = await prisma.summary.create({
      data: {
        elderId,
        content: JSON.stringify(content),
        versionNo: String(newVersion),
        reviewStatus,
      },
    })

    return summary
  },

  async getLatest(elderId: string) {
    const summary = await prisma.summary.findFirst({
      where: { elderId },
      orderBy: { createdAt: 'desc' },
    })

    return summary
  },

  async confirm(elderId: string, summaryId: string, reviewedBy: string) {
    const summary = await prisma.summary.findFirst({
      where: { id: summaryId, elderId },
    })

    if (!summary) {
      throw new NotFoundError('摘要记录不存在')
    }

    const updated = await prisma.summary.update({
      where: { id: summaryId },
      data: {
        reviewStatus: 'confirmed',
        reviewedBy,
        reviewedAt: new Date(),
      },
    })

    return updated
  },

  async reject(elderId: string, summaryId: string, reviewedBy: string) {
    const summary = await prisma.summary.findFirst({
      where: { id: summaryId, elderId },
    })

    if (!summary) {
      throw new NotFoundError('摘要记录不存在')
    }

    const updated = await prisma.summary.update({
      where: { id: summaryId },
      data: {
        reviewStatus: 'rejected',
        reviewedBy,
        reviewedAt: new Date(),
      },
    })

    return updated
  },
}
