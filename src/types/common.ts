export enum UserRole {
  ELDERLY = 'elderly',
  FAMILY = 'family',
  COMMUNITY = 'community',
  HOSPITAL_SW = 'hospital_sw',
  PROVIDER = 'provider',
  ADMIN = 'admin',
}

export enum ProfileStatus {
  DRAFT = 'draft',
  PENDING_CONFIRM = 'pending_confirm',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

export enum CaseStatus {
  OPEN = 'open',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  ESCALATED = 'escalated',
}

export enum Priority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  URGENT = 4,
}

export enum CardStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
}

export enum CardVisibility {
  MINIMAL = 'minimal',
  CONTACT = 'contact',
  FULL = 'full',
}

export enum FollowupType {
  PHONE = 'phone',
  VISIT = 'visit',
  VIDEO = 'video',
}

export enum TaskType {
  INTAKE_REVIEW = 'intake_review',
  EMERGENCY_RESPONSE = 'emergency_response',
  DISCHARGE_PICKUP = 'discharge_pickup',
  MEDICATION_REMINDER = 'medication_reminder',
  REVISIT = 'revisit',
  FOLLOWUP = 'followup',
  OTHER = 'other',
}
