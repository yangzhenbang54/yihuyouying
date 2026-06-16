import { FollowupType } from '@/types/common'

export interface FollowupRecord {
  id: string
  elderId: string
  elderName: string
  caseId?: string
  type: FollowupType
  status: 'scheduled' | 'completed' | 'missed'
  scheduledDate: string
  completedAt?: string
  result: string
  satisfaction?: number
  nextAction: string
  assigneeId: string
  assigneeName: string
  createdAt: string
}

export const mockFollowups: FollowupRecord[] = [
  { id: 'f1', elderId: 'e1', elderName: '张秀英', type: FollowupType.PHONE, status: 'scheduled', scheduledDate: '2024-12-25', result: '', nextAction: '更新档案信息', assigneeId: 'u5', assigneeName: '刘社工', createdAt: '2024-12-15' },
  { id: 'f2', elderId: 'e2', elderName: '李大勇', caseId: 'case1', type: FollowupType.VISIT, status: 'scheduled', scheduledDate: '2024-12-21', result: '', nextAction: '评估出院后恢复情况', assigneeId: 'u6', assigneeName: '陈志愿者', createdAt: '2024-12-17' },
  { id: 'f3', elderId: 'e5', elderName: '赵文英', caseId: 'case2', type: FollowupType.PHONE, status: 'scheduled', scheduledDate: '2024-12-23', result: '', nextAction: '了解血糖控制情况', assigneeId: 'u5', assigneeName: '刘社工', createdAt: '2024-12-16' },
  { id: 'f4', elderId: 'e8', elderName: '周大爷', caseId: 'case4', type: FollowupType.VISIT, status: 'completed', scheduledDate: '2024-12-08', completedAt: '2024-12-08', result: '恢复良好，女儿已安排定期陪护', satisfaction: 5, nextAction: '下月常规回访', assigneeId: 'u5', assigneeName: '刘社工', createdAt: '2024-12-05' },
  { id: 'f5', elderId: 'e11', elderName: '冯奶奶', caseId: 'case6', type: FollowupType.VISIT, status: 'completed', scheduledDate: '2024-12-12', completedAt: '2024-12-12', result: '康复训练进行中，左侧肢体活动有所改善', satisfaction: 4, nextAction: '调整康复方案，两周后复查', assigneeId: 'u5', assigneeName: '刘社工', createdAt: '2024-12-09' },
  { id: 'f6', elderId: 'e13', elderName: '许阿姨', type: FollowupType.PHONE, status: 'completed', scheduledDate: '2024-12-10', completedAt: '2024-12-10', result: '身体状况稳定，冬季保暖物资已到位', satisfaction: 5, nextAction: '下月电话回访', assigneeId: 'u7', assigneeName: '赵社工', createdAt: '2024-12-08' },
  { id: 'f7', elderId: 'e15', elderName: '金婆婆', type: FollowupType.VISIT, status: 'missed', scheduledDate: '2024-12-11', result: '未能联系到金婆婆，正在协调同乡志愿者配合', nextAction: '协调同乡志愿者再次上门', assigneeId: 'u6', assigneeName: '陈志愿者', createdAt: '2024-12-09' },
  { id: 'f8', elderId: 'e4', elderName: '张德明', type: FollowupType.PHONE, status: 'scheduled', scheduledDate: '2024-12-28', result: '', nextAction: '关注冬季呼吸道健康', assigneeId: 'u7', assigneeName: '赵社工', createdAt: '2024-12-17' },
  { id: 'f9', elderId: 'e3', elderName: '王淑芬', type: FollowupType.PHONE, status: 'completed', scheduledDate: '2024-12-05', completedAt: '2024-12-05', result: '健康状况良好，老伴陪伴充足', satisfaction: 5, nextAction: '三个月后回访', assigneeId: 'u5', assigneeName: '刘社工', createdAt: '2024-12-01' },
  { id: 'f10', elderId: 'e12', elderName: '曹大爷', type: FollowupType.PHONE, status: 'scheduled', scheduledDate: '2024-12-27', result: '', nextAction: '了解糖尿病管理情况', assigneeId: 'u6', assigneeName: '陈志愿者', createdAt: '2024-12-17' },
]
