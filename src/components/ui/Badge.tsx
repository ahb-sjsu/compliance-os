import type { VendorStatus, RiskTier } from '../../types/vendor';

const STATUS_META: Record<VendorStatus, { label: string; color: string }> = {
  PROSPECT: { label: 'Prospect', color: 'bgr' },
  IN_REVIEW: { label: 'In Review', color: 'bb' },
  ACTIVE: { label: 'Active', color: 'bg' },
  ON_HOLD: { label: 'On Hold', color: 'by' },
  OFFBOARDING: { label: 'Offboarding', color: 'bo' },
  OFFBOARDED: { label: 'Offboarded', color: 'bgr' },
};

const TIER_COLOR: Record<RiskTier, string> = { HIGH: 'br', MED: 'by', LOW: 'bg' };

export function Badge({ cls, children }: { cls: string; children: React.ReactNode }) {
  return <span className={'badge ' + cls}>{children}</span>;
}

export function StatusBadge({ status }: { status: VendorStatus }) {
  const m = STATUS_META[status] || { label: status, color: 'bgr' };
  return <Badge cls={m.color}>{m.label}</Badge>;
}

export function TierBadge({ tier }: { tier: RiskTier }) {
  return <Badge cls={TIER_COLOR[tier] || 'bgr'}>{tier} Risk</Badge>;
}
