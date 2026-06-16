import { NextRequest } from 'next/server'
import { success, paginated, error } from '@/lib/api-response'
import { AppError } from '@/lib/errors'
import { cardService } from '@/services/card.service'

async function getAuth(request: NextRequest) {
  const token = request.cookies.get('yhyy_token')?.value
  if (!token) throw new AppError('未登录', 401, 'UNAUTHORIZED')
  const { verifyToken } = await import('@/lib/auth')
  return verifyToken(token)
}

export async function GET(request: NextRequest) {
  try {
    await getAuth(request)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const result = await cardService.listAll(page, pageSize)
    return paginated(result.data, result.total, result.page, result.pageSize)
  } catch (e) {
    if (e instanceof AppError) return error(e.message, e.statusCode, e.code)
    return error('服务器内部错误', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    await getAuth(request)
    const body = await request.json()
    const { elderId, visibilityLevel, emergencyNote } = body
    const card = await cardService.create(elderId, { visibilityLevel, emergencyNote })
    return success(card, 201)
  } catch (e) {
    if (e instanceof AppError) {
      return error(e.message, e.statusCode, e.code)
    }
    return error('服务器内部错误', 500)
  }
}
