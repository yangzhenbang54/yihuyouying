import { NextRequest } from 'next/server'
import { success, error } from '@/lib/api-response'
import { AppError } from '@/lib/errors'
import { voiceService } from '@/services/voice.service'

async function getAuth(request: NextRequest) {
  const token = request.cookies.get('yhyy_token')?.value
  if (!token) throw new AppError('未登录', 401, 'UNAUTHORIZED')
  const { verifyToken } = await import('@/lib/auth')
  return verifyToken(token)
}

export async function POST(request: NextRequest) {
  try {
    await getAuth(request)
    const body = await request.json()
    const { elderId, fieldName, transcript, confidence, durationMs } = body
    const record = await voiceService.saveTranscript(elderId, fieldName, transcript, confidence, durationMs)
    return success(record, 201)
  } catch (e) {
    if (e instanceof AppError) {
      return error(e.message, e.statusCode, e.code)
    }
    return error('服务器内部错误', 500)
  }
}
