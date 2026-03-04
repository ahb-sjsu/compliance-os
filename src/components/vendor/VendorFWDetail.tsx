import type { Dispatch, SetStateAction } from 'react';
import type { Vendor } from '../../types/vendor';
import type { ControlStatus, FrameworkControl, FrameworkData } from '../../types/framework';
import { can, type Role } from '../../constants/roles';
import { FW } from '../../constants/frameworks';

interface StatusMap {
  [key: string]: { icon: string; cls: string };
}

interface VendorFWDetailProps {
  activeFw: string;
  fwData: Record<string, FrameworkData>;
  vendor: Vendor;
  role: Role;
  showControls: boolean;
  setShowControls: Dispatch<SetStateAction<boolean>>;
  SM: StatusMap;
  onUpdateControl: (vendorId: number, fwId: string, ctrlId: string, status: ControlStatus, wNote?: string) => void;
  setWaiving: Dispatch<SetStateAction<{ fwId: string; ctrlId: string } | null>>;
  setWNote: Dispatch<SetStateAction<string>>;
}

export default function VendorFWDetail({
  activeFw,
  fwData,
  vendor,
  role,
  showControls,
  setShowControls,
  SM,
  onUpdateControl,
  setWaiving,
  setWNote,
}: VendorFWDetailProps) {
  const fw = FW[activeFw];
  const controls: FrameworkControl[] = (fwData[activeFw] && fwData[activeFw].controls) || [];
  const done = controls.filter((c) => c.status === 'approved' || c.status === 'waived').length;
  const total = controls.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const miss = controls.filter((c) => c.status === 'missing').length;
  const pc = pct === 100 ? 'var(--green)' : miss > 0 ? 'var(--red)' : 'var(--ink)';

  return (
    <>
      <div
        style={{
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{fw ? fw.full : activeFw}</div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{fw ? fw.desc : ''}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 20, color: pc }}>{pct}%</div>
          <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: '"JetBrains Mono",monospace' }}>
            {done}/{total} controls
          </div>
        </div>
      </div>

      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}
        className="np"
      >
        <span style={{ fontSize: 11, color: 'var(--text3)' }}>
          {showControls
            ? 'Showing ' + total + ' controls \u2014 collapse when done.'
            : 'Controls hidden. Expand for detailed review.'}
        </span>
        <button className="btn bs bsm" onClick={() => setShowControls((p) => !p)}>
          {showControls ? 'Collapse Controls' : 'Show Controls'}
        </button>
      </div>

      {!showControls && (
        <div className="es" style={{ padding: 24 }}>
          Click Show Controls to review individual {activeFw} controls
        </div>
      )}

      {showControls &&
        controls.map((ctrl) => {
          const m = SM[ctrl.status] || SM.missing;
          return (
            <div key={ctrl.id} className="ci">
              <div className={'ci-ic ' + m.cls}>{m.icon}</div>
              <div className="ci-inf">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="ci-nm">{ctrl.label}</span>
                  <span
                    style={{
                      fontSize: 9,
                      fontFamily: '"JetBrains Mono",monospace',
                      background: 'var(--surface3)',
                      color: 'var(--text3)',
                      padding: '1px 5px',
                      borderRadius: 3,
                    }}
                  >
                    {ctrl.sec}
                  </span>
                </div>
                <div className="ci-rf">{ctrl.ref}</div>
                {ctrl.approvedBy && (
                  <div
                    style={{
                      fontSize: 10,
                      color: 'var(--text3)',
                      fontFamily: '"JetBrains Mono",monospace',
                      marginTop: 2,
                    }}
                  >
                    {ctrl.status === 'waived' ? 'Waived' : 'Approved'} by {ctrl.approvedBy} &mdash; {ctrl.approvedAt}
                    {ctrl.notes ? ' \u2014 ' + ctrl.notes : ''}
                  </div>
                )}
              </div>
              {can(role, 'approve') && (
                <div className="ci-ac np">
                  {ctrl.status !== 'approved' && (
                    <button
                      className="btn bsuc bsm"
                      onClick={() => onUpdateControl(vendor.id, activeFw, ctrl.id, 'approved')}
                    >
                      Approve
                    </button>
                  )}
                  {ctrl.status !== 'pending' && (
                    <button
                      className="btn bs bsm"
                      onClick={() => onUpdateControl(vendor.id, activeFw, ctrl.id, 'pending')}
                    >
                      Pending
                    </button>
                  )}
                  {ctrl.status !== 'waived' && (
                    <button
                      className="btn bs bsm"
                      onClick={() => {
                        setWaiving({ fwId: activeFw, ctrlId: ctrl.id });
                        setWNote('');
                      }}
                    >
                      Waive
                    </button>
                  )}
                  {ctrl.status !== 'missing' && (
                    <button
                      className="btn bs bsm"
                      onClick={() => onUpdateControl(vendor.id, activeFw, ctrl.id, 'missing')}
                    >
                      Reset
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
    </>
  );
}
