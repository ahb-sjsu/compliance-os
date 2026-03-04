import { useState, type ReactNode } from 'react';
import { useSettings } from '../settings/useSettings';

function SectionTitle({ children }: { children: ReactNode }) {
  return <div className="settings-section-title">{children}</div>;
}

function Row({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="settings-row">
      <div style={{ flex: 1, paddingRight: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
        {hint && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{hint}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function Tog({ val, onChange }: { val: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="tog">
      <input type="checkbox" checked={val} onChange={(e) => onChange(e.target.checked)} />
      <span className="tog-sl" />
    </label>
  );
}

function Sel({ val, onChange, opts }: { val: string; onChange: (v: string) => void; opts: [string, string][] }) {
  return (
    <select value={val} onChange={(e) => onChange(e.target.value)} style={{ width: 'auto' }}>
      {opts.map(([v, l]) => (
        <option key={v} value={v}>
          {l}
        </option>
      ))}
    </select>
  );
}

function Inp({ val, onChange, placeholder }: { val: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={val}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || ''}
      style={{ width: 200 }}
    />
  );
}

const PRESETS = ['#1a1816', '#1e40af', '#166534', '#7c3aed', '#9a3412', '#1e3a5f'];

export default function SettingsPage() {
  const { settings: S, update, reset } = useSettings();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div style={{ maxWidth: 700 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Settings</div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>
            Changes apply immediately and are saved to your browser automatically.
          </div>
        </div>
        {!confirmReset ? (
          <button className="btn bs bsm" onClick={() => setConfirmReset(true)}>
            Reset to Defaults
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--red)' }}>Reset all settings?</span>
            <button
              className="btn bdng bsm"
              onClick={() => {
                reset();
                setConfirmReset(false);
              }}
            >
              Yes, Reset
            </button>
            <button className="btn bs bsm" onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="settings-section">
        <SectionTitle>Branding</SectionTitle>
        <Row label="Organization Name" hint="Shown in the sidebar subtitle and on exports">
          <Inp val={S.orgName} onChange={(v) => update({ orgName: v })} placeholder="Justice Innovations" />
        </Row>
        <Row label="App Subtitle" hint="Small text below ComplianceOS in the sidebar">
          <Inp val={S.appSubtitle} onChange={(v) => update({ appSubtitle: v })} placeholder="Justice Innovations v2" />
        </Row>
        <Row label="Sidebar Footer Note" hint="Version/status line at the bottom of the sidebar">
          <Inp
            val={S.sidebarFooter}
            onChange={(v) => update({ sidebarFooter: v })}
            placeholder="v2.1 - Single-org ready"
          />
        </Row>
        <Row label="Show Demo Role Bar" hint="The dark bar at the top for switching roles">
          <Tog val={S.showRoleBar} onChange={(v) => update({ showRoleBar: v })} />
        </Row>
      </div>

      <div className="settings-section">
        <SectionTitle>Appearance</SectionTitle>
        <Row label="Accent Color" hint="Active nav, buttons, vendor profile header">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {PRESETS.map((c) => (
              <div
                key={c}
                onClick={() => update({ accentColor: c })}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: c,
                  cursor: 'pointer',
                  border: S.accentColor === c ? '3px solid var(--text)' : '2px solid transparent',
                  boxShadow: '0 1px 3px rgba(0,0,0,.25)',
                  transition: 'all .12s',
                }}
              />
            ))}
            <input
              type="color"
              value={S.accentColor}
              onChange={(e) => update({ accentColor: e.target.value })}
              style={{
                width: 28,
                height: 28,
                border: '1px solid var(--border)',
                borderRadius: 5,
                cursor: 'pointer',
                padding: 2,
              }}
              title="Custom color"
            />
          </div>
        </Row>
        <Row label="Font Size" hint="Scales text throughout the application">
          <Sel
            val={S.fontSize}
            onChange={(v) => update({ fontSize: v as 'compact' | 'normal' | 'comfortable' })}
            opts={[
              ['compact', 'Compact'],
              ['normal', 'Normal'],
              ['comfortable', 'Comfortable'],
            ]}
          />
        </Row>
        <Row label="Sidebar Width" hint="Width of the left navigation sidebar">
          <Sel
            val={S.sidebarWidth}
            onChange={(v) => update({ sidebarWidth: v as 'narrow' | 'normal' | 'wide' })}
            opts={[
              ['narrow', 'Narrow'],
              ['normal', 'Normal'],
              ['wide', 'Wide'],
            ]}
          />
        </Row>
        <Row label="Table Row Density" hint="Row padding in vendor and audit tables">
          <Sel
            val={S.tableDensity}
            onChange={(v) => update({ tableDensity: v as 'compact' | 'normal' | 'spacious' })}
            opts={[
              ['compact', 'Compact'],
              ['normal', 'Normal'],
              ['spacious', 'Spacious'],
            ]}
          />
        </Row>
      </div>

      <div className="settings-section">
        <SectionTitle>Dashboard</SectionTitle>
        <Row label="Show Active Vendors card">
          <Tog val={S.showStatActive} onChange={(v) => update({ showStatActive: v })} />
        </Row>
        <Row label="Show Missing Items card">
          <Tog val={S.showStatMissing} onChange={(v) => update({ showStatMissing: v })} />
        </Row>
        <Row label="Show Expiring 30d card">
          <Tog val={S.showStatExpiring} onChange={(v) => update({ showStatExpiring: v })} />
        </Row>
        <Row label="Show High Risk card">
          <Tog val={S.showStatRisk} onChange={(v) => update({ showStatRisk: v })} />
        </Row>
        <Row label="Vendor table row limit" hint="How many vendors to show on the dashboard">
          <Sel
            val={String(S.dashVendorLimit)}
            onChange={(v) => update({ dashVendorLimit: Number(v) })}
            opts={[
              ['5', '5'],
              ['8', '8 (default)'],
              ['10', '10'],
              ['999', 'All'],
            ]}
          />
        </Row>
        <Row label="Activity feed row limit">
          <Sel
            val={String(S.dashActivityLimit)}
            onChange={(v) => update({ dashActivityLimit: Number(v) })}
            opts={[
              ['5', '5'],
              ['8', '8 (default)'],
              ['12', '12'],
              ['999', 'All'],
            ]}
          />
        </Row>
      </div>

      <div className="settings-section">
        <SectionTitle>New Vendor Defaults</SectionTitle>
        <Row label="Default Risk Tier" hint="Pre-selected when opening the Add Vendor form">
          <Sel
            val={S.defaultTier}
            onChange={(v) => update({ defaultTier: v as 'LOW' | 'MED' | 'HIGH' })}
            opts={[
              ['LOW', 'LOW'],
              ['MED', 'MED (default)'],
              ['HIGH', 'HIGH'],
            ]}
          />
        </Row>
        <Row label="Default Status" hint="Starting status for new vendors">
          <Sel
            val={S.defaultStatus}
            onChange={(v) => update({ defaultStatus: v as 'PROSPECT' | 'IN_REVIEW' })}
            opts={[
              ['PROSPECT', 'Prospect (default)'],
              ['IN_REVIEW', 'In Review'],
            ]}
          />
        </Row>
        <Row label="Default Paid Vendor" hint="Whether new vendors are marked as paid by default">
          <Tog val={S.defaultPaid} onChange={(v) => update({ defaultPaid: v })} />
        </Row>
      </div>

      <div className="settings-section">
        <SectionTitle>Data &amp; Privacy</SectionTitle>
        <Row label="Show Sensitive Document Badges" hint="Display the 'Sensitive' badge on restricted documents">
          <Tog val={S.showSensitiveIndicators} onChange={(v) => update({ showSensitiveIndicators: v })} />
        </Row>
        <Row label="Include Disclaimer on Exports" hint="Append compliance disclaimer to CSV exports">
          <Tog val={S.exportDisclaimer} onChange={(v) => update({ exportDisclaimer: v })} />
        </Row>
      </div>

      <div className="al al-i">
        SSO configuration, user management, and multi-org settings will be available after backend deployment to AWS
        GovCloud.
      </div>
    </div>
  );
}
