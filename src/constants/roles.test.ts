import { describe, it, expect } from 'vitest';
import { can, ROLES } from './roles';

describe('ROLES', () => {
  it('defines all four roles', () => {
    expect(ROLES).toHaveLength(4);
    expect([...ROLES]).toEqual(['ADMIN', 'REVIEWER', 'REQUESTER', 'READ_ONLY']);
  });
});

describe('can', () => {
  it('ADMIN can do everything', () => {
    expect(can('ADMIN', 'all')).toBe(true);
    expect(can('ADMIN', 'approve')).toBe(true);
    expect(can('ADMIN', 'create')).toBe(true);
    expect(can('ADMIN', 'upload')).toBe(true);
  });

  it('REVIEWER can approve and upload', () => {
    expect(can('REVIEWER', 'approve')).toBe(true);
    expect(can('REVIEWER', 'upload')).toBe(true);
    expect(can('REVIEWER', 'create')).toBe(false);
    expect(can('REVIEWER', 'all')).toBe(false);
  });

  it('REQUESTER can create and upload', () => {
    expect(can('REQUESTER', 'create')).toBe(true);
    expect(can('REQUESTER', 'upload')).toBe(true);
    expect(can('REQUESTER', 'approve')).toBe(false);
    expect(can('REQUESTER', 'all')).toBe(false);
  });

  it('READ_ONLY cannot do anything', () => {
    expect(can('READ_ONLY', 'all')).toBe(false);
    expect(can('READ_ONLY', 'approve')).toBe(false);
    expect(can('READ_ONLY', 'create')).toBe(false);
    expect(can('READ_ONLY', 'upload')).toBe(false);
  });
});
