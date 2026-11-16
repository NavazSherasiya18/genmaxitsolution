import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ArrowRight } from 'lucide-react';
import { ShowcaseProject } from '../../data/showcaseProjects';
import { ProjectBrandLogo } from '../brand/ProjectLogos';

export const AetherLandingPage: React.FC<{ project: ShowcaseProject }> = ({ project }) => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  const [fleetFilter, setFleetFilter] = useState<'all' | 'transit' | 'coldchain' | 'customs'>('all');
  const [selectedUnitId, setSelectedUnitId] = useState('UNIT-14B');
  const [diagnosticDone, setDiagnosticDone] = useState(false);
  const [activeCorridor, setActiveCorridor] = useState<'ocean' | 'highway' | 'air'>('ocean');
  const [truckCount, setTruckCount] = useState(250);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [fleetEmail, setFleetEmail] = useState('');
  const [fleetDemoSent, setFleetDemoSent] = useState(false);

  const fleetUnits = [
    {
      id: 'UNIT-14B',
      type: 'coldchain',
      driver: 'Sarah Jenkins · Freightliner eCascadia',
      route: 'Rotterdam Port -> Munich Biopharma Hub',
      status: 'Cold-Chain Nominal',
      speed: '84 km/h',
      temp: '3.8°C (Biopharma Lock)',
      eta: '04h 12m',
      efficiency: '96%',
    },
    {
      id: 'UNIT-88K',
      type: 'customs',
      driver: 'Michael Chen · Intermodal Heavy Hauler',
      route: 'Port Newark Terminal -> Chicago Rail Yard',
      status: 'Customs Clearance Stage 2',
      speed: '0 km/h (Berth 4)',
      temp: '14.2°C (Ambient)',
      eta: '14:00 EST',
      efficiency: '89%',
    },
    {
      id: 'UNIT-302M',
      type: 'transit',
      driver: 'Elena Rostova · Autonomous Convoy Lead',
      route: 'Singapore Jurong -> Kuala Lumpur Hub',
      status: 'In-Transit Optimal',
      speed: '91 km/h',
      temp: '2.4°C (Frozen Grade A)',
      eta: '02h 45m',
      efficiency: '98%',
    },
  ];

  const corridors = {
    ocean: { name: 'Maritime Container Telemetry', routes: 'Rotterdam · Singapore · Los Angeles', metric: '-41% Port Demurrage Fees', desc: 'Satellite AIS container transponder streams integrated with automated terminal chassis appointment scheduling.' },
    highway: { name: 'Interstate Electric & Diesel Convoys', routes: 'EU Autobahn · I-95 · Trans-Pacific Rail', metric: '-22.4% Fuel & kWh Burn', desc: 'Live platooning telemetry, CAN-Bus injector diagnostics, and dynamic toll/grade weather rerouting.' },
    air: { name: 'Biopharma Cold-Chain Air Freight', routes: 'Basel · Tokyo Narita · JFK Pharma Hub', metric: '99.98% Thermal Compliance', desc: 'Continuous NIST-traceable -70°C cryogenic and +2°C to +8°C biologic container monitoring across tarmac handoffs.' },
  }[activeCorridor];

  const visibleFleetUnits = fleetFilter === 'all' ? fleetUnits : fleetUnits.filter((u) => u.type === fleetFilter);
  const activeUnit = fleetUnits.find((u) => u.id === selectedUnitId) || fleetUnits[0];
  const estimatedAnnualSavings = Math.round(truckCount * 6840);
  const estimatedMonthlyLicense = Math.round(truckCount * 28);

  return (
    <div className="min-h-screen bg-[#101216] text-[#F3F4F6]" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-[#F97316] text-[#101216] text-xs font-bold shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-[#101216]/95 backdrop-blur-md border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <a href="#top" className="shrink-0">
            <ProjectBrandLogo projectId={project.id} size="md" tone="light" />
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-wider text-slate-300 font-medium">
            <a href="#console" className="hover:text-[#F97316] transition-colors whitespace-nowrap shrink-0">Live Dispatch</a>
            <a href="#corridors" className="hover:text-[#F97316] transition-colors whitespace-nowrap shrink-0">Corridors</a>
            <a href="#hardware" className="hover:text-[#F97316] transition-colors whitespace-nowrap shrink-0">IoT Edge</a>
            <a href="#pricing" className="hover:text-[#F97316] transition-colors whitespace-nowrap shrink-0">Fleet ROI</a>
          </nav>

          <a
            href="#trial"
            className="px-5 py-2.5 rounded-lg bg-[#F97316] text-[#101216] font-bold text-xs uppercase tracking-wider hover:bg-orange-400 transition-colors whitespace-nowrap shrink-0"
          >
            Deploy Fleet Trial
          </a>
        </div>
      </header>

      {/* 2. Hero */}
      <section id="top" className="py-16 lg:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#F97316]">
              Sub-Second Global Telemetry &amp; Cold-Chain Command
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]" style={{ textWrap: 'balance' }}>
              Command 45,000+ Freight Assets With Predictive Route AI
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Eliminate cold-chain spoilage and empty return miles. Real-time satellite GPS telemetry, ELD driver compliance, and automated port customs milestones unified on one operational plane.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="#console" className="px-6 py-3.5 rounded-lg bg-[#F97316] text-[#101216] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:bg-orange-400">
                <span>Inspect Live Telemetry</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#pricing" className="px-6 py-3.5 rounded-lg border border-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider hover:border-[#F97316]">
                Calculate Fleet Savings
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div>
                <div className="text-2xl font-bold text-white font-mono tabular-nums">45,000+</div>
                <div className="text-xs text-slate-400">Active Commercial Units</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#F97316] font-mono tabular-nums">-22.4%</div>
                <div className="text-xs text-slate-400">Diesel &amp; Energy Savings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">99.1%</div>
                <div className="text-xs text-slate-400">On-Time SLA Guarantee</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[420px] rounded-2xl overflow-hidden border border-orange-500/30 shadow-2xl">
              <img src={project.secondaryImage} alt="Aether Automated Logistics Intermodal Terminal" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Dispatch Console */}
      <section id="console" className="py-20 bg-[#15181E] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#F97316]">Interactive Fleet Command</div>
              <h2 className="text-3xl font-bold text-white mt-1">Live Vehicle &amp; Sensor Dispatch Monitor</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Vehicles' },
                { id: 'coldchain', label: 'Cold-Chain' },
                { id: 'transit', label: 'In-Transit' },
                { id: 'customs', label: 'Port Customs' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFleetFilter(f.id as any)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                    fleetFilter === f.id ? 'bg-[#F97316] text-[#101216]' : 'bg-[#1D2129] text-slate-300 border border-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-3">
              {visibleFleetUnits.map((u) => (
                <button
                  key={u.id}
                  onClick={() => { setSelectedUnitId(u.id); setDiagnosticDone(false); }}
                  className={`w-full text-left p-5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    activeUnit.id === u.id
                      ? 'bg-[#1D212A] border-[#F97316] shadow-lg'
                      : 'bg-[#181B21] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-[#F97316] font-bold">{u.id}</span>
                      <span className="text-slate-400">{u.driver}</span>
                    </div>
                    <div className="text-sm font-bold text-white mt-1">{u.route}</div>
                  </div>
                  <div className="text-right font-mono text-xs shrink-0">
                    <div className="text-emerald-400 font-semibold">{u.status}</div>
                    <div className="text-slate-400 mt-0.5 tabular-nums">ETA: {u.eta}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-5 p-6 rounded-xl bg-[#181B21] border border-slate-800 flex flex-col justify-between space-y-5">
              <div>
                <div className="text-xs font-mono text-[#F97316] mb-1">Active Telemetry Inspection · {activeUnit.id}</div>
                <h3 className="text-xl font-bold text-white">{activeUnit.route}</h3>
                <p className="text-xs text-slate-400 mt-1">{activeUnit.driver}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3.5 rounded-lg bg-[#101216] border border-slate-800">
                  <div className="text-[11px] text-slate-400">Ground Velocity</div>
                  <div className="text-lg font-bold text-white tabular-nums mt-0.5">{activeUnit.speed}</div>
                </div>
                <div className="p-3.5 rounded-lg bg-[#101216] border border-slate-800">
                  <div className="text-[11px] text-slate-400">Container Temp</div>
                  <div className="text-lg font-bold text-cyan-400 tabular-nums mt-0.5">{activeUnit.temp}</div>
                </div>
                <div className="p-3.5 rounded-lg bg-[#101216] border border-slate-800">
                  <div className="text-[11px] text-slate-400">Estimated Arrival</div>
                  <div className="text-lg font-bold text-[#F97316] tabular-nums mt-0.5">{activeUnit.eta}</div>
                </div>
                <div className="p-3.5 rounded-lg bg-[#101216] border border-slate-800">
                  <div className="text-[11px] text-slate-400">Route Efficiency</div>
                  <div className="text-lg font-bold text-emerald-400 tabular-nums mt-0.5">{activeUnit.efficiency}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setDiagnosticDone(true);
                  showToast(`Diagnostic packet verified for ${activeUnit.id}: All 14 IoT sensors nominal.`);
                }}
                className="w-full py-3 rounded-lg bg-[#F97316] hover:bg-orange-400 text-[#101216] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                {diagnosticDone ? `✓ ${activeUnit.id} Sensor Health Verified` : `Run Remote Diagnostic on ${activeUnit.id}`}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Multi-Modal Corridor Matrix */}
      <section id="corridors" className="py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#F97316]">Intermodal Network Intelligence</div>
              <h2 className="text-3xl font-bold text-white mt-1">Unified Ocean, Highway &amp; Cold-Air Corridors</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'ocean', label: 'Maritime Ports' },
                { id: 'highway', label: 'Autonomous Highway' },
                { id: 'air', label: 'Biopharma Air' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCorridor(c.id as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                    activeCorridor === c.id ? 'bg-[#F97316] text-[#101216]' : 'bg-[#181B21] text-slate-300 border border-slate-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#181B21] border border-orange-500/25 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <div className="text-xs font-mono text-emerald-400">{corridors.routes}</div>
              <h3 className="text-2xl font-bold text-white">{corridors.name}</h3>
              <p className="text-sm text-slate-300 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {corridors.desc}
              </p>
            </div>
            <div className="md:col-span-4 text-left md:text-right">
              <div className="text-xs text-slate-400">Verified Enterprise Outcome</div>
              <div className="text-2xl font-bold text-[#F97316] font-mono tabular-nums mt-1">{corridors.metric}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Hardware & Edge Gateway Specifications */}
      <section id="hardware" className="py-20 bg-[#15181E] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-10">Aether Edge Hardware &amp; Kafka Stream Specs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: '01. Dual-SIM 5G / Satcom', desc: 'Zero dead-zone failover across cross-border Alpine passes, ocean routes, and remote quarries.' },
              { title: '02. -70°C Cryo Probe', desc: 'FDA 21 CFR Part 11 compliant wireless thermal probes with 90-minute predictive compressor alerts.' },
              { title: '03. J1939 CAN-Bus Link', desc: 'Sub-second fault code capture for turbocharger, DEF, and braking wear prediction.' },
              { title: '04. Automated Customs EDI', desc: 'Direct webhook push into SAP TM, Oracle OTM, and port clearance manifest brokers.' },
            ].map((h, i) => (
              <div key={i} className="p-6 rounded-xl bg-[#181B21] border border-slate-800 space-y-2">
                <div className="text-sm font-bold text-[#F97316]">{h.title}</div>
                <p className="text-xs text-slate-300 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Visual Network Split */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-slate-800 h-88">
            <img src={project.thumbnail} alt="Aether Global GPS Routing Dashboard" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>
          <div className="lg:col-span-6 space-y-5">
            <div className="text-xs font-mono uppercase tracking-widest text-[#F97316]">Kafka Telemetry Stream Engine</div>
            <h2 className="text-3xl font-bold text-white">Zero Cargo Spoilage Across Ocean &amp; Highway Corridors</h2>
            <p className="text-sm text-slate-300 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Automated exception alerts trigger 90 minutes before compressor drift reaches threshold, routing carriers directly to pre-booked service depots along interstate corridors.
            </p>
            <blockquote className="p-5 rounded-xl bg-[#181B21] border border-slate-800 text-xs text-slate-300 italic">
              “Aether reduced our annual fleet fuel burn by $14.2M within six months of deployment.” — Marcus Vance, VP Supply Chain Operations
            </blockquote>
          </div>
        </div>
      </section>

      {/* 7. Interactive Fleet ROI & Licensing Calculator */}
      <section id="pricing" className="py-20 bg-[#15181E] border-y border-slate-800">
        <div className="max-w-4xl mx-auto px-6 p-8 rounded-2xl bg-[#181B21] border border-orange-500/25 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono text-[#F97316] uppercase">Fleet Scale Calculator</div>
              <h2 className="text-2xl font-bold text-white">Estimate Fuel Savings &amp; Monthly Licensing</h2>
            </div>
            <span className="text-2xl font-bold font-mono text-[#F97316] tabular-nums">{truckCount} Units</span>
          </div>

          <input
            type="range"
            min={25}
            max={2500}
            step={25}
            value={truckCount}
            onChange={(e) => setTruckCount(Number(e.target.value))}
            className="w-full accent-[#F97316] cursor-pointer"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800 font-mono">
            <div>
              <div className="text-xs text-slate-400">Est. Annual Fuel + Detention Savings</div>
              <div className="text-2xl font-bold text-emerald-400 tabular-nums mt-1">${estimatedAnnualSavings.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">All-Inclusive Fleet Platform Fee</div>
              <div className="text-2xl font-bold text-white tabular-nums mt-1">${estimatedMonthlyLicense.toLocaleString()}/mo</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Net Hardware Setup</div>
              <div className="text-2xl font-bold text-[#F97316] tabular-nums mt-1">$0 Upfront</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Operations FAQ & Pilot Trial CTA */}
      <section id="trial" className="py-20">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white text-center">Telemetry &amp; Hardware FAQ</h2>
            {[
              { q: 'How quickly can Edge Gateways be installed across legacy trailers?', a: 'Magnetic waterproof 10-year battery container units mount in under 90 seconds per trailer with zero harness wiring.' },
              { q: 'Does Aether integrate natively with SAP Transportation Management?', a: 'Yes, pre-built bi-directional Kafka webhooks sync ASNs, geofence dwell times, and BOL photos directly into SAP TM and Oracle OTM.' },
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl bg-[#181B21] border border-slate-800">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left text-sm font-bold text-white cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#F97316] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && <div className="px-5 pb-4 text-xs text-slate-300">{item.a}</div>}
              </div>
            ))}
          </div>

          <div className="p-8 rounded-2xl bg-[#15181E] border border-orange-500/30 text-center space-y-5">
            <h3 className="text-2xl font-bold text-white">Connect Your First 50 Trucks Free for 30 Days</h3>
            {fleetDemoSent ? (
              <div className="p-4 rounded-xl bg-orange-500/15 border border-orange-500/40 text-orange-300 text-sm font-medium">
                Telemetry API Sandbox Created — Provisioning key sent to your operations inbox.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (fleetEmail.includes('@')) {
                    setFleetDemoSent(true);
                    showToast('Fleet Telemetry API Sandbox key dispatched.');
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  required
                  value={fleetEmail}
                  onChange={(e) => setFleetEmail(e.target.value)}
                  placeholder="Operations director email..."
                  className="flex-1 px-4 py-3 rounded-lg bg-[#101216] border border-slate-700 text-white text-sm focus:outline-none focus:border-[#F97316]"
                />
                <button type="submit" className="px-6 py-3 rounded-lg bg-[#F97316] text-[#101216] font-bold text-xs uppercase tracking-wider hover:bg-orange-400 cursor-pointer whitespace-nowrap shrink-0">
                  Launch 30-Day Pilot
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="py-12 bg-[#0A0B0E] text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <ProjectBrandLogo projectId={project.id} size="sm" tone="light" />
            <p>Global satellite GPS &amp; cold-chain telemetry infrastructure for enterprise fleets.</p>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-white uppercase">Platform</div>
            <div>Live Route Dispatch</div>
            <div>Cold-Chain Sensors</div>
            <div>Port Customs Automation</div>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-white uppercase">Hubs</div>
            <div>Rotterdam Europort</div>
            <div>Port Newark, NJ</div>
            <div>Singapore Tuas</div>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-white uppercase">Operations</div>
            <div>dispatch@aetherfleet.io</div>
            <div>99.99% Uptime SLA</div>
            <div>© 2026 Aether Logistics Systems</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
