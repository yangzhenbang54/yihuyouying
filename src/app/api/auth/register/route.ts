import { NextRequest } from 'next/server';
import { success, error } from '@/lib/api-response';
import { signToken, setAuthCookie, hashPassword } from '@/lib/auth';
import { authService } from '@/services/auth.service';
import { AppError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, password, role, organization } = body;

    if (!name || !phone || !password || !role) {
      return error('姓名、手机号、密码和角色为必填项', 400);
    }

    const hashedPassword = await hashPassword(password);

    const user = await authService.register({
      name,
      phone,
      password: hashedPassword,
      role,
      organization,
    });

    const token = signToken({ userId: user.id, role: user.role });
    setAuthCookie(token);

    return success(user);
  } catch (e: any) {
    console.error('Register error:', e?.message || e, e?.code);
    if (e instanceof AppError) {
      return error(e.message, e.statusCode);
    }
    return error(`注册失败: ${e?.message || '服务器内部错误'}`, 500);
  }
}
