import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  CreditCard,
  FileText,
  LayoutDashboard,
  Menu,
  Pill,
  Printer,
  Receipt,
  Sparkles,
  UserCircle2,
  Video,
  X,
} from 'lucide-react';
import {
  HealthLinkBrandLogo,
  useHealthLinkFavicon,
} from '../../components/healthlink/HealthLinkBrandLogo';
import { useHealthLinkStore } from '../../context/HealthLinkStoreContext';
import {
  addDemoDaysIso,
  formatCurrencyUsd,
  getDemoTodayIso,
} from '../../data/healthlinkCatalog';
import { HealthLinkStatusBadge } from '../../components/healthlink/HealthLinkStatusBadge';
import { HealthLinkPrintModal, PrintPayload } from '../../components/healthlink/HealthLinkPrintModal';
import { HealthLinkSimulatedVideoModal } from '../../components/healthlink/HealthLinkSimulatedVideoModal';

type PortalTab = 'overview' | 'appointments' | 'documents' | 'invoices';
const VALID_TABS: PortalTab[] = ['overview', 'appointments', 'documents', 'invoices'];

export const HealthLinkPatientPortalPage: React.FC = () => {
  const { tab: routeTab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  useHealthLinkFavicon(true);

  const {
    dataset,
    activePatientPortalId,
    setActivePatientPortalId,
    guidedMode,
    setGuidedMode,
    bookAppointment,
    enterTelehealthWaitingRoom,
    startTelehealthConsultation,
    completeTelehealthVisit,
    recordInvoicePayment,
    setActiveRole,
  } = useHealthLinkStore();

  const [activeTab, setActiveTab] = useState<PortalTab>(
    routeTab && VALID_TABS.includes(routeTab as PortalTab) ? (routeTab as PortalTab) : 'overview'
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);
  const [activeVideoVisitId, setActiveVideoVisitId] = useState<string | null>(null);

  // Appointment Booking Form State
  const today = getDemoTodayIso();
  const dateOptions = [today, addDemoDaysIso(today, 1), addDemoDaysIso(today, 2)];

  const [bookMode, setBookMode] = useState<'telehealth' | 'in_person'>('telehealth');
  const [bookClinicianId, setBookClinicianId] = useState<string>(dataset.clinicians[0].id);
  const [bookDateIso, setBookDateIso] = useState<string>(today);
  const [bookTimeSlot, setBookTimeSlot] = useState<string>(dataset.clinicians[0].telehealthSlots[0]);
  const [bookReason, setBookReason] = useState<string>('Routine clinical follow-up & vitals check');
  const [bookFeedback, setBookFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    if (routeTab && VALID_TABS.includes(routeTab as PortalTab)) {
      setActiveTab(routeTab as PortalTab);
    }
  }, [routeTab]);

  const activePatient =
    dataset.patients.find((p) => p.id === activePatientPortalId) || dataset.patients[0];

  useEffect(() => {
    document.title = `${activePatient.name} — HealthLink Patient Portal`;
  }, [activePatient.name]);

  const switchTab = (nextTab: PortalTab) => {
    setActiveTab(nextTab);
    setMobileMenuOpen(false);
    navigate(`/showcase/healthlink/portal/${nextTab}`);
  };

  // Patient-scoped datasets (strict isolation for activePatient.id only)
  const patientAppointments = dataset.appointments.filter((a) => a.patientId === activePatient.id);
  const patientVisits = dataset.visits.filter((v) => v.patientId === activePatient.id);
  const releasedVisits = patientVisits.filter((v) => v.releasedToPatient);
  const patientPrescriptions = dataset.prescriptions.filter(
    (p) => p.patientId === activePatient.id && p.status !== 'draft'
  );
  const patientInvoices = dataset.invoices.filter((i) => i.patientId === activePatient.id);

  const selectedClinician =
    dataset.clinicians.find((c) => c.id === bookClinicianId) || dataset.clinicians[0];

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setBookFeedback(null);
    const res = bookAppointment({
      patientId: activePatient.id,
      facilityId: selectedClinician.facilityId,
      clinicianId: selectedClinician.id,
      dateIso: bookDateIso,
      timeSlot: bookTimeSlot,
      mode: bookMode,
      reason: bookReason,
    });
    if (!res.ok) {
      setBookFeedback({ type: 'err', text: res.error || 'Could not book slot.' });
      return;
    }
    setBookFeedback({
      type: 'ok',
      text: `${bookMode === 'telehealth' ? 'Telehealth Video' : 'In-Clinic'} slot booked for ${
        activePatient.name
      } (${res.data?.dateIso} at ${res.data?.timeSlot}).`,
    });
  };

  const handleOpenTelehealthRoom = (aptId: string) => {
    const res = enterTelehealthWaitingRoom(aptId);
    if (res.ok && res.data) {
      startTelehealthConsultation(res.data.id);
      setActiveVideoVisitId(res.data.id);
    } else {
      setBookFeedback({
        type: 'err',
        text: res.error || 'Could not initialize simulated waiting room.',
      });
    }
  };

  const activeVideoVisit = activeVideoVisitId
    ? dataset.visits.find((v) => v.id === activeVideoVisitId) || null
    : null;
  const activeVideoDoc = activeVideoVisit
    ? dataset.clinicians.find((c) => c.id === activeVideoVisit.clinicianId)
    : undefined;

  return (
    <div className="healthlink-showcase min-h-screen flex flex-col bg-[#F7FAFC] text-[#0A2540]">
      {/* Discreet Concept & Exit Header */}
      <div className="bg-[#0A2540] text-slate-200 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-[#5EEAD4] uppercase tracking-wider shrink-0">
              Interactive Concept Demo
            </span>
            <span className="text-slate-400 hidden sm:inline" aria-hidden="true">
              ·
            </span>
            <span className="text-slate-300 hidden sm:inline truncate">
              Sample Patient Portal (Scoped to {activePatient.name})
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              to="/showcase/healthlink/app"
              className="text-slate-200 hover:text-[#5EEAD4] font-medium transition-colors"
            >
              Open Hospital App
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-1 text-slate-200 hover:text-[#5EEAD4] font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Genmax Portfolio</span>
              <span className="sm:hidden">Genmax</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Portal Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#DCE6EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/showcase/healthlink" aria-label="HealthLink Website" className="shrink-0">
              <HealthLinkBrandLogo
                variant="full"
                tone="dark"
                size="sm"
                subtitle="Patient Portal"
              />
            </Link>
          </div>

          {/* Portal Desktop Tabs */}
          <nav
            aria-label="Patient Portal sections"
            className="hidden md:flex items-center gap-1 text-xs font-semibold"
          >
            {[
              { id: 'overview' as PortalTab, label: 'Overview', icon: LayoutDashboard },
              { id: 'appointments' as PortalTab, label: 'Appointments', icon: Calendar },
              { id: 'documents' as PortalTab, label: 'Documents', icon: FileText },
              { id: 'invoices' as PortalTab, label: 'Invoices', icon: Receipt },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => switchTab(t.id)}
                  className={`px-3.5 py-2 inline-flex items-center gap-1.5 border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#EDF7F5] border-[#CBE8E2] text-[#0F766E]'
                      : 'bg-white border-transparent text-[#475569] hover:text-[#0A2540]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sample Patient Profile Menu */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 border border-[#DCE6EE] bg-[#F7FAFC] px-2.5 h-9 text-xs">
              <UserCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
              <select
                aria-label="Sample patient profile switcher"
                value={activePatient.id}
                onChange={(e) => setActivePatientPortalId(e.target.value)}
                className="bg-transparent font-semibold text-[#0A2540] focus:outline-none cursor-pointer max-w-[165px] sm:max-w-none"
              >
                {dataset.patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="md:hidden p-2 border border-[#DCE6EE] bg-white text-[#0A2540] cursor-pointer"
              aria-label="Toggle portal menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#DCE6EE] bg-white px-4 py-3 grid grid-cols-2 gap-2 text-xs font-semibold">
            {VALID_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => switchTab(tab)}
                className={`p-2.5 border text-left capitalize cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#EDF7F5] border-[#CBE8E2] text-[#0F766E]'
                    : 'bg-[#F7FAFC] border-[#DCE6EE] text-[#0A2540]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Guided Telehealth Bar */}
      {guidedMode === 'telehealth' && (
        <div className="bg-[#EDF7F5] border-b border-[#CBE8E2] px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0F766E] shrink-0" />
              <span className="font-bold text-[#0A2540]">
                Guided Telehealth Flow: Book a video slot below → Join Simulated Waiting Room →
                Complete Consultation → Check Documents tab for released follow-up notes.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveRole('doctor');
                  navigate('/showcase/healthlink/app/doctor');
                }}
                className="px-2.5 py-1 bg-[#0F766E] text-white font-semibold cursor-pointer"
              >
                Open Doctor Telehealth Queue →
              </button>
              <button
                type="button"
                onClick={() => setGuidedMode('none')}
                className="p-1 text-[#475569] hover:text-[#0A2540] cursor-pointer"
                aria-label="Dismiss guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Active Patient Banner */}
        <div className="bg-white border border-[#DCE6EE] p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0F766E]">
              Sample Patient Account · {activePatient.id}
            </p>
            <h1
              className="text-xl sm:text-2xl font-bold text-[#0A2540]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Welcome back, {activePatient.name}
            </h1>
            <p className="text-xs text-[#475569] hl-tabular">
              Age {activePatient.age} · {activePatient.cityOrVillage} · Blood Group{' '}
              {activePatient.bloodGroup} · Allergy Note: {activePatient.allergiesNote}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => switchTab('appointments')}
              className="px-4 py-2.5 bg-[#0F766E] hover:bg-[#0D9488] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Book Telehealth / Visit</span>
            </button>
            <Link
              to="/showcase/healthlink/app"
              className="px-4 py-2.5 border border-[#DCE6EE] bg-[#F7FAFC] hover:border-[#0D9488] text-[#0A2540] font-semibold inline-flex items-center gap-1.5"
            >
              <span>Hospital App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 hl-tabular">
              {[
                {
                  label: 'Appointments',
                  value: patientAppointments.length,
                  sub: 'Scheduled & active',
                  tab: 'appointments' as PortalTab,
                },
                {
                  label: 'Visit Summaries',
                  value: releasedVisits.length,
                  sub: 'Released by clinicians',
                  tab: 'documents' as PortalTab,
                },
                {
                  label: 'Prescriptions',
                  value: patientPrescriptions.length,
                  sub: 'Pharmacy tracked',
                  tab: 'documents' as PortalTab,
                },
                {
                  label: 'Invoices',
                  value: patientInvoices.length,
                  sub: `${patientInvoices.filter((i) => i.status === 'pending_payment').length} pending payment`,
                  tab: 'invoices' as PortalTab,
                },
              ].map((stat) => (
                <button
                  key={stat.label}
                  type="button"
                  onClick={() => switchTab(stat.tab)}
                  className="bg-white border border-[#DCE6EE] hover:border-[#0D9488] p-4 text-left transition-colors cursor-pointer"
                >
                  <p className="text-xs font-semibold text-[#475569]">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#0A2540] mt-1">{stat.value}</p>
                  <p className="text-[11px] text-[#0F766E] mt-1 font-medium">{stat.sub} →</p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Latest Released Summary */}
              <div className="bg-white border border-[#DCE6EE] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#0A2540]">Latest Visit Summary</h2>
                  <button
                    type="button"
                    onClick={() => switchTab('documents')}
                    className="text-xs font-semibold text-[#0F766E] hover:underline cursor-pointer"
                  >
                    All Documents →
                  </button>
                </div>

                {releasedVisits.length === 0 ? (
                  <p className="text-xs text-[#64748B]">
                    No visit summaries have been released for {activePatient.name} yet.
                  </p>
                ) : (
                  (() => {
                    const latest = releasedVisits[0];
                    const doc = dataset.clinicians.find((c) => c.id === latest.clinicianId);
                    return (
                      <div className="border border-[#DCE6EE] bg-[#F7FAFC] p-4 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#0A2540] hl-tabular">
                            {latest.queueToken} · {latest.department}
                          </span>
                          <span className="text-[#475569]">{latest.createdAtLabel}</span>
                        </div>
                        <p className="text-[#475569]">Clinician: {doc?.name}</p>
                        <p>
                          <strong>Summary:</strong> {latest.diagnosis}
                        </p>
                        <p>
                          <strong>Follow-up:</strong> {latest.followUpInstructions}
                        </p>
                      </div>
                    );
                  })()
                )}
              </div>

              {/* Next Appointment or Invoice */}
              <div className="bg-white border border-[#DCE6EE] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#0A2540]">Upcoming &amp; Billing Status</h2>
                  <button
                    type="button"
                    onClick={() => switchTab('appointments')}
                    className="text-xs font-semibold text-[#0F766E] hover:underline cursor-pointer"
                  >
                    Manage Appointments →
                  </button>
                </div>

                {patientAppointments.length > 0 ? (
                  <div className="space-y-2.5 text-xs">
                    {patientAppointments.slice(0, 2).map((apt) => {
                      const doc = dataset.clinicians.find((c) => c.id === apt.clinicianId);
                      return (
                        <div
                          key={apt.id}
                          className="border border-[#DCE6EE] bg-[#F7FAFC] p-3.5 flex flex-wrap items-center justify-between gap-2"
                        >
                          <div>
                            <p className="font-bold text-[#0A2540] hl-tabular">
                              {apt.dateIso} at {apt.timeSlot} (
                              {apt.mode === 'telehealth' ? 'Telehealth Video' : 'In-Clinic'})
                            </p>
                            <p className="text-[#475569]">{doc?.name}</p>
                          </div>
                          <HealthLinkStatusBadge status={apt.status} />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-[#64748B]">
                    No upcoming bookings. Use Appointments to reserve a Telehealth or Clinic slot.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPOINTMENTS & TELEHEALTH */}
        {activeTab === 'appointments' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form
              onSubmit={handleBookAppointment}
              className="lg:col-span-5 bg-white border border-[#DCE6EE] p-5 space-y-4 text-xs"
            >
              <div>
                <h2 className="text-base font-bold text-[#0A2540]">
                  Book New Appointment (Demo)
                </h2>
                <p className="text-[#475569]">
                  Available clinician time slots check against existing schedule conflicts.
                </p>
              </div>

              {bookFeedback && (
                <div
                  role={bookFeedback.type === 'err' ? 'alert' : 'status'}
                  className={`p-3 border flex items-start gap-2 ${
                    bookFeedback.type === 'err'
                      ? 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
                      : 'bg-[#EDF7F5] border-[#CBE8E2] text-[#0F766E]'
                  }`}
                >
                  {bookFeedback.type === 'err' ? (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  )}
                  <span>{bookFeedback.text}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-[#475569] mb-1">Consultation Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookMode('telehealth')}
                    className={`py-2 px-3 border font-semibold cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                      bookMode === 'telehealth'
                        ? 'bg-[#0F766E] border-[#0F766E] text-white'
                        : 'bg-[#F7FAFC] border-[#DCE6EE] text-[#0A2540]'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    Telehealth Video
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookMode('in_person')}
                    className={`py-2 px-3 border font-semibold cursor-pointer ${
                      bookMode === 'in_person'
                        ? 'bg-[#0A2540] border-[#0A2540] text-white'
                        : 'bg-[#F7FAFC] border-[#DCE6EE] text-[#0A2540]'
                    }`}
                  >
                    In-Clinic Visit
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Clinician &amp; Facility
                </label>
                <select
                  value={bookClinicianId}
                  onChange={(e) => {
                    const nextId = e.target.value;
                    setBookClinicianId(nextId);
                    const nextDoc = dataset.clinicians.find((c) => c.id === nextId);
                    if (nextDoc) setBookTimeSlot(nextDoc.telehealthSlots[0]);
                  }}
                  className="w-full h-10 px-3 bg-white border border-[#DCE6EE] text-[#0A2540]"
                >
                  {dataset.clinicians.map((c) => {
                    const fac = dataset.facilities.find((f) => f.id === c.facilityId);
                    return (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.department} ({fac?.name})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#475569] mb-1">Date</label>
                  <select
                    value={bookDateIso}
                    onChange={(e) => setBookDateIso(e.target.value)}
                    className="w-full h-10 px-2.5 bg-white border border-[#DCE6EE] text-[#0A2540] hl-tabular"
                  >
                    {dateOptions.map((d, idx) => (
                      <option key={d} value={d}>
                        {idx === 0 ? `Today (${d})` : idx === 1 ? `Tomorrow (${d})` : d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#475569] mb-1">Time Slot</label>
                  <select
                    value={bookTimeSlot}
                    onChange={(e) => setBookTimeSlot(e.target.value)}
                    className="w-full h-10 px-2.5 bg-white border border-[#DCE6EE] text-[#0A2540] hl-tabular"
                  >
                    {selectedClinician.telehealthSlots.map((slot) => {
                      const occupied = dataset.appointments.some(
                        (a) =>
                          a.clinicianId === selectedClinician.id &&
                          a.dateIso === bookDateIso &&
                          a.timeSlot === slot &&
                          a.status !== 'completed'
                      );
                      return (
                        <option key={slot} value={slot}>
                          {slot} {occupied ? '(Taken)' : '(Open)'}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Reason for Appointment
                </label>
                <textarea
                  rows={2}
                  value={bookReason}
                  onChange={(e) => setBookReason(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DCE6EE] text-[#0A2540]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#0F766E] hover:bg-[#0D9488] text-white font-semibold cursor-pointer"
              >
                Confirm Appointment Slot
              </button>
            </form>

            <div className="lg:col-span-7 bg-white border border-[#DCE6EE] p-5 space-y-4">
              <h2 className="text-base font-bold text-[#0A2540]">
                {activePatient.name}’s Appointments ({patientAppointments.length})
              </h2>

              {patientAppointments.length === 0 ? (
                <p className="text-xs text-[#64748B] py-4">
                  No appointments scheduled for {activePatient.name} yet. Reserve a slot on the left.
                </p>
              ) : (
                <div className="space-y-3">
                  {patientAppointments.map((apt) => {
                    const doc = dataset.clinicians.find((c) => c.id === apt.clinicianId);
                    const fac = dataset.facilities.find((f) => f.id === apt.facilityId);
                    return (
                      <div
                        key={apt.id}
                        className="border border-[#DCE6EE] bg-[#F7FAFC] p-4 flex flex-wrap items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#0F766E]">{apt.id}</span>
                            <HealthLinkStatusBadge status={apt.status} />
                          </div>
                          <p className="font-bold text-[#0A2540] hl-tabular">
                            {apt.dateIso} at {apt.timeSlot} ·{' '}
                            {apt.mode === 'telehealth' ? 'Telehealth Video' : 'In-Clinic'}
                          </p>
                          <p className="text-[#475569]">
                            {doc?.name} · {fac?.name} — {apt.reason}
                          </p>
                        </div>

                        {apt.mode === 'telehealth' && apt.status !== 'completed' && (
                          <button
                            type="button"
                            onClick={() => handleOpenTelehealthRoom(apt.id)}
                            className="px-4 py-2.5 bg-[#0F766E] hover:bg-[#0D9488] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Join Simulated Waiting Room</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: DOCUMENTS & PRESCRIPTIONS */}
        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-white border border-[#DCE6EE] p-5 space-y-4">
              <h2 className="text-base font-bold text-[#0A2540]">
                Released Consultation Summaries ({releasedVisits.length})
              </h2>

              {releasedVisits.length === 0 ? (
                <p className="text-xs text-[#64748B]">
                  No finalized summaries released yet for {activePatient.name}.
                </p>
              ) : (
                <div className="space-y-4">
                  {releasedVisits.map((v) => {
                    const doc = dataset.clinicians.find((c) => c.id === v.clinicianId);
                    const fac = dataset.facilities.find((f) => f.id === v.facilityId);
                    const rx = dataset.prescriptions.find((p) => p.visitId === v.id);
                    return (
                      <div
                        key={v.id}
                        className="border border-[#DCE6EE] bg-[#F7FAFC] p-4 space-y-3 text-xs"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2 pb-2 border-b border-[#EAEFF4]">
                          <div>
                            <p className="font-bold text-[#0A2540] hl-tabular">
                              {v.queueToken} · {v.department} ({fac?.name})
                            </p>
                            <p className="text-[#475569]">
                              {v.createdAtLabel} · {doc?.name}
                            </p>
                          </div>
                          {fac && (
                            <button
                              type="button"
                              onClick={() =>
                                setPrintPayload({
                                  type: 'case_summary',
                                  visit: v,
                                  patient: activePatient,
                                  facility: fac,
                                  clinician: doc,
                                  prescription: rx,
                                })
                              }
                              className="px-3 py-1.5 border border-[#DCE6EE] bg-white hover:border-[#0D9488] text-[#0A2540] font-semibold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              Print Summary
                            </button>
                          )}
                        </div>
                        <p>
                          <strong>Summary / Diagnosis:</strong> {v.diagnosis || 'Completed'}
                        </p>
                        <p>
                          <strong>Notes:</strong> {v.clinicalNotes || '—'}
                        </p>
                        <p className="bg-white border border-[#DCE6EE] p-2.5 text-[#0F766E]">
                          <strong>Follow-up Plan:</strong> {v.followUpInstructions}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="lg:col-span-5 bg-white border border-[#DCE6EE] p-5 space-y-4">
              <h2 className="text-base font-bold text-[#0A2540] inline-flex items-center gap-2">
                <Pill className="w-4 h-4 text-[#0F766E]" />
                Prescriptions ({patientPrescriptions.length})
              </h2>

              {patientPrescriptions.length === 0 ? (
                <p className="text-xs text-[#64748B]">
                  No signed prescriptions on file for {activePatient.name}.
                </p>
              ) : (
                <div className="space-y-3">
                  {patientPrescriptions.map((rx) => (
                    <div
                      key={rx.id}
                      className="border border-[#DCE6EE] bg-[#F7FAFC] p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#0A2540]">{rx.id}</span>
                        <HealthLinkStatusBadge status={rx.status} />
                      </div>
                      <ul className="space-y-1.5 text-[#475569] hl-tabular">
                        {rx.lines.map((l) => (
                          <li key={l.medicineId} className="bg-white border border-[#EAEFF4] p-2">
                            <p className="font-semibold text-[#0A2540]">{l.medicineName}</p>
                            <p>{l.dosageInstruction}</p>
                            <p className="text-[11px] text-[#0F766E] font-semibold mt-0.5">
                              Issued {l.dispensedQty} of {l.prescribedQty}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: INVOICES */}
        {activeTab === 'invoices' && (
          <div className="bg-white border border-[#DCE6EE] p-5 space-y-4">
            <h2 className="text-base font-bold text-[#0A2540]">
              Itemized Invoices — {activePatient.name} ({patientInvoices.length})
            </h2>

            {patientInvoices.length === 0 ? (
              <p className="text-xs text-[#64748B] py-4">
                No invoices have been issued to {activePatient.name} yet.
              </p>
            ) : (
              <div className="space-y-4">
                {patientInvoices.map((inv) => {
                  const fac = dataset.facilities.find((f) => f.id === inv.facilityId);
                  return (
                    <div
                      key={inv.id}
                      className="border border-[#DCE6EE] bg-[#F7FAFC] p-4 space-y-3 text-xs hl-tabular"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#EAEFF4]">
                        <div>
                          <p className="font-bold text-[#0A2540] text-sm">
                            {inv.id} — {formatCurrencyUsd(inv.totalAmount)}
                          </p>
                          <p className="text-[#475569]">
                            {fac?.name} · Issued {inv.issuedDateIso} at {inv.issuedTimeLabel}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <HealthLinkStatusBadge status={inv.status} />
                          {inv.status === 'pending_payment' && (
                            <button
                              type="button"
                              onClick={() =>
                                recordInvoicePayment({
                                  invoiceId: inv.id,
                                  method: 'Portal Demo Card •••• 4242',
                                })
                              }
                              className="px-3 py-1.5 bg-[#0F766E] hover:bg-[#0D9488] text-white font-semibold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              Settle Payment (Demo)
                            </button>
                          )}
                          {fac && (
                            <button
                              type="button"
                              onClick={() =>
                                setPrintPayload({
                                  type: 'payment_receipt',
                                  invoice: inv,
                                  patient: activePatient,
                                  facility: fac,
                                })
                              }
                              className="px-3 py-1.5 border border-[#DCE6EE] bg-white hover:border-[#0D9488] text-[#0A2540] font-semibold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              Print Receipt
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {inv.items.map((item, idx) => (
                          <div
                            key={`${item.description}-${idx}`}
                            className="bg-white border border-[#EAEFF4] p-2.5 flex justify-between gap-2"
                          >
                            <span className="text-[#0A2540]">
                              {item.description} (×{item.quantity})
                            </span>
                            <span className="font-mono font-semibold">
                              {formatCurrencyUsd(item.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <HealthLinkPrintModal
        payload={printPayload}
        onClose={() => setPrintPayload(null)}
      />

      {activeVideoVisit && (
        <HealthLinkSimulatedVideoModal
          open={Boolean(activeVideoVisit)}
          viewerRole="patient"
          clinicianName={activeVideoDoc?.name || 'Consulting Clinician'}
          patientName={activePatient.name}
          appointmentReason={activeVideoVisit.visitReason}
          queueToken={activeVideoVisit.queueToken}
          onClose={() => setActiveVideoVisitId(null)}
          onCompleteSession={(summary) => {
            completeTelehealthVisit({
              visitId: activeVideoVisit.id,
              diagnosis: summary.diagnosis,
              clinicalNotes: summary.clinicalNotes,
              followUpInstructions: summary.followUpInstructions,
            });
            setActiveVideoVisitId(null);
            switchTab('documents');
          }}
        />
      )}
    </div>
  );
};
