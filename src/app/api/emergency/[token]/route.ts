import { NextRequest } from 'next/server'
import { success, error } from '@/lib/api-response'
import { AppError } from '@/lib/errors'
import { emergencyService } from '@/services/emergency.service'

// GET only - no auth required (public emergency QR code access)
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const data = await emergencyService.getByToken(params.token)
    return success(data)
  } catch (e) {
    if (e instanceof AppError) {
      return error(e.message, e.statusCode, e.code)
    }
    return error('服务器内部错误', 500)
  }
}
