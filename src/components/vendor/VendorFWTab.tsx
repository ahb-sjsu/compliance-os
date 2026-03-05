import { useState } from 'react';
import type { Vendor } from '../../types/vendor';
import type { ControlStatus, FrameworkData } from '../../types/framework';
import { can, type Role } from '../../constants/roles';
import { FW } from '../../constants/frameworks';
import { suggestFW } from '../../helpers/vendors';
import VendorFWDetail from './VendorFWDetail';

interface VendorFWTabProps {
  vendor: Vendor;
  role: Role;
  onUpdateControl: (vendorId: string, fwId: string, ctrlId: string, status: ControlStatus, wNote?: string) => void;
  onUpdateVendorFW: (vendorId: string, fwIds: string[]) => void;
}

const SM: Record<string, { icon: string; cls: string }> = {
  approved: { icon: 'v', cls: 'ci-ok' },
  pending: { icon: 'o', cls: 'ci-wn' },
  missing: { icon: 'x', cls: 'ci-ms' },
  waived: { icon: '~', cls: 'ci-wv' },
};

export default function VendorFWTab({ vendor, role, onUpdateControl, onUpdateVendorFW }: VendorFWTabProps) {
  const [activeFw, setActiveFw] = useState<string | null>((vendor.frameworks || [])[0] || null);
  const [showControls, setShowControls] = useState(false);
  const [editingFws, setEditingFws] = useState(false);
  const [selFws, setSelFws] = useState<string[]>(vendor.frameworks || []);
  const [waiving, setWaiving] = useState<{ fwId: string; ctrlId: string } | null>(null);
  const [wNote, setWNote] = useState('');

  const fwData: Record<string, FrameworkData> = vendor.frameworkData || {};

  const fwScore = (fwId: string) => {
    const ctrls = (fwData[fwId] && fwData[fwId].controls) || [];
    const done = ctrls.filter((c) => c.status === 'approved' || c.status === 'waived').length;
    return { done, total: ctrls.length, pct: ctrls.length ? Math.round((done / ctrls.length) * 100) : 0 };
  };

  const appliedFws = vendor.frameworks || [];

  if (appliedFws.length === 0)
    return (
      <div className="es">
        <div style={{ marginBottom: 12 }}>No frameworks assigned to this vendor.</div>
        {can(role, 'all') && (
          <button className="btn bs bsm" onClick={() => setEditingFws(true)}>
            Manage Frameworks
          </button>
        )}

        {editingFws && (
          <div className="ov" onClick={() => setEditingFws(false)}>
            <div className="mo" onClick={(e) => e.stopPropagation()}>
              <div className="mo-hd">
                <div>
                  <div className="mo-ti">Manage Frameworks</div>
                  <div className="mo-su">Select which frameworks apply to this vendor</div>
                </div>
                <button className="mo-cl" onClick={() => setEditingFws(false)}>
                  &times;
                </button>
              </div>
              <div className="mo-bd">
                {Object.values(FW).map((fw) => {
                  const checked = selFws.includes(fw.id);
                  const sug = suggestFW(vendor).includes(fw.id);
                  return (
                    <label
                      key={fw.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: '1px solid var(--border)',
                        marginBottom: 8,
                        cursor: 'pointer',
                        background: checked ? 'var(--surface3)' : 'var(--surface)',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setSelFws((p) => (p.includes(fw.id) ? p.filter((x) => x !== fw.id) : [...p, fw.id]))
                        }
                        style={{ width: 16, height: 16 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{fw.full}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>{fw.controls.length} controls</div>
                      </div>
                      {sug && (
                        <span className="badge bb" style={{ fontSize: 9 }}>
                          Suggested
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
              <div className="mo-ft">
                <button className="btn bs" onClick={() => setEditingFws(false)}>
                  Cancel
                </button>
                <button
                  className="btn bp"
                  onClick={() => {
                    onUpdateVendorFW(vendor.id, selFws);
                    setEditingFws(false);
                    setActiveFw(selFws[0] || null);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {appliedFws.map((fid) => {
          const sc = fwScore(fid);
          const pc = sc.pct === 100 ? 'var(--green)' : sc.done < sc.total / 2 ? 'var(--red)' : 'var(--yellow)';
          return (
            <div
              key={fid}
              onClick={() => {
                setActiveFw(fid);
                setShowControls(false);
              }}
              style={{
                cursor: 'pointer',
                padding: '10px 14px',
                borderRadius: 8,
                border: '2px solid',
                borderColor: activeFw === fid ? 'var(--ink)' : 'var(--border)',
                background: activeFw === fid ? 'var(--ink)' : 'var(--surface)',
                color: activeFw === fid ? '#fff' : 'var(--text)',
                minWidth: 110,
                transition: 'all .12s',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 12 }}>{fid}</div>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: '"JetBrains Mono",monospace',
                  color: activeFw === fid ? 'rgba(255,255,255,.6)' : pc,
                  marginTop: 2,
                }}
              >
                {sc.pct}% &bull; {sc.done}/{sc.total}
              </div>
            </div>
          );
        })}
        {can(role, 'all') && (
          <button className="btn bs bsm np" onClick={() => setEditingFws(true)}>
            Manage
          </button>
        )}
      </div>

      {activeFw && fwData[activeFw] && (
        <VendorFWDetail
          activeFw={activeFw}
          fwData={fwData}
          vendor={vendor}
          role={role}
          showControls={showControls}
          setShowControls={setShowControls}
          SM={SM}
          onUpdateControl={onUpdateControl}
          setWaiving={setWaiving}
          setWNote={setWNote}
        />
      )}

      {!activeFw && appliedFws.length > 0 && <div className="es">Select a framework above</div>}

      {waiving && (
        <div className="ov" onClick={() => setWaiving(null)}>
          <div className="mo" onClick={(e) => e.stopPropagation()}>
            <div className="mo-hd">
              <div>
                <div className="mo-ti">Waive Framework Control</div>
                <div className="mo-su">Justification required for audit trail</div>
              </div>
              <button className="mo-cl" onClick={() => setWaiving(null)}>
                &times;
              </button>
            </div>
            <div className="mo-bd">
              <div className="fg">
                <label className="fl">Justification (required)</label>
                <textarea
                  value={wNote}
                  onChange={(e) => setWNote(e.target.value)}
                  placeholder="Why is this control being waived?"
                />
              </div>
            </div>
            <div className="mo-ft">
              <button className="btn bs" onClick={() => setWaiving(null)}>
                Cancel
              </button>
              <button
                className="btn bp"
                onClick={() => {
                  if (!wNote.trim()) {
                    alert('Justification required');
                    return;
                  }
                  onUpdateControl(vendor.id, waiving.fwId, waiving.ctrlId, 'waived', wNote);
                  setWaiving(null);
                }}
              >
                Confirm Waiver
              </button>
            </div>
          </div>
        </div>
      )}

      {editingFws && (
        <div className="ov" onClick={() => setEditingFws(false)}>
          <div className="mo" onClick={(e) => e.stopPropagation()}>
            <div className="mo-hd">
              <div>
                <div className="mo-ti">Manage Frameworks</div>
                <div className="mo-su">Select which frameworks apply to this vendor</div>
              </div>
              <button className="mo-cl" onClick={() => setEditingFws(false)}>
                &times;
              </button>
            </div>
            <div className="mo-bd">
              {Object.values(FW).map((fw) => {
                const checked = selFws.includes(fw.id);
                const sug = suggestFW(vendor).includes(fw.id);
                return (
                  <label
                    key={fw.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      marginBottom: 8,
                      cursor: 'pointer',
                      background: checked ? 'var(--surface3)' : 'var(--surface)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setSelFws((p) => (p.includes(fw.id) ? p.filter((x) => x !== fw.id) : [...p, fw.id]))
                      }
                      style={{ width: 16, height: 16 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{fw.full}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>{fw.controls.length} controls</div>
                    </div>
                    {sug && (
                      <span className="badge bb" style={{ fontSize: 9 }}>
                        Suggested
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
            <div className="mo-ft">
              <button className="btn bs" onClick={() => setEditingFws(false)}>
                Cancel
              </button>
              <button
                className="btn bp"
                onClick={() => {
                  onUpdateVendorFW(vendor.id, selFws);
                  setEditingFws(false);
                  setActiveFw(selFws[0] || null);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
