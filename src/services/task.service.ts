import { prisma } from '@/lib/prisma'
import { NotFoundError } from '@/lib/errors'

export const taskService = {
  async list(params: {
    page: number
    pageSize: number
    status?: string
    taskType?: string
    assigneeId?: string
    userId?: string
    role?: string
  }) {
    const { page, pageSize, status, taskType, assigneeId } = params
    const skip = (page - 1) * pageSize

    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status
    }
    if (taskType) {
      where.taskType = taskType
    }
    if (assigneeId) {
      where.assigneeId = assigneeId
    }

    const [data, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          elder: true,
        },
      }),
      prisma.task.count({ where }),
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
    const task = await prisma.task.findUnique({
      where: { id },
      include: { elder: true },
    })

    if (!task) {
      throw new NotFoundError('任务不存在')
    }

    return task
  },

  async create(data: {
    elderId: string
    taskType: string
    title: string
    description?: string
    assigneeId: string
    dueDate?: string
    priority?: number
  }) {
    const task = await prisma.task.create({
      data: {
        elderId: data.elderId,
        taskType: data.taskType,
        title: data.title,
        description: data.description ?? '',
        assigneeId: data.assigneeId,
        dueDate: data.dueDate ?? '',
        status: 'todo',
        priority: data.priority ?? 2,
      },
    })

    return task
  },

  async update(
    id: string,
    data: {
      title?: string
      description?: string
      status?: string
      priority?: number
      assigneeId?: string
      dueDate?: string
      taskType?: string
    }
  ) {
    const task = await prisma.task.findUnique({ where: { id } })
    if (!task) {
      throw new NotFoundError('任务不存在')
    }

    const updated = await prisma.task.update({
      where: { id },
      data,
    })

    return updated
  },

  async complete(id: string, note?: string) {
    const task = await prisma.task.findUnique({ where: { id } })
    if (!task) {
      throw new NotFoundError('任务不存在')
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        status: 'done',
        completedAt: new Date().toISOString(),
        completionNote: note ?? '',
      },
    })

    return updated
  },
}
