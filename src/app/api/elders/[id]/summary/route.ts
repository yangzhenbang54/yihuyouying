import { NextRequest } from 'next/server'
import { success, error } from '@/lib/api-response'
import { AppError } from '@/lib/errors'
import { summaryService } from '@/services/summary.service'

async function getAuth(request: NextRequest) {
  const token = request.cookies.get('yhyy_token')?.value
  if (!token) throw new AppError('未登录', 401, 'UNAUTHORIZED')
  const { verifyToken } = await import('@/lib/auth')
  return verifyToken(token)
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await getAuth(request)
    const summary = await summaryService.getLatest(params.id)
    return success(summary)
  } catch (e) {
    if (e instanceof AppError) {
      return error(e.message, e.statusCode, e.code)
    }
    return error('服务器内部错误', 500)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuth(request)
    const body = await request.json()
    const { action, reviewedBy } = body
    const reviewer = reviewedBy || user.userId

    if (action === 'confirm') {
      const summary = await summaryService.confirm(params.id, body.summaryId, reviewer)
      return success(summary)
    }
    if (action === 'reject') {
      const summary = await summaryService.reject(params.id, body.summaryId, reviewer)
      return success(summary)
    }

    return error('不支持的操作', 400)
  } catch (e) {
    if (e instanceof AppError) {
      return error(e.message, e.statusCode, e.code)
    }
    return error('服务器内部错误', 500)
  }
}
