import { useState } from 'react';
import type { Vendor, ChecklistStatus } from '../../types/vendor';
import { can, type Role } from '../../constants/roles';

interface ChecklistTabProps {
  vendor: Vendor;
  role: Role;
  onUpdate: (vendorId: number, itemId: string, status: ChecklistStatus, wNote?: string) => void;
}

const SM: Record<string, { icon: string; cls: string }> = {
  approved: { icon: 'v', cls: 'ci-ok' },
  pending: { icon: 'o', cls: 'ci-wn' },
  missing: { icon: 'x', cls: 'ci-ms' },
  waived: { icon: '~', cls: 'ci-wv' },
};

export default function ChecklistTab({ vendor, role, onUpdate }: ChecklistTabProps) {
  const [waiving, setWaiving] = useState<string | null>(null);
  const [wNote, setWNote] = useState('');

  return (
    <>
      {(vendor.checklist || []).map((item) => {
        const m = SM[item.status] || SM.missing;
        return (
          <div key={item.id} className="ci">
            <div className={'ci-ic ' + m.cls}>{m.icon}</div>
            <div className="ci-inf">
              <div className="ci-nm">{item.label}</div>
              <div className="ci-rf">{item.ref}</div>
              {item.approvedBy && (
                <div
                  style={{
                    fontSize: 10,
                    color: 'var(--text3)',
                    fontFamily: '"JetBrains Mono",monospace',
                    marginTop: 2,
                  }}
                >
                  {item.status === 'waived' ? 'Waived' : 'Approved'} by {item.approvedBy} &mdash; {item.approvedAt}
                  {item.notes ? ' \u2014 ' + item.notes : ''}
                </div>
              )}
            </div>
            {can(role, 'approve') && (
              <div className="ci-ac np">
                {item.status !== 'approved' && (
                  <button className="btn bsuc bsm" onClick={() => onUpdate(vendor.id, item.id, 'approved')}>
                    Approve
                  </button>
                )}
                {item.status !== 'pending' && (
                  <button className="btn bs bsm" onClick={() => onUpdate(vendor.id, item.id, 'pending')}>
                    Pending
                  </button>
                )}
                {item.status !== 'waived' && (
                  <button
                    className="btn bs bsm"
                    onClick={() => {
                      setWaiving(item.id);
                      setWNote('');
                    }}
                  >
                    Waive
                  </button>
                )}
                {item.status !== 'missing' && (
                  <button className="btn bs bsm" onClick={() => onUpdate(vendor.id, item.id, 'missing')}>
                    Reset
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {waiving && (
        <div className="ov" onClick={() => setWaiving(null)}>
          <div className="mo" onClick={(e) => e.stopPropagation()}>
            <div className="mo-hd">
              <div>
                <div className="mo-ti">Waive Checklist Item</div>
                <div className="mo-su">Justification is required for audit trail</div>
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
                  placeholder="Why is this item being waived?"
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
                  onUpdate(vendor.id, waiving, 'waived', wNote);
                  setWaiving(null);
                }}
              >
                Confirm Waiver
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
