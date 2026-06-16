import { AuditLog } from '@/types/audit'

export const mockAudits: AuditLog[] = [
  { id: 'a1', actorId: 'u8', actorName: '周医生', actorRole: 'hospital_sw', action: '扫描查看', resourceType: 'emergency_card', resourceId: 'card1', ip: '192.168.1.100', createdAt: '2024-12-17T10:23:00', isAbnormal: false },
  { id: 'a2', actorId: 'u5', actorName: '刘社工', actorRole: 'community', action: '查看档案', resourceType: 'elder_profile', resourceId: 'e2', ip: '192.168.1.50', createdAt: '2024-12-17T09:15:00', isAbnormal: false },
  { id: 'a3', actorId: 'u5', actorName: '刘社工', actorRole: 'community', action: '修改档案', resourceType: 'elder_profile', resourceId: 'e1', ip: '192.168.1.50', createdAt: '2024-12-17T08:30:00', isAbnormal: false },
  { id: 'a4', actorId: 'u6', actorName: '陈志愿者', actorRole: 'community', action: '创建工单', resourceType: 'task', resourceId: 't2', ip: '192.168.1.51', createdAt: '2024-12-17T10:05:00', isAbnormal: false },
  { id: 'a5', actorId: 'u8', actorName: '周医生', actorRole: 'hospital_sw', action: '扫描查看', resourceType: 'emergency_card', resourceId: 'card2', ip: '192.168.1.100', createdAt: '2024-12-17T09:45:00', isAbnormal: false },
  { id: 'a6', actorId: 'u12', actorName: '马管理员', actorRole: 'admin', action: '导出报表', resourceType: 'dashboard', resourceId: 'overview', ip: '192.168.1.10', createdAt: '2024-12-16T17:00:00', isAbnormal: false },
  { id: 'a7', actorId: 'u12', actorName: '马管理员', actorRole: 'admin', action: '修改角色', resourceType: 'user', resourceId: 'u6', ip: '192.168.1.10', createdAt: '2024-12-16T14:20:00', isAbnormal: false },
  { id: 'a8', actorId: 'u3', actorName: '王阿姨', actorRole: 'family', action: '查看档案', resourceType: 'elder_profile', resourceId: 'e1', ip: '192.168.1.200', createdAt: '2024-12-16T10:30:00', isAbnormal: false },
  { id: 'a9', actorId: 'u6', actorName: '陈志愿者', actorRole: 'community', action: '多项批量查看', resourceType: 'elder_profile', resourceId: 'e1,e2,e3,e4,e5,e6,e7,e8', ip: '192.168.1.51', createdAt: '2024-12-15T23:15:00', isAbnormal: true },
  { id: 'a10', actorId: 'u11', actorName: '益心公益', actorRole: 'provider', action: '查看档案', resourceType: 'elder_profile', resourceId: 'e11', ip: '192.168.1.150', createdAt: '2024-12-15T14:00:00', isAbnormal: false },
  { id: 'a11', actorId: 'u5', actorName: '刘社工', actorRole: 'community', action: '生成卡片', resourceType: 'emergency_card', resourceId: 'card11', ip: '192.168.1.50', createdAt: '2024-12-15T11:00:00', isAbnormal: false },
  { id: 'a12', actorId: 'u7', actorName: '赵社工', actorRole: 'community', action: '导出档案', resourceType: 'elder_profile', resourceId: 'e13', ip: '192.168.1.52', createdAt: '2024-12-14T16:30:00', isAbnormal: false },
  { id: 'a13', actorId: 'u9', actorName: '吴护士', actorRole: 'hospital_sw', action: '扫描查看', resourceType: 'emergency_card', resourceId: 'card9', ip: '192.168.1.101', createdAt: '2024-12-14T09:20:00', isAbnormal: false },
  { id: 'a14', actorId: 'u6', actorName: '陈志愿者', actorRole: 'community', action: '非工作时间访问', resourceType: 'elder_profile', resourceId: 'e15', ip: '192.168.1.51', createdAt: '2024-12-14T02:10:00', isAbnormal: true },
]
