import type { AuditEntry } from '../types/vendor';

interface AuditLogPageProps {
  globalAudit: AuditEntry[];
}

export default function AuditLogPage({ globalAudit }: AuditLogPageProps) {
  return (
    <>
      <div className="al al-i">
        Audit log is append-only. All actions are timestamped with actor, entity, and details. In production, store
        immutably with WORM protection and retention policies per your applicable compliance framework and CSA guidance.
      </div>
      <div className="tw">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Entity</th>
            </tr>
          </thead>
          <tbody>
            {globalAudit.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <div className="es">No audit entries</div>
                </td>
              </tr>
            )}
            {globalAudit.map((e, i) => (
              <tr key={i}>
                <td
                  style={{
                    fontFamily: '"JetBrains Mono",monospace',
                    fontSize: 11,
                    color: 'var(--text3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {e.ts}
                </td>
                <td style={{ fontWeight: 600, fontSize: 12 }}>{e.actor}</td>
                <td style={{ fontSize: 12, color: 'var(--text2)' }}>{e.action}</td>
                <td>
                  <span className="badge bgr">{e.entity}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
