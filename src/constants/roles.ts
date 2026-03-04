export const ROLES = ['ADMIN', 'REVIEWER', 'REQUESTER', 'READ_ONLY'] as const;
export type Role = (typeof ROLES)[number];

const PERMS: Record<Role, Record<string, number>> = {
  ADMIN: { all: 1, approve: 1, create: 1, upload: 1 },
  REVIEWER: { approve: 1, upload: 1 },
  REQUESTER: { create: 1, upload: 1 },
  READ_ONLY: {},
};

export function can(role: Role, p: string): boolean {
  return !!(PERMS[role] && PERMS[role][p]);
}
