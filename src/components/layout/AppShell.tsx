import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import type { AppSettings } from '../../types/settings';
import type { Role } from '../../constants/roles';

interface AppShellProps {
  tab: string;
  setTab: (tab: string) => void;
  role: Role;
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
  settings: S,
  missingCount,
  pageTitle,
  topbarActions,
  children,
}: AppShellProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
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
