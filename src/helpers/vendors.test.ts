import { describe, it, expect } from 'vitest';
import { suggestFW, buildChecklist, buildFWControls, gateCheck } from './vendors';
import type { Vendor, ChecklistItem } from '../types/vendor';

describe('suggestFW', () => {
  it('suggests CJIS for HIGH tier', () => {
    expect(suggestFW({ tier: 'HIGH', category: 'Legal' })).toContain('CJIS');
  });

  it('suggests FedRAMP and StateRAMP for tech + MED/HIGH', () => {
    const result = suggestFW({ tier: 'MED', category: 'Technology' });
    expect(result).toContain('FedRAMP');
    expect(result).toContain('StateRAMP');
  });

  it('suggests CISA for MED tier', () => {
    expect(suggestFW({ tier: 'MED', category: 'Other' })).toContain('CISA');
  });

  it('returns empty for LOW tier non-tech', () => {
    expect(suggestFW({ tier: 'LOW', category: 'Legal' })).toEqual([]);
  });

  it('returns no duplicates', () => {
    const result = suggestFW({ tier: 'HIGH', category: 'Cloud Services' });
    expect(new Set(result).size).toBe(result.length);
  });
});

describe('buildChecklist', () => {
  it('always includes contract', () => {
    const items = buildChecklist({ paid: false, onsite: false, tier: 'LOW' });
    expect(items.some((i) => i.id === 'contract')).toBe(true);
  });

  it('includes W-9 for paid vendors', () => {
    const items = buildChecklist({ paid: true, onsite: false, tier: 'LOW' });
    expect(items.some((i) => i.id === 'w9')).toBe(true);
  });

  it('does not include W-9 for unpaid vendors', () => {
    const items = buildChecklist({ paid: false, onsite: false, tier: 'LOW' });
    expect(items.some((i) => i.id === 'w9')).toBe(false);
  });

  it('includes COI for onsite vendors', () => {
    const items = buildChecklist({ paid: false, onsite: true, tier: 'LOW' });
    expect(items.some((i) => i.id === 'coi')).toBe(true);
  });

  it('includes security addendum and evidence for HIGH tier', () => {
    const items = buildChecklist({ paid: false, onsite: false, tier: 'HIGH' });
    expect(items.some((i) => i.id === 'addendum')).toBe(true);
    expect(items.some((i) => i.id === 'evidence')).toBe(true);
  });

  it('includes security questionnaire for MED tier', () => {
    const items = buildChecklist({ paid: false, onsite: false, tier: 'MED' });
    expect(items.some((i) => i.id === 'secq')).toBe(true);
  });

  it('all items start with missing status', () => {
    const items = buildChecklist({ paid: true, onsite: true, tier: 'HIGH' });
    expect(items.every((i) => i.status === 'missing')).toBe(true);
  });
});

describe('buildFWControls', () => {
  it('returns controls for known framework', () => {
    const ctrls = buildFWControls('CJIS');
    expect(ctrls.length).toBeGreaterThan(0);
    expect(ctrls[0]).toHaveProperty('id');
    expect(ctrls[0]).toHaveProperty('label');
    expect(ctrls[0].status).toBe('missing');
  });

  it('returns empty array for unknown framework', () => {
    expect(buildFWControls('NONEXISTENT')).toEqual([]);
  });
});

describe('gateCheck', () => {
  const makeVendor = (overrides: Partial<Vendor> = {}): Vendor =>
    ({
      id: 'test-1',
      company: 'Test Co',
      owner: 'Admin',
      riskDone: true,
      checklist: [],
      ...overrides,
    }) as Vendor;

  const approvedItem = (id: string): ChecklistItem => ({
    id,
    label: id,
    ref: '',
    status: 'approved',
    approvedBy: 'ADMIN',
    approvedAt: '',
    notes: '',
  });

  it('returns no blocks when all conditions met', () => {
    const vendor = makeVendor();
    const checklist = [approvedItem('contract')];
    expect(gateCheck(vendor, checklist)).toEqual([]);
  });

  it('blocks when no owner', () => {
    const vendor = makeVendor({ owner: '' });
    const checklist = [approvedItem('contract')];
    const blocks = gateCheck(vendor, checklist);
    expect(blocks).toContain('Owner must be assigned');
  });

  it('blocks when contract not approved', () => {
    const vendor = makeVendor();
    const checklist = [{ ...approvedItem('contract'), status: 'pending' as const }];
    const blocks = gateCheck(vendor, checklist);
    expect(blocks.some((b) => b.includes('Contract'))).toBe(true);
  });

  it('blocks when risk not done', () => {
    const vendor = makeVendor({ riskDone: false });
    const checklist = [approvedItem('contract')];
    const blocks = gateCheck(vendor, checklist);
    expect(blocks.some((b) => b.includes('Risk'))).toBe(true);
  });

  it('blocks when checklist items incomplete', () => {
    const vendor = makeVendor();
    const checklist = [approvedItem('contract'), { ...approvedItem('w9'), status: 'missing' as const }];
    const blocks = gateCheck(vendor, checklist);
    expect(blocks.some((b) => b.includes('checklist'))).toBe(true);
  });
});
