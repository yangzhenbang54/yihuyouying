import { NextRequest } from 'next/server'
import { success, error } from '@/lib/api-response'
import { AppError } from '@/lib/errors'
import { followupService } from '@/services/followup.service'

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
    const record = await followupService.getById(params.id)
    return success(record)
  } catch (e) {
    if (e instanceof AppError) {
      return error(e.message, e.statusCode, e.code)
    }
    return error('服务器内部错误', 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await getAuth(request)
    const body = await request.json()
    let record

    if (body.action === 'complete') {
      record = await followupService.complete(params.id, body.result, body.satisfaction)
    } else if (body.action === 'markMissed') {
      record = await followupService.markMissed(params.id)
    } else {
      return error('不支持的操作', 400)
    }

    return success(record)
  } catch (e) {
    if (e instanceof AppError) {
      return error(e.message, e.statusCode, e.code)
    }
    return error('服务器内部错误', 500)
  }
}
