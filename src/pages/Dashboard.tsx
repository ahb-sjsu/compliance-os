import type { Vendor, AuditEntry } from '../types/vendor';
import type { AppSettings } from '../types/settings';
import { StatusBadge, TierBadge } from '../components/ui/Badge';

interface DashboardProps {
  vendors: Vendor[];
  totalActive: number;
  missing: number;
  exp30: number;
  exp60: number;
  exp90: number;
  highRisk: number;
  onOpen: (v: Vendor) => void;
  globalAudit: AuditEntry[];
  settings: AppSettings;
}

interface StatCard {
  key: string;
  cls: string;
  label: string;
  val: number;
  sub: string;
}

export default function Dashboard({
  vendors,
  totalActive,
  missing,
  exp30,
  exp60,
  exp90,
  highRisk,
  onOpen,
  globalAudit,
  settings: S,
}: DashboardProps) {
  const openTasks = vendors.reduce((sum, v) => sum + (v.tasks || []).filter((t) => !t.done).length, 0);

  const statCards = (
    [
      S.showStatActive && {
        key: 'active',
        cls: 'ok',
        label: 'Active Vendors',
        val: totalActive,
        sub: vendors.length + ' total',
      },
      S.showStatMissing && {
        key: 'missing',
        cls: missing > 0 ? 'dng' : 'ok',
        label: 'Missing Items',
        val: missing,
        sub: 'vendors with gaps',
      },
      S.showStatExpiring && {
        key: 'exp',
        cls: exp30 > 0 ? 'wrn' : 'ok',
        label: 'Expiring 30d',
        val: exp30,
        sub: exp60 + ' in 60d \u2022 ' + exp90 + ' in 90d',
      },
      S.showStatRisk && {
        key: 'risk',
        cls: highRisk > 0 ? 'wrn' : 'ok',
        label: 'High Risk',
        val: highRisk,
        sub: openTasks + ' open tasks',
      },
    ] as (StatCard | false)[]
  ).filter(Boolean) as StatCard[];

  return (
    <>
      <div className="sg" style={{ gridTemplateColumns: 'repeat(' + statCards.length + ',1fr)' }}>
        {statCards.map((c) => (
          <div key={c.key} className={'sc ' + c.cls}>
            <div className="sl">{c.label}</div>
            <div className="sv">{c.val}</div>
            <div className="ss">{c.sub}</div>
          </div>
        ))}
      </div>

      {missing > 0 && (
        <div className="al al-r">
          Missing items: {missing} vendor(s) have compliance gaps. Review before granting access.
        </div>
      )}
      {exp30 > 0 && (
        <div className="al al-w">Expiring soon: {exp30} vendor(s) have documents expiring within 30 days.</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div>
          <div className="sd">Vendors</div>
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Tier</th>
                  <th>Status</th>
                  <th>Checklist</th>
                </tr>
              </thead>
              <tbody>
                {vendors.slice(0, S.dashVendorLimit).map((v) => {
                  const done = (v.checklist || []).filter(
                    (i) => i.status === 'approved' || i.status === 'waived',
                  ).length;
                  const total = (v.checklist || []).length;
                  return (
                    <tr key={v.id} style={{ cursor: 'pointer' }} onClick={() => onOpen(v)}>
                      <td style={{ fontWeight: 600 }}>{v.company}</td>
                      <td>
                        <TierBadge tier={v.tier} />
                      </td>
                      <td>
                        <StatusBadge status={v.status} />
                      </td>
                      <td
                        style={{
                          fontFamily: '"JetBrains Mono",monospace',
                          fontSize: 11,
                        }}
                      >
                        {done}/{total}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div className="sd">Recent Activity</div>
          <div className="card" style={{ padding: '8px 14px' }}>
            {globalAudit.slice(0, S.dashActivityLimit).map((e, i) => (
              <div
                key={i}
                style={{
                  padding: '7px 0',
                  borderBottom: '1px solid var(--border)',
                  fontSize: 11,
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 12 }}>{e.actor}</div>
                <div style={{ color: 'var(--text2)', marginTop: 1 }}>{e.action}</div>
                <div
                  style={{
                    color: 'var(--text3)',
                    fontSize: 10,
                    fontFamily: '"JetBrains Mono",monospace',
                    marginTop: 1,
                  }}
                >
                  {e.ts}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
