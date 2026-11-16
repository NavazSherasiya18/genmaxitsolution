import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Menu,
  Pill,
  Receipt,
  RotateCcw,
  Search,
  Sparkles,
  Stethoscope,
  UserCheck,
  X,
} from 'lucide-react';
import {
  HealthLinkBrandLogo,
  useHealthLinkFavicon,
} from '../../components/healthlink/HealthLinkBrandLogo';
import { useHealthLinkStore } from '../../context/HealthLinkStoreContext';
import { HealthLinkRole, getDemoTodayIso } from '../../data/healthlinkCatalog';
import { ReceptionWorkspace } from '../../components/healthlink/roles/ReceptionWorkspace';
import { DoctorWorkspace } from '../../components/healthlink/roles/DoctorWorkspace';
import { PharmacyWorkspace } from '../../components/healthlink/roles/PharmacyWorkspace';
import { BillingWorkspace } from '../../components/healthlink/roles/BillingWorkspace';
import { AdminWorkspace } from '../../components/healthlink/roles/AdminWorkspace';
import { HealthLinkPrintModal, PrintPayload } from '../../components/healthlink/HealthLinkPrintModal';
import { HealthLinkConfirmResetModal } from '../../components/healthlink/HealthLinkConfirmResetModal';
import { HealthLinkUnifiedTimelineModal } from '../../components/healthlink/HealthLinkUnifiedTimelineModal';

const ROLE_META: Record<
  HealthLinkRole,
  { label: string; shortLabel: string; icon: React.ComponentType<{ className?: string }> }
> = {
  reception: { label: 'Reception Desk', shortLabel: 'Reception', icon: ClipboardList },
  doctor: { label: 'Doctor Console', shortLabel: 'Doctor', icon: Stethoscope },
  pharmacy: { label: 'Outpatient Pharmacy', shortLabel: 'Pharmacy', icon: Pill },
  billing: { label: 'Billing & Cashier', shortLabel: 'Billing', icon: Receipt },
  admin: { label: 'Administrator', shortLabel: 'Admin', icon: BarChart3 },
};

const VALID_ROLES: HealthLinkRole[] = ['reception', 'doctor', 'pharmacy', 'billing', 'admin'];

export const HealthLinkWorkspacePage: React.FC = () => {
  const { role: routeRole } = useParams<{ role?: string }>();
  const navigate = useNavigate();
  useHealthLinkFavicon(true);

  const {
    dataset,
    activeRole,
    setActiveRole,
    activeFacilityId,
    setActiveFacilityId,
    setActivePatientPortalId,
    setFocusedPatientId,
    guidedMode,
    setGuidedMode,
    markAllNotificationsRead,
    resetDemoData,
  } = useHealthLinkStore();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [timelinePatientId, setTimelinePatientId] = useState<string | null>(null);
  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  // Sync URL param `:role` with store `activeRole`
  useEffect(() => {
    if (routeRole && VALID_ROLES.includes(routeRole as HealthLinkRole)) {
      if (activeRole !== routeRole) {
        setActiveRole(routeRole as HealthLinkRole);
      }
    }
  }, [routeRole, activeRole, setActiveRole]);

  const effectiveRole: HealthLinkRole =
    routeRole && VALID_ROLES.includes(routeRole as HealthLinkRole)
      ? (routeRole as HealthLinkRole)
      : activeRole;

  useEffect(() => {
    document.title = `${ROLE_META[effectiveRole].label} — HealthLink Workspace`;
  }, [effectiveRole]);

  const handleSelectRole = (nextRole: HealthLinkRole) => {
    setActiveRole(nextRole);
    setMobileNavOpen(false);
    navigate(`/showcase/healthlink/app/${nextRole}`);
  };

  const currentFacility =
    dataset.facilities.find((f) => f.id === activeFacilityId) || dataset.facilities[0];

  const today = getDemoTodayIso();
  const unreadNotifications = dataset.activityLog.filter((a) => a.unread).length;

  // Dynamic role counts for clean navigation visibility
  const roleBadges = useMemo(() => {
    const recWaiting = dataset.visits.filter(
      (v) => v.facilityId === activeFacilityId && v.visitDateIso === today
    ).length;
    const docQueue = dataset.visits.filter(
      (v) => v.facilityId === activeFacilityId && v.progressStatus !== 'completed'
    ).length;
    const rxPending = dataset.prescriptions.filter(
      (p) =>
        p.facilityId === activeFacilityId &&
        (p.status === 'pending_pharmacy' || p.status === 'partially_dispensed')
    ).length;
    const unbilledVisits = dataset.visits.filter((v) => {
      if (v.facilityId !== activeFacilityId) return false;
      const hasUnbilledBatch = dataset.dispensingRecords.some(
        (d) => d.visitId === v.id && d.billedInvoiceId === null
      );
      return (!v.consultationBilled && v.progressStatus === 'completed') || hasUnbilledBatch;
    }).length;
    return {
      reception: recWaiting,
      doctor: docQueue,
      pharmacy: rxPending,
      billing: unbilledVisits,
      admin: dataset.inventory.filter((m) => m.stockQty <= m.reorderThreshold).length,
    };
  }, [dataset, activeFacilityId, today]);

  const searchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return [];
    return dataset.patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.phone.includes(q)
    );
  }, [dataset.patients, globalSearch]);

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 text-slate-200">
      <div className="space-y-6">
        <div className="pb-4 border-b border-white/10">
          <Link to="/showcase/healthlink" className="block">
            <HealthLinkBrandLogo
              variant="full"
              tone="light"
              size="md"
              subtitle="Interactive Concept Demo"
            />
          </Link>
        </div>

        {/* Role Links */}
        <div className="space-y-1">
          <p className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Hospital Roles
          </p>
          {VALID_ROLES.map((r) => {
            const meta = ROLE_META[r];
            const Icon = meta.icon;
            const isActive = effectiveRole === r;
            const count = roleBadges[r];
            return (
              <button
                key={r}
                type="button"
                onClick={() => handleSelectRole(r)}
                className={`w-full px-3 py-2.5 text-left text-xs font-semibold flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#0F766E] text-white'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="inline-flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{meta.label}</span>
                </span>
                <span
                  className={`font-mono text-[11px] px-1.5 py-0.5 hl-tabular ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Connected Portals & Exits */}
        <div className="space-y-1 pt-4 border-t border-white/10">
          <p className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Connected Views
          </p>
          <Link
            to="/showcase/healthlink/portal"
            className="w-full px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white flex items-center justify-between"
          >
            <span className="inline-flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#5EEAD4]" />
              <span>Patient Portal</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>
          <Link
            to="/showcase/healthlink"
            className="w-full px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 opacity-70" />
            <span>HealthLink Product Site</span>
          </Link>
          <Link
            to="/portfolio"
            className="w-full px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 text-[#5EEAD4]" />
            <span>Back to Genmax Portfolio</span>
          </Link>
        </div>
      </div>

      {/* Bottom Reset Demo Control */}
      <div className="pt-4 border-t border-white/10 space-y-2">
        <button
          type="button"
          onClick={() => setResetModalOpen(true)}
          className="w-full px-3 py-2.5 border border-white/20 bg-white/5 hover:bg-white/15 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#5EEAD4]" />
          <span>Reset Demo Data</span>
        </button>
        <p className="text-[10px] text-slate-400 text-center">
          Sample browser-local state only
        </p>
      </div>
    </div>
  );

  return (
    <div className="healthlink-showcase min-h-screen flex bg-[#F7FAFC] text-[#0A2540]">
      {/* Fixed Left Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-[#0A2540] shrink-0 border-r border-[#12385E]">
        <div className="sticky top-0 h-screen overflow-y-auto">{sidebarContent}</div>
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex bg-[#0A2540]/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="HealthLink role navigation"
        >
          <div className="w-72 max-w-[85vw] bg-[#0A2540] h-full overflow-y-auto relative">
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Close navigation drawer"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={() => setMobileNavOpen(false)} />
        </div>
      )}

      {/* Main Content Shell */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Operations Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#DCE6EE]">
          <div className="px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
            {/* Left: Mobile Drawer Button + Breadcrumbs */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="lg:hidden p-2 border border-[#DCE6EE] bg-white text-[#0A2540] cursor-pointer shrink-0"
                aria-label="Open role navigation"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <div className="text-[11px] font-medium text-[#475569] flex items-center gap-1.5 truncate">
                  <Link to="/showcase/healthlink" className="hover:text-[#0F766E]">
                    HealthLink
                  </Link>
                  <span>/</span>
                  <span className="truncate">{currentFacility.name}</span>
                  <span>/</span>
                  <span className="text-[#0F766E] font-semibold">
                    {ROLE_META[effectiveRole].shortLabel}
                  </span>
                </div>
                <h1
                  className="text-base sm:text-lg font-bold text-[#0A2540] truncate"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {ROLE_META[effectiveRole].label}
                </h1>
              </div>
            </div>

            {/* Right Utility Controls */}
            <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto justify-end">
              {/* Sample Facility Switcher */}
              <div className="flex items-center gap-1.5 border border-[#DCE6EE] bg-[#F7FAFC] px-2.5 h-9 text-xs">
                <Building2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                <select
                  aria-label="Sample facility selector"
                  value={activeFacilityId}
                  onChange={(e) => setActiveFacilityId(e.target.value)}
                  className="bg-transparent font-semibold text-[#0A2540] focus:outline-none cursor-pointer"
                >
                  {dataset.facilities.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visible Switch Demo Role Control */}
              <div className="flex items-center gap-1.5 border border-[#CBE8E2] bg-[#EDF7F5] px-2.5 h-9 text-xs">
                <span className="text-[#0F766E] font-semibold hidden sm:inline">Role:</span>
                <select
                  aria-label="Switch Demo Role"
                  value={effectiveRole}
                  onChange={(e) => handleSelectRole(e.target.value as HealthLinkRole)}
                  className="bg-transparent font-bold text-[#0A2540] focus:outline-none cursor-pointer"
                >
                  {VALID_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_META[r].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Global Patient Search */}
              <div className="relative flex-1 sm:flex-initial sm:w-56">
                <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={globalSearch}
                  onFocus={() => setSearchOpen(true)}
                  onChange={(e) => {
                    setGlobalSearch(e.target.value);
                    setSearchOpen(true);
                  }}
                  placeholder="Find patient (PT-1042)..."
                  aria-label="Global patient search"
                  className="w-full h-9 pl-8 pr-2.5 bg-[#F7FAFC] border border-[#DCE6EE] text-xs text-[#0A2540]"
                />
                {searchOpen && globalSearch.trim().length > 0 && (
                  <div className="absolute right-0 left-0 sm:w-80 top-10 bg-white border border-[#DCE6EE] shadow-xl z-40 divide-y divide-[#EAEFF4]">
                    <div className="px-3 py-1.5 bg-[#F7FAFC] flex items-center justify-between text-[11px] text-[#475569]">
                      <span>Matching Sample Patients ({searchResults.length})</span>
                      <button
                        type="button"
                        onClick={() => setSearchOpen(false)}
                        className="text-[#0A2540] font-semibold cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                    {searchResults.length === 0 ? (
                      <p className="p-3 text-xs text-[#64748B]">No patient records found.</p>
                    ) : (
                      searchResults.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setFocusedPatientId(p.id);
                            setTimelinePatientId(p.id);
                            setSearchOpen(false);
                          }}
                          className="w-full p-3 text-left text-xs hover:bg-[#EDF7F5] cursor-pointer flex items-center justify-between gap-2"
                        >
                          <div>
                            <p className="font-bold text-[#0A2540]">
                              {p.name} <span className="font-mono text-[#0F766E]">({p.id})</span>
                            </p>
                            <p className="text-[#475569]">
                              {p.cityOrVillage} · Phone {p.phone}
                            </p>
                          </div>
                          <span className="text-[11px] font-semibold text-[#0F766E]">Timeline →</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Notifications Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifOpen((o) => !o)}
                  className="h-9 px-2.5 border border-[#DCE6EE] bg-white hover:border-[#0D9488] text-[#0A2540] inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                  aria-label="Open notifications"
                >
                  <Bell className="w-4 h-4 text-[#0F766E]" />
                  {unreadNotifications > 0 && (
                    <span className="font-mono bg-[#0F766E] text-white px-1.5 py-0.5 text-[10px] hl-tabular">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-10 w-80 sm:w-96 bg-white border border-[#DCE6EE] shadow-2xl z-40">
                    <div className="px-4 py-3 bg-[#F7FAFC] border-b border-[#DCE6EE] flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0A2540]">Workspace Notifications</span>
                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        className="text-[#0F766E] font-semibold hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-[#EAEFF4] text-xs">
                      {dataset.activityLog.slice(0, 8).map((ev) => (
                        <div
                          key={ev.id}
                          className={`p-3 space-y-0.5 ${
                            ev.unread ? 'bg-[#EDF7F5]/60' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-[#0A2540]">{ev.title}</span>
                            <span className="text-[10px] text-[#64748B] shrink-0">
                              {ev.timestampLabel}
                            </span>
                          </div>
                          <p className="text-[#475569]">{ev.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Quick Role Action Bar (retains primary page role shortcuts cleanly) */}
          <div className="lg:hidden px-4 py-2 bg-[#F7FAFC] border-t border-[#EAEFF4] flex items-center justify-between gap-2 overflow-x-auto text-xs">
            <div className="flex items-center gap-1.5 shrink-0">
              {VALID_ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleSelectRole(r)}
                  className={`px-2.5 py-1 border font-semibold whitespace-nowrap cursor-pointer ${
                    effectiveRole === r
                      ? 'bg-[#0A2540] border-[#0A2540] text-white'
                      : 'bg-white border-[#DCE6EE] text-[#475569]'
                  }`}
                >
                  {ROLE_META[r].shortLabel}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setResetModalOpen(true)}
              className="px-2.5 py-1 border border-[#DCE6EE] bg-white text-[#9A3412] font-semibold shrink-0 cursor-pointer"
            >
              Reset
            </button>
          </div>
        </header>

        {/* Dismissible Guided Demo Workflow Bar */}
        {guidedMode !== 'none' && (
          <div className="bg-[#EDF7F5] border-b border-[#CBE8E2] px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0F766E] shrink-0" />
                <span className="font-bold text-[#0A2540]">
                  {guidedMode === 'walk_in'
                    ? 'Guided Walk-In Flow (Aarav Kulkarni · PT-1042):'
                    : 'Guided Telehealth Flow:'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {guidedMode === 'walk_in' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setFocusedPatientId('PT-1042');
                        setTimelinePatientId('PT-1042');
                      }}
                      className="px-2.5 py-1 bg-white border border-[#CBE8E2] text-[#0A2540] font-semibold hover:border-[#0F766E] cursor-pointer"
                    >
                      1. Inspect PT-1042 History
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectRole('reception')}
                      className={`px-2.5 py-1 border font-semibold cursor-pointer ${
                        effectiveRole === 'reception'
                          ? 'bg-[#0F766E] border-[#0F766E] text-white'
                          : 'bg-white border-[#CBE8E2] text-[#0A2540]'
                      }`}
                    >
                      2. Reception Token
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectRole('doctor')}
                      className={`px-2.5 py-1 border font-semibold cursor-pointer ${
                        effectiveRole === 'doctor'
                          ? 'bg-[#0F766E] border-[#0F766E] text-white'
                          : 'bg-white border-[#CBE8E2] text-[#0A2540]'
                      }`}
                    >
                      3. Doctor RX
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectRole('pharmacy')}
                      className={`px-2.5 py-1 border font-semibold cursor-pointer ${
                        effectiveRole === 'pharmacy'
                          ? 'bg-[#0F766E] border-[#0F766E] text-white'
                          : 'bg-white border-[#CBE8E2] text-[#0A2540]'
                      }`}
                    >
                      4. Pharmacy Dispense
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectRole('billing')}
                      className={`px-2.5 py-1 border font-semibold cursor-pointer ${
                        effectiveRole === 'billing'
                          ? 'bg-[#0F766E] border-[#0F766E] text-white'
                          : 'bg-white border-[#CBE8E2] text-[#0A2540]'
                      }`}
                    >
                      5. Billing Receipt
                    </button>
                    <Link
                      to="/showcase/healthlink/portal"
                      onClick={() => setActivePatientPortalId('PT-1042')}
                      className="px-2.5 py-1 bg-[#0A2540] text-white font-semibold inline-flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-[#5EEAD4]" />
                      6. Portal Check
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/showcase/healthlink/portal/appointments"
                      className="px-2.5 py-1 bg-white border border-[#CBE8E2] text-[#0A2540] font-semibold"
                    >
                      1. Portal Slot Booking
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleSelectRole('doctor')}
                      className="px-2.5 py-1 bg-[#0F766E] text-white font-semibold cursor-pointer"
                    >
                      2. Doctor Telehealth Video Queue
                    </button>
                    <Link
                      to="/showcase/healthlink/portal/documents"
                      className="px-2.5 py-1 bg-[#0A2540] text-white font-semibold"
                    >
                      3. Verify Follow-Up in Portal
                    </Link>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setGuidedMode('none')}
                  className="ml-2 p-1 text-[#475569] hover:text-[#0A2540] cursor-pointer"
                  aria-label="Dismiss guided walkthrough bar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Role View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {effectiveRole === 'reception' && (
            <ReceptionWorkspace
              key={activeFacilityId}
              onOpenTimeline={(pid) => setTimelinePatientId(pid)}
              onPrint={(p) => setPrintPayload(p)}
              onNavigateRole={(r) => handleSelectRole(r)}
            />
          )}

          {effectiveRole === 'doctor' && (
            <DoctorWorkspace
              key={activeFacilityId}
              onOpenTimeline={(pid) => setTimelinePatientId(pid)}
              onPrint={(p) => setPrintPayload(p)}
              onNavigateRole={(r) => handleSelectRole(r)}
            />
          )}

          {effectiveRole === 'pharmacy' && (
            <PharmacyWorkspace
              key={activeFacilityId}
              onPrint={(p) => setPrintPayload(p)}
              onNavigateRole={(r) => handleSelectRole(r)}
            />
          )}

          {effectiveRole === 'billing' && (
            <BillingWorkspace
              key={activeFacilityId}
              onPrint={(p) => setPrintPayload(p)}
              onOpenPatientPortal={(pid) => {
                setActivePatientPortalId(pid);
                navigate('/showcase/healthlink/portal');
              }}
            />
          )}

          {effectiveRole === 'admin' && <AdminWorkspace />}
        </main>
      </div>

      {/* Shared Modals */}
      <HealthLinkPrintModal
        payload={printPayload}
        onClose={() => setPrintPayload(null)}
      />
      <HealthLinkUnifiedTimelineModal
        patientId={timelinePatientId}
        onClose={() => setTimelinePatientId(null)}
        onPrint={(p) => setPrintPayload(p)}
      />
      <HealthLinkConfirmResetModal
        open={resetModalOpen}
        onCancel={() => setResetModalOpen(false)}
        onConfirm={() => {
          resetDemoData();
          navigate('/showcase/healthlink/app/reception');
        }}
      />
    </div>
  );
};
