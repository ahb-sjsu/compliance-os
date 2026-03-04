import type { Vendor } from '../types/vendor';

export function exportVendorsCSV(vendors: Vendor[], title: string, includeDisclaimer: boolean): void {
  const hdr = ['Company', 'Category', 'Tier', 'Status', 'Owner', 'Done', 'Missing'];
  const rows = vendors.map((v) => {
    const cl = v.checklist || [];
    return [
      v.company,
      v.category,
      v.tier,
      v.status,
      v.owner || 'Unassigned',
      cl.filter((i) => i.status === 'approved' || i.status === 'waived').length + '/' + cl.length,
      cl.filter((i) => i.status === 'missing').length,
    ];
  });
  const disc = includeDisclaimer
    ? [
        'DISCLAIMER: This export is for tracking purposes only. It does not constitute certification or authorization under any compliance framework.',
        '',
      ]
    : [];
  const csv = [title, 'Generated: ' + new Date().toLocaleDateString(), ...disc, '', hdr, ...rows]
    .map((r) => (Array.isArray(r) ? r.map((c) => '"' + c + '"').join(',') : r))
    .join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'ComplianceOS_' + title.replace(/\s/g, '_') + '_' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
}

export function exportFullCSV(vendors: Vendor[], includeDisclaimer: boolean): void {
  const hdr = [
    'Company',
    'DBA',
    'Contact',
    'Email',
    'Category',
    'Tier',
    'Status',
    'Owner',
    'Checklist Done',
    'Checklist Missing',
    'Frameworks',
    'Risk Done',
  ];
  const rows = vendors.map((v) => {
    const cl = v.checklist || [];
    return [
      v.company,
      v.dba || '',
      v.contact,
      v.email,
      v.category,
      v.tier,
      v.status,
      v.owner || '',
      cl.filter((i) => i.status === 'approved' || i.status === 'waived').length + '/' + cl.length,
      cl.filter((i) => i.status === 'missing').length,
      (v.frameworks || []).join('; '),
      v.riskDone ? 'Yes' : 'No',
    ];
  });
  const disc = includeDisclaimer
    ? [
        'DISCLAIMER: This export is for tracking purposes only. It does not constitute certification or authorization under any compliance framework.',
        '',
      ]
    : [];
  const csv = ['ComplianceOS Vendor Export', 'Generated: ' + new Date().toLocaleDateString(), ...disc, '', hdr, ...rows]
    .map((r) => (Array.isArray(r) ? r.map((c) => '"' + (c || '') + '"').join(',') : r))
    .join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'ComplianceOS_AllVendors_' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
}
