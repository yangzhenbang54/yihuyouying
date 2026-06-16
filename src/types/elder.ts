import { ProfileStatus } from './common'

export interface ElderProfile {
  id: string
  name: string
  gender: 'male' | 'female'
  age: number
  livingStatus: 'alone' | 'with_spouse' | 'with_family' | 'institution'
  community: string
  address: string
  phone?: string
  avatar?: string
  medicalHistory?: string
  emergencyNotes?: string
  communicationPref?: string
  carePref?: string
  aidNeeds?: string
  status: ProfileStatus
  riskLevel: 'high' | 'medium' | 'low'
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface MedicalRecord {
  id: string
  elderId: string
  type: 'discharge_summary' | 'prescription' | 'lab_report' | 'outpatient_record' | 'other'
  title: string
  imageUrl?: string
  ocrText?: string
  structuredData?: Record<string, string>
  confidenceScore?: number
  reviewedBy?: string
  reviewStatus: 'pending' | 'confirmed' | 'needs_review'
  createdAt: string
}
