import React, { useState } from 'react';
import { 
  X, ArrowLeft, ExternalLink, Sparkles, CheckCircle2, ShoppingBag, 
  Calendar, MapPin, Search, Users, Activity, Heart, Shield, ArrowRight,
  TrendingUp, DollarSign, Truck, AlertTriangle, Monitor, Smartphone, Tablet,
  Compass, Award
} from 'lucide-react';
import { ShowcaseProject } from '../../data/showcaseProjects';

interface ProjectFirstPageViewerProps {
  project: ShowcaseProject;
  onClose?: () => void;
  onOpenAudit?: () => void;
  isModal?: boolean;
}

export const ProjectFirstPageViewer: React.FC<ProjectFirstPageViewerProps> = ({
  project,
  onClose,
  onOpenAudit,
  isModal = true,
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  // Interactive state per project
  const [ecommerceCartCount, setEcommerceCartCount] = useState(3);
  const [travelGuests, setTravelGuests] = useState('2 Adults');
  const [travelDestination, setTravelDestination] = useState('Santorini Caldera, Greece');
  const [fintechInvestment, setFintechInvestment] = useState(2500000);
  const [healthStatusChecked, setHealthStatusChecked] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 2500);
  };

  const calculatedYield = Math.round((fintechInvestment * 0.149));

  return (
    <div className={isModal ? "fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-start p-2 sm:p-4 animate-in fade-in duration-200" : "w-full"}>
      
      {/* ---------------- TOP AGENCY INSPECTOR BAR ---------------- */}
      <div className="w-full max-w-7xl bg-slate-900 border border-slate-700/80 text-white rounded-2xl p-3 sm:p-4 mb-3 shadow-2xl flex flex-wrap items-center justify-between gap-3 sticky top-2 z-50">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Genmax Projects</span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <strong className="text-white font-medium">{project.title}</strong>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{project.categoryLabel}</span>
            <span className="text-slate-500">•</span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-cyan-300 font-mono text-[10px]">
              {project.timeline}
            </span>
          </div>
        </div>

        {/* Device Switcher Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-slate-400">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${deviceMode === 'desktop' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:text-white'}`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${deviceMode === 'tablet' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:text-white'}`}
              title="Tablet View"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${deviceMode === 'mobile' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:text-white'}`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {onOpenAudit && (
            <button
              onClick={onOpenAudit}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-xs hover:opacity-95 shadow-md transition-all cursor-pointer"
            >
              Request Similar Build
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Action Notice Toast */}
      {actionNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* ---------------- PROJECT CANVAS CONTAINER ---------------- */}
      <div 
        className={`w-full transition-all duration-300 rounded-3xl overflow-hidden shadow-2xl border ${
          deviceMode === 'desktop' ? 'max-w-7xl' : deviceMode === 'tablet' ? 'max-w-[768px]' : 'max-w-[420px]'
        }`}
        style={{
          backgroundColor: project.themeStyle.bg,
          color: project.themeStyle.text,
          borderColor: project.themeStyle.borderColor,
        }}
      >

        {/* ========================================================= */}
        {/* CASE 1: E-COMMERCE (AURELIA & CO. LUXURY BOUTIQUE)         */}
        {/* ========================================================= */}
        {project.category === 'ecommerce' && (
          <div className="bg-[#0A0E17] text-[#F8FAFC] font-sans">
            {/* E-Commerce Header */}
            <div className="border-b border-[#D4AF37]/25 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <span className="text-xl sm:text-2xl font-serif font-bold tracking-widest text-[#D4AF37]">
                  AURÉLIA & CO.
                </span>
                <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-widest text-slate-300">
                  <span className="hover:text-[#D4AF37] cursor-pointer">High Jewelry</span>
                  <span className="hover:text-[#D4AF37] cursor-pointer">Collections</span>
                  <span className="hover:text-[#D4AF37] cursor-pointer">Atelier</span>
                  <span className="hover:text-[#D4AF37] cursor-pointer">Haute Horlogerie</span>
                </nav>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="text-[#D4AF37] font-medium hidden sm:inline">USD ($)</span>
                <button
                  onClick={() => {
                    setEcommerceCartCount((c) => c + 1);
                    triggerNotice('Item added to Aurélia luxury shopping bag!');
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-[#111726] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Bag ({ecommerceCartCount})</span>
                </button>
              </div>
            </div>

            {/* E-Commerce Hero Banner */}
            <div className="relative py-16 px-6 sm:px-12 border-b border-slate-800 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-serif tracking-widest uppercase bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fall/Winter High Haute Joaillerie</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
                    Elevate Your Elegance with Rare Gemstone Masterpieces
                  </h1>

                  <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                    Hand-finished in Milan and Paris with ethically certified diamonds, untreated Colombian emeralds, and 18K solid recycled gold.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => triggerNotice('Opening Aurélia Fall High-Jewelry Lookbook')}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E6CA65] to-[#C19B2E] text-slate-950 font-bold text-xs uppercase tracking-widest hover:opacity-90 shadow-lg shadow-[#D4AF37]/20 transition-all cursor-pointer"
                    >
                      Shop The Collection →
                    </button>
                    <button
                      onClick={() => triggerNotice('Private showroom appointment booked')}
                      className="px-6 py-3 rounded-full bg-slate-900 border border-[#D4AF37]/40 text-[#D4AF37] font-semibold text-xs tracking-wider uppercase hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Book Private Salon
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 relative">
                  <div className="rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl relative group">
                    <img
                      src={project.thumbnail}
                      alt="Aurélia & Co. Luxury Collection"
                      className="w-full h-72 sm:h-84 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-950/90 border border-[#D4AF37]/30 backdrop-blur-md flex items-center justify-between">
                      <div>
                        <div className="text-xs font-serif font-bold text-white">Serpentine Diamond Choker</div>
                        <div className="text-[11px] text-[#D4AF37]">14.5ct VVS Diamonds • $34,000</div>
                      </div>
                      <button
                        onClick={() => {
                          setEcommerceCartCount((c) => c + 1);
                          triggerNotice('Added Serpentine Diamond Choker to bag!');
                        }}
                        className="px-3 py-1 rounded-lg bg-[#D4AF37] text-slate-950 text-xs font-bold hover:bg-[#E6CA65] cursor-pointer"
                      >
                        Add to Bag
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* E-Commerce Product Carousel Cards */}
            <div className="p-6 sm:p-12 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif font-bold text-white tracking-wide">
                  Signature Atelier Releases
                </h3>
                <span className="text-xs text-[#D4AF37] underline cursor-pointer">View All 48 Pieces</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { name: 'Emerald Cascade Earrings', price: '$15,200', tag: 'Natural Emerald', desc: '5.2ct Colombian untreated emeralds set in platinum.' },
                  { name: 'Atelier Velvet Dinner Blazer', price: '$3,850', tag: 'Silk Tailoring', desc: 'Italian black velvet tailored to bespoke specifications.' },
                  { name: 'Pavé Solitaire Eternity Ring', price: '$9,400', tag: 'D-Flawless', desc: '3.1ct oval diamond with micro-pavé inner gallery.' },
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#111726] border border-[#D4AF37]/20 space-y-3 hover:border-[#D4AF37]/60 transition-all">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                      {item.tag}
                    </span>
                    <h4 className="text-base font-serif font-bold text-white">{item.name}</h4>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                      <span className="text-sm font-bold text-white">{item.price}</span>
                      <button
                        onClick={() => {
                          setEcommerceCartCount((c) => c + 1);
                          triggerNotice(`Added ${item.name} to luxury bag!`);
                        }}
                        className="text-xs text-[#D4AF37] hover:underline font-semibold cursor-pointer"
                      >
                        + Add to Bag
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CASE 2: TRAVEL & RESORT (AZURE ESCAPES)                    */}
        {/* ========================================================= */}
        {project.category === 'travel' && (
          <div className="bg-[#041B2D] text-[#F0F9FF] font-sans">
            {/* Travel Header */}
            <div className="border-b border-[#38BDF8]/25 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#38BDF8]" />
                  <span>AZURE ESCAPES</span>
                </span>
                <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider text-slate-300">
                  <span className="hover:text-[#38BDF8] cursor-pointer">Santorini</span>
                  <span className="hover:text-[#38BDF8] cursor-pointer">Amalfi Coast</span>
                  <span className="hover:text-[#38BDF8] cursor-pointer">Ibiza</span>
                  <span className="hover:text-[#38BDF8] cursor-pointer">Bali Villas</span>
                </nav>
              </div>

              <button
                onClick={() => triggerNotice('Direct Concierge connected via WhatsApp')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-md transition-all cursor-pointer"
              >
                Book Consultation
              </button>
            </div>

            {/* Travel Hero Banner */}
            <div className="relative py-16 px-6 sm:px-12 border-b border-sky-950 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-sky-500/20 text-[#38BDF8] border border-sky-500/30">
                    Handpicked Mediterranean & Tropical Sanctuaries
                  </span>

                  <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                    Discover Your Private Coastal Sanctuary
                  </h1>

                  <p className="text-sm text-sky-200/80 max-w-xl leading-relaxed">
                    Cliffside Aegean infinity pool villas, private chefs, and direct yacht charters with 24/7 dedicated butler service.
                  </p>

                  {/* Interactive Travel Search Bar */}
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-sky-400/30 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="text-[10px] text-sky-300 uppercase font-semibold block mb-1">Destination</label>
                        <select
                          value={travelDestination}
                          onChange={(e) => setTravelDestination(e.target.value)}
                          className="w-full bg-[#082842] border border-sky-600/40 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none"
                        >
                          <option value="Santorini Caldera, Greece">Santorini Caldera, Greece</option>
                          <option value="Amalfi Cliffside, Italy">Amalfi Cliffside, Italy</option>
                          <option value="Uluwatu Oceanfront, Bali">Uluwatu Oceanfront, Bali</option>
                          <option value="Formentera Island, Spain">Formentera Island, Spain</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-sky-300 uppercase font-semibold block mb-1">Dates</label>
                        <div className="w-full bg-[#082842] border border-sky-600/40 rounded-lg px-2.5 py-2 text-white text-xs flex items-center justify-between">
                          <span>Jun 14 - Jun 21</span>
                          <Calendar className="w-3.5 h-3.5 text-sky-400" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-sky-300 uppercase font-semibold block mb-1">Guests</label>
                        <select
                          value={travelGuests}
                          onChange={(e) => setTravelGuests(e.target.value)}
                          className="w-full bg-[#082842] border border-sky-600/40 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none"
                        >
                          <option value="2 Adults">2 Adults (Romantic)</option>
                          <option value="4 Adults">4 Adults (Villa Suite)</option>
                          <option value="8+ Family">8+ Family / Group</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => triggerNotice(`Found 14 available luxury villas for ${travelDestination}!`)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 cursor-pointer shadow-md"
                    >
                      Search Available Luxury Villas →
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 relative">
                  <div className="rounded-2xl overflow-hidden border border-sky-500/40 shadow-2xl relative group">
                    <img
                      src={project.thumbnail}
                      alt="Azure Escapes Villa Preview"
                      className="w-full h-72 sm:h-84 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#041B2D]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#082842]/90 border border-sky-400/30 backdrop-blur-md flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">Villa Oia Sunset Terrace</div>
                        <div className="text-[11px] text-sky-300">Santorini • €1,850 / night</div>
                      </div>
                      <button
                        onClick={() => triggerNotice('Villa Oia reservation request initiated!')}
                        className="px-3 py-1 rounded-lg bg-sky-400 text-slate-950 text-xs font-bold hover:bg-sky-300 cursor-pointer"
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Featured Destination Grid */}
            <div className="p-6 sm:p-12 space-y-6">
              <h3 className="text-xl font-bold text-white tracking-tight">Curated Coastal Collections</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { name: 'Amalfi Lemon Grove Estate', location: 'Ravello, Italy', price: '€2,400 / night', rating: '5.0 ★' },
                  { name: 'Uluwatu Cliff Top Villa', location: 'Bali, Indonesia', price: '$1,650 / night', rating: '4.9 ★' },
                  { name: 'Ibiza Sunset Bay Finca', location: 'Balearic Islands', price: '€3,100 / night', rating: '5.0 ★' },
                ].map((v, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#082842] border border-sky-600/30 space-y-2 hover:border-sky-400 transition-all">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-sky-300">{v.location}</span>
                      <span className="text-amber-400 font-bold">{v.rating}</span>
                    </div>
                    <h4 className="text-base font-bold text-white">{v.name}</h4>
                    <div className="flex items-center justify-between pt-2 border-t border-sky-900/60">
                      <span className="text-sm font-semibold text-[#38BDF8]">{v.price}</span>
                      <button
                        onClick={() => triggerNotice(`Viewing availability for ${v.name}`)}
                        className="text-xs text-white hover:text-sky-300 underline cursor-pointer"
                      >
                        View Villa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CASE 3: HEALTHTECH SAAS (HEALTHLINK)                       */}
        {/* ========================================================= */}
        {project.category === 'healthtech' && (
          <div className="bg-[#F8FAFC] text-[#0F172A] font-sans">
            {/* HealthTech Header */}
            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-white">
              <div className="flex items-center gap-8">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-blue-600 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span>HealthLink AI</span>
                </span>
                <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
                  <span className="text-blue-600 cursor-pointer">Patient Vitals</span>
                  <span className="hover:text-blue-600 cursor-pointer">Doctors</span>
                  <span className="hover:text-blue-600 cursor-pointer">Consultations</span>
                  <span className="hover:text-blue-600 cursor-pointer">Prescriptions</span>
                </nav>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  ● HIPAA Secure
                </span>
                <button
                  onClick={() => triggerNotice('Connecting to on-call physician...')}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-md transition-all cursor-pointer"
                >
                  Book Consultation
                </button>
              </div>
            </div>

            {/* HealthTech Hero */}
            <div className="p-6 sm:p-12 border-b border-slate-200 bg-gradient-to-b from-blue-50/50 to-white">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    Smart Vitals Telemetry & Virtual Clinic
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                    Seamless Clinical Care & Telemedicine in Minutes
                  </h1>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                    Connect directly with board-certified specialists. Real-time patient telemetry streaming SpO2, blood pressure, and ECG straight to clinical workstations.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setHealthStatusChecked(true);
                        triggerNotice('Patient telemetry vitals verified: Normal (98% SpO2, 72 bpm)');
                      }}
                      className="px-5 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition-all cursor-pointer shadow-md"
                    >
                      {healthStatusChecked ? '✓ Vitals Verified (Normal)' : 'Check Live Vitals Stream'}
                    </button>
                    <button
                      onClick={() => triggerNotice('Schedule appointment modal opened')}
                      className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Schedule Appointment
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-2xl overflow-hidden border border-blue-200 shadow-xl bg-white p-2">
                    <img
                      src={project.thumbnail}
                      alt="HealthLink Doctor Telemetry Dashboard"
                      className="w-full h-72 object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vitals Telemetry Live Cards */}
            <div className="p-6 sm:p-12 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Active Patient Monitoring Channels</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500">Average Heart Rate</div>
                  <div className="text-2xl font-bold text-blue-600 mt-1">72 - 78 bpm</div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-1">● Normal Sinus Rhythm</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500">Blood Oxygen (SpO2)</div>
                  <div className="text-2xl font-bold text-cyan-600 mt-1">98.5%</div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-1">● Optimal Range</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500">Next Consultation</div>
                  <div className="text-2xl font-bold text-indigo-600 mt-1">9:30 AM</div>
                  <div className="text-[11px] text-slate-500 mt-1">Dr. Sarah Evans (Cardiology)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CASE 4: FINTECH REAL ESTATE (PRIMUS CAPITAL)               */}
        {/* ========================================================= */}
        {project.category === 'fintech' && (
          <div className="bg-[#0F131C] text-[#F1F5F9] font-sans">
            {/* FinTech Header */}
            <div className="border-b border-amber-500/20 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span className="text-[#F59E0B]">PRIMUS</span> CAPITAL
                </span>
                <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider text-slate-400">
                  <span className="text-[#F59E0B] cursor-pointer">Portfolio GAV</span>
                  <span className="hover:text-white cursor-pointer">Yield Analytics</span>
                  <span className="hover:text-white cursor-pointer">Funds</span>
                  <span className="hover:text-white cursor-pointer">LP Portal</span>
                </nav>
              </div>

              <button
                onClick={() => triggerNotice('Request Institutional LP Prospectus')}
                className="px-4 py-2 rounded-xl bg-[#F59E0B] text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Request Access
              </button>
            </div>

            {/* FinTech Hero */}
            <div className="p-6 sm:p-12 border-b border-slate-800">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Institutional Wealth & Real Estate Portfolios
                  </span>

                  <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                    Unlocking Institutional Value Through Global Real Estate
                  </h1>

                  <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                    $16.4 Billion in prime life-science campuses, central business district commercial towers, and industrial logistics facilities.
                  </p>

                  {/* Interactive Yield Calculator */}
                  <div className="p-5 rounded-2xl bg-[#161D2B] border border-amber-500/30 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Interactive Capital Allocation:</span>
                      <strong className="text-amber-400 font-mono text-sm">${(fintechInvestment / 1000000).toFixed(2)}M USD</strong>
                    </div>

                    <input
                      type="range"
                      min="500000"
                      max="10000000"
                      step="250000"
                      value={fintechInvestment}
                      onChange={(e) => setFintechInvestment(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />

                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800">
                      <div>
                        <div className="text-slate-400">Target Net IRR:</div>
                        <div className="text-base font-bold text-emerald-400">14.9% Annualized</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Est. Annual Distributions:</div>
                        <div className="text-base font-bold text-amber-400 font-mono">${calculatedYield.toLocaleString()} / yr</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl">
                    <img
                      src={project.thumbnail}
                      alt="Primus Capital Portfolio Valuation"
                      className="w-full h-72 sm:h-80 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* FinTech Metrics */}
            <div className="p-6 sm:p-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-[#161D2B] border border-slate-800">
                <div className="text-xs text-slate-400">Gross Asset Value (GAV)</div>
                <div className="text-3xl font-bold text-white mt-1">$16.4B</div>
                <div className="text-[11px] text-emerald-400 mt-1">+8.2% YTD Outperformance</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#161D2B] border border-slate-800">
                <div className="text-xs text-slate-400">Institutional Occupancy</div>
                <div className="text-3xl font-bold text-amber-400 mt-1">96.7%</div>
                <div className="text-[11px] text-slate-400 mt-1">Across 142 Global Properties</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#161D2B] border border-slate-800">
                <div className="text-xs text-slate-400">Pipeline Deal Volume</div>
                <div className="text-3xl font-bold text-cyan-400 mt-1">$2.7B</div>
                <div className="text-[11px] text-slate-400 mt-1">Direct Off-Market Acquisitions</div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CASE 5: IOT LOGISTICS TELEMETRY (AETHER FLEET)             */}
        {/* ========================================================= */}
        {project.category === 'logistics' && (
          <div className="bg-[#111215] text-[#F3F4F6] font-mono">
            {/* Logistics Header */}
            <div className="border-b border-orange-500/25 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <span className="text-xl sm:text-2xl font-bold text-orange-500 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-orange-500" />
                  <span>AETHER TELEMETRY</span>
                </span>
                <nav className="hidden lg:flex items-center gap-6 text-xs text-slate-400">
                  <span className="text-orange-400 cursor-pointer">Live Map</span>
                  <span className="hover:text-white cursor-pointer">Fleet Status</span>
                  <span className="hover:text-white cursor-pointer">IoT Sensors</span>
                  <span className="hover:text-white cursor-pointer">Fuel Routing</span>
                </nav>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="px-2.5 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30">
                  45,000+ Units Active
                </span>
              </div>
            </div>

            {/* Logistics Hero Banner */}
            <div className="p-6 sm:p-12 border-b border-slate-800">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <span className="px-3 py-1 rounded-full text-xs uppercase bg-orange-500/10 text-orange-400 border border-orange-500/30">
                    Mission-Critical Fleet Telemetry & IoT Tracking
                  </span>

                  <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight font-sans">
                    Real-Time Global Fleet Tracking & Telemetry Console
                  </h1>

                  <p className="text-sm text-slate-300 font-sans leading-relaxed max-w-xl">
                    Sub-second satellite GPS telemetry, driver safety scoring, dynamic route optimization, and automated pharmaceutical cold-chain compliance.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-3 font-sans">
                    <button
                      onClick={() => triggerNotice('Live IoT satellite map telemetry updated')}
                      className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                    >
                      Launch Live Fleet Console →
                    </button>
                    <button
                      onClick={() => triggerNotice('Generating cold-chain sensor diagnostic')}
                      className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Run Telemetry Diagnostic
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-2xl overflow-hidden border border-orange-500/30 shadow-2xl">
                    <img
                      src={project.thumbnail}
                      alt="Aether Fleet Telemetry Map"
                      className="w-full h-72 sm:h-80 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Logistics Live Sensor Feed Cards */}
            <div className="p-6 sm:p-12 grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans">
              <div className="p-5 rounded-2xl bg-[#191A20] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Unit #14B (Sarah J.)</span>
                  <span className="text-emerald-400 font-mono">68 MPH</span>
                </div>
                <div className="text-base font-bold text-white">Trans-Atlantic Flight Cargo</div>
                <div className="text-xs text-slate-400">Route: London → NYC (ETA: 4h 12m)</div>
                <div className="pt-2 text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Cold-Chain Temp: 3.8°C (Optimal)</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#191A20] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Unit #88 (Michael C.)</span>
                  <span className="text-amber-400 font-mono">Idle (Port)</span>
                </div>
                <div className="text-base font-bold text-white">Port Newark Container Terminal</div>
                <div className="text-xs text-slate-400">Customs Clearance Stage 2 of 3</div>
                <div className="pt-2 text-[11px] text-amber-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Scheduled Dispatch: 14:00 EST</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#191A20] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Fleet Efficiency Rate</span>
                  <span className="text-cyan-400 font-mono">88.4%</span>
                </div>
                <div className="text-base font-bold text-white">Fuel Cost Optimization</div>
                <div className="text-xs text-slate-400">Automated multi-stop routing saving 22.4% fuel.</div>
                <div className="pt-2 text-[11px] text-cyan-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>AI Route Recalibration Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SHARED BOTTOM CTA ON FIRST PAGE DESIGN ---------------- */}
        <div className="p-8 sm:p-12 border-t border-slate-800/60 bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              Want a high-converting custom solution like this?
            </div>
            <h4 className="text-xl font-bold font-heading text-white">
              Partner with Genmax IT Solution for Your Next Build
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Rapid 7-14 business day sprint, 365 days of free support, and 100% bespoke engineering.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onOpenAudit && (
              <button
                onClick={onOpenAudit}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
              >
                Claim Free Project Consultation
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
