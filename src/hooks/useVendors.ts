import { useState, useMemo } from 'react';
import type { Vendor, AuditEntry, VendorStatus, ChecklistStatus } from '../types/vendor';
import type { ControlStatus, FrameworkNotes } from '../types/framework';
import { suggestFW, buildChecklist, buildFWControls, gateCheck } from '../helpers/vendors';
import { nowTs, daysUntil } from '../helpers/dates';

export function useVendors(initialVendors: Vendor[], initialAudit: AuditEntry[]) {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [globalAudit, setGlobalAudit] = useState<AuditEntry[]>(initialAudit);
  const [fwNotes, setFwNotes] = useState<Record<string, FrameworkNotes>>({});

  const addAudit = (actor: string, action: string, entity: string) => {
    setGlobalAudit((p) => [{ ts: nowTs(), actor, action, entity }, ...p]);
  };

  const saveVendor = (v: Partial<Vendor>, role: string) => {
    if (v.id) {
      setVendors((p) => p.map((x) => (x.id === v.id ? { ...x, ...v } : x)));
      addAudit(role, 'Vendor updated: ' + v.company, 'vendor');
    } else {
      const id = crypto.randomUUID();
      const suggested = suggestFW(v as Pick<Vendor, 'tier' | 'category'>);
      const fw: Record<string, { controls: ReturnType<typeof buildFWControls> }> = {};
      suggested.forEach((fid) => {
        fw[fid] = { controls: buildFWControls(fid) };
      });
      const newV: Vendor = {
        ...(v as Omit<
          Vendor,
          | 'id'
          | 'checklist'
          | 'documents'
          | 'tasks'
          | 'riskAnswers'
          | 'riskDone'
          | 'frameworks'
          | 'frameworkData'
          | 'auditLog'
        >),
        id,
        checklist: buildChecklist(v as Pick<Vendor, 'paid' | 'onsite' | 'tier'>),
        documents: [],
        tasks: [],
        riskAnswers: [],
        riskDone: false,
        frameworks: suggested,
        frameworkData: fw,
        auditLog: [{ ts: nowTs(), actor: role, action: 'Vendor created', entity: 'vendor' }],
      } as Vendor;
      setVendors((p) => [...p, newV]);
      addAudit(role, 'Vendor created: ' + v.company, 'vendor');
    }
  };

  const changeStatus = (vendorId: string, newStatus: VendorStatus, role: string) => {
    const vendor = vendors.find((v) => v.id === vendorId);
    if (!vendor) return;
    if (newStatus === 'ACTIVE') {
      const blocks = gateCheck(vendor, vendor.checklist || []);
      if (blocks.length) {
        alert('Cannot set to ACTIVE:\n\n' + blocks.map((b) => '  \u2022 ' + b).join('\n'));
        return;
      }
    }
    setVendors((p) =>
      p.map((v) => {
        if (v.id !== vendorId) return v;
        const entry: AuditEntry = {
          ts: nowTs(),
          actor: role,
          action: 'Status changed to ' + newStatus,
          entity: 'vendor',
        };
        return { ...v, status: newStatus, auditLog: [entry, ...(v.auditLog || [])] };
      }),
    );
    addAudit(role, vendor.company + ' status changed to ' + newStatus, 'vendor');
  };

  const updateChecklist = (vendorId: string, itemId: string, status: ChecklistStatus, role: string, wNote?: string) => {
    setVendors((p) =>
      p.map((v) => {
        if (v.id !== vendorId) return v;
        const cl = v.checklist.map((i) =>
          i.id !== itemId
            ? i
            : {
                ...i,
                status,
                approvedBy: status === 'missing' ? '' : role,
                approvedAt: status === 'missing' ? '' : nowTs(),
                notes: wNote !== undefined ? wNote : i.notes,
              },
        );
        const entry: AuditEntry = {
          ts: nowTs(),
          actor: role,
          action: 'Checklist ' + status + ': ' + itemId,
          entity: 'checklist',
        };
        return { ...v, checklist: cl, auditLog: [entry, ...(v.auditLog || [])] };
      }),
    );
  };

  const saveRisk = (vendorId: string, answers: boolean[], role: string) => {
    setVendors((p) =>
      p.map((v) => {
        if (v.id !== vendorId) return v;
        const entry: AuditEntry = {
          ts: nowTs(),
          actor: role,
          action: 'Risk snapshot saved',
          entity: 'risk',
        };
        return { ...v, riskAnswers: answers, riskDone: true, auditLog: [entry, ...(v.auditLog || [])] };
      }),
    );
  };

  const addDocument = (
    vendorId: string,
    doc: { name: string; type: string; sensitive: boolean; expiry: string },
    role: string,
  ) => {
    setVendors((p) =>
      p.map((v) => {
        if (v.id !== vendorId) return v;
        const nd = { ...doc, id: crypto.randomUUID(), uploadedBy: role, uploadedAt: nowTs() };
        const entry: AuditEntry = {
          ts: nowTs(),
          actor: role,
          action: 'Document uploaded: ' + doc.name,
          entity: 'document',
        };
        return { ...v, documents: [...(v.documents || []), nd], auditLog: [entry, ...(v.auditLog || [])] };
      }),
    );
  };

  const addTask = (vendorId: string, task: { text: string; due: string }, role: string) => {
    setVendors((p) =>
      p.map((v) => {
        if (v.id !== vendorId) return v;
        return {
          ...v,
          tasks: [...(v.tasks || []), { ...task, id: crypto.randomUUID(), done: false, createdBy: role }],
        };
      }),
    );
  };

  const toggleTask = (vendorId: string, taskId: string) => {
    setVendors((p) =>
      p.map((v) => {
        if (v.id !== vendorId) return v;
        return { ...v, tasks: (v.tasks || []).map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) };
      }),
    );
  };

  const updateFWControl = (
    vendorId: string,
    fwId: string,
    ctrlId: string,
    status: ControlStatus,
    role: string,
    wNote?: string,
  ) => {
    setVendors((p) =>
      p.map((v) => {
        if (v.id !== vendorId) return v;
        const fd = { ...v.frameworkData };
        if (!fd[fwId]) return v;
        fd[fwId] = {
          ...fd[fwId],
          controls: fd[fwId].controls.map((c) =>
            c.id !== ctrlId
              ? c
              : {
                  ...c,
                  status,
                  approvedBy: status === 'missing' ? '' : role,
                  approvedAt: status === 'missing' ? '' : nowTs(),
                  notes: wNote !== undefined ? wNote : c.notes,
                },
          ),
        };
        const entry: AuditEntry = {
          ts: nowTs(),
          actor: role,
          action: 'Framework control ' + status + ': ' + ctrlId,
          entity: 'framework',
        };
        return { ...v, frameworkData: fd, auditLog: [entry, ...(v.auditLog || [])] };
      }),
    );
  };

  const updateVendorFW = (vendorId: string, fwIds: string[]) => {
    setVendors((p) =>
      p.map((v) => {
        if (v.id !== vendorId) return v;
        const fd = { ...v.frameworkData };
        fwIds.forEach((fid) => {
          if (!fd[fid]) fd[fid] = { controls: buildFWControls(fid) };
        });
        return { ...v, frameworks: fwIds, frameworkData: fd };
      }),
    );
  };

  const saveFwNote = (fwId: string, patch: Partial<FrameworkNotes>, role: string) => {
    setFwNotes((p) => ({ ...p, [fwId]: { ...(p[fwId] || ({} as FrameworkNotes)), ...patch } }));
    addAudit(role, 'Framework notes updated: ' + fwId, 'framework');
  };

  // Derived stats
  const totalActive = vendors.filter((v) => v.status === 'ACTIVE').length;
  const missing = vendors.filter((v) => (v.checklist || []).some((i) => i.status === 'missing')).length;
  const exp30 = vendors.filter((v) =>
    (v.documents || []).some((d) => {
      const d2 = daysUntil(d.expiry);
      return d2 !== null && d2 >= 0 && d2 <= 30;
    }),
  ).length;
  const exp60 = vendors.filter((v) =>
    (v.documents || []).some((d) => {
      const d2 = daysUntil(d.expiry);
      return d2 !== null && d2 >= 0 && d2 <= 60;
    }),
  ).length;
  const exp90 = vendors.filter((v) =>
    (v.documents || []).some((d) => {
      const d2 = daysUntil(d.expiry);
      return d2 !== null && d2 >= 0 && d2 <= 90;
    }),
  ).length;
  const highRisk = vendors.filter((v) => v.tier === 'HIGH' && v.status !== 'OFFBOARDED').length;

  return {
    vendors,
    globalAudit,
    fwNotes,
    saveVendor,
    changeStatus,
    updateChecklist,
    saveRisk,
    addDocument,
    addTask,
    toggleTask,
    updateFWControl,
    updateVendorFW,
    saveFwNote,
    totalActive,
    missing,
    exp30,
    exp60,
    exp90,
    highRisk,
  };
}

/** Filter vendors by search text and status/tier/missing filters. */
export function useFilteredVendors(
  vendors: Vendor[],
  search: string,
  filters: { status: string; tier: string; missing: string },
) {
  return useMemo(
    () =>
      vendors.filter((v) => {
        if (filters.status !== 'all' && v.status !== filters.status) return false;
        if (filters.tier !== 'all' && v.tier !== filters.tier) return false;
        if (filters.missing === 'yes' && !(v.checklist || []).some((i) => i.status === 'missing')) return false;
        if (search) {
          const s = search.toLowerCase();
          if (
            !v.company.toLowerCase().includes(s) &&
            !v.contact.toLowerCase().includes(s) &&
            !v.category.toLowerCase().includes(s)
          )
            return false;
        }
        return true;
      }),
    [vendors, filters, search],
  );
}
