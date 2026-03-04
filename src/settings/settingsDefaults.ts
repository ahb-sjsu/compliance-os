import type { AppSettings } from '../types/settings';

export const SETTINGS_KEY = 'complianceos_v2_settings';

export const DEFAULTS: AppSettings = {
  orgName: 'Justice Innovations',
  appSubtitle: 'Justice Innovations v2',
  sidebarFooter: 'v2.1 - Single-org ready',
  showRoleBar: true,
  accentColor: '#1a1816',
  fontSize: 'normal',
  sidebarWidth: 'normal',
  tableDensity: 'normal',
  dashVendorLimit: 8,
  dashActivityLimit: 8,
  showStatActive: true,
  showStatMissing: true,
  showStatExpiring: true,
  showStatRisk: true,
  defaultTier: 'MED',
  defaultStatus: 'PROSPECT',
  defaultPaid: true,
  showSensitiveIndicators: true,
  exportDisclaimer: true,
};
