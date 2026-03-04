import type { VendorStatus, RiskTier } from '../types/vendor';

export const STATUS_META: Record<VendorStatus, { label: string; color: string }> = {
  PROSPECT: { label: 'Prospect', color: 'bgr' },
  IN_REVIEW: { label: 'In Review', color: 'bb' },
  ACTIVE: { label: 'Active', color: 'bg' },
  ON_HOLD: { label: 'On Hold', color: 'by' },
  OFFBOARDING: { label: 'Offboarding', color: 'bo' },
  OFFBOARDED: { label: 'Offboarded', color: 'bgr' },
};

export const TIER_COLOR: Record<RiskTier, string> = {
  HIGH: 'br',
  MED: 'by',
  LOW: 'bg',
};
