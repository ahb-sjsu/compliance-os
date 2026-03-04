import { useState } from 'react';
import type { Vendor } from '../types/vendor';
import type { AppSettings } from '../types/settings';
import { daysUntil } from '../helpers/dates';
import { StatusBadge, TierBadge } from '../components/ui/Badge';

interface ReportsProps {
  vendors: Vendor[];
  settings: AppSettings;
}

interface ReportDef {
  id: string;
  label: string;
  desc: string;
  fn: () => Vendor[];
}

export default function Reports({ vendors, settings: S }: ReportsProps) {
  const [active, setActive] = useState<string | null>(null);

  const RPTS: ReportDef[] = [
    {
      id: 'all',
      label: 'All Vendors',
      desc: 'Complete vendor list',
      fn: () => vendors,
    },
    {
      id: 'missing',
      label: 'Missing Items',
      desc: 'Vendors with missing checklist items',
      fn: () => vendors.filter((v) => (v.checklist || []).some((i) => i.status === 'missing')),
    },
    {
      id: 'exp30',
      label: 'Expiring 30d',
      desc: 'Documents expiring within 30 days',
      fn: () =>
        vendors.filter((v) =>
          (v.documents || []).some((d) => {
            const d2 = daysUntil(d.expiry);
            return d2 !== null && d2 >= 0 && d2 <= 30;
          }),
        ),
    },
    {
      id: 'exp90',
      label: 'Expiring 90d',
      desc: 'Documents expiring within 90 days',
      fn: () =>
        vendors.filter((v) =>
          (v.documents || []).some((d) => {
            const d2 = daysUntil(d.expiry);
            return d2 !== null && d2 >= 0 && d2 <= 90;
          }),
        ),
    },
    {
      id: 'highRisk',
      label: 'High Risk',
      desc: 'HIGH tier vendors',
      fn: () => vendors.filter((v) => v.tier === 'HIGH'),
    },
    {
      id: 'offboard',
      label: 'Offboarding',
      desc: 'Vendors in offboarding or offboarded status',
      fn: () => vendors.filter((v) => v.status === 'OFFBOARDING' || v.status === 'OFFBOARDED'),
    },
  ];

  const exportCSV = (data: Vendor[], title: string) => {
    const hdr = ['Company', 'Category', 'Tier', 'Status', 'Owner', 'Done', 'Missing'];
    const rows = data.map((v) => {
      const cl = v.checklist || [];
      return [
        v.company,
        v.category,
        v.tier,
        v.status,
        v.owner || 'Unassigned',
        cl.filter((i) => i.status === 'approved' || i.status === 'waived').length + '/' + cl.length,
        cl.filter((i) => i.status === 'missing').length,
      ];
    });
    const disc =
      S && S.exportDisclaimer
        ? [
            'DISCLAIMER: This export is for tracking purposes only. It does not constitute certification or authorization under any compliance framework.',
            '',
          ]
        : [];
    const csv = [title, 'Generated: ' + new Date().toLocaleDateString(), ...disc, '', hdr, ...rows]
      .map((r) => (Array.isArray(r) ? r.map((c) => '"' + c + '"').join(',') : r))
      .join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'ComplianceOS_' + title.replace(/\s/g, '_') + '_' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
  };

  const cur = RPTS.find((r) => r.id === active);
  const data = cur ? cur.fn() : [];

  return (
    <>
      <div className="rg">
        {RPTS.map((r) => (
          <div
            key={r.id}
            className="rc"
            style={{
              outline: active === r.id ? '2px solid var(--ink)' : '',
            }}
            onClick={() => setActive((p) => (p === r.id ? null : r.id))}
          >
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{r.label}</div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--text2)',
                lineHeight: 1.4,
                marginBottom: 8,
              }}
            >
              {r.desc}
            </div>
            <div
              style={{
                fontSize: 12,
                fontFamily: '"JetBrains Mono",monospace',
                color: 'var(--text3)',
              }}
            >
              {r.fn().length} vendors
            </div>
          </div>
        ))}
      </div>
      {active && cur && (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 16 }}>
              {cur.label} ({data.length})
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn bs bsm" onClick={() => exportCSV(data, cur.label)}>
                Export CSV
              </button>
              <button className="btn bs bsm" onClick={() => window.print()}>
                Print / PDF
              </button>
              <button className="btn bs bsm" onClick={() => setActive(null)}>
                Close
              </button>
            </div>
          </div>
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Category</th>
                  <th>Tier</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Checklist</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div className="es">No vendors match</div>
                    </td>
                  </tr>
                )}
                {data.map((v) => {
                  const cl = v.checklist || [];
                  return (
                    <tr key={v.id}>
                      <td style={{ fontWeight: 600 }}>{v.company}</td>
                      <td style={{ fontSize: 12, color: 'var(--text2)' }}>{v.category}</td>
                      <td>
                        <TierBadge tier={v.tier} />
                      </td>
                      <td>
                        <StatusBadge status={v.status} />
                      </td>
                      <td style={{ fontSize: 12 }}>{v.owner || <span className="badge br">Unassigned</span>}</td>
                      <td
                        style={{
                          fontFamily: '"JetBrains Mono",monospace',
                          fontSize: 12,
                        }}
                      >
                        {cl.filter((i) => i.status === 'approved' || i.status === 'waived').length}/{cl.length}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
