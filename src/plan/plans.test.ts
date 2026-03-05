import { describe, it, expect } from 'vitest';
import { PLANS, FREE_REPORT_IDS } from './plans';

describe('PLANS', () => {
  describe('free plan', () => {
    const free = PLANS.free;

    it('has correct tier and name', () => {
      expect(free.tier).toBe('free');
      expect(free.name).toBe('Free');
    });

    it('limits vendors to 3', () => {
      expect(free.limits.maxVendors).toBe(3);
    });

    it('limits docs per vendor to 5', () => {
      expect(free.limits.maxDocsPerVendor).toBe(5);
    });

    it('limits audit log to 20 entries', () => {
      expect(free.limits.maxAuditLogEntries).toBe(20);
    });

    it('disables premium features', () => {
      expect(free.features.riskAssessment).toBe(false);
      expect(free.features.frameworks).toBe(false);
      expect(free.features.csvExport).toBe(false);
      expect(free.features.printPdf).toBe(false);
      expect(free.features.fwComplianceReport).toBe(false);
      expect(free.features.advancedReports).toBe(false);
      expect(free.features.customization).toBe(false);
      expect(free.features.googleDriveSync).toBe(false);
      expect(free.features.allRoles).toBe(false);
    });
  });

  describe('pro plan', () => {
    const pro = PLANS.pro;

    it('has correct tier and name', () => {
      expect(pro.tier).toBe('pro');
      expect(pro.name).toBe('Pro');
    });

    it('has unlimited vendors', () => {
      expect(pro.limits.maxVendors).toBe(Infinity);
    });

    it('has unlimited docs', () => {
      expect(pro.limits.maxDocsPerVendor).toBe(Infinity);
    });

    it('has unlimited audit log', () => {
      expect(pro.limits.maxAuditLogEntries).toBe(Infinity);
    });

    it('enables all features', () => {
      const features = Object.values(pro.features);
      expect(features.every(Boolean)).toBe(true);
    });
  });
});

describe('FREE_REPORT_IDS', () => {
  it('includes all and missing', () => {
    expect(FREE_REPORT_IDS).toContain('all');
    expect(FREE_REPORT_IDS).toContain('missing');
  });

  it('does not include advanced reports', () => {
    expect(FREE_REPORT_IDS).not.toContain('exp30');
    expect(FREE_REPORT_IDS).not.toContain('exp90');
    expect(FREE_REPORT_IDS).not.toContain('highRisk');
    expect(FREE_REPORT_IDS).not.toContain('offboard');
  });
});
