export interface AppSettings {
  orgName: string;
  appSubtitle: string;
  sidebarFooter: string;
  showRoleBar: boolean;
  accentColor: string;
  fontSize: 'compact' | 'normal' | 'comfortable';
  sidebarWidth: 'narrow' | 'normal' | 'wide';
  tableDensity: 'compact' | 'normal' | 'spacious';
  dashVendorLimit: number;
  dashActivityLimit: number;
  showStatActive: boolean;
  showStatMissing: boolean;
  showStatExpiring: boolean;
  showStatRisk: boolean;
  defaultTier: 'HIGH' | 'MED' | 'LOW';
  defaultStatus: 'PROSPECT' | 'IN_REVIEW';
  defaultPaid: boolean;
  showSensitiveIndicators: boolean;
  exportDisclaimer: boolean;
}
