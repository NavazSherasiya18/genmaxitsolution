import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calculator,
  Compass,
  FileSpreadsheet,
  FolderCheck,
  Gavel,
  Layers,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { PrimusBrandLogo, usePrimusFavicon } from '../../components/primus/PrimusBrandLogo';
import { PrimusStatusBadge } from '../../components/primus/PrimusStatusBadge';
import { usePrimusStore } from '../../context/PrimusStoreContext';
import { PRIMUS_MEDIA } from '../../data/primusCatalog';
import { formatPrimusMoney } from '../../utils/primusFinance';

const PREVIEW_TABS = [
  {
    id: 'discovery',
    label: 'Asset Discovery',
    title: 'Screen & Compare Commercial Properties Across London and Singapore',
    summary:
      'Filter across logistics, offices, and mixed-use assets in native GBP and SGD, inspect corridor maps, maintain a deal watchlist, and compare up to three deals side by side.',
    route: '/showcase/primus-capital/app/discovery',
    cta: 'Open Asset Discovery',
    Icon: Compass,
  },
  {
    id: 'underwriting',
    label: 'Underwriting Studio',
    title: 'Inspect Base, Upside & Downside Scenarios in Real Time',
    summary:
      'Edit purchase basis, occupancy, rent growth, CapEx reserves, amortization, and exit cap rates with a live occupancy × exit cap sensitivity grid and transparent formula definitions.',
    route: '/showcase/primus-capital/app/underwriting',
    cta: 'Open Underwriting Studio',
    Icon: Calculator,
  },
  {
    id: 'diligence',
    label: 'Diligence & Committee',
    title: 'Verify Required Diligence Packs & Freeze Committee Decisions',
    summary:
      'Inspect sample CSV rent rolls, sign off required technical tasks, lock frozen underwriting revisions, and record Committee Reviewer votes inside an auditable timeline.',
    route: '/showcase/primus-capital/app/diligence',
    cta: 'Open Diligence & Committee',
    Icon: Gavel,
  },
  {
    id: 'portal',
    label: 'Investor Portal',
    title: 'Read-Only LP Capital Accounts, Holdings & Quarterly Reports',
    summary:
      'Switch between fictional sample institutional LP profiles to review only that partner’s commitments, operating stakes, quarterly reports, and printable capital statements.',
    route: '/showcase/primus-capital/portal',
    cta: 'Open Investor Portal',
    Icon: FileSpreadsheet,
  },
];

export const PrimusPublicPage: React.FC = () => {
  usePrimusFavicon(true);
  const navigate = useNavigate();
  const { dataset, setActiveAssetId, setGuidedDemoActive } = usePrimusStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(PREVIEW_TABS[0].id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.title = 'Primus Capital | Institutional Real Estate Investment Platform (Demo)';
  }, []);

  const launchGuidedDemo = () => {
    setActiveAssetId('meridian-logistics-park');
    setGuidedDemoActive(true);
    navigate('/showcase/primus-capital/app/discovery');
  };

  const featuredShowcaseAssets = [
    dataset.assets.find((a) => a.id === 'meridian-logistics-park'),
    dataset.assets.find((a) => a.id === 'bishopsgate-limestone-house'),
    dataset.assets.find((a) => a.id === 'raffles-quay-exchange'),
  ].filter((a): a is NonNullable<typeof a> => Boolean(a));

  const currentTab = PREVIEW_TABS.find((t) => t.id === activeTab) || PREVIEW_TABS[0];

  return (
    <div className="primus-showcase min-h-screen flex flex-col">
      {/* Discreet Portfolio Return & Concept Disclosure Bar */}
      <div className="bg-[#07101D] text-slate-300 border-b border-slate-800 px-4 sm:px-8 py-2 text-[11px] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase tracking-wider text-[#DFC285]">
            Interactive Concept Demo
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline">
            Sample commercial assets &amp; illustrative projections · Simulated workflows only
          </span>
        </div>
        <Link
          to="/"
          className="text-slate-200 hover:text-[#DFC285] font-semibold inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Back to Genmax Portfolio</span>
        </Link>
      </div>

      {/* Main Sticky Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-[#DDD7CB] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/showcase/primus-capital" className="shrink-0">
            <PrimusBrandLogo variant="full" tone="dark" size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#475569]">
            <a href="#platform" className="hover:text-[#0D1829]">
              Platform
            </a>
            <a href="#assets" className="hover:text-[#0D1829]">
              Asset Classes
            </a>
            <a href="#workflow" className="hover:text-[#0D1829]">
              Investment Workflow
            </a>
            <Link to="/showcase/primus-capital/portal" className="hover:text-[#0D1829]">
              Investor Portal
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3 text-xs">
            <Link
              to="/showcase/primus-capital/assets/meridian-logistics-park"
              className="px-3.5 py-2 border border-[#DDD7CB] bg-[#F6F4EF] hover:border-[#9E7C3B] font-semibold text-[#0D1829]"
            >
              Meridian Deal
            </Link>
            <Link
              to="/showcase/primus-capital/app"
              className="px-4 py-2 bg-[#0D1829] hover:bg-[#192D4D] text-white font-semibold inline-flex items-center gap-1.5"
            >
              <span>Launch Demo</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D6B572]" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="md:hidden p-2 border border-[#DDD7CB] text-[#0D1829]"
            aria-label="Toggle Primus navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#DDD7CB] p-4 space-y-3 text-xs font-semibold">
            <a
              href="#platform"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-[#0D1829]"
            >
              Platform
            </a>
            <a
              href="#assets"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-[#0D1829]"
            >
              Asset Classes
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-[#0D1829]"
            >
              Investment Workflow
            </a>
            <Link to="/showcase/primus-capital/portal" className="block py-1.5 text-[#0D1829]">
              Investor Portal
            </Link>
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={launchGuidedDemo}
                className="w-full py-2.5 bg-[#0D1829] text-white font-semibold"
              >
                Start Guided Demo
              </button>
              <Link
                to="/"
                className="w-full py-2 border border-[#DDD7CB] text-center text-[#475569]"
              >
                Back to Genmax Portfolio
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Band */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-14 lg:pt-14 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FBF6EA] border border-[#E6D4AD] text-[11px] font-bold uppercase tracking-wider text-[#7C5D24]">
                <Layers className="w-3.5 h-3.5 text-[#9E7C3B]" />
                <span>Acquisitions · Underwriting · LP Reporting</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[54px] pr-serif text-[#0D1829] leading-[1.06]">
                From first look to{' '}
                <span className="italic text-[#9E7C3B]">investment committee</span>.
              </h1>

              <p className="text-base text-[#475569] leading-relaxed max-w-xl">
                Primus Capital connects commercial property discovery, scenario underwriting,
                blocking diligence checklists, frozen Investment Committee revisions, and read-only
                investor reporting in one institutional workspace.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={launchGuidedDemo}
                  className="px-5 py-3 bg-[#0D1829] hover:bg-[#192D4D] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#DFC285]" />
                  <span>Start Guided Demo</span>
                </button>
                <Link
                  to="/showcase/primus-capital/assets/meridian-logistics-park"
                  className="px-5 py-3 border border-[#DDD7CB] bg-white hover:border-[#9E7C3B] text-[#0D1829] text-xs sm:text-sm font-semibold inline-flex items-center gap-2"
                >
                  <span>Inspect Meridian Dossier</span>
                  <ArrowRight className="w-4 h-4 text-[#9E7C3B]" />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#DDD7CB] text-xs pr-tabular">
                <div>
                  <strong className="text-base text-[#0D1829] block">12 Assets</strong>
                  <span className="text-[#475569]">London &amp; Singapore</span>
                </div>
                <div>
                  <strong className="text-base text-[#0D1829] block">3 Scenarios</strong>
                  <span className="text-[#475569]">Base, Upside, Downside</span>
                </div>
                <div>
                  <strong className="text-base text-[#0D1829] block">2 LP Profiles</strong>
                  <span className="text-[#475569]">Read-only reporting</span>
                </div>
              </div>
            </div>

            {/* Hero Workspace + Flagship Property Composition */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white border border-[#DDD7CB] p-2.5 shadow-xl">
                <img
                  src={PRIMUS_MEDIA.workspacePreview}
                  alt="Primus Capital underwriting workspace preview"
                  className="w-full aspect-[16/10] object-cover border border-[#EAE5DA]"
                />
              </div>

              <div className="box-zoom-sm grid grid-cols-12 gap-4 items-center bg-white border border-[#DDD7CB] p-3.5">
                <img
                  src={PRIMUS_MEDIA.meridianLogistics}
                  alt="Meridian Logistics Park Singapore commercial facility"
                  className="col-span-5 aspect-[16/10] object-cover border border-[#EAE5DA]"
                />
                <div className="col-span-7 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#9E7C3B]">
                    Flagship Walkthrough Deal · SGD
                  </span>
                  <p className="text-sm font-bold text-[#0D1829]">
                    Meridian Logistics Park, Singapore
                  </p>
                  <p className="text-xs text-[#475569] pr-tabular">
                    S$148.0M basis · 485,000 sq ft · 94.2% occupied
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Capabilities Interactive Tabs */}
        <section id="platform" className="bg-white border-y border-[#DDD7CB] py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#9E7C3B]">
                Connected Architecture
              </p>
              <h2 className="text-3xl sm:text-4xl pr-serif text-[#0D1829]">
                Three synchronized experiences tailored to each stakeholder.
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              {PREVIEW_TABS.map(({ id, label, Icon }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`p-3.5 border text-left flex items-center gap-2.5 font-bold cursor-pointer transition-colors ${
                      active
                        ? 'bg-[#0D1829] border-[#0D1829] text-white'
                        : 'bg-[#F6F4EF] border-[#DDD7CB] text-[#0D1829] hover:border-[#9E7C3B]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#DFC285]' : 'text-[#9E7C3B]'}`} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-[#F6F4EF] border border-[#DDD7CB] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-3">
                <h3 className="text-2xl pr-serif text-[#0D1829]">{currentTab.title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{currentTab.summary}</p>
                <div className="pt-2">
                  <Link
                    to={currentTab.route}
                    className="px-4 py-2.5 bg-[#0D1829] hover:bg-[#192D4D] text-white text-xs font-semibold inline-flex items-center gap-2"
                  >
                    <span>{currentTab.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D6B572]" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 grid grid-cols-2 gap-3 text-xs">
                <div className="box-zoom-sm bg-white border border-[#DDD7CB] p-3.5">
                  <span className="text-[#9E7C3B] font-bold block">Multi-Currency</span>
                  <strong className="text-[#0D1829] block mt-0.5">GBP · SGD · USD</strong>
                  <span className="text-[11px] text-[#64748B]">Documented demo FX rates</span>
                </div>
                <div className="box-zoom-sm bg-white border border-[#DDD7CB] p-3.5">
                  <span className="text-[#9E7C3B] font-bold block">Governance Lock</span>
                  <strong className="text-[#0D1829] block mt-0.5">Frozen Revisions</strong>
                  <span className="text-[11px] text-[#64748B]">Role-gated IC voting</span>
                </div>
                <div className="box-zoom-sm bg-white border border-[#DDD7CB] p-3.5">
                  <span className="text-[#9E7C3B] font-bold block">Data Room</span>
                  <strong className="text-[#0D1829] block mt-0.5">Sample CSV &amp; Packs</strong>
                  <span className="text-[11px] text-[#64748B]">Blocking task checks</span>
                </div>
                <div className="box-zoom-sm bg-white border border-[#DDD7CB] p-3.5">
                  <span className="text-[#9E7C3B] font-bold block">LP Scope</span>
                  <strong className="text-[#0D1829] block mt-0.5">Strictly Scoped</strong>
                  <span className="text-[11px] text-[#64748B]">Dedicated Partner view</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Asset Classes & Featured Properties */}
        <section id="assets" className="max-w-7xl mx-auto px-4 sm:px-8 py-14 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#9E7C3B]">
                Fictional Sample Portfolio
              </p>
              <h2 className="text-3xl sm:text-4xl pr-serif text-[#0D1829]">
                Logistics, Grade-A Office &amp; Mixed-Use Assets
              </h2>
            </div>
            <Link
              to="/showcase/primus-capital/app/discovery"
              className="text-xs font-bold text-[#0D1829] hover:text-[#9E7C3B] inline-flex items-center gap-1"
            >
              <span>Browse All 12 Commercial Assets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredShowcaseAssets.map((asset) => {
              const cap = ((asset.currentAnnualNoi / asset.askingPrice) * 100).toFixed(2);
              return (
                <Link
                  key={asset.id}
                  to={`/showcase/primus-capital/assets/${asset.slug}`}
                  className="box-zoom bg-white border border-[#DDD7CB] hover:border-[#9E7C3B] flex flex-col justify-between group"
                >
                  <div>
                    <div className="aspect-[16/10] bg-[#EFECE5] overflow-hidden border-b border-[#DDD7CB]">
                      <img
                        src={asset.gallery[0].url}
                        alt={asset.name}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E7C3B]">
                          {asset.market} · {asset.assetClass.replace('_', '-')}
                        </span>
                        <PrimusStatusBadge status={asset.stage} />
                      </div>
                      <h3 className="text-lg font-bold text-[#0D1829] pr-sans">{asset.name}</h3>
                      <p className="text-xs text-[#475569]">{asset.district}</p>
                    </div>
                  </div>
                  <div className="px-5 py-3.5 bg-[#F6F4EF] border-t border-[#EAE5DA] flex items-center justify-between text-xs pr-tabular">
                    <span>
                      Basis: <strong>{formatPrimusMoney(asset.askingPrice, asset.currency, true)}</strong>
                    </span>
                    <span>
                      Cap Rate: <strong className="text-[#9E7C3B]">{cap}%</strong>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 4-Step Workflow + Brand Mark Spec */}
        <section id="workflow" className="bg-[#0D1829] text-white py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  num: '01',
                  title: 'Screen & Compare',
                  desc: 'Evaluate 12 London & Singapore properties with side-by-side FX normalization.',
                  Icon: Compass,
                },
                {
                  num: '02',
                  title: 'Model Returns',
                  desc: 'Run Base, Upside & Downside projections with 0% LTV / cap rate sensitivity.',
                  Icon: Calculator,
                },
                {
                  num: '03',
                  title: 'Verify & Vote',
                  desc: 'Clear required diligence items, lock frozen revisions, and record IC decisions.',
                  Icon: FolderCheck,
                },
                {
                  num: '04',
                  title: 'Monitor & Report',
                  desc: 'Track Operating Holdings separately and publish read-only LP capital accounts.',
                  Icon: ShieldCheck,
                },
              ].map(({ num, title, desc, Icon }) => (
                <div key={num} className="box-zoom p-5 bg-[#132238] border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-[#DFC285]">
                    <span className="font-mono text-xs font-bold">{num}</span>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold pr-sans">{title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            {/* Official SVG Lockup Specimen */}
            <div className="border-t border-slate-800 pt-8 flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#DFC285]">
                  Architectural Brand System
                </p>
                <p className="text-xs text-slate-300 max-w-lg">
                  Custom stepped limestone &amp; brushed-brass SVG brand emblem engineered for
                  light/dark headers, committee memoranda, and crisp 16px favicon clarity.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="px-4 py-2.5 bg-white border border-[#DDD7CB]">
                  <PrimusBrandLogo variant="full" tone="dark" size="sm" />
                </div>
                <div className="px-4 py-2.5 bg-[#07101D] border border-slate-700">
                  <PrimusBrandLogo variant="full" tone="light" size="sm" />
                </div>
                <div className="p-2 bg-[#07101D] border border-slate-700">
                  <PrimusBrandLogo variant="emblem" tone="light" size="sm" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-[#DDD7CB] py-6 px-4 sm:px-8 text-xs text-[#475569]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-4 h-4 text-[#9E7C3B]" />
            <span>
              <strong>Primus Capital</strong> · Interactive Concept Demo · Fictional properties &amp;
              illustrative projections
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-5 font-semibold">
            <Link to="/showcase/primus-capital/app" className="hover:text-[#0D1829]">
              Team Workspace
            </Link>
            <Link to="/showcase/primus-capital/portal" className="hover:text-[#0D1829]">
              Investor Portal
            </Link>
            <Link to="/" className="text-[#9E7C3B] hover:underline">
              ← Back to Genmax Portfolio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
