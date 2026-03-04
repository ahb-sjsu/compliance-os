export type VendorStatus = 'PROSPECT' | 'IN_REVIEW' | 'ACTIVE' | 'ON_HOLD' | 'OFFBOARDING' | 'OFFBOARDED';
export type RiskTier = 'HIGH' | 'MED' | 'LOW';
export type ChecklistStatus = 'approved' | 'pending' | 'missing' | 'waived';

export interface ChecklistItem {
  id: string;
  label: string;
  ref: string;
  status: ChecklistStatus;
  approvedBy: string;
  approvedAt: string;
  notes: string;
}

export interface VendorDocument {
  id: number;
  name: string;
  type: string;
  sensitive: boolean;
  uploadedBy: string;
  uploadedAt: string;
  expiry: string;
}

export interface VendorTask {
  id: number;
  text: string;
  done: boolean;
  due: string;
  createdBy: string;
}

export interface AuditEntry {
  ts: string;
  actor: string;
  action: string;
  entity: string;
}

export interface Vendor {
  id: number;
  company: string;
  dba: string;
  contact: string;
  email: string;
  category: string;
  tier: RiskTier;
  onsite: boolean;
  paid: boolean;
  owner: string;
  status: VendorStatus;
  notes: string;
  checklist: ChecklistItem[];
  documents: VendorDocument[];
  tasks: VendorTask[];
  riskAnswers: boolean[];
  riskDone: boolean;
  frameworks: string[];
  frameworkData: Record<string, import('./framework').FrameworkData>;
  auditLog: AuditEntry[];
}
