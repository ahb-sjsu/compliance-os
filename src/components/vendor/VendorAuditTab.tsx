import type { Vendor } from '../../types/vendor';

interface VendorAuditTabProps {
  vendor: Vendor;
}

export default function VendorAuditTab({ vendor }: VendorAuditTabProps) {
  return (
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
          {(vendor.auditLog || []).length === 0 && (
            <tr>
              <td colSpan={4}>
                <div className="es">No audit entries</div>
              </td>
            </tr>
          )}
          {(vendor.auditLog || []).map((e, i) => (
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
  );
}
