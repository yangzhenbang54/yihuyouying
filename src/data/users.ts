import { User } from '@/types/user'
import { UserRole } from '@/types/common'

export const mockUsers: User[] = [
  { id: 'u1', name: '张奶奶', phone: '13800001001', role: UserRole.ELDERLY, organization: '', community: '雨花社区', status: 'active', createdAt: '2024-09-01', lastLogin: '2024-12-15' },
  { id: 'u2', name: '李爷爷', phone: '13800001002', role: UserRole.ELDERLY, organization: '', community: '东山社区', status: 'active', createdAt: '2024-09-05', lastLogin: '2024-11-20' },
  { id: 'u3', name: '王阿姨', phone: '13800001003', role: UserRole.FAMILY, organization: '', community: '雨花社区', status: 'active', createdAt: '2024-09-02', lastLogin: '2024-12-16' },
  { id: 'u4', name: '李建国', phone: '13800001004', role: UserRole.FAMILY, organization: '', community: '东山社区', status: 'active', createdAt: '2024-09-08', lastLogin: '2024-12-10' },
  { id: 'u5', name: '刘社工', phone: '13800001005', role: UserRole.COMMUNITY, organization: '雨花社区服务中心', community: '雨花社区', status: 'active', createdAt: '2024-08-15', lastLogin: '2024-12-17' },
  { id: 'u6', name: '陈志愿者', phone: '13800001006', role: UserRole.COMMUNITY, organization: '东山社区服务中心', community: '东山社区', status: 'active', createdAt: '2024-08-20', lastLogin: '2024-12-16' },
  { id: 'u7', name: '赵社工', phone: '13800001007', role: UserRole.COMMUNITY, organization: '玄武湖社区服务中心', community: '玄武湖社区', status: 'active', createdAt: '2024-08-18', lastLogin: '2024-12-15' },
  { id: 'u8', name: '周医生', phone: '13800001008', role: UserRole.HOSPITAL_SW, organization: '市中心医院', community: '', status: 'active', createdAt: '2024-09-10', lastLogin: '2024-12-14' },
  { id: 'u9', name: '吴护士', phone: '13800001009', role: UserRole.HOSPITAL_SW, organization: '市第一人民医院', community: '', status: 'active', createdAt: '2024-09-12', lastLogin: '2024-12-13' },
  { id: 'u10', name: '康护护理站', phone: '13800001010', role: UserRole.PROVIDER, organization: '康护护理服务公司', community: '', status: 'active', createdAt: '2024-09-20', lastLogin: '2024-12-12' },
  { id: 'u11', name: '益心公益', phone: '13800001011', role: UserRole.PROVIDER, organization: '益心公益服务中心', community: '', status: 'active', createdAt: '2024-09-22', lastLogin: '2024-12-10' },
  { id: 'u12', name: '马管理员', phone: '13800001012', role: UserRole.ADMIN, organization: '项目组', community: '', status: 'active', createdAt: '2024-08-01', lastLogin: '2024-12-17' },
  { id: 'u13', name: '孙督导', phone: '13800001013', role: UserRole.ADMIN, organization: '项目组', community: '', status: 'active', createdAt: '2024-08-01', lastLogin: '2024-12-16' },
  { id: 'u14', name: '黄老人', phone: '13800001014', role: UserRole.ELDERLY, organization: '', community: '玄武湖社区', status: 'active', createdAt: '2024-09-15', lastLogin: '2024-10-20' },
]
