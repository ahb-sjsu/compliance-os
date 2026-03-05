import { useState } from 'react';
import type { Vendor } from '../../types/vendor';
import type { AppSettings } from '../../types/settings';
import { can, type Role } from '../../constants/roles';
import { daysUntil, fmtDays } from '../../helpers/dates';

interface DocumentForm {
  name: string;
  type: string;
  expiry: string;
  sensitive: boolean;
}

interface DocumentsTabProps {
  vendor: Vendor;
  role: Role;
  settings: AppSettings;
  onAdd: (vendorId: string, doc: DocumentForm) => void;
}

export default function DocumentsTab({ vendor, role, settings, onAdd }: DocumentsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<DocumentForm>({ name: '', type: 'Contract', expiry: '', sensitive: false });
  const canDL = (doc: { sensitive: boolean }) => can(role, 'approve') || can(role, 'all') || !doc.sensitive;
  const showSensitive = settings ? settings.showSensitiveIndicators : true;

  return (
    <>
      {can(role, 'upload') && (
        <div style={{ marginBottom: 14 }} className="np">
          <button className="btn bs bsm" onClick={() => setShowForm(!showForm)}>
            + Add Document
          </button>
        </div>
      )}
      {showForm && (
        <div className="card cp" style={{ marginBottom: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">File Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="document.pdf"
              />
            </div>
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                {['Contract', 'W-9', 'COI', 'Security', 'Other'].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">Expiry</label>
              <input
                type="date"
                value={form.expiry}
                onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))}
              />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input
                type="checkbox"
                checked={form.sensitive}
                onChange={(e) => setForm((f) => ({ ...f, sensitive: e.target.checked }))}
                style={{ width: 16, height: 16 }}
              />
              Mark as sensitive (restricted download)
            </label>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn bp bsm"
              onClick={() => {
                if (!form.name) {
                  alert('File name required');
                  return;
                }
                onAdd(vendor.id, form);
                setShowForm(false);
                setForm({ name: '', type: 'Contract', expiry: '', sensitive: false });
              }}
            >
              Add
            </button>
            <button className="btn bs bsm" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {(vendor.documents || []).length === 0 && <div className="es">No documents on file</div>}
      {(vendor.documents || []).map((doc) => {
        const d2 = daysUntil(doc.expiry);
        const dc =
          d2 === null
            ? 'var(--text3)'
            : d2 < 0
              ? 'var(--red)'
              : d2 <= 30
                ? 'var(--red)'
                : d2 <= 90
                  ? 'var(--yellow)'
                  : 'var(--green)';
        return (
          <div key={doc.id} className="dr">
            <span style={{ fontSize: 20, flexShrink: 0 }}>{'\uD83D\uDCC4'}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}>
                {doc.name}
                {doc.sensitive && showSensitive && (
                  <span className="badge br" style={{ fontSize: 9 }}>
                    Sensitive
                  </span>
                )}
              </div>
              <div
                style={{ fontSize: 10, color: 'var(--text3)', fontFamily: '"JetBrains Mono",monospace', marginTop: 2 }}
              >
                {doc.type} &bull; Uploaded by {doc.uploadedBy} &bull; {doc.uploadedAt}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
              {doc.expiry && (
                <span style={{ fontSize: 11, fontFamily: '"JetBrains Mono",monospace', color: dc }}>{fmtDays(d2)}</span>
              )}
              {canDL(doc) ? (
                <button
                  className="btn bs bsm"
                  onClick={() => alert('Download: ' + doc.name + '\n(Requires backend file storage)')}
                >
                  Download
                </button>
              ) : (
                <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: '"JetBrains Mono",monospace' }}>
                  Admin/Reviewer only
                </span>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
