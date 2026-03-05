import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import type { AppSettings } from '../../types/settings';
import { ROLES, ROLE_LABELS, type Role } from '../../constants/roles';

interface AppShellProps {
  tab: string;
  setTab: (tab: string) => void;
  role: Role;
  setRole: (role: Role) => void;
  settings: AppSettings;
  missingCount: number;
  pageTitle: string;
  topbarActions?: ReactNode;
  children: ReactNode;
}

export function AppShell({
  tab,
  setTab,
  role,
  setRole,
  settings: S,
  missingCount,
  pageTitle,
  topbarActions,
  children,
}: AppShellProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      {S.showRoleBar && (
        <div
          className="np"
          style={{
            background:
              role === 'ADMIN'
                ? '#1a1816'
                : role === 'COMPLIANCE_ADMIN'
                  ? '#1e3a5f'
                  : '#3b1f0a',
            color: 'rgba(255,255,255,.75)',
            fontSize: 12,
            padding: '8px 16px',
            display: 'flex',
            gap: 20,
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ color: 'rgba(255,255,255,.4)' }}>DEMO — viewing as:</span>
          {ROLES.map((r) => (
            <span
              key={r}
              onClick={() => setRole(r)}
              style={{
                cursor: 'pointer',
                color: r === role ? '#fff' : 'rgba(255,255,255,.45)',
                fontWeight: r === role ? 700 : 400,
                padding: '2px 8px',
                borderRadius: 4,
                background: r === role ? 'rgba(255,255,255,.15)' : 'transparent',
                transition: 'all .12s',
              }}
            >
              {ROLE_LABELS[r]}
            </span>
          ))}
        </div>
      )}
      <div className="layout">
        <Sidebar tab={tab} setTab={setTab} role={role} settings={S} missingCount={missingCount} />
        <div className="main">
          <Topbar title={pageTitle} actions={topbarActions} />
          <div className="content">{children}</div>
        </div>
      </div>
    </div>
  );
}
