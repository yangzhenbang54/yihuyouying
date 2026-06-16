import { success, error } from '@/lib/api-response'
import { dashboardService } from '@/services/dashboard.service'

export async function GET() {
  try {
    const data = await dashboardService.getRiskDistribution()
    return success(data)
  } catch (e) {
    return error('获取风险分布失败', 500)
  }
}
