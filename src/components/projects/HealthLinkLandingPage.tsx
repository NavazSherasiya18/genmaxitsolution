import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ArrowRight } from 'lucide-react';
import { ShowcaseProject } from '../../data/showcaseProjects';
import { ProjectBrandLogo } from '../brand/ProjectLogos';

export const HealthLinkLandingPage: React.FC<{ project: ShowcaseProject }> = ({ project }) => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  const [activeVitalsChannel, setActiveVitalsChannel] = useState<'cardiology' | 'pulmonary' | 'metabolic'>('cardiology');
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM');
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Sarah Evans, MD (Cardiology)');
  const [bookedConsult, setBookedConsult] = useState(false);
  const [billingMode, setBillingMode] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [clinicEmail, setClinicEmail] = useState('');
  const [clinicDemoSent, setClinicDemoSent] = useState(false);

  const vitalsData = {
    cardiology: {
      patient: 'Patient #HL-8492 · Continuous Holter Sync',
      hr: '72 bpm',
      spo2: '99%',
      bp: '118 / 76',
      status: 'Normal Sinus Rhythm',
      notes: 'Zero atrial fibrillation episodes detected over last 24h telemetry window.',
    },
    pulmonary: {
      patient: 'Patient #HL-3104 · Smart Spirometry',
      hr: '68 bpm',
      spo2: '98.5%',
      bp: '114 / 72',
      status: 'Optimal Oxygenation',
      notes: 'FEV1/FVC ratio steady at 84%. Clear nocturnal respiratory cadence.',
    },
    metabolic: {
      patient: 'Patient #HL-5521 · Continuous CGM Feed',
      hr: '74 bpm',
      spo2: '99%',
      bp: '120 / 78',
      status: 'Glycemic Target Met',
      notes: 'Time-in-range holding at 94% across 7-day rolling basal curve.',
    },
  }[activeVitalsChannel];

  const specialists = [
    { name: 'Dr. Sarah Evans, MD (Cardiology)', dept: 'Preventive Cardiology', exp: '16 Yrs · Johns Hopkins', nextSlot: 'Today 11:00 AM' },
    { name: 'Dr. Marcus Chen, MD (Pulmonology)', dept: 'Sleep & Respiratory Medicine', exp: '14 Yrs · Stanford Medical', nextSlot: 'Today 02:15 PM' },
    { name: 'Dr. Priya Nair, MD (Endocrinology)', dept: 'Metabolic & Continuous CGM', exp: '12 Yrs · Mass General', nextSlot: 'Today 04:30 PM' },
    { name: 'Dr. Elena Alvarez, MD (Neurology)', dept: 'Remote Stroke & Sleep Care', exp: '18 Yrs · Mayo Clinic', nextSlot: 'Tomorrow 09:30 AM' },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0F172A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-[#1D4ED8] text-white text-xs font-bold shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. Clinical Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <a href="#top" className="shrink-0">
            <ProjectBrandLogo projectId={project.id} size="md" tone="dark" />
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#telemetry" className="hover:text-[#1D4ED8] transition-colors whitespace-nowrap shrink-0">Patient Vitals</a>
            <a href="#specialists" className="hover:text-[#1D4ED8] transition-colors whitespace-nowrap shrink-0">Specialists</a>
            <a href="#workflow" className="hover:text-[#1D4ED8] transition-colors whitespace-nowrap shrink-0">Clinical Flow</a>
            <a href="#plans" className="hover:text-[#1D4ED8] transition-colors whitespace-nowrap shrink-0">Membership</a>
          </nav>

          <a
            href="#booking"
            className="px-5 py-2.5 rounded-xl bg-[#1D4ED8] text-white font-semibold text-xs hover:bg-[#1E40AF] transition-colors whitespace-nowrap shrink-0"
          >
            Book Consultation
          </a>
        </div>
      </header>

      {/* 2. Hero */}
      <section id="top" className="py-16 lg:py-24 bg-[#F4F7FB] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="text-xs font-bold text-[#1D4ED8] uppercase tracking-widest">
              HIPAA &amp; HL7 FHIR Compliant Virtual Hospital Platform
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]" style={{ textWrap: 'balance' }}>
              Continuous Clinical Vitals &amp; Specialist Telehealth in 4 Minutes
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              Connect directly with 4,500+ board-certified cardiologists, pulmonologists, and internists. Live Bluetooth ECG, SpO2, and continuous glucose streams directly inside encrypted video triage rooms.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="#booking" className="px-6 py-3.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2">
                <span>Book Encrypted Triage</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#telemetry" className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider hover:bg-slate-50">
                Inspect Live Vitals
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div>
                <div className="text-2xl font-bold text-[#1D4ED8] tabular-nums">1.2M+</div>
                <div className="text-xs text-slate-500">Annual Consults</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#059669] tabular-nums">&lt; 4 Mins</div>
                <div className="text-xs text-slate-500">Median Wait Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 tabular-nums">96.2%</div>
                <div className="text-xs text-slate-500">Patient Retention</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white">
              <img
                src={project.secondaryImage}
                alt="Physician reviewing digital ECG telemetry"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Biometric Telemetry & Booking Module */}
      <section id="telemetry" className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-[#1D4ED8]">Live Biometric Stream</div>
                <h2 className="text-2xl font-bold text-slate-900">Remote Vitals Telemetry Monitor</h2>
              </div>
              <div className="flex gap-1.5 bg-slate-200/70 p-1 rounded-xl">
                {[
                  { id: 'cardiology', label: 'Cardiology' },
                  { id: 'pulmonary', label: 'Pulmonary' },
                  { id: 'metabolic', label: 'Metabolic' },
                ].map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveVitalsChannel(ch.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      activeVitalsChannel === ch.id ? 'bg-white text-[#1D4ED8] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs font-mono text-slate-500">{vitalsData.patient}</div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <div className="text-xs text-slate-500">Heart Rate</div>
                <div className="text-2xl font-bold text-[#1D4ED8] font-mono tabular-nums mt-1">{vitalsData.hr}</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <div className="text-xs text-slate-500">Blood Oxygen (SpO2)</div>
                <div className="text-2xl font-bold text-[#059669] font-mono tabular-nums mt-1">{vitalsData.spo2}</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <div className="text-xs text-slate-500">Blood Pressure</div>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">{vitalsData.bp}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-emerald-900">{vitalsData.status}</div>
                <p className="text-xs text-emerald-800 mt-0.5">{vitalsData.notes}</p>
              </div>
            </div>
          </div>

          <div id="booking" className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div>
              <div className="text-xs font-semibold text-[#1D4ED8]">Immediate Video Triage</div>
              <h3 className="text-xl font-bold text-slate-900">Schedule Specialist Session</h3>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 block">Attending Specialist</label>
              <select
                value={selectedDoctor}
                onChange={(e) => { setSelectedDoctor(e.target.value); setBookedConsult(false); }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
              >
                {specialists.map((s) => (
                  <option key={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 block">Today’s Available Encrypted Slots</label>
              <div className="grid grid-cols-2 gap-2">
                {['09:30 AM', '11:00 AM', '02:15 PM', '04:30 PM'].map((slot) => (
                  <button
                    key={slot}
                    onClick={() => { setSelectedSlot(slot); setBookedConsult(false); }}
                    className={`py-2.5 rounded-xl text-xs font-mono font-semibold border cursor-pointer transition-colors ${
                      selectedSlot === slot
                        ? 'bg-blue-50 border-[#1D4ED8] text-[#1D4ED8]'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {bookedConsult ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                Confirmed: {selectedDoctor} at {selectedSlot} — Encrypted WebRTC room link dispatched.
              </div>
            ) : (
              <button
                onClick={() => {
                  setBookedConsult(true);
                  showToast(`Appointment confirmed with ${selectedDoctor} at ${selectedSlot}`);
                }}
                className="w-full py-3.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Confirm {selectedSlot} Video Consultation
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. Board-Certified Specialist Directory */}
      <section id="specialists" className="py-20 bg-[#F4F7FB] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-bold uppercase tracking-widest text-[#1D4ED8] mb-2">On-Call Attending Faculty</div>
            <h2 className="text-3xl font-bold text-slate-900">Select a Board-Certified Specialist</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialists.map((doc) => (
              <div key={doc.name} className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-xs font-semibold text-[#1D4ED8]">{doc.dept}</div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{doc.name}</h3>
                  <div className="text-xs text-slate-500 mt-1">{doc.exp}</div>
                </div>
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="text-xs font-mono text-emerald-700 font-semibold">{doc.nextSlot}</div>
                  <a
                    href="#booking"
                    onClick={() => {
                      setSelectedDoctor(doc.name);
                      setBookedConsult(false);
                      showToast(`Selected ${doc.name} for video consultation.`);
                    }}
                    className="block w-full py-2 rounded-lg bg-slate-900 hover:bg-[#1D4ED8] text-white text-center text-xs font-bold transition-colors"
                  >
                    Select Physician
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 4-Stage Virtual Care Workflow */}
      <section id="workflow" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-bold uppercase tracking-widest text-[#1D4ED8] mb-2">End-to-End Care Pathway</div>
            <h2 className="text-3xl font-bold text-slate-900">How Remote Clinical Triage Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01. Wearable & Sensor Pair', desc: 'Apple Watch, pulse oximeters, and Bluetooth blood pressure cuffs auto-sync within 15 seconds.' },
              { step: '02. AI Risk Stratification', desc: 'Clinical scoring models highlight abnormal arrhythmias or glycemic spikes before the physician joins.' },
              { step: '03. 4-Min Video Consultation', desc: 'Zero-latency 1080p encrypted video triage inside your dedicated clinical care portal.' },
              { step: '04. Pharmacy & Lab Routing', desc: 'Signed e-prescriptions route straight to Walgreens, CVS, or local hospital pharmacies.' },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                <div className="text-sm font-bold text-[#1D4ED8]">{item.step}</div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. EHR Interoperability Split */}
      <section className="py-20 bg-[#F4F7FB] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 h-96 bg-white">
            <img src={project.thumbnail} alt="HealthLink Clinical Tablet Interface" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>
          <div className="lg:col-span-6 space-y-5">
            <div className="text-xs font-bold uppercase tracking-widest text-[#1D4ED8]">Enterprise EHR Interoperability</div>
            <h2 className="text-3xl font-bold text-slate-900">Bi-Directional Epic &amp; Cerner HL7 Sync</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every clinical note, e-prescription, and continuous vital waveform archives automatically into existing hospital electronic health records with AES-256 zero-knowledge encryption.
            </p>
            <blockquote className="p-5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 italic">
              “HealthLink cut our outpatient cardiology waitlists from 19 days to 4 minutes while improving post-discharge medication adherence to 96%.” — Dr. Anita Kulkarni, Chief Medical Officer
            </blockquote>
          </div>
        </div>
      </section>

      {/* 7. Patient & Hospital Membership Plans */}
      <section id="plans" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#1D4ED8] mb-1">Transparent Clinical Licensing</div>
              <h2 className="text-3xl font-bold text-slate-900">Care Access &amp; Clinic Deployments</h2>
            </div>

            <div className="inline-flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setBillingMode('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${billingMode === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingMode('annual')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${billingMode === 'annual' ? 'bg-white text-[#1D4ED8] shadow-xs' : 'text-slate-600'}`}
              >
                Annual (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Individual Virtual Care',
                target: 'For patients managing chronic vitals',
                price: billingMode === 'annual' ? '$39/mo' : '$49/mo',
                specs: ['Unlimited 24/7 urgent video triage', 'Smart SpO2 & BP Bluetooth telemetry sync', 'Direct pharmacy prescription routing'],
              },
              {
                name: 'Private Practice Suite',
                target: 'For multi-physician specialty clinics',
                price: billingMode === 'annual' ? '$490/mo' : '$590/mo',
                specs: ['Up to 15 attending clinical seats', 'Bi-directional Epic / Cerner HL7 FHIR API', 'Automated CPT telemedicine billing codes'],
              },
              {
                name: 'Enterprise Health Network',
                target: 'For regional hospital groups',
                price: 'Custom SLA',
                specs: ['Unlimited patient & specialist capacity', 'Dedicated AWS GovCloud HIPAA tenancy', '24/7 clinical systems engineer support'],
              },
            ].map((tier, idx) => (
              <div key={idx} className={`p-8 rounded-2xl border flex flex-col justify-between space-y-6 ${idx === 1 ? 'border-[#1D4ED8] bg-blue-50/30' : 'border-slate-200 bg-white'}`}>
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-[#1D4ED8]">{tier.target}</div>
                  <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                  <div className="text-3xl font-extrabold text-slate-900 tabular-nums">{tier.price}</div>
                  <ul className="space-y-2.5 pt-3 border-t border-slate-200 text-xs text-slate-600">
                    {tier.specs.map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#1D4ED8] shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href="#demo"
                  onClick={() => showToast(`Selected ${tier.name} licensing inquiry.`)}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-[#1D4ED8] text-white text-center text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Select Plan
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Clinical FAQ & Hospital Demo Form */}
      <section id="demo" className="py-20 bg-[#F4F7FB] border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900 text-center">Compliance &amp; Telehealth FAQ</h2>
            {[
              { q: 'Does HealthLink accept major commercial and Medicare health plans?', a: 'Yes, automatic eligibility verification runs in real time for Aetna, BlueCross, Cigna, UnitedHealthcare, and Medicare Advantage.' },
              { q: 'Is continuous telemetry encrypted before leaving the patient device?', a: 'All BLE wearable metrics are signed with TLS 1.3 transport encryption and stored in zero-knowledge HIPAA vaults.' },
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl bg-white border border-slate-200">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left text-sm font-bold text-slate-900 cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#1D4ED8] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && <div className="px-5 pb-4 text-xs text-slate-600">{item.a}</div>}
              </div>
            ))}
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-5 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900">Deploy HealthLink Across Your Clinical Network</h3>
            {clinicDemoSent ? (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-sm font-medium">
                Sandbox Credentials Dispatched — Check your institutional email to explore the staging portal.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (clinicEmail.includes('@')) {
                    setClinicDemoSent(true);
                    showToast('Clinical network architecture packet sent.');
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  required
                  value={clinicEmail}
                  onChange={(e) => setClinicEmail(e.target.value)}
                  placeholder="Enter hospital or clinic email..."
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-sm focus:outline-none focus:border-[#1D4ED8]"
                />
                <button type="submit" className="px-6 py-3 rounded-xl bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#1E40AF] cursor-pointer whitespace-nowrap shrink-0">
                  Request Clinic Demo
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="py-12 bg-slate-900 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <ProjectBrandLogo projectId={project.id} size="sm" tone="light" />
            <p>HIPAA &amp; ISO 27001 certified clinical telemetry and remote specialist network.</p>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-white uppercase">Virtual Care</div>
            <div>Cardiology Triage</div>
            <div>Pulmonary Monitoring</div>
            <div>Continuous CGM Sync</div>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-white uppercase">Hospital API</div>
            <div>HL7 FHIR Connectors</div>
            <div>Epic &amp; Cerner Sync</div>
            <div>SOC2 Type II Audits</div>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-white uppercase">Support Desk</div>
            <div>support@healthlink.care</div>
            <div>Boston · Zurich</div>
            <div>© 2026 HealthLink Systems Inc.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
