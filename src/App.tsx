import { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import VendorsList from './pages/VendorsList';
import VendorProfile from './pages/VendorProfile';
import Reports from './pages/Reports';
import AuditLogPage from './pages/AuditLogPage';
import FrameworksAdmin from './pages/FrameworksAdmin';
import SettingsPage from './pages/SettingsPage';
import { VendorModal } from './modals/VendorModal';
import { ExportModal } from './modals/ExportModal';
import { FWReportModal } from './modals/FWReportModal';
import { useVendors, useFilteredVendors } from './hooks/useVendors';
import { useSettings } from './settings/useSettings';
import { can, type Role } from './constants/roles';
import { SEED_VENDORS, SEED_AUDIT } from './constants/seed';
import type { Vendor, VendorStatus, ChecklistStatus } from './types/vendor';
import type { ControlStatus } from './types/framework';
import type { FrameworkNotes } from './types/framework';

type ModalState = null | 'newVendor' | 'export' | 'fwReport' | { type: 'edit'; data: Vendor };

export function App() {
  const { settings: S } = useSettings();
  const [role, setRole] = useState<Role>('ADMIN');
  const [tab, setTab] = useState('dashboard');
  const [modal, setModal] = useState<ModalState>(null);
  const [activeVendorId, setActiveVendorId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'all', tier: 'all', missing: 'all' });

  const {
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
  } = useVendors(SEED_VENDORS, SEED_AUDIT);

  const filtered = useFilteredVendors(vendors, search, filters);
  const activeVendor = vendors.find((v) => v.id === activeVendorId) || null;

  const openVendor = (v: Vendor) => {
    setActiveVendorId(v.id);
    setTab('vendor');
  };

  const PAGE_TITLE: Record<string, string> = {
    dashboard: 'Dashboard',
    vendors: 'Vendors',
    vendor: activeVendor ? activeVendor.company : 'Vendor',
    reports: 'Reports',
    auditlog: 'Audit Log',
    frameworks: 'Frameworks (Admin)',
    settings: 'Settings',
  };

  const topbarActions = (
    <>
      {tab === 'vendors' && can(role, 'create') && (
        <button className="btn bp bsm" onClick={() => setModal('newVendor')}>
          + Add Vendor
        </button>
      )}
      {tab === 'vendor' && activeVendor && (
        <button className="btn bs bsm" onClick={() => setTab('vendors')}>
          Back to Vendors
        </button>
      )}
      <button className="btn bs bsm" onClick={() => setModal('export')}>
        Export
      </button>
    </>
  );

  return (
    <>
      <AppShell
        tab={tab}
        setTab={setTab}
        role={role}
        setRole={setRole}
        settings={S}
        missingCount={missing}
        pageTitle={PAGE_TITLE[tab] || ''}
        topbarActions={topbarActions}
      >
        {tab === 'dashboard' && (
          <Dashboard
            vendors={vendors}
            totalActive={totalActive}
            missing={missing}
            exp30={exp30}
            exp60={exp60}
            exp90={exp90}
            highRisk={highRisk}
            onOpen={openVendor}
            globalAudit={globalAudit}
            settings={S}
          />
        )}
        {tab === 'vendors' && (
          <VendorsList
            vendors={filtered}
            search={search}
            setSearch={setSearch}
            filters={filters}
            setFilters={setFilters}
            onOpen={openVendor}
            allCount={vendors.length}
          />
        )}
        {tab === 'vendor' && activeVendor && (
          <VendorProfile
            vendor={activeVendor}
            role={role}
            settings={S}
            onUpdateChecklist={(vendorId: number, itemId: string, status: ChecklistStatus, wNote?: string) =>
              updateChecklist(vendorId, itemId, status, role, wNote)
            }
            onChangeStatus={(vendorId: number, newStatus: VendorStatus) => changeStatus(vendorId, newStatus, role)}
            onSaveRisk={(vendorId: number, answers: boolean[]) => saveRisk(vendorId, answers, role)}
            onAddDocument={(
              vendorId: number,
              doc: { name: string; type: string; expiry: string; sensitive: boolean },
            ) => addDocument(vendorId, doc, role)}
            onAddTask={(vendorId: number, task: { text: string; due: string }) => addTask(vendorId, task, role)}
            onToggleTask={toggleTask}
            onEdit={(v: Vendor) => setModal({ type: 'edit', data: v })}
            onUpdateFWControl={(
              vendorId: number,
              fwId: string,
              ctrlId: string,
              status: ControlStatus,
              wNote?: string,
            ) => updateFWControl(vendorId, fwId, ctrlId, status, role, wNote)}
            onUpdateVendorFW={updateVendorFW}
          />
        )}
        {tab === 'reports' && <Reports vendors={vendors} settings={S} />}
        {tab === 'auditlog' && <AuditLogPage globalAudit={globalAudit} />}
        {tab === 'frameworks' && can(role, 'all') && (
          <FrameworksAdmin
            fwNotes={fwNotes}
            onSave={(fwId: string, patch: Partial<FrameworkNotes>) => saveFwNote(fwId, patch, role)}
            vendors={vendors}
            onOpenReport={() => setModal('fwReport')}
          />
        )}
        {tab === 'settings' && can(role, 'all') && <SettingsPage />}
      </AppShell>

      {modal === 'newVendor' && (
        <VendorModal onSave={(v) => saveVendor(v, role)} onClose={() => setModal(null)} settings={S} />
      )}
      {modal && typeof modal === 'object' && modal.type === 'edit' && (
        <VendorModal
          data={modal.data}
          onSave={(v) => saveVendor(v, role)}
          onClose={() => setModal(null)}
          settings={S}
        />
      )}
      {modal === 'export' && <ExportModal vendors={vendors} onClose={() => setModal(null)} settings={S} />}
      {modal === 'fwReport' && <FWReportModal vendors={vendors} onClose={() => setModal(null)} />}
    </>
  );
}
