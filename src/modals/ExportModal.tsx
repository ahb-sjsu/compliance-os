import type { Vendor } from '../types/vendor';
import type { AppSettings } from '../types/settings';
import { Modal } from '../components/ui/Modal';

interface ExportModalProps {
  vendors: Vendor[];
  onClose: () => void;
  settings: AppSettings;
}

export function ExportModal({ vendors, onClose, settings: S }: ExportModalProps) {
  const exportCSV = () => {
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
        String(cl.filter((i) => i.status === 'missing').length),
        (v.frameworks || []).join('; '),
        v.riskDone ? 'Yes' : 'No',
      ];
    });
    const disc: string[] =
      S && S.exportDisclaimer
        ? [
            'DISCLAIMER: This export is for tracking purposes only. It does not constitute certification or authorization under any compliance framework.',
            '',
          ]
        : [];
    const csv = [
      'ComplianceOS Vendor Export',
      'Generated: ' + new Date().toLocaleDateString(),
      ...disc,
      '',
      hdr,
      ...rows,
    ]
      .map((r) => (Array.isArray(r) ? r.map((c) => '"' + (c || '') + '"').join(',') : r))
      .join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'ComplianceOS_AllVendors_' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
    onClose();
  };

  const footer = (
    <>
      <button className="btn bs" onClick={onClose}>
        Cancel
      </button>
      <button className="btn bp" onClick={exportCSV}>
        Download CSV
      </button>
    </>
  );

  return (
    <Modal
      onClose={onClose}
      title="Export Vendor Data"
      subtitle="Download all vendor compliance data as CSV"
      footer={footer}
    >
      <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 14 }}>
        This will export all {vendors.length} vendors with full checklist, risk, and framework data.
      </p>
      {S && S.exportDisclaimer && (
        <div className="al al-i">A compliance disclaimer will be included in the export header.</div>
      )}
    </Modal>
  );
}
