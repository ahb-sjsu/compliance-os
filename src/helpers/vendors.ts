import type { Vendor, ChecklistItem } from '../types/vendor';
import type { FrameworkControl } from '../types/framework';
import { FW } from '../constants/frameworks';

export function suggestFW(v: Pick<Vendor, 'tier' | 'category'>): string[] {
  const ids: string[] = [];
  const cat = (v.category || '').toLowerCase();
  if (v.tier === 'HIGH') ids.push('CJIS');
  if (['MED', 'HIGH'].includes(v.tier) && (cat.includes('tech') || cat.includes('cloud') || cat.includes('saas')))
    ids.push('FedRAMP', 'StateRAMP');
  if (['MED', 'HIGH'].includes(v.tier)) ids.push('CISA');
  return [...new Set(ids)];
}

export function buildFWControls(fwId: string): FrameworkControl[] {
  const fw = FW[fwId];
  if (!fw) return [];
  return fw.controls.map((c) => ({ ...c, status: 'missing' as const, approvedBy: '', approvedAt: '', notes: '' }));
}

export function buildChecklist(v: Pick<Vendor, 'paid' | 'onsite' | 'tier'>): ChecklistItem[] {
  const add = (id: string, label: string, ref: string): ChecklistItem => ({
    id,
    label,
    ref,
    status: 'missing',
    approvedBy: '',
    approvedAt: '',
    notes: '',
  });
  const items = [add('contract', 'Contract (MSA / SOW)', 'Required for all vendors')];
  if (v.paid) items.push(add('w9', 'W-9 Form', 'Required for paid vendors'));
  if (v.onsite || v.tier === 'HIGH')
    items.push(add('coi', 'Certificate of Insurance (COI)', 'Required for onsite or HIGH tier'));
  if (['MED', 'HIGH'].includes(v.tier)) {
    items.push(add('secq', 'Security Questionnaire Lite', 'Required for MED/HIGH tier'));
    items.push(add('irc', 'Incident Response Contact', 'Required for MED/HIGH tier'));
  }
  if (v.tier === 'HIGH') {
    items.push(add('addendum', 'Security Addendum', 'Required for HIGH tier'));
    items.push(add('evidence', 'Security Evidence (SOC2 / ISO 27001 / Pen Test)', 'Required for HIGH tier'));
  }
  return items;
}

export function gateCheck(vendor: Vendor, checklist: ChecklistItem[]): string[] {
  const blocks: string[] = [];
  if (!vendor.owner) blocks.push('Owner must be assigned');
  const contract = checklist.find((i) => i.id === 'contract');
  if (!contract || contract.status !== 'approved') blocks.push('Contract must be approved (not waived)');
  const incomplete = checklist.filter((i) => i.status !== 'approved' && i.status !== 'waived');
  if (incomplete.length) blocks.push(incomplete.length + ' checklist item(s) not complete');
  if (!vendor.riskDone) blocks.push('Risk snapshot must be completed');
  return blocks;
}
