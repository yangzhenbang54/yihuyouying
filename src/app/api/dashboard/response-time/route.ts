import { success, error } from '@/lib/api-response'
import { dashboardService } from '@/services/dashboard.service'

export async function GET() {
  try {
    const data = await dashboardService.getResponseTime()
    return success(data)
  } catch (e) {
    return error('获取响应时间数据失败', 500)
  }
}
