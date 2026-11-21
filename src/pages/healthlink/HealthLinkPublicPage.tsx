import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Calendar,
  ChevronDown,
  ClipboardCheck,
  FileText,
  Menu,
  Pill,
  Play,
  Receipt,
  ShieldAlert,
  Stethoscope,
  Video,
  X,
} from 'lucide-react';
import {
  HEALTHLINK_FAVICON_SVG,
  HealthLinkBrandLogo,
  useHealthLinkFavicon,
} from '../../components/healthlink/HealthLinkBrandLogo';
import { useHealthLinkStore } from '../../context/HealthLinkStoreContext';
import {
  HEALTHLINK_MEDIA,
  HealthLinkRole,
  getDemoTodayIso,
} from '../../data/healthlinkCatalog';

type JourneyStep = {
  id: string;
  stepNum: string;
  roleLabel: string;
  title: string;
  summary: string;
  targetRoute: string;
  role?: HealthLinkRole;
  image: string;
  imageAlt: string;
  highlights: string[];
};

const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'reception',
    stepNum: '01',
    roleLabel: 'Reception Desk',
    title: 'Find returning patients & assign queue tokens without duplicate crowding',
    summary:
      'Search returning outpatients by name, PT-ID, or phone to inspect prior case timelines immediately. Register walk-ins or check in scheduled slots to route queue tokens straight to the assigned physician.',
    targetRoute: '/showcase/healthlink/app/reception',
    role: 'reception',
    image: HEALTHLINK_MEDIA.heroHospital,
    imageAlt: 'Bright outpatient clinic reception lobby with clean check-in desk',
    highlights: [
      'Instant lookup across returning history (e.g. Aarav Kulkarni PT-1042)',
      'Duplicate same-day queue token prevention',
      'Printable reception token slip with clinician & department',
    ],
  },
  {
    id: 'doctor',
    stepNum: '02',
    roleLabel: 'Doctor Console',
    title: 'Capture structured vitals, notes, and stock-aware e-prescriptions',
    summary:
      'Clinicians work from their facility queue, review prior case timelines, enter vitals and working notes, and build multi-line prescriptions showing real pharmacy stock levels before signing.',
    targetRoute: '/showcase/healthlink/app/doctor',
    role: 'doctor',
    image: HEALTHLINK_MEDIA.doctorConsult,
    imageAlt: 'Attending clinician reviewing digital patient records on tablet with patient',
    highlights: [
      'Save clinical drafts safely or Sign & Send straight to Pharmacy',
      'Built-in low-stock and zero-stock visibility during prescribing',
      'Printable Consultation & Prescription Summary sheet',
    ],
  },
  {
    id: 'pharmacy',
    stepNum: '03',
    roleLabel: 'Outpatient Pharmacy',
    title: 'Dispense full or partial batches with automatic inventory deduction',
    summary:
      'Signed prescriptions queue automatically for pharmacists. Partial dispensing is supported when shelf stock is lower than ordered, preventing over-dispensing and zero-stock errors.',
    targetRoute: '/showcase/healthlink/app/pharmacy',
    role: 'pharmacy',
    image: HEALTHLINK_MEDIA.pharmacyDispense,
    imageAlt: 'Modern outpatient clinic dispensary organized with clinical precision',
    highlights: [
      'Blocks dispensing on out-of-stock medications cleanly',
      'Supports batch-by-batch partial dispensing with remaining balance tracking',
      'Printable Pharmacy Medicine Slip per batch',
    ],
  },
  {
    id: 'billing',
    stepNum: '04',
    roleLabel: 'Billing & Cashier',
    title: 'Itemize consultation fees and dispensed batches without double billing',
    summary:
      'Invoices pull unbilled clinician fees and unbilled pharmacy dispensing batches automatically. If a partial refill happens later, a follow-up invoice charges only the newly issued medicines.',
    targetRoute: '/showcase/healthlink/app/billing',
    role: 'billing',
    image: HEALTHLINK_MEDIA.heroHospital,
    imageAlt: 'Clinic front-office desk coordinating outpatient checkout',
    highlights: [
      'Never double-bills consultation fees or previously settled batches',
      'Supports demo coordination fees, discounts & multiple tender modes',
      'Printable itemized Payment Receipt synced immediately to Patient Portal',
    ],
  },
  {
    id: 'portal',
    stepNum: '05',
    roleLabel: 'Patient Portal & Telehealth',
    title: 'Book slots, join simulated video visits, and download released summaries',
    summary:
      'Patients inspect only their own released visit notes, prescription fulfillment status, and paid or pending receipts—plus book in-clinic or simulated telehealth video slots.',
    targetRoute: '/showcase/healthlink/portal',
    image: HEALTHLINK_MEDIA.telehealthHome,
    imageAlt: 'Patient joining a quiet home telehealth video check-in on a laptop',
    highlights: [
      'Real slot conflict prevention across clinicians and dates',
      'Browser-local simulated video room (no camera/mic permission prompts)',
      'Post-visit follow-up notes release straight into Documents tab',
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: 'Are the patients, clinicians, and prescriptions in HealthLink real?',
    a: 'No. All patients, clinicians, clinics (Northside General Clinic and Harborview Specialist Center), medicines, appointments, and invoices are fictional concept data stored strictly in your browser under localStorage for demonstration purposes.',
  },
  {
    q: 'How can a prospective healthcare client test the full end-to-end flow?',
    a: 'Click “Start Guided Demo” in the hero to walk step-by-step from Reception check-in (using returning patient PT-1042 Aarav Kulkarni) through Doctor prescribing, Pharmacy dispensing, Billing settlement, and Patient Portal verification—or switch roles anytime inside the workspace.',
  },
  {
    q: 'What happens if a prescribed medicine is low in stock or out of stock?',
    a: 'HealthLink prevents dispensing more than remaining prescription quantity or warehouse stock. For example, PulmoEase 100mcg begins at 4 units (demonstrating partial dispensing on RX-508), while NeuroCalm 25mg begins at 0 units and is blocked cleanly.',
  },
  {
    q: 'Does the Telehealth video consultation require camera or microphone access?',
    a: 'No. The Telehealth waiting room and consultation screen use a simulated browser-local preview so evaluators and clients can test the workflow cleanly on any desktop or mobile device without hardware permissions.',
  },
  {
    q: 'Can demo changes be restored back to the original clean state?',
    a: 'Yes. Every hospital workspace screen includes a “Reset Demo Data” control with a confirmation dialog that restores all seeded facilities, queues, stock levels, prescriptions, and invoices.',
  },
];

export const HealthLinkPublicPage: React.FC = () => {
  const navigate = useNavigate();
  useHealthLinkFavicon(true);

  const {
    dataset,
    setActiveRole,
    setActiveFacilityId,
    setFocusedPatientId,
    setActivePatientPortalId,
    setGuidedMode,
  } = useHealthLinkStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedStepId, setSelectedStepId] = useState<string>('reception');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    document.title = 'HealthLink — Connected Hospital Operations & Patient Portal';
  }, []);

  const today = getDemoTodayIso();
  const activeStep = JOURNEY_STEPS.find((s) => s.id === selectedStepId) || JOURNEY_STEPS[0];

  const todayVisitsCount = dataset.visits.filter((v) => v.visitDateIso === today).length;
  const pendingRxCount = dataset.prescriptions.filter(
    (p) => p.status === 'pending_pharmacy' || p.status === 'partially_dispensed'
  ).length;
  const lowStockCount = dataset.inventory.filter(
    (m) => m.stockQty <= m.reorderThreshold
  ).length;
  const scheduledAppointmentsCount = dataset.appointments.filter(
    (a) => a.status !== 'completed'
  ).length;

  const handleLaunchGuidedWalkIn = () => {
    setGuidedMode('walk_in');
    setActiveFacilityId('fac-northside');
    setFocusedPatientId('PT-1042');
    setActiveRole('reception');
    navigate('/showcase/healthlink/app/reception');
  };

  const handleLaunchTelehealthGuide = () => {
    setGuidedMode('telehealth');
    setActivePatientPortalId('PT-1042');
    navigate('/showcase/healthlink/portal/appointments');
  };

  const handleLaunchRole = (role: HealthLinkRole) => {
    setGuidedMode('none');
    setActiveRole(role);
    navigate(`/showcase/healthlink/app/${role}`);
  };

  return (
    <div className="healthlink-showcase min-h-screen flex flex-col bg-[#F7FAFC] text-[#0A2540]">
      {/* Discreet Showcase Attribution Bar */}
      <div className="bg-[#0A2540] text-slate-200 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-[#5EEAD4] uppercase tracking-wider shrink-0">
              Interactive Concept Demo
            </span>
            <span className="text-slate-400 hidden sm:inline" aria-hidden="true">
              |
            </span>
            <span className="text-slate-300 hidden sm:inline truncate">
              Sample hospital workflow using fictional patients, stock &amp; simulated billing
            </span>
          </div>

          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1.5 text-slate-200 hover:text-[#5EEAD4] font-medium transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Genmax Portfolio</span>
          </Link>
        </div>
      </div>

      {/* Main Public Product Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DCE6EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/showcase/healthlink" aria-label="HealthLink Home" className="shrink-0">
            <HealthLinkBrandLogo variant="full" tone="dark" size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="HealthLink sections"
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#475569]"
          >
            <a href="#platform" className="hover:text-[#0A2540] transition-colors whitespace-nowrap shrink-0">
              Platform
            </a>
            <a href="#workflow" className="hover:text-[#0A2540] transition-colors whitespace-nowrap shrink-0">
              Hospital Workflow
            </a>
            <a href="#portal" className="hover:text-[#0A2540] transition-colors whitespace-nowrap shrink-0">
              Patient Portal
            </a>
            <a href="#faq" className="hover:text-[#0A2540] transition-colors whitespace-nowrap shrink-0">
              FAQ
            </a>
          </nav>

          {/* Desktop CTA Group */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              to="/showcase/healthlink/portal"
              className="px-4 py-2 border border-[#DCE6EE] bg-white hover:border-[#0D9488] text-xs font-semibold text-[#0A2540] transition-colors whitespace-nowrap shrink-0"
            >
              Patient Portal
            </Link>
            <Link
              to="/showcase/healthlink/app"
              className="px-4 py-2.5 bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Launch Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="lg:hidden p-2 border border-[#DCE6EE] bg-white text-[#0A2540] cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#DCE6EE] px-4 py-4 space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2 text-[#475569] font-medium">
              <a
                href="#platform"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-[#F7FAFC] border border-[#DCE6EE]"
              >
                Platform
              </a>
              <a
                href="#workflow"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-[#F7FAFC] border border-[#DCE6EE]"
              >
                Hospital Workflow
              </a>
              <a
                href="#portal"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-[#F7FAFC] border border-[#DCE6EE]"
              >
                Patient Portal
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-[#F7FAFC] border border-[#DCE6EE]"
              >
                FAQ
              </a>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#EAEFF4]">
              <Link
                to="/showcase/healthlink/app"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 px-4 bg-[#0F766E] text-white text-center text-xs font-semibold"
              >
                Launch Hospital Demo
              </Link>
              <Link
                to="/showcase/healthlink/portal"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 px-4 border border-[#DCE6EE] text-[#0A2540] text-center text-xs font-semibold"
              >
                Open Patient Portal
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white border-b border-[#DCE6EE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#0F766E]">
                  Multi-Role Hospital Operations Platform
                </p>

                <h1
                  className="text-3xl sm:text-5xl font-extrabold text-[#0A2540] leading-[1.1] tracking-tight"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", textWrap: 'balance' }}
                >
                  From patient check-in to follow-up, one connected workspace
                </h1>

                <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl">
                  HealthLink links front-desk queue tokens, doctor consultation notes and
                  stock-aware prescribing, outpatient pharmacy dispensing, itemized billing, and a
                  patient portal with simulated telehealth visits in a single working demo.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <Link
                    to="/showcase/healthlink/app"
                    className="px-6 py-3.5 bg-[#0F766E] hover:bg-[#0D9488] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Launch Demo</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleLaunchGuidedWalkIn}
                    className="px-6 py-3.5 border border-[#DCE6EE] bg-[#F7FAFC] hover:border-[#0D9488] text-[#0A2540] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Play className="w-4 h-4 text-[#0F766E]" />
                    <span>Start Guided Demo</span>
                  </button>
                </div>

                {/* Live Local Demo State Counters (Strict Factual Workspace Data) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#EAEFF4] hl-tabular">
                  <div>
                    <p className="text-xl font-bold text-[#0A2540]">{todayVisitsCount}</p>
                    <p className="text-xs text-[#475569]">Sample Visits Today</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[#0F766E]">{pendingRxCount}</p>
                    <p className="text-xs text-[#475569]">Active RX in Queue</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[#9A3412]">{lowStockCount}</p>
                    <p className="text-xs text-[#475569]">Stock Alerts Seeded</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[#0A2540]">{scheduledAppointmentsCount}</p>
                    <p className="text-xs text-[#475569]">Portal Bookings</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Clinic Image + Live Interactive Product UI Preview */}
              <div className="lg:col-span-6 space-y-4">
                <div className="border border-[#DCE6EE] bg-[#F7FAFC] overflow-hidden shadow-sm">
                  <div className="bg-[#0A2540] px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="font-mono">healthlink.app/northside-clinic</span>
                    <span className="text-[#5EEAD4] font-semibold">Live Interactive Workspace</span>
                  </div>
                  <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={HEALTHLINK_MEDIA.heroHospital}
                      alt="HealthLink sample outpatient reception and care desk"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="p-4 bg-white border-t border-[#DCE6EE] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-[#EDF7F5] border border-[#CBE8E2]">
                      <p className="font-semibold text-[#0F766E]">Returning Sample Case</p>
                      <p className="font-bold text-[#0A2540] mt-0.5">Aarav Kulkarni · PT-1042</p>
                      <p className="text-[#475569]">2 prior visits on timeline</p>
                    </div>
                    <div className="p-3 bg-[#F7FAFC] border border-[#DCE6EE]">
                      <p className="font-semibold text-[#0A2540]">Pending Pharmacy</p>
                      <p className="font-bold text-[#0A2540] mt-0.5">David Kim · RX-509</p>
                      <p className="text-[#475569]">Ready to dispense</p>
                    </div>
                    <div className="p-3 bg-[#F7FAFC] border border-[#DCE6EE]">
                      <p className="font-semibold text-[#0A2540]">Partial Batch Example</p>
                      <p className="font-bold text-[#0A2540] mt-0.5">Nadia Patel · RX-508</p>
                      <p className="text-[#475569]">2 of 4 inhalers remaining</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Connected Hospital Journey (#workflow) */}
        <section id="workflow" className="py-16 sm:py-20 bg-[#F7FAFC] border-b border-[#DCE6EE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="max-w-3xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0F766E]">
                End-to-End Hospital Workflow
              </p>
              <h2
                className="text-2xl sm:text-4xl font-bold text-[#0A2540] tracking-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Every department updates the same patient case in real time
              </h2>
              <p className="text-sm sm:text-base text-[#475569]">
                Inspect how Reception, Clinicians, Pharmacists, Cashiers, and Patients share one
                synchronized workflow without redundant paperwork.
              </p>
            </div>

            {/* Step Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {JOURNEY_STEPS.map((step) => {
                const active = step.id === activeStep.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setSelectedStepId(step.id)}
                    className={`p-3.5 border text-left transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#0A2540] border-[#0A2540] text-white'
                        : 'bg-white border-[#DCE6EE] text-[#0A2540] hover:border-[#0D9488]'
                    }`}
                  >
                    <p
                      className={`text-[11px] font-mono font-semibold ${
                        active ? 'text-[#5EEAD4]' : 'text-[#0F766E]'
                      }`}
                    >
                      STEP {step.stepNum}
                    </p>
                    <p className="text-xs sm:text-sm font-bold mt-0.5">{step.roleLabel}</p>
                  </button>
                );
              })}
            </div>

            {/* Selected Journey Detail Card */}
            <div className="bg-white border border-[#DCE6EE] grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#0F766E]">
                    Step {activeStep.stepNum} · {activeStep.roleLabel}
                  </span>
                  <h3
                    className="text-2xl font-bold text-[#0A2540]"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {activeStep.title}
                  </h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{activeStep.summary}</p>

                  <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-[#0A2540]">
                    {activeStep.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <ClipboardCheck className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#EAEFF4] flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeStep.role) {
                        handleLaunchRole(activeStep.role);
                      } else {
                        navigate(activeStep.targetRoute);
                      }
                    }}
                    className="px-5 py-2.5 bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Open {activeStep.roleLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleLaunchGuidedWalkIn}
                    className="px-4 py-2.5 border border-[#DCE6EE] bg-[#F7FAFC] hover:border-[#0D9488] text-[#0A2540] text-xs font-semibold cursor-pointer"
                  >
                    Start Guided Walkthrough
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-[#DCE6EE] bg-[#F7FAFC] aspect-[4/3] lg:aspect-auto overflow-hidden">
                <img
                  src={activeStep.image}
                  alt={activeStep.imageAlt}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Role Modules Overview (#platform) */}
        <section id="platform" className="py-16 sm:py-20 bg-white border-b border-[#DCE6EE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0F766E]">
                Role-Based Architecture
              </p>
              <h2
                className="text-2xl sm:text-4xl font-bold text-[#0A2540] tracking-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Explore any hospital desk directly
              </h2>
              <p className="text-sm sm:text-base text-[#475569]">
                Jump straight into a specific clinical or administrative module, or switch roles
                anytime inside the hospital workspace header.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Calendar,
                  title: 'Reception Desk',
                  desc: 'Search returning patients, inspect full history drawers, check in appointments, and generate non-duplicate queue tokens.',
                  action: 'Open Reception Desk',
                  onClick: () => handleLaunchRole('reception'),
                },
                {
                  icon: Stethoscope,
                  title: 'Doctor Console',
                  desc: 'Log vitals, write diagnoses and follow-up plans, launch simulated telehealth rooms, and sign e-prescriptions.',
                  action: 'Open Doctor Console',
                  onClick: () => handleLaunchRole('doctor'),
                },
                {
                  icon: Pill,
                  title: 'Outpatient Pharmacy',
                  desc: 'Fulfill full or partial prescriptions with automated stock verification and printable batch dispensing slips.',
                  action: 'Open Pharmacy',
                  onClick: () => handleLaunchRole('pharmacy'),
                },
                {
                  icon: Receipt,
                  title: 'Billing & Cashier',
                  desc: 'Build itemized bills from unbilled consultations and pharmacy batches without double charging, then issue receipts.',
                  action: 'Open Billing Desk',
                  onClick: () => handleLaunchRole('billing'),
                },
                {
                  icon: BarChart3,
                  title: 'Administrator Console',
                  desc: 'Inspect live facility workload bars, low/zero stock alerts, and filterable cross-department audit activity.',
                  action: 'Open Admin Overview',
                  onClick: () => handleLaunchRole('admin'),
                },
                {
                  icon: FileText,
                  title: 'Patient Portal',
                  desc: 'Switch sample patient profiles to book appointments, join simulated video rooms, and view released visit PDFs.',
                  action: 'Open Patient Portal',
                  onClick: () => navigate('/showcase/healthlink/portal'),
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="box-zoom border border-[#DCE6EE] bg-[#F7FAFC] p-6 flex flex-col justify-between space-y-5 hover:border-[#0D9488]"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 bg-[#EDF7F5] border border-[#CBE8E2] flex items-center justify-center text-[#0F766E]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-[#0A2540]">{card.title}</h3>
                      <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={card.onClick}
                      className="text-xs font-semibold text-[#0F766E] hover:text-[#0A2540] inline-flex items-center gap-1.5 cursor-pointer self-start"
                    >
                      <span>{card.action}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Patient Portal & Telehealth Feature Highlight (#portal) */}
        <section id="portal" className="py-16 sm:py-20 bg-[#EDF7F5] border-b border-[#CBE8E2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="box-zoom-sm lg:col-span-6 border border-[#CBE8E2] bg-white overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={HEALTHLINK_MEDIA.telehealthHome}
                  alt="Patient connecting with clinic specialist via HealthLink Telehealth Portal"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 border-t border-[#DCE6EE] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#0A2540] inline-flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#0F766E]" />
                  Simulated Video Consultation Room
                </span>
                <span className="text-[#475569]">Zero camera permissions required</span>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0F766E]">
                Patient Portal &amp; Telehealth
              </p>
              <h2
                className="text-2xl sm:text-4xl font-bold text-[#0A2540] tracking-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Self-service scheduling, simulated remote visits, and patient-scoped records
              </h2>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Patients switch between sample accounts to book unreserved clinician slots, enter
                the simulated waiting room, and inspect only their own released case notes,
                prescriptions, and itemized receipts.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/showcase/healthlink/portal"
                  className="px-5 py-3 bg-[#0A2540] hover:bg-[#14375C] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors"
                >
                  <span>Open Patient Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={handleLaunchTelehealthGuide}
                  className="px-5 py-3 bg-white border border-[#0F766E] text-[#0F766E] hover:bg-[#0F766E] hover:text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Try Guided Telehealth Flow</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Data Transparency & FAQ (#faq) */}
        <section id="faq" className="py-16 sm:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="box-zoom-sm bg-[#F7FAFC] border border-[#DCE6EE] p-5 flex items-start gap-3 text-xs sm:text-sm text-[#475569]">
              <ShieldAlert className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-[#0A2540]">
                  Interactive Concept Demo Notice (Sample Clinical Data Only)
                </p>
                <p>
                  HealthLink uses fictional clinics, sample clinicians, mock medicines, and
                  browser-local state to showcase software architecture for hospital owners and
                  healthcare clients. It does not offer real medical advice, store real PHI, or
                  process live card payments.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2
                className="text-2xl sm:text-3xl font-bold text-[#0A2540]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Frequently Asked Questions
              </h2>

              <div className="border border-[#DCE6EE] divide-y divide-[#DCE6EE]">
                {FAQ_ITEMS.map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={item.q} className="bg-white">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#F7FAFC] cursor-pointer"
                      >
                        <span className="text-sm font-bold text-[#0A2540]">{item.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#0F766E] shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 text-xs sm:text-sm text-[#475569] leading-relaxed">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Public Footer with Official Brand Lockups & Back to Genmax */}
      <footer className="bg-[#0A2540] text-slate-300 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5 space-y-3">
              <HealthLinkBrandLogo
                variant="full"
                tone="light"
                size="md"
                subtitle="Interactive Concept Demo"
              />
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Connected hospital operations website, multi-role workspace, and patient portal
                showcase engineered by Genmax IT Solution.
              </p>
            </div>

            <div className="md:col-span-3 space-y-2 text-xs">
              <p className="font-semibold text-white uppercase tracking-wider">Experiences</p>
              <ul className="space-y-1.5">
                <li>
                  <Link to="/showcase/healthlink/app" className="hover:text-[#5EEAD4]">
                    Hospital Workspace
                  </Link>
                </li>
                <li>
                  <Link to="/showcase/healthlink/portal" className="hover:text-[#5EEAD4]">
                    Patient Portal
                  </Link>
                </li>
                <li>
                  <Link to="/portfolio" className="hover:text-[#5EEAD4]">
                    Back to Genmax Portfolio
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-2 text-xs">
              <p className="font-semibold text-white uppercase tracking-wider">
                Brand Mark &amp; Favicon Identity
              </p>
              <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10">
                <HealthLinkBrandLogo variant="emblem" tone="light" size="sm" />
                <div className="w-5 h-5 overflow-hidden border border-white/20 shrink-0">
                  <img
                    src={`data:image/svg+xml,${encodeURIComponent(HEALTHLINK_FAVICON_SVG)}`}
                    alt="HealthLink 16px favicon mark"
                    className="w-full h-full"
                  />
                </div>
                <span className="text-[11px] text-slate-300">
                  Interlocking care-pathway emblem with light, dark &amp; favicon SVG variants.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <span>HealthLink Clinical Operations · Interactive Concept Demo</span>
            <Link to="/portfolio" className="text-[#5EEAD4] hover:underline font-medium">
              ← Return to Genmax IT Solution Portfolio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
