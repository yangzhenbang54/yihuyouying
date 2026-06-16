import { success, error } from '@/lib/api-response';
import { clearAuthCookie } from '@/lib/auth';
import { AppError } from '@/lib/errors';

export async function POST() {
  try {
    clearAuthCookie();
    return success({ logout: true });
  } catch (e) {
    if (e instanceof AppError) {
      return error(e.message, e.statusCode);
    }
    return error('退出登录失败，服务器内部错误', 500);
  }
}
