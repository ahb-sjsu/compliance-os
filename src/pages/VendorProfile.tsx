import { useState } from 'react';
import type { Vendor, ChecklistStatus, VendorStatus } from '../types/vendor';
import type { AppSettings } from '../types/settings';
import type { FrameworkControl } from '../types/framework';
import { can, type Role } from '../constants/roles';
import { STATUS_META } from '../constants/statuses';
import { StatusBadge, TierBadge } from '../components/ui/Badge';
import ChecklistTab from '../components/vendor/ChecklistTab';
import DocumentsTab from '../components/vendor/DocumentsTab';
import TasksTab from '../components/vendor/TasksTab';
import RiskTab from '../components/vendor/RiskTab';
import VendorFWTab from '../components/vendor/VendorFWTab';
import VendorAuditTab from '../components/vendor/VendorAuditTab';

interface VendorProfileProps {
  vendor: Vendor;
  role: Role;
  settings: AppSettings;
  onUpdateChecklist: (vendorId: number, itemId: string, status: ChecklistStatus, wNote?: string) => void;
  onChangeStatus: (vendorId: number, status: VendorStatus) => void;
  onSaveRisk: (vendorId: number, answers: boolean[]) => void;
  onAddDocument: (vendorId: number, doc: { name: string; type: string; sensitive: boolean; expiry: string }) => void;
  onAddTask: (vendorId: number, task: { text: string; due: string }) => void;
  onToggleTask: (vendorId: number, taskId: number) => void;
  onEdit: (vendor: Vendor) => void;
  onUpdateFWControl: (
    vendorId: number,
    fwId: string,
    controlId: string,
    status: FrameworkControl['status'],
    wNote?: string,
  ) => void;
  onUpdateVendorFW: (vendorId: number, frameworks: string[]) => void;
}

type TabKey = 'checklist' | 'documents' | 'tasks' | 'risk' | 'frameworks' | 'audit';

export default function VendorProfile({
  vendor,
  role,
  settings,
  onUpdateChecklist,
  onChangeStatus,
  onSaveRisk,
  onAddDocument,
  onAddTask,
  onToggleTask,
  onEdit,
  onUpdateFWControl,
  onUpdateVendorFW,
}: VendorProfileProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('checklist');
  const done = (vendor.checklist || []).filter((i) => i.status === 'approved' || i.status === 'waived').length;
  const total = (vendor.checklist || []).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const pctColor = pct === 100 ? '#86efac' : pct > 50 ? '#fde047' : '#fca5a5';
  const STATUSES = Object.keys(STATUS_META) as VendorStatus[];

  return (
    <>
      <div className="ph np">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 6 }}>{vendor.company}</div>
            <div
              style={{
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
                marginBottom: 8,
              }}
            >
              <TierBadge tier={vendor.tier} />
              <StatusBadge status={vendor.status} />
              <span className="badge bgr">{vendor.category}</span>
              {(vendor.frameworks || []).map((f) => (
                <span key={f} className="badge bgr" style={{ fontSize: 9 }}>
                  {f}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>
              {vendor.contact} &bull; {vendor.email}
              {vendor.owner && ' \u2022 Owner: ' + vendor.owner}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              alignItems: 'flex-end',
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: pctColor,
                lineHeight: 1,
              }}
            >
              {pct}%
            </div>
            <div
              style={{
                fontSize: 10,
                color: 'rgba(255,255,255,.4)',
                fontFamily: '"JetBrains Mono",monospace',
              }}
            >
              {done}/{total} complete
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {can(role, 'create') && (
                <button
                  className="btn bsm"
                  style={{
                    background: 'rgba(255,255,255,.15)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,.25)',
                  }}
                  onClick={() => onEdit(vendor)}
                >
                  Edit
                </button>
              )}
              <button
                className="btn bsm"
                style={{
                  background: 'rgba(255,255,255,.15)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,.25)',
                }}
                onClick={() => window.print()}
              >
                Print / PDF
              </button>
              {(can(role, 'approve') || can(role, 'all')) && (
                <button
                  className="btn bsm"
                  style={{
                    background: 'rgba(255,255,255,.15)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,.25)',
                  }}
                  onClick={() => alert('ZIP download requires backend file storage.')}
                >
                  Docs ZIP
                </button>
              )}
            </div>
          </div>
        </div>
        {(can(role, 'all') || can(role, 'approve')) && (
          <div
            style={{
              marginTop: 12,
              paddingTop: 12,
              borderTop: '1px solid rgba(255,255,255,.15)',
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,.4)',
                fontFamily: '"JetBrains Mono",monospace',
              }}
            >
              CHANGE STATUS:
            </span>
            {STATUSES.filter((s) => s !== vendor.status).map((s) => (
              <button
                key={s}
                className="btn bsm"
                style={{
                  background: 'rgba(255,255,255,.1)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,.2)',
                  fontSize: 11,
                }}
                onClick={() => onChangeStatus(vendor.id, s)}
              >
                to {STATUS_META[s].label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="tabs">
        {(['checklist', 'documents', 'tasks', 'risk', 'frameworks', 'audit'] as TabKey[]).map((t) => (
          <div key={t} className={'tab' + (activeTab === t ? ' on' : '')} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </div>
        ))}
      </div>

      {activeTab === 'checklist' && <ChecklistTab vendor={vendor} role={role} onUpdate={onUpdateChecklist} />}
      {activeTab === 'documents' && (
        <DocumentsTab vendor={vendor} role={role} settings={settings} onAdd={onAddDocument} />
      )}
      {activeTab === 'tasks' && <TasksTab vendor={vendor} role={role} onAddTask={onAddTask} onToggle={onToggleTask} />}
      {activeTab === 'risk' && <RiskTab vendor={vendor} role={role} onSave={onSaveRisk} />}
      {activeTab === 'frameworks' && (
        <VendorFWTab
          vendor={vendor}
          role={role}
          onUpdateControl={onUpdateFWControl}
          onUpdateVendorFW={onUpdateVendorFW}
        />
      )}
      {activeTab === 'audit' && <VendorAuditTab vendor={vendor} />}
    </>
  );
}
