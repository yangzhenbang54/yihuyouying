export interface DischargePlan {
  id: string
  elderId: string
  elderName: string
  caseId: string
  hospitalName: string
  dischargeDate: string
  pickupStatus: 'completed' | 'pending' | 'not_needed'
  medicationReminderStatus: 'completed' | 'pending' | 'not_needed'
  revisitStatus: 'completed' | 'pending' | 'not_needed'
  visitStatus: 'completed' | 'pending' | 'not_needed'
  assigneeId: string
  assigneeName: string
  notes: string
  createdAt: string
}

export const mockDischarges: DischargePlan[] = [
  { id: 'd1', elderId: 'e2', elderName: '李大勇', caseId: 'case1', hospitalName: '市中心医院', dischargeDate: '2024-12-20', pickupStatus: 'pending', medicationReminderStatus: 'pending', revisitStatus: 'pending', visitStatus: 'pending', assigneeId: 'u6', assigneeName: '陈志愿者', notes: '需安排车辆接送，出院后需社区志愿者定期探访', createdAt: '2024-12-17' },
  { id: 'd2', elderId: 'e5', elderName: '赵文英', caseId: 'case2', hospitalName: '市第一人民医院', dischargeDate: '2024-12-20', pickupStatus: 'completed', medicationReminderStatus: 'pending', revisitStatus: 'pending', visitStatus: 'not_needed', assigneeId: 'u5', assigneeName: '刘社工', notes: '子女已安排接送，需提醒出院用药注意事项', createdAt: '2024-12-16' },
  { id: 'd3', elderId: 'e8', elderName: '周大爷', caseId: 'case4', hospitalName: '市中医院', dischargeDate: '2024-12-06', pickupStatus: 'completed', medicationReminderStatus: 'completed', revisitStatus: 'completed', visitStatus: 'completed', assigneeId: 'u5', assigneeName: '刘社工', notes: '女儿已全程陪同，出院后恢复良好', createdAt: '2024-12-02' },
  { id: 'd4', elderId: 'e11', elderName: '冯奶奶', caseId: 'case6', hospitalName: '市中心医院', dischargeDate: '2024-12-10', pickupStatus: 'completed', medicationReminderStatus: 'completed', revisitStatus: 'completed', visitStatus: 'pending', assigneeId: 'u5', assigneeName: '刘社工', notes: '儿子已安排接送，需要持续关注康复训练', createdAt: '2024-12-06' },
]
