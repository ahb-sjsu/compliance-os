import { useState } from 'react';
import type { Vendor } from '../../types/vendor';
import { can, type Role } from '../../constants/roles';
import { RISK_QUESTIONS } from '../../constants/riskQuestions';

interface RiskTabProps {
  vendor: Vendor;
  role: Role;
  onSave: (vendorId: string, answers: boolean[]) => void;
}

export default function RiskTab({ vendor, role, onSave }: RiskTabProps) {
  const [answers, setAnswers] = useState<boolean[]>(
    vendor.riskAnswers && vendor.riskAnswers.length === 10 ? [...vendor.riskAnswers] : new Array(10).fill(false),
  );
  const [editing, setEditing] = useState(!vendor.riskDone);
  const score = answers.filter(Boolean).length;
  const level = score <= 2 ? 'Low' : score <= 5 ? 'Medium' : 'High';
  const lc = level === 'Low' ? 'var(--green)' : level === 'Medium' ? 'var(--yellow)' : 'var(--red)';
  const barCls = level === 'Low' ? 'lo' : level === 'Medium' ? 'me' : 'hi';

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 20,
          padding: '16px 20px',
          background: 'var(--surface2)',
          borderRadius: 8,
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ textAlign: 'center', minWidth: 80 }}>
          <div style={{ fontSize: 32, fontWeight: 600, color: lc, lineHeight: 1 }}>{score}/10</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: lc, marginTop: 4 }}>{level} Risk</div>
        </div>
        <div style={{ flex: 1 }}>
          <div className="rb">
            {[...Array(10)].map((_, i) => (
              <div key={i} className={'rs' + (i < score ? ' ' + barCls : '')} />
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 6 }}>
            {vendor.riskDone ? 'Snapshot completed. Stored for audit.' : 'Risk snapshot not yet completed.'}
          </div>
        </div>
        {(can(role, 'create') || can(role, 'all')) && (
          <button className="btn bs bsm np" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit'}
          </button>
        )}
      </div>

      {RISK_QUESTIONS.map((q, i) => (
        <div key={i} className="rq">
          <div style={{ flex: 1, fontSize: 12.5, paddingRight: 12, lineHeight: 1.4 }}>
            <span
              style={{ color: 'var(--text3)', fontFamily: '"JetBrains Mono",monospace', fontSize: 10, marginRight: 8 }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            {q}
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button
              className={'btn bsm ' + (answers[i] ? 'bdng' : 'bs')}
              disabled={!editing}
              onClick={() => {
                const a = [...answers];
                a[i] = true;
                setAnswers(a);
              }}
            >
              Yes
            </button>
            <button
              className={'btn bsm ' + (!answers[i] ? 'bsuc' : 'bs')}
              disabled={!editing}
              onClick={() => {
                const a = [...answers];
                a[i] = false;
                setAnswers(a);
              }}
            >
              No
            </button>
          </div>
        </div>
      ))}

      {editing && (can(role, 'create') || can(role, 'all')) && (
        <div style={{ marginTop: 14 }}>
          <button
            className="btn bp"
            onClick={() => {
              onSave(vendor.id, answers);
              setEditing(false);
            }}
          >
            Save Risk Snapshot
          </button>
        </div>
      )}
    </>
  );
}
