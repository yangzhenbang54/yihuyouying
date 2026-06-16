import { UserRole } from './common'

export interface User {
  id: string
  name: string
  phone: string
  role: UserRole
  organization: string
  community?: string
  avatar?: string
  avatarColor?: string
  avatarEmoji?: string
  status: 'active' | 'inactive'
  createdAt: string
  lastLogin?: string
}
