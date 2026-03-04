/** Feature flags and limits for each plan tier */
export type PlanTier = 'free' | 'pro';

export interface PlanLimits {
  maxVendors: number;
  maxDocsPerVendor: number;
  maxAuditLogEntries: number;
}

export interface PlanFeatures {
  riskAssessment: boolean;
  frameworks: boolean;
  csvExport: boolean;
  printPdf: boolean;
  fwComplianceReport: boolean;
  advancedReports: boolean;
  customization: boolean;
  googleDriveSync: boolean;
  allRoles: boolean;
}

export interface PlanDefinition {
  tier: PlanTier;
  name: string;
  price: string;
  limits: PlanLimits;
  features: PlanFeatures;
}

export const PLANS: Record<PlanTier, PlanDefinition> = {
  free: {
    tier: 'free',
    name: 'Free',
    price: '$0',
    limits: {
      maxVendors: 3,
      maxDocsPerVendor: 5,
      maxAuditLogEntries: 20,
    },
    features: {
      riskAssessment: false,
      frameworks: false,
      csvExport: false,
      printPdf: false,
      fwComplianceReport: false,
      advancedReports: false,
      customization: false,
      googleDriveSync: false,
      allRoles: false,
    },
  },
  pro: {
    tier: 'pro',
    name: 'Pro',
    price: '$9/mo',
    limits: {
      maxVendors: Infinity,
      maxDocsPerVendor: Infinity,
      maxAuditLogEntries: Infinity,
    },
    features: {
      riskAssessment: true,
      frameworks: true,
      csvExport: true,
      printPdf: true,
      fwComplianceReport: true,
      advancedReports: true,
      customization: true,
      googleDriveSync: true,
      allRoles: true,
    },
  },
};

/** Free-tier report IDs (only 'all' and 'missing') */
export const FREE_REPORT_IDS = ['all', 'missing'];
