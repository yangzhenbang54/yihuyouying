import { TaskStatus, TaskType, Priority } from './common'

export interface Task {
  id: string
  elderId: string
  elderName: string
  taskType: TaskType
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  assigneeId: string
  assigneeName: string
  dueDate: string
  completedAt?: string
  completionNote?: string
  createdAt: string
}
