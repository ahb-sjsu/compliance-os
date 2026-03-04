import { useState } from 'react';
import type { Vendor } from '../types/vendor';
import type { ControlStatus } from '../types/framework';
import { FW } from '../constants/frameworks';
import { STATUS_META } from '../constants/statuses';
import { Modal } from '../components/ui/Modal';

interface FWReportModalProps {
  vendors: Vendor[];
  onClose: () => void;
}

export function FWReportModal({ vendors, onClose }: FWReportModalProps) {
  const [selV, setSelV] = useState<number[]>(vendors.filter((v) => (v.frameworks || []).length > 0).map((v) => v.id));
  const [selF, setSelF] = useState<string[]>(Object.keys(FW));
  const [inclCtrls, setInclCtrls] = useState(true);
  const rDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const rVendors = vendors.filter((v) => selV.includes(v.id) && (v.frameworks || []).some((f) => selF.includes(f)));

  const fwSc = (v: Vendor, fwId: string) => {
    const ctrls = (v.frameworkData && v.frameworkData[fwId] && v.frameworkData[fwId].controls) || [];
    const ok = ctrls.filter((c) => c.status === 'approved' || c.status === 'waived').length;
    return { ok, total: ctrls.length, pct: ctrls.length ? Math.round((ok / ctrls.length) * 100) : 0 };
  };

  const sSym: Record<ControlStatus, string> = {
    approved: 'OK',
    waived: 'W',
    pending: 'P',
    missing: '--',
  };

  const statusColor: Record<ControlStatus, string> = {
    approved: '#166534',
    waived: '#444',
    pending: '#854d0e',
    missing: '#991b1b',
  };

  const footer = (
    <>
      <button className="btn bs" onClick={onClose}>
        Close
      </button>
      <button className="btn bp" onClick={() => window.print()}>
        Print / Save PDF
      </button>
    </>
  );

  return (
    <Modal
      onClose={onClose}
      title="Framework Compliance Report"
      subtitle="Configure and print an audit-ready report"
      xl
      footer={footer}
    >
      {/* --- Configuration area --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <div className="sd">Vendors</div>
          <div style={{ maxHeight: 160, overflowY: 'auto' }}>
            {vendors
              .filter((v) => (v.frameworks || []).length > 0)
              .map((v) => (
                <label
                  key={v.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 12,
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: 5,
                    background: selV.includes(v.id) ? 'var(--surface3)' : 'transparent',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selV.includes(v.id)}
                    onChange={() => setSelV((p) => (p.includes(v.id) ? p.filter((x) => x !== v.id) : [...p, v.id]))}
                  />
                  <span style={{ fontWeight: 600 }}>{v.company}</span>
                  <span style={{ color: 'var(--text3)', fontSize: 10 }}>({(v.frameworks || []).join(', ')})</span>
                </label>
              ))}
          </div>
        </div>
        <div>
          <div className="sd">Options</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
            {Object.values(FW).map((fw) => (
              <label
                key={fw.id}
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}
              >
                <input
                  type="checkbox"
                  checked={selF.includes(fw.id)}
                  onChange={() => setSelF((p) => (p.includes(fw.id) ? p.filter((x) => x !== fw.id) : [...p, fw.id]))}
                />
                <span>{fw.label}</span>
              </label>
            ))}
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
            <input type="checkbox" checked={inclCtrls} onChange={(e) => setInclCtrls(e.target.checked)} />
            Include control-by-control breakdown
          </label>
        </div>
      </div>

      {/* --- Print-ready report preview --- */}
      <div
        style={{
          border: '2px solid var(--border)',
          borderRadius: 8,
          padding: '24px 28px',
          background: '#fff',
          color: '#000',
          fontFamily: 'Georgia,serif',
          maxHeight: 380,
          overflowY: 'auto',
        }}
      >
        {/* Report header */}
        <div style={{ borderBottom: '3px solid #1a1816', paddingBottom: 14, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  fontFamily: 'Arial,sans-serif',
                  color: '#666',
                  marginBottom: 4,
                }}
              >
                COMPLIANCE DOCUMENTATION
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Arial,sans-serif' }}>
                Framework Compliance Report
              </div>
              <div style={{ fontSize: 12, color: '#444', fontFamily: 'Arial,sans-serif' }}>
                Justice Innovations &mdash; ComplianceOS v2
              </div>
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'Arial,sans-serif' }}>
              <div style={{ fontSize: 10, color: '#666' }}>Generated</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{rDate}</div>
              <div style={{ fontSize: 9, color: '#888', fontFamily: 'Courier New,monospace' }}>
                Tracking only &mdash; not a certification
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              padding: '7px 10px',
              background: '#f5f5f5',
              borderRadius: 4,
              fontSize: 9,
              fontFamily: 'Arial,sans-serif',
              color: '#666',
              lineHeight: 1.5,
            }}
          >
            DISCLAIMER: Compliance is determined by the governing agency and your organization&rsquo;s documented
            policies and controls. This report documents internal tracking only and does not constitute CJIS
            certification, FedRAMP authorization, StateRAMP authorization, or CISA accreditation.
          </div>
        </div>

        {/* Vendor sections */}
        {rVendors.map((v) => (
          <div key={v.id} style={{ marginBottom: 28 }}>
            <div
              className="np"
              style={{
                background: '#1a1816',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '5px 5px 0 0',
                fontFamily: 'Arial,sans-serif',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700 }}>{v.company}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,.6)', marginTop: 1 }}>
                {v.category} &bull; {v.tier} &bull; {STATUS_META[v.status] ? STATUS_META[v.status].label : v.status}{' '}
                &bull; Owner: {v.owner || 'Unassigned'}
              </div>
            </div>
            {(v.frameworks || [])
              .filter((fid) => selF.includes(fid))
              .map((fid) => {
                const fw = FW[fid];
                const sc = fwSc(v, fid);
                const ctrls = (v.frameworkData && v.frameworkData[fid] && v.frameworkData[fid].controls) || [];
                const cc = sc.pct === 100 ? '#166534' : sc.ok < sc.total / 2 ? '#991b1b' : '#854d0e';
                return (
                  <div
                    key={fid}
                    style={{
                      border: '1px solid #ddd',
                      borderTop: 'none',
                      padding: '12px 14px',
                      fontFamily: 'Arial,sans-serif',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 8,
                        paddingBottom: 6,
                        borderBottom: '1px solid #eee',
                      }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{fw ? fw.full : fid}</span>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: cc }}>{sc.pct}%</div>
                        <div style={{ fontSize: 8, color: '#888', fontFamily: 'Courier New,monospace' }}>
                          {sc.ok}/{sc.total} controls
                        </div>
                      </div>
                    </div>
                    {inclCtrls && ctrls.length > 0 && (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9 }}>
                        <thead>
                          <tr style={{ background: '#f5f5f5' }}>
                            <th style={{ padding: '4px 6px', textAlign: 'left', width: 55 }}>Section</th>
                            <th style={{ padding: '4px 6px', textAlign: 'left' }}>Control</th>
                            <th style={{ padding: '4px 6px', textAlign: 'center', width: 60 }}>Status</th>
                            <th style={{ padding: '4px 6px', textAlign: 'left', width: 90 }}>By</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ctrls.map((c, ci) => (
                            <tr
                              key={c.id}
                              style={{
                                background: ci % 2 === 0 ? '#fff' : '#fafafa',
                                borderBottom: '1px solid #f0f0f0',
                              }}
                            >
                              <td
                                style={{
                                  padding: '4px 6px',
                                  fontFamily: 'Courier New,monospace',
                                  color: '#666',
                                  fontSize: 8,
                                }}
                              >
                                {c.sec}
                              </td>
                              <td style={{ padding: '4px 6px' }}>{c.label}</td>
                              <td
                                style={{
                                  padding: '4px 6px',
                                  textAlign: 'center',
                                  fontWeight: 700,
                                  color: statusColor[c.status] || '#666',
                                }}
                              >
                                {sSym[c.status] || '?'}
                              </td>
                              <td style={{ padding: '4px 6px', color: '#666' }}>{c.approvedBy || '--'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                      {['Compliance Officer', 'Reviewer', 'Date'].map((lbl) => (
                        <div key={lbl} style={{ borderTop: '1px solid #999', paddingTop: 3 }}>
                          <div
                            style={{
                              fontSize: 8,
                              color: '#888',
                              fontFamily: 'Courier New,monospace',
                              textTransform: 'uppercase',
                            }}
                          >
                            {lbl}
                          </div>
                          <div style={{ height: 14 }} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        ))}

        {rVendors.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#888', fontFamily: 'Arial,sans-serif' }}>
            No vendors selected.
          </div>
        )}

        {/* Report footer */}
        <div
          style={{
            borderTop: '2px solid #1a1816',
            marginTop: 20,
            paddingTop: 10,
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 8,
            color: '#888',
            fontFamily: 'Courier New,monospace',
          }}
        >
          <span>ComplianceOS v2 &mdash; Justice Innovations</span>
          <span>Generated {rDate} &mdash; Internal use only</span>
          <span>Not a certification document</span>
        </div>
      </div>
    </Modal>
  );
}
