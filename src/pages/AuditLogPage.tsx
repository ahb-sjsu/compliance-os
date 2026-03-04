import type { AuditEntry } from '../types/vendor';
import { usePlan } from '../plan/usePlan';

interface AuditLogPageProps {
  globalAudit: AuditEntry[];
}

export default function AuditLogPage({ globalAudit }: AuditLogPageProps) {
  const { plan } = usePlan();
  const limit = plan.limits.maxAuditLogEntries;
  const entries = limit === Infinity ? globalAudit : globalAudit.slice(0, limit);
  const truncated = globalAudit.length > entries.length;

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
            {entries.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <div className="es">No audit entries</div>
                </td>
              </tr>
            )}
            {entries.map((e, i) => (
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
      {truncated && (
        <div
          style={{
            textAlign: 'center',
            padding: '12px 0',
            fontSize: 12,
            color: 'var(--text3)',
          }}
        >
          Showing {limit} of {globalAudit.length} entries. Upgrade to Pro for full audit history.
        </div>
      )}
    </>
  );
}
