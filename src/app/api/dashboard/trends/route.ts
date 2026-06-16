import { NextRequest } from 'next/server'
import { success, error } from '@/lib/api-response'
import { AppError } from '@/lib/errors'
import { dashboardService } from '@/services/dashboard.service'

async function getAuth(request: NextRequest) {
  const token = request.cookies.get('yhyy_token')?.value
  if (!token) throw new AppError('未登录', 401, 'UNAUTHORIZED')
  const { verifyToken } = await import('@/lib/auth')
  return verifyToken(token)
}

export async function GET(request: NextRequest) {
  try {
    await getAuth(request)
    const trends = await dashboardService.getTrends()
    return success(trends)
  } catch (e) {
    if (e instanceof AppError) {
      return error(e.message, e.statusCode, e.code)
    }
    return error('服务器内部错误', 500)
  }
}
