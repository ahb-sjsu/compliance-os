import { useState } from 'react';
import type { Vendor } from '../types/vendor';
import type { FrameworkNotes } from '../types/framework';
import { FW } from '../constants/frameworks';

interface FrameworksAdminProps {
  fwNotes: Record<string, FrameworkNotes>;
  onSave: (fwId: string, patch: Partial<FrameworkNotes>) => void;
  vendors: Vendor[];
  onOpenReport: () => void;
}

export default function FrameworksAdmin({ fwNotes, onSave, vendors, onOpenReport }: FrameworksAdminProps) {
  const [activeFw, setActiveFw] = useState('CJIS');
  const [showCtrls, setShowCtrls] = useState(false);
  const fw = FW[activeFw];
  const notes: FrameworkNotes = fwNotes[activeFw] || {
    aligns: false,
    lastReviewed: '',
    notes: '',
  };

  return (
    <>
      <div
        className="np"
        style={{
          background: 'var(--ink)',
          borderRadius: 10,
          padding: '18px 24px',
          marginBottom: 20,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 3 }}>Frameworks (Admin)</div>
          <div
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,.6)',
              lineHeight: 1.5,
            }}
          >
            Manually track which frameworks apply and document review dates.
          </div>
          <div
            style={{
              fontSize: 10,
              fontFamily: '"JetBrains Mono",monospace',
              color: 'rgba(255,255,255,.35)',
              marginTop: 6,
              background: 'rgba(255,255,255,.06)',
              padding: '3px 10px',
              borderRadius: 4,
              display: 'inline-block',
            }}
          >
            Manual tracking only &mdash; does not automatically monitor compliance
          </div>
        </div>
        <button
          className="btn bsm"
          style={{
            background: 'rgba(255,255,255,.15)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,.3)',
          }}
          onClick={onOpenReport}
        >
          Framework Summary Report
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 10,
          marginBottom: 20,
        }}
      >
        {Object.values(FW).map((f) => {
          const n = fwNotes[f.id] || ({} as Partial<FrameworkNotes>);
          const vc = vendors.filter((v) => (v.frameworks || []).includes(f.id)).length;
          const isActive = activeFw === f.id;
          return (
            <div
              key={f.id}
              onClick={() => {
                setActiveFw(f.id);
                setShowCtrls(false);
              }}
              style={{
                cursor: 'pointer',
                padding: '12px 14px',
                borderRadius: 10,
                border: '2px solid',
                borderColor: isActive ? 'var(--ink)' : 'var(--border)',
                background: isActive ? 'var(--ink)' : 'var(--surface)',
                color: isActive ? '#fff' : 'var(--text)',
                transition: 'all .12s',
                boxShadow: 'var(--sh)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700 }}>{f.id}</span>
                <span
                  className={'badge ' + (n.aligns ? 'bg' : 'bgr')}
                  style={isActive ? { background: 'rgba(255,255,255,.2)', color: '#fff' } : {}}
                >
                  {n.aligns ? 'Aligned' : 'Not set'}
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 3 }}>{f.label}</div>
              <div
                style={{
                  fontSize: 9,
                  fontFamily: '"JetBrains Mono",monospace',
                  opacity: 0.65,
                }}
              >
                {vc} vendors &bull; {n.lastReviewed ? 'Reviewed ' + n.lastReviewed : 'Not reviewed'}
              </div>
            </div>
          );
        })}
      </div>

      {fw && (
        <div className="card cp">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: 16,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{fw.full}</div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--text2)',
                  marginTop: 2,
                }}
              >
                {fw.desc}
              </div>
              <a
                href={fw.src}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 11,
                  color: 'var(--blue)',
                  fontFamily: '"JetBrains Mono",monospace',
                  marginTop: 4,
                  display: 'inline-block',
                  textDecoration: 'none',
                }}
              >
                Official Source
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--text2)' }}>We align to this:</span>
              <label className="tog">
                <input
                  type="checkbox"
                  checked={notes.aligns || false}
                  onChange={(e) => onSave(activeFw, { aligns: e.target.checked })}
                />
                <span className="tog-sl" />
              </label>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: notes.aligns ? 'var(--green)' : 'var(--text3)',
                }}
              >
                {notes.aligns ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
              marginBottom: 14,
            }}
          >
            <div className="fg">
              <label className="fl">Last Reviewed Date</label>
              <input
                type="date"
                value={notes.lastReviewed || ''}
                onChange={(e) => onSave(activeFw, { lastReviewed: e.target.value })}
                max={new Date().toISOString().slice(0, 10)}
              />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                paddingBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--text3)',
                  fontFamily: '"JetBrains Mono",monospace',
                }}
              >
                {fw.controls.length} controls &bull;{' '}
                {vendors.filter((v) => (v.frameworks || []).includes(activeFw)).length} vendors assigned
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--text3)',
                  marginTop: 4,
                }}
              >
                Review periodically and update date to maintain records.
              </div>
            </div>
          </div>

          <div className="fg">
            <label className="fl">Internal Notes</label>
            <textarea
              value={notes.notes || ''}
              onChange={(e) => onSave(activeFw, { notes: e.target.value })}
              placeholder={'Document your alignment status, gaps, and remediation plans for ' + fw.label}
              style={{ minHeight: 80 }}
            />
          </div>

          <div
            style={{
              marginTop: 12,
              borderTop: '1px solid var(--border)',
              paddingTop: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--text2)',
                  }}
                >
                  Advanced: Control Catalog
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: 'var(--text3)',
                    fontFamily: '"JetBrains Mono",monospace',
                    marginLeft: 8,
                  }}
                >
                  {fw.controls.length} controls
                </span>
              </div>
              <button className="btn bs bsm" onClick={() => setShowCtrls((p) => !p)}>
                {showCtrls ? 'Hide Controls' : 'Show Controls'}
              </button>
            </div>
            {!showCtrls && (
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--text3)',
                  marginTop: 6,
                  fontStyle: 'italic',
                }}
              >
                Default view &mdash; expand only when needed for audit prep.
              </div>
            )}
            {showCtrls && (
              <div
                style={{
                  marginTop: 10,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 5,
                }}
              >
                {fw.controls.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      display: 'flex',
                      gap: 8,
                      padding: '7px 10px',
                      background: 'var(--surface2)',
                      borderRadius: 6,
                      border: '1px solid var(--border)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: '"JetBrains Mono",monospace',
                        fontSize: 9,
                        color: 'var(--text3)',
                        flexShrink: 0,
                        minWidth: 50,
                      }}
                    >
                      {c.sec}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text2)' }}>{c.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
