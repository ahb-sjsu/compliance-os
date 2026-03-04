import type { Vendor } from '../types/vendor';
import { STATUS_META } from '../constants/statuses';
import { StatusBadge, TierBadge } from '../components/ui/Badge';

interface VendorFilters {
  status: string;
  tier: string;
  missing: string;
}

interface VendorsListProps {
  vendors: Vendor[];
  search: string;
  setSearch: (s: string) => void;
  filters: VendorFilters;
  setFilters: (fn: (f: VendorFilters) => VendorFilters) => void;
  onOpen: (v: Vendor) => void;
  allCount: number;
}

export default function VendorsList({
  vendors,
  search,
  setSearch,
  filters,
  setFilters,
  onOpen,
  allCount,
}: VendorsListProps) {
  const hasF = search || filters.status !== 'all' || filters.tier !== 'all' || filters.missing !== 'all';

  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <input
          style={{ maxWidth: 220 }}
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          style={{ width: 'auto' }}
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        >
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_META).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
        <select
          style={{ width: 'auto' }}
          value={filters.tier}
          onChange={(e) => setFilters((f) => ({ ...f, tier: e.target.value }))}
        >
          <option value="all">All Tiers</option>
          <option value="HIGH">HIGH Risk</option>
          <option value="MED">MED Risk</option>
          <option value="LOW">LOW Risk</option>
        </select>
        <select
          style={{ width: 'auto' }}
          value={filters.missing}
          onChange={(e) => setFilters((f) => ({ ...f, missing: e.target.value }))}
        >
          <option value="all">All</option>
          <option value="yes">Has Missing Items</option>
        </select>
        {hasF && (
          <button
            className="btn bs bsm"
            onClick={() => {
              setSearch('');
              setFilters(() => ({ status: 'all', tier: 'all', missing: 'all' }));
            }}
          >
            Clear
          </button>
        )}
        <span
          style={{
            marginLeft: 'auto',
            fontSize: 12,
            color: 'var(--text3)',
            fontFamily: '"JetBrains Mono",monospace',
          }}
        >
          {vendors.length} of {allCount}
        </span>
      </div>
      <div className="tw">
        <table>
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Category</th>
              <th>Tier</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Checklist</th>
              <th>Frameworks</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <div className="es">No vendors match</div>
                </td>
              </tr>
            )}
            {vendors.map((v) => {
              const done = (v.checklist || []).filter((i) => i.status === 'approved' || i.status === 'waived').length;
              const total = (v.checklist || []).length;
              const miss = (v.checklist || []).filter((i) => i.status === 'missing').length;
              return (
                <tr key={v.id} style={{ cursor: 'pointer' }} onClick={() => onOpen(v)}>
                  <td style={{ fontWeight: 600 }}>{v.company}</td>
                  <td style={{ fontSize: 12, color: 'var(--text2)' }}>{v.category}</td>
                  <td>
                    <TierBadge tier={v.tier} />
                  </td>
                  <td>
                    <StatusBadge status={v.status} />
                  </td>
                  <td style={{ fontSize: 12 }}>{v.owner || <span className="badge br">Unassigned</span>}</td>
                  <td
                    style={{
                      fontFamily: '"JetBrains Mono",monospace',
                      fontSize: 11,
                    }}
                  >
                    {done}/{total}
                    {miss > 0 && (
                      <span className="badge br" style={{ marginLeft: 6 }}>
                        {miss}
                      </span>
                    )}
                  </td>
                  <td>
                    {(v.frameworks || []).map((f) => (
                      <span key={f} className="badge bgr" style={{ marginRight: 3, fontSize: 9 }}>
                        {f}
                      </span>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
