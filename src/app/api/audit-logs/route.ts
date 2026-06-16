import { NextRequest } from 'next/server'
import { paginated, error } from '@/lib/api-response'
import { AppError } from '@/lib/errors'
import { auditService } from '@/services/audit.service'

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
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)
    const action = searchParams.get('action') || undefined
    const actorId = searchParams.get('actorId') || undefined
    const resourceType = searchParams.get('resourceType') || undefined

    const result = await auditService.list({ page, pageSize, action, actorId, resourceType })
    return paginated(result.data, result.total, result.page, result.pageSize)
  } catch (e) {
    if (e instanceof AppError) {
      return error(e.message, e.statusCode, e.code)
    }
    return error('服务器内部错误', 500)
  }
}
