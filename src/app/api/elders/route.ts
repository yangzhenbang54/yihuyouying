import { NextRequest } from 'next/server'
import { success, paginated, error } from '@/lib/api-response'
import { AppError } from '@/lib/errors'
import { elderService } from '@/services/elder.service'

async function getAuth(request: NextRequest) {
  const token = request.cookies.get('yhyy_token')?.value
  if (!token) throw new AppError('未登录', 401, 'UNAUTHORIZED')
  const { verifyToken } = await import('@/lib/auth')
  return verifyToken(token)
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuth(request)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)
    const community = searchParams.get('community') || undefined
    const riskLevel = searchParams.get('riskLevel') || undefined

    const result = await elderService.list({
      page,
      pageSize,
      community,
      riskLevel,
      userId: user.userId,
      role: user.role,
    })

    return paginated(result.data, result.total, result.page, result.pageSize)
  } catch (e) {
    if (e instanceof AppError) {
      return error(e.message, e.statusCode, e.code)
    }
    return error('服务器内部错误', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuth(request)
    const body = await request.json()
    const elder = await elderService.create(body, user.userId)
    return success(elder, 201)
  } catch (e) {
    if (e instanceof AppError) {
      return error(e.message, e.statusCode, e.code)
    }
    return error('服务器内部错误', 500)
  }
}
