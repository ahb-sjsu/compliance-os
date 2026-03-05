export const ROLES = ['ADMIN', 'COMPLIANCE_ADMIN', 'VENDOR'] as const;
export type Role = (typeof ROLES)[number];

/** Human-readable labels for display */
export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Admin',
  COMPLIANCE_ADMIN: 'Compliance Admin',
  VENDOR: 'Vendor',
};

const PERMS: Record<Role, Record<string, number>> = {
  ADMIN: { all: 1, settings: 1, approve: 1, create: 1, upload: 1 },
  COMPLIANCE_ADMIN: { approve: 1, create: 1, upload: 1 },
  VENDOR: { upload: 1 },
};

export function can(role: Role, p: string): boolean {
  return !!(PERMS[role] && PERMS[role][p]);
}
