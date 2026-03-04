export type ControlStatus = 'approved' | 'pending' | 'missing' | 'waived';

export interface ControlDefinition {
  id: string;
  sec: string;
  label: string;
  ref: string;
}

export interface FrameworkControl extends ControlDefinition {
  status: ControlStatus;
  approvedBy: string;
  approvedAt: string;
  notes: string;
}

export interface FrameworkDefinition {
  id: string;
  label: string;
  full: string;
  desc: string;
  src: string;
  controls: ControlDefinition[];
}

export interface FrameworkData {
  controls: FrameworkControl[];
}

export interface FrameworkNotes {
  aligns: boolean;
  lastReviewed: string;
  notes: string;
}
