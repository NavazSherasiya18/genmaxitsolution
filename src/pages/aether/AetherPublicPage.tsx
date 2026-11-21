import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Download,
  Menu,
  Navigation,
  PlayCircle,
  ShieldCheck,
  Smartphone,
  ThermometerSnowflake,
  Truck,
  X,
} from 'lucide-react';
import {
  AETHER_EMBLEM_SVG,
  AETHER_FAVICON_SVG,
  AETHER_HORIZONTAL_DARK_SVG,
  AETHER_HORIZONTAL_LIGHT_SVG,
  AetherBrandLogo,
  useAetherFavicon,
} from '../../components/aether/AetherBrandLogo';
import { useAetherStore } from '../../context/AetherStoreContext';
import { AETHER_MEDIA } from '../../data/aetherCatalog';

function downloadSvgAsset(filename: string, svgText: string) {
  try {
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch {
    // Graceful no-op outside browser
  }
}

export const AetherPublicPage: React.FC = () => {
  useAetherFavicon(true);
  const navigate = useNavigate();
  const { setGuidedDemoActive } = useAetherStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleStartGuidedDemo = () => {
    setGuidedDemoActive(true);
    navigate('/showcase/aether-fleet/app/overview');
  };

  return (
    <div className="aether-showcase min-h-screen bg-slate-50 text-[#0C131F]">
      {/* Concept Strip + Exit to Genmax Portfolio */}
      <div className="bg-[#080D16] text-slate-300 border-b border-[#1D283A] px-4 py-2 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 font-bold uppercase tracking-wider text-[10px]">
              Interactive Concept Demo
            </span>
            <span className="text-slate-400 hidden sm:inline">
              Simulated IoT telemetry, cold-chain workflows &amp; sample Indian corridor fleets
            </span>
          </div>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-cyan-300 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Genmax Portfolio</span>
          </Link>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#0C131F]/95 backdrop-blur-md border-b border-[#223047] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/showcase/aether-fleet" aria-label="Aether Fleet Home">
            <AetherBrandLogo tone="light" size="md" />
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a href="#platform" className="hover:text-cyan-300 transition-colors">
              Platform
            </a>
            <a href="#fleet-tracking" className="hover:text-cyan-300 transition-colors">
              Fleet Tracking
            </a>
            <a href="#cold-chain" className="hover:text-cyan-300 transition-colors">
              Cold Chain
            </a>
            <Link to="/showcase/aether-fleet/track/AFL-2048" className="hover:text-cyan-300 transition-colors">
              Customer Portal
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/showcase/aether-fleet/driver"
              className="px-3.5 py-2 border border-[#223047] hover:border-cyan-400 text-xs font-semibold text-slate-200 transition-colors"
            >
              Driver View
            </Link>
            <Link
              to="/showcase/aether-fleet/app"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <span>Launch Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 text-slate-200 hover:text-cyan-300 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Responsive Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0C131F] border-t border-[#223047] px-4 py-4 space-y-3 text-sm">
            <a
              href="#platform"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-cyan-300"
            >
              Platform
            </a>
            <a
              href="#fleet-tracking"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-cyan-300"
            >
              Fleet Tracking
            </a>
            <a
              href="#cold-chain"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-cyan-300"
            >
              Cold Chain
            </a>
            <Link
              to="/showcase/aether-fleet/track/AFL-2048"
              className="block py-2 text-slate-200 hover:text-cyan-300"
            >
              Customer Portal
            </Link>
            <div className="pt-2 flex flex-col gap-2 border-t border-[#223047]">
              <Link
                to="/showcase/aether-fleet/driver"
                className="w-full py-2.5 text-center border border-[#223047] text-xs font-semibold text-white"
              >
                Open Driver Workspace
              </Link>
              <Link
                to="/showcase/aether-fleet/app"
                className="w-full py-2.5 text-center bg-cyan-500 text-slate-950 text-xs font-bold"
              >
                Launch Control Tower
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Flagship Hero */}
      <section className="bg-[#0C131F] text-white border-b border-[#223047]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#131D2E] border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Navigation className="w-3.5 h-3.5" />
              <span>Connected IoT Logistics &amp; Cold-Chain Operations</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-white">
              Track every corridor shipment, sensor reading, and delivery proof in one tower.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Aether Fleet unites real-time vehicle GPS telemetry, sustained 2°C–8°C cold-chain excursion alerts, mobile driver instructions, and live customer tracking inside one synchronized logistics workspace.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleStartGuidedDemo}
                className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Start Guided Demo (AFL-2048)</span>
              </button>

              <Link
                to="/showcase/aether-fleet/app"
                className="px-5 py-3 border border-[#334155] hover:border-cyan-400 text-white font-semibold text-sm inline-flex items-center gap-2 transition-colors"
              >
                <span>Open Control Tower</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </Link>
            </div>

            {/* Concept Baseline Strip */}
            <div className="grid grid-cols-3 gap-4 pt-5 border-t border-[#223047] text-xs af-tabular">
              <div>
                <p className="text-lg font-bold text-white">15 Units</p>
                <p className="text-slate-400">Reefer &amp; Heavy Trucks</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">30 Orders</p>
                <p className="text-slate-400">Pune · NCR · Bengaluru</p>
              </div>
              <div>
                <p className="text-lg font-bold text-cyan-300">4 Views</p>
                <p className="text-slate-400">Live Synced State</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <div className="border border-[#223047] bg-[#131D2E] p-2 shadow-2xl">
              <img
                src={AETHER_MEDIA.controlTowerPreview}
                alt="Aether Fleet Dispatcher Control Tower monitoring Pune to Mumbai refrigerated run AFL-2048"
                className="w-full aspect-video object-cover"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 px-1">
              <span>Live Control Tower preview · Simulated Pune–Mumbai cold-chain corridor</span>
              <Link
                to="/showcase/aether-fleet/shipments/AFL-2048"
                className="text-cyan-300 font-semibold hover:underline"
              >
                Inspect Flagship Run AFL-2048 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Four Connected Experiences Architecture */}
      <section id="platform" className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">
            Four Connected Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0C131F]">
            One operational data engine shared across dispatch, drivers, and recipients.
          </h2>
          <p className="text-sm text-slate-600">
            Actions inside any role immediately update browser-local operational state across the Control Tower, Driver App, and Customer Portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="box-zoom bg-white border border-slate-200 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <Compass className="w-6 h-6 text-cyan-600" />
              <h3 className="text-base font-bold text-[#0C131F]">1. Product Overview</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluate fleet capability modules, telemetry architecture, and cold-chain compliance workflows.
              </p>
            </div>
            <button
              type="button"
              onClick={handleStartGuidedDemo}
              className="text-xs font-bold text-cyan-700 hover:underline text-left cursor-pointer"
            >
              Launch 6-Step Guided Tour →
            </button>
          </div>

          <div className="box-zoom bg-white border border-slate-200 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <Truck className="w-6 h-6 text-cyan-600" />
              <h3 className="text-base font-bold text-[#0C131F]">2. Dispatcher Control Tower</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                8 operational modules: corridor map, dispatch capacity validation, IoT health, and incident triage.
              </p>
            </div>
            <Link
              to="/showcase/aether-fleet/app"
              className="text-xs font-bold text-cyan-700 hover:underline"
            >
              Open Control Tower →
            </Link>
          </div>

          <div className="box-zoom bg-white border border-slate-200 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <Smartphone className="w-6 h-6 text-cyan-600" />
              <h3 className="text-base font-bold text-[#0C131F]">3. Mobile Driver App</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Touch-friendly stop check-ins, dispatcher alert replies, sensor recovery replay, and digital POD capture.
              </p>
            </div>
            <Link
              to="/showcase/aether-fleet/driver"
              className="text-xs font-bold text-cyan-700 hover:underline"
            >
              Open Driver Workspace →
            </Link>
          </div>

          <div className="box-zoom bg-white border border-slate-200 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <ShieldCheck className="w-6 h-6 text-cyan-600" />
              <h3 className="text-base font-bold text-[#0C131F]">4. Customer Portal</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Public tracking page showing clean ETA milestones and signed Proof of Delivery without leaking internal notes.
              </p>
            </div>
            <Link
              to="/showcase/aether-fleet/track/AFL-2048"
              className="text-xs font-bold text-cyan-700 hover:underline"
            >
              Track AFL-2048 →
            </Link>
          </div>
        </div>
      </section>

      {/* Fleet Tracking & Cold-Chain Proof Band */}
      <section id="fleet-tracking" className="bg-white border-y border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <img
              src={AETHER_MEDIA.reeferHighway}
              alt="Aether Fleet refrigerated cold-chain truck along Mumbai-Pune Expressway"
              className="w-full aspect-video object-cover border border-slate-200"
            />
          </div>
          <div id="cold-chain" className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-700 inline-flex items-center gap-1.5">
              <ThermometerSnowflake className="w-4 h-4" />
              <span>Sustained Excursion &amp; Geofence Intelligence</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0C131F]">
              Eliminate false-alarm fatigue with sustained thermal policy evaluation.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Brief loading-bay door dips never flood dispatchers with noise. Aether Fleet monitors per-shipment probe policies (such as 2.0°C – 8.0°C clinical biologics), opens one deduplicated Critical Incident upon sustained breach, pushes instant driver corrective instructions, and retains audit accountability even after reefer recovery until formal dispatcher closeout.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <img
                src={AETHER_MEDIA.loadingBays}
                alt="Cold-chain loading depot hub"
                className="w-full aspect-[4/3] object-cover border border-slate-200"
              />
              <img
                src={AETHER_MEDIA.podDelivery}
                alt="Sealed pharmaceutical cold box verified at receiving dock"
                className="w-full aspect-[4/3] object-cover border border-slate-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Identity & SVG Asset Export Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="box-zoom-sm bg-[#0C131F] text-white p-6 sm:p-8 border border-[#223047] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <AetherBrandLogo tone="light" size="md" />
            <h3 className="text-lg font-bold pt-1">
              Vector Brand System &amp; Exportable SVG Marks
            </h3>
            <p className="text-xs text-slate-300">
              Clean folded route-ribbon emblem engineered for 16px favicon crispness, dark dispatch consoles, and light customer portals.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => downloadSvgAsset('aether-fleet-emblem.svg', AETHER_EMBLEM_SVG)}
              className="px-3 py-2 bg-[#131D2E] border border-[#223047] hover:border-cyan-400 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Emblem SVG</span>
            </button>
            <button
              type="button"
              onClick={() => downloadSvgAsset('aether-fleet-logo-dark.svg', AETHER_HORIZONTAL_DARK_SVG)}
              className="px-3 py-2 bg-[#131D2E] border border-[#223047] hover:border-cyan-400 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dark Text Lockup</span>
            </button>
            <button
              type="button"
              onClick={() => downloadSvgAsset('aether-fleet-logo-light.svg', AETHER_HORIZONTAL_LIGHT_SVG)}
              className="px-3 py-2 bg-[#131D2E] border border-[#223047] hover:border-cyan-400 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Light Text Lockup</span>
            </button>
            <button
              type="button"
              onClick={() => downloadSvgAsset('aether-fleet-favicon.svg', AETHER_FAVICON_SVG)}
              className="px-3 py-2 bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Favicon SVG</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#080D16] text-slate-400 border-t border-[#1D283A] py-8 px-4 sm:px-6 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <AetherBrandLogo tone="light" size="sm" />
            <p className="text-[11px]">
              Interactive Concept Demo · Fictional fleets, telemetry streams &amp; sample Indian freight corridors.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/showcase/aether-fleet/app" className="hover:text-cyan-300">
              Control Tower
            </Link>
            <Link to="/showcase/aether-fleet/driver" className="hover:text-cyan-300">
              Driver Workspace
            </Link>
            <Link to="/showcase/aether-fleet/track/AFL-2048" className="hover:text-cyan-300">
              Customer Portal
            </Link>
            <Link to="/portfolio" className="text-cyan-300 font-semibold hover:underline">
              Back to Genmax Portfolio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
