import { NextRequest } from 'next/server'
import { success, error } from '@/lib/api-response'
import { AppError } from '@/lib/errors'
import { cardService } from '@/services/card.service'

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
    const card = await cardService.getById(params.id)
    return success(card)
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
    // If action is 'revoke', call revoke; otherwise update
    if (body.action === 'revoke') {
      const card = await cardService.revoke(params.id)
      return success(card)
    }
    return error('不支持的操作', 400)
  } catch (e) {
    if (e instanceof AppError) {
      return error(e.message, e.statusCode, e.code)
    }
    return error('服务器内部错误', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await getAuth(request)
    await cardService.delete(params.id)
    return success({ deleted: true })
  } catch (e) {
    if (e instanceof AppError) {
      return error(e.message, e.statusCode, e.code)
    }
    return error('服务器内部错误', 500)
  }
}
