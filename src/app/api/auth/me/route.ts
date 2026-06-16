import { success, error } from '@/lib/api-response';
import { getAuthToken, verifyToken } from '@/lib/auth';
import { authService } from '@/services/auth.service';
import { AppError } from '@/lib/errors';

export async function GET() {
  try {
    const token = getAuthToken();

    if (!token) {
      return error('未登录', 401);
    }

    const payload = verifyToken(token);

    const user = await authService.getMe(payload.userId);

    return success(user);
  } catch (e) {
    if (e instanceof AppError) {
      return error(e.message, e.statusCode);
    }
    return error('获取用户信息失败，服务器内部错误', 500);
  }
}
