import { useState } from 'react';
import type { Vendor } from '../types/vendor';
import type { AppSettings } from '../types/settings';
import { suggestFW } from '../helpers/vendors';
import { Modal } from '../components/ui/Modal';

interface VendorModalProps {
  data?: Vendor;
  onSave: (v: Partial<Vendor>) => void;
  onClose: () => void;
  settings: AppSettings;
}

export function VendorModal({ data, onSave, onClose, settings }: VendorModalProps) {
  const S = settings || ({} as AppSettings);
  const blank: Partial<Vendor> = {
    company: '',
    dba: '',
    contact: '',
    email: '',
    category: 'Technology',
    tier: S.defaultTier || 'MED',
    onsite: false,
    paid: S.defaultPaid !== undefined ? S.defaultPaid : true,
    status: S.defaultStatus || 'PROSPECT',
    owner: '',
    notes: '',
  };
  const [form, setForm] = useState<Partial<Vendor>>(data ? { ...blank, ...data } : blank);
  const sug = suggestFW(form as Pick<Vendor, 'tier' | 'category'>);

  const footer = (
    <>
      <button className="btn bs" onClick={onClose}>
        Cancel
      </button>
      <button
        className="btn bp"
        onClick={() => {
          if (!(form.company || '').trim()) {
            alert('Company name required');
            return;
          }
          onSave(form);
        }}
      >
        {data ? 'Save Changes' : 'Add Vendor'}
      </button>
    </>
  );

  return (
    <Modal
      onClose={onClose}
      title={data ? 'Edit Vendor' : 'Add New Vendor'}
      subtitle={data ? 'Update vendor information' : 'Fill in the details below. The checklist will be auto-generated.'}
      footer={footer}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="fg">
          <label className="fl">Company Name *</label>
          <input
            value={form.company || ''}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            placeholder="Acme Corp"
          />
        </div>
        <div className="fg">
          <label className="fl">DBA / Trade Name</label>
          <input
            value={form.dba || ''}
            onChange={(e) => setForm((f) => ({ ...f, dba: e.target.value }))}
            placeholder="Optional"
          />
        </div>
        <div className="fg">
          <label className="fl">Contact Name</label>
          <input
            value={form.contact || ''}
            onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
            placeholder="Jane Smith"
          />
        </div>
        <div className="fg">
          <label className="fl">Email</label>
          <input
            type="email"
            value={form.email || ''}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="jane@vendor.com"
          />
        </div>
        <div className="fg">
          <label className="fl">Category</label>
          <select
            value={form.category || 'Technology'}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          >
            {['Technology', 'Legal', 'Logistics', 'Finance', 'Consulting', 'Security', 'Facilities', 'Other'].map(
              (c) => (
                <option key={c}>{c}</option>
              ),
            )}
          </select>
        </div>
        <div className="fg">
          <label className="fl">Risk Tier</label>
          <select
            value={form.tier || 'MED'}
            onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value as Vendor['tier'] }))}
          >
            <option value="LOW">LOW Risk</option>
            <option value="MED">MED Risk</option>
            <option value="HIGH">HIGH Risk</option>
          </select>
        </div>
        <div className="fg">
          <label className="fl">Owner</label>
          <input
            value={form.owner || ''}
            onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
            placeholder="Admin User"
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24, marginBottom: 14 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
          <input
            type="checkbox"
            checked={!!form.paid}
            onChange={(e) => setForm((f) => ({ ...f, paid: e.target.checked }))}
            style={{ width: 16, height: 16 }}
          />
          Paid Vendor (requires W-9)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
          <input
            type="checkbox"
            checked={!!form.onsite}
            onChange={(e) => setForm((f) => ({ ...f, onsite: e.target.checked }))}
            style={{ width: 16, height: 16 }}
          />
          Onsite Access (requires COI)
        </label>
      </div>
      {sug.length > 0 && (
        <div className="al al-i" style={{ marginBottom: 14 }}>
          Suggested frameworks based on tier and category:{' '}
          {sug.map((f) => (
            <strong key={f} style={{ marginLeft: 4 }}>
              {f}
            </strong>
          ))}
        </div>
      )}
      <div className="fg">
        <label className="fl">Notes</label>
        <textarea
          value={form.notes || ''}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          placeholder="Internal notes..."
        />
      </div>
    </Modal>
  );
}
