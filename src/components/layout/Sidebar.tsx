import type { AppSettings } from '../../types/settings';
import { can, type Role } from '../../constants/roles';

interface NavItem {
  id: string;
  icon: string;
  label: string;
  badge?: number | null;
}

interface SidebarProps {
  tab: string;
  setTab: (tab: string) => void;
  role: Role;
  settings: AppSettings;
  missingCount: number;
}

export function Sidebar({ tab, setTab, role, settings: S, missingCount }: SidebarProps) {
  const sbWidth = ({ narrow: 172, normal: 200, wide: 240 } as Record<string, number>)[S.sidebarWidth] || 200;

  const NAV: NavItem[] = [
    { id: 'dashboard', icon: '\u229E', label: 'Dashboard' },
    { id: 'vendors', icon: '\uD83C\uDFE2', label: 'Vendors', badge: missingCount > 0 ? missingCount : null },
    { id: 'reports', icon: '\uD83D\uDCCA', label: 'Reports' },
    { id: 'auditlog', icon: '\uD83D\uDCCB', label: 'Audit Log' },
    ...(can(role, 'all') ? [{ id: 'frameworks', icon: '\uD83C\uDFDB', label: 'Frameworks (Admin)' }] : []),
    ...(can(role, 'all') ? [{ id: 'settings', icon: '\u2699', label: 'Settings' }] : []),
  ];

  return (
    <aside className="sb np" style={{ width: sbWidth }}>
      <div className="sb-brand">
        <div className="sb-name">ComplianceOS</div>
        <div className="sb-sub">{S.appSubtitle}</div>
      </div>
      <nav className="sb-nav">
        {NAV.map((item) => (
          <div key={item.id} className={'nav-i' + (tab === item.id ? ' on' : '')} onClick={() => setTab(item.id)}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </div>
        ))}
      </nav>
      <div className="sb-ft">
        <div className="fw-tags">
          {['CJIS', 'FedRAMP', 'StateRAMP', 'CISA'].map((f) => (
            <span key={f} className="fw-tag">
              {f}
            </span>
          ))}
        </div>
        <div style={{ fontSize: '8.5px', fontFamily: '"JetBrains Mono",monospace', color: 'var(--text3)' }}>
          {S.sidebarFooter}
        </div>
      </div>
    </aside>
  );
}
