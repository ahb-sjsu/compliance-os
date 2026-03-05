import { describe, it, expect } from 'vitest';
import { can, ROLES, ROLE_LABELS } from './roles';

describe('ROLES', () => {
  it('defines all three roles', () => {
    expect(ROLES).toHaveLength(3);
    expect([...ROLES]).toEqual(['ADMIN', 'COMPLIANCE_ADMIN', 'VENDOR']);
  });

  it('has labels for every role', () => {
    for (const r of ROLES) {
      expect(ROLE_LABELS[r]).toBeTruthy();
    }
  });
});

describe('can', () => {
  it('ADMIN can do everything', () => {
    expect(can('ADMIN', 'all')).toBe(true);
    expect(can('ADMIN', 'settings')).toBe(true);
    expect(can('ADMIN', 'approve')).toBe(true);
    expect(can('ADMIN', 'create')).toBe(true);
    expect(can('ADMIN', 'upload')).toBe(true);
  });

  it('COMPLIANCE_ADMIN can approve, create, and upload', () => {
    expect(can('COMPLIANCE_ADMIN', 'approve')).toBe(true);
    expect(can('COMPLIANCE_ADMIN', 'create')).toBe(true);
    expect(can('COMPLIANCE_ADMIN', 'upload')).toBe(true);
    expect(can('COMPLIANCE_ADMIN', 'all')).toBe(false);
    expect(can('COMPLIANCE_ADMIN', 'settings')).toBe(false);
  });

  it('VENDOR can only upload', () => {
    expect(can('VENDOR', 'upload')).toBe(true);
    expect(can('VENDOR', 'create')).toBe(false);
    expect(can('VENDOR', 'approve')).toBe(false);
    expect(can('VENDOR', 'all')).toBe(false);
    expect(can('VENDOR', 'settings')).toBe(false);
  });
});
