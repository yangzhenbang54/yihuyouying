import { NextRequest } from 'next/server';
import { success, error } from '@/lib/api-response';
import { signToken, setAuthCookie } from '@/lib/auth';
import { authService } from '@/services/auth.service';
import { AppError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return error('手机号和密码不能为空', 400);
    }

    const user = await authService.login(phone, password);

    const token = signToken({ userId: user.id, role: user.role });
    setAuthCookie(token);

    return success(user);
  } catch (e) {
    if (e instanceof AppError) {
      return error(e.message, e.statusCode);
    }
    return error('登录失败，服务器内部错误', 500);
  }
}
