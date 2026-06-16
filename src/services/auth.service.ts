import { prisma } from '@/lib/prisma'
import { NotFoundError, UnauthorizedError, ConflictError } from '@/lib/errors'
import bcrypt from 'bcryptjs'

function excludePasswordHash<T extends { passwordHash?: string }>(user: T): Omit<T, 'passwordHash'> {
  const { passwordHash, ...rest } = user
  return rest
}

export const authService = {
  async login(phone: string, password: string) {
    const user = await prisma.user.findUnique({ where: { phone } })
    if (!user) {
      throw new UnauthorizedError('手机号未注册')
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      throw new UnauthorizedError('密码错误')
    }

    // Update lastLogin
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    return excludePasswordHash(user)
  },

  async register(data: {
    name: string
    phone: string
    password: string
    role: string
    organization?: string
  }) {
    const existingUser = await prisma.user.findUnique({ where: { phone: data.phone } })
    if (existingUser) {
      throw new ConflictError('该手机号已注册')
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        passwordHash: data.password, // already hashed by route handler
        role: data.role,
        organization: data.organization || '',
        status: 'active',
      },
    })

    return excludePasswordHash(user)
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new NotFoundError('用户不存在')
    }
    return excludePasswordHash(user)
  },

  async listUsers() {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return users.map(excludePasswordHash)
  },

  async updateUser(
    id: string,
    data: {
      name?: string
      role?: string
      organization?: string
      status?: 'active' | 'inactive'
    }
  ) {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
      throw new NotFoundError('用户不存在')
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
    })

    return excludePasswordHash(updated)
  },
}
