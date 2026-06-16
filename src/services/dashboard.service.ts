import { prisma } from '@/lib/prisma'

export const dashboardService = {
  async getKpi() {
    const now = new Date()
    const nowISO = now.toISOString()

    const [
      totalElders,
      activeCards,
      completedTasks,
      pendingTasks,
      openCases,
      scheduledFollowups,
      completedFollowups,
    ] = await Promise.all([
      prisma.elderProfile.count(),
      prisma.emergencyCard.count({ where: { status: 'active' } }),
      prisma.task.count({ where: { status: 'done' } }),
      prisma.task.count({ where: { status: { in: ['todo', 'in_progress'] } } }),
      prisma.caseEvent.count({ where: { status: { in: ['open', 'escalated'] } } }),
      prisma.followupRecord.count({ where: { status: 'scheduled' } }),
      prisma.followupRecord.count({ where: { status: 'completed' } }),
    ])

    return {
      totalElders,
      activeCards,
      completedTasks,
      pendingTasks,
      openCases,
      scheduledFollowups,
      completedFollowups,
    }
  },

  async getTrends() {
    const now = new Date()
    const weeks: { start: Date; end: Date }[] = []

    // Generate last 12 week boundaries (Monday to Sunday)
    for (let i = 11; i >= 0; i--) {
      const monday = new Date(now)
      monday.setDate(monday.getDate() - monday.getDay() + 1 - i * 7)
      monday.setHours(0, 0, 0, 0)
      const sunday = new Date(monday)
      sunday.setDate(sunday.getDate() + 6)
      sunday.setHours(23, 59, 59, 999)
      weeks.push({ start: monday, end: sunday })
    }

    const trends = await Promise.all(
      weeks.map(async (week) => {
        const weekLabel = `${week.start.getMonth() + 1}/${week.start.getDate()}`

        const [profiles, cards, cases] = await Promise.all([
          prisma.elderProfile.count({
            where: {
              createdAt: {
                gte: week.start.toISOString(),
                lte: week.end.toISOString(),
              },
            },
          }),
          prisma.emergencyCard.count({
            where: {
              createdAt: {
                gte: week.start.toISOString(),
                lte: week.end.toISOString(),
              },
            },
          }),
          prisma.caseEvent.count({
            where: {
              createdAt: {
                gte: week.start.toISOString(),
                lte: week.end.toISOString(),
              },
            },
          }),
        ])

        return {
          week: weekLabel,
          profiles,
          cards,
          cases,
        }
      })
    )

    return trends
  },

  async getRiskDistribution() {
    const [high, medium, low] = await Promise.all([
      prisma.elderProfile.count({ where: { riskLevel: 'high' } }),
      prisma.elderProfile.count({ where: { riskLevel: 'medium' } }),
      prisma.elderProfile.count({ where: { riskLevel: 'low' } }),
    ])

    return [
      { name: '重点关注', value: high, color: '#ef4444' },
      { name: '中等关注', value: medium, color: '#f59e0b' },
      { name: '一般关注', value: low, color: '#0d9488' },
    ]
  },

  async getResponseTime() {
    // Get completed tasks with their createdAt and completedAt
    const completedTasks = await prisma.task.findMany({
      where: {
        status: 'done',
        completedAt: { not: null },
      },
      select: {
        createdAt: true,
        completedAt: true,
      },
      orderBy: { completedAt: 'desc' },
      take: 100,
    })

    // Calculate response times in minutes
    const responseTimes = completedTasks
      .map((t) => {
        const created = new Date(t.createdAt).getTime()
        const completed = new Date(t.completedAt!).getTime()
        return Math.round((completed - created) / 60000)
      })
      .sort((a, b) => a - b)

    if (responseTimes.length === 0) {
      return []
    }

    // Compute median and p90
    const mid = Math.floor(responseTimes.length / 2)
    const medianMinutes = responseTimes[mid]
    const p90Index = Math.floor(responseTimes.length * 0.9)
    const p90Minutes = responseTimes[Math.min(p90Index, responseTimes.length - 1)]

    const now = new Date()
    const dateLabel = `${now.getMonth() + 1}/${String(now.getDate()).padStart(2, '0')}`

    return [
      {
        date: dateLabel,
        medianMinutes,
        p90Minutes,
      },
    ]
  },
}
