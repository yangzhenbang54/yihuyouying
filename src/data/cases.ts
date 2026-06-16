import { CaseEvent } from '@/types/case'
import { CaseStatus, Priority } from '@/types/common'

export const mockCases: CaseEvent[] = [
  { id: 'case1', elderId: 'e2', elderName: '李大勇', community: '东山社区', triggerType: 'scan', description: '张大爷因胸痛被邻居送至市中心医院急诊，医院社工扫码获取紧急联系人信息', status: CaseStatus.OPEN, severity: Priority.URGENT, assigneeId: 'u6', assigneeName: '陈志愿者', createdAt: '2024-12-17' },
  { id: 'case2', elderId: 'e5', elderName: '赵文英', community: '雨花社区', triggerType: 'manual', description: '赵奶奶因血糖控制不佳住院治疗，现已准备出院', status: CaseStatus.OPEN, severity: Priority.HIGH, assigneeId: 'u5', assigneeName: '刘社工', createdAt: '2024-12-16' },
  { id: 'case3', elderId: 'e1', elderName: '张秀英', community: '雨花社区', triggerType: 'followup', description: '回访中张奶奶反馈近期血压不稳定，已建议就医', status: CaseStatus.RESOLVED, severity: Priority.MEDIUM, assigneeId: 'u5', assigneeName: '刘社工', createdAt: '2024-12-10', resolvedAt: '2024-12-12' },
  { id: 'case4', elderId: 'e8', elderName: '周大爷', community: '雨花社区', triggerType: 'scan', description: '周大爷在家摔倒，邻居拨打120，医院社工扫码联系其女儿', status: CaseStatus.RESOLVED, severity: Priority.URGENT, assigneeId: 'u5', assigneeName: '刘社工', createdAt: '2024-12-01', resolvedAt: '2024-12-05' },
  { id: 'case5', elderId: 'e15', elderName: '金婆婆', community: '东山社区', triggerType: 'manual', description: '金婆婆向社区反映冬季生活困难，需要物资支持', status: CaseStatus.OPEN, severity: Priority.HIGH, assigneeId: 'u6', assigneeName: '陈志愿者', createdAt: '2024-12-14' },
  { id: 'case6', elderId: 'e11', elderName: '冯奶奶', community: '雨花社区', triggerType: 'followup', description: '冯奶奶表示康复训练效果不理想，希望调整方案', status: CaseStatus.RESOLVED, severity: Priority.MEDIUM, assigneeId: 'u5', assigneeName: '刘社工', createdAt: '2024-12-05', resolvedAt: '2024-12-09' },
  { id: 'case7', elderId: 'e4', elderName: '张德明', community: '玄武湖社区', triggerType: 'manual', description: '张大爷反映冬季取暖设备故障', status: CaseStatus.CLOSED, severity: Priority.MEDIUM, assigneeId: 'u7', assigneeName: '赵社工', createdAt: '2024-11-28', resolvedAt: '2024-12-01' },
  { id: 'case8', elderId: 'e13', elderName: '许阿姨', community: '玄武湖社区', triggerType: 'scan', description: '许阿姨在社区活动时突感不适，志愿者扫码查看信息', status: CaseStatus.RESOLVED, severity: Priority.HIGH, assigneeId: 'u7', assigneeName: '赵社工', createdAt: '2024-12-08', resolvedAt: '2024-12-09' },
]
