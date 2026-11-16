import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Calculator,
  Compass,
  FolderCheck,
  Gavel,
  Kanban,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Search,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import { PrimusBrandLogo, usePrimusFavicon } from '../../components/primus/PrimusBrandLogo';
import {
  PrimusCommitteeMemoModal,
  PrimusConfirmResetModal,
  PrimusDocumentPreviewModal,
} from '../../components/primus/PrimusModals';
import { AssetDiscoveryModule } from '../../components/primus/modules/AssetDiscoveryModule';
import { CommitteeCenterModule } from '../../components/primus/modules/CommitteeCenterModule';
import { DealPipelineModule } from '../../components/primus/modules/DealPipelineModule';
import { DiligenceDataRoomModule } from '../../components/primus/modules/DiligenceDataRoomModule';
import { ExecutiveDashboardModule } from '../../components/primus/modules/ExecutiveDashboardModule';
import { PortfolioMonitoringModule } from '../../components/primus/modules/PortfolioMonitoringModule';
import { UnderwritingStudioModule } from '../../components/primus/modules/UnderwritingStudioModule';
import { usePrimusStore } from '../../context/PrimusStoreContext';
import {
  CommercialAsset,
  CommitteeSubmission,
  DataRoomDoc,
  PrimusMarket,
  PrimusRole,
} from '../../data/primusCatalog';
import { PrimusCurrency } from '../../utils/primusFinance';

type PrimusModuleId =
  | 'dashboard'
  | 'discovery'
  | 'underwriting'
  | 'pipeline'
  | 'diligence'
  | 'committee'
  | 'portfolio';

const NAV_ITEMS: {
  id: PrimusModuleId;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'dashboard', label: 'Executive Dashboard', Icon: LayoutDashboard },
  { id: 'discovery', label: 'Asset Discovery', Icon: Compass },
  { id: 'underwriting', label: 'Underwriting Studio', Icon: Calculator },
  { id: 'pipeline', label: 'Deal Pipeline', Icon: Kanban },
  { id: 'diligence', label: 'Diligence & Data Room', Icon: FolderCheck },
  { id: 'committee', label: 'Committee Center', Icon: Gavel },
  { id: 'portfolio', label: 'Portfolio Monitoring', Icon: Building2 },
];

const GUIDED_STEPS: {
  step: number;
  label: string;
  module: PrimusModuleId;
  hint: string;
}[] = [
  {
    step: 1,
    label: 'Compare Logistics',
    module: 'discovery',
    hint: 'Open Compare Selected (2/3) or search Meridian Logistics Park.',
  },
  {
    step: 2,
    label: 'Base vs Downside',
    module: 'underwriting',
    hint: 'Toggle Base Case vs Downside Stress on Meridian Logistics Park.',
  },
  {
    step: 3,
    label: 'Clear TSK-MLP-4',
    module: 'diligence',
    hint: 'Preview Rent Roll DOC-MLP-01 & check off final required Tuas task.',
  },
  {
    step: 4,
    label: 'Submit Freeze Pack',
    module: 'committee',
    hint: 'Submit Meridian Logistics Park to freeze underwriting revision.',
  },
  {
    step: 5,
    label: 'Approve as Reviewer',
    module: 'committee',
    hint: 'Switch Demo Role to Committee Reviewer & record an approval vote.',
  },
  {
    step: 6,
    label: 'Verify Memo & Log',
    module: 'committee',
    hint: 'Open Frozen Memo or inspect the governance activity log below.',
  },
];

export const PrimusWorkspacePage: React.FC = () => {
  usePrimusFavicon(true);
  const { module: rawModule } = useParams<{ module?: string }>();
  const navigate = useNavigate();

  const {
    dataset,
    activeRole,
    setActiveRole,
    activeMarketScope,
    setActiveMarketScope,
    consolidatedCurrency,
    setConsolidatedCurrency,
    activeAssetId,
    setActiveAssetId,
    guidedDemoActive,
    setGuidedDemoActive,
    resetDemoData,
  } = usePrimusStore();

  const activeModule: PrimusModuleId = NAV_ITEMS.some((i) => i.id === rawModule)
    ? (rawModule as PrimusModuleId)
    : 'dashboard';

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DataRoomDoc | null>(null);
  const [memoState, setMemoState] = useState<{
    open: boolean;
    asset: CommercialAsset;
    submission?: CommitteeSubmission | null;
  } | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const modLabel = NAV_ITEMS.find((n) => n.id === activeModule)?.label || 'Workspace';
    document.title = `${modLabel} | Primus Capital Interactive Workspace`;
  }, [activeModule]);

  const navigateModule = (mod: PrimusModuleId) => {
    setMobileMenuOpen(false);
    navigate(
      mod === 'dashboard'
        ? '/showcase/primus-capital/app'
        : `/showcase/primus-capital/app/${mod}`
    );
  };

  const quickSearchMatches = useMemo(() => {
    const q = quickSearch.trim().toLowerCase();
    if (!q) return [];
    return dataset.assets
      .filter((a) => `${a.name} ${a.code} ${a.district}`.toLowerCase().includes(q))
      .slice(0, 5);
  }, [quickSearch, dataset.assets]);

  const activeAsset =
    dataset.assets.find((a) => a.id === activeAssetId) || dataset.assets[0];
  const currentNav = NAV_ITEMS.find((n) => n.id === activeModule)!;

  return (
    <div className="primus-showcase min-h-screen flex bg-[#F6F4EF]">
      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-[#0D1829] text-slate-200 border-r border-slate-800 shrink-0 transition-all duration-200 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between gap-2">
          <Link to="/showcase/primus-capital" className="overflow-hidden">
            <PrimusBrandLogo
              variant={sidebarCollapsed ? 'emblem' : 'full'}
              tone="light"
              size="sm"
            />
          </Link>
          <button
            type="button"
            onClick={() => setSidebarCollapsed((c) => !c)}
            className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 text-xs" aria-label="Primus Workspace Navigation">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const active = activeModule === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => navigateModule(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 font-semibold transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#192D4D] text-[#DFC285] border-l-2 border-[#D6B572]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-2 text-[11px]">
          {!sidebarCollapsed && (
            <div className="px-3 py-2 bg-[#07101D] border border-slate-800 text-slate-300">
              <p className="font-bold text-[#DFC285]">Interactive Concept Demo</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Browser-local storage · Projections &amp; votes simulated
              </p>
            </div>
          )}
          <Link
            to="/showcase/primus-capital/portal"
            className="block px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 font-semibold truncate"
          >
            {sidebarCollapsed ? 'LP' : 'Switch to Investor Portal →'}
          </Link>
          <Link
            to="/showcase/primus-capital"
            className="block px-3 py-2 text-slate-400 hover:text-white truncate"
          >
            {sidebarCollapsed ? 'Web' : 'Public Product Website'}
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-2 text-slate-400 hover:text-[#DFC285] truncate"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            {!sidebarCollapsed && <span>Back to Genmax Portfolio</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#07101D]/65"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-72 bg-[#0D1829] text-white h-full flex flex-col z-10 p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <PrimusBrandLogo variant="full" tone="light" size="sm" />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-slate-300"
                aria-label="Close workspace navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 text-xs">
              {NAV_ITEMS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => navigateModule(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 font-semibold ${
                    activeModule === id ? 'bg-[#192D4D] text-[#DFC285]' : 'text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
            <div className="border-t border-slate-800 pt-3 space-y-2 text-xs">
              <Link to="/showcase/primus-capital/portal" className="block py-1.5 text-[#DFC285]">
                Open Read-Only Investor Portal
              </Link>
              <Link to="/" className="block py-1.5 text-slate-300">
                ← Back to Genmax Portfolio
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Control Header */}
        <header className="bg-white border-b border-[#DDD7CB] sticky top-0 z-30">
          <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 border border-[#DDD7CB] text-[#0D1829]"
                aria-label="Open menu"
              >
                <Menu className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9E7C3B]">
                  Primus Capital / Workspace
                </p>
                <h1 className="text-base sm:text-lg font-bold text-[#0D1829] pr-sans truncate">
                  {currentNav.label}
                </h1>
              </div>
            </div>

            {/* Global Asset Search */}
            <div className="hidden md:block relative w-64 xl:w-80 text-xs">
              <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="Jump to asset dossier (e.g. Meridian)..."
                aria-label="Global asset jump search"
                className="w-full h-9 pl-8 pr-3 bg-[#F6F4EF] border border-[#DDD7CB] text-[#0D1829]"
              />
              {quickSearchMatches.length > 0 && (
                <div className="absolute left-0 right-0 top-10 bg-white border border-[#DDD7CB] shadow-xl z-40 divide-y divide-[#EAE5DA]">
                  {quickSearchMatches.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setQuickSearch('');
                        setActiveAssetId(m.id);
                        navigate(`/showcase/primus-capital/assets/${m.slug}`);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#F6F4EF] flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <span className="font-bold text-[#0D1829] truncate">{m.name}</span>
                      <span className="text-[10px] font-mono text-[#9E7C3B]">{m.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Market Scope + Consolidated Currency + Switch Demo Role + Reset */}
            <div className="flex items-center gap-2 text-xs">
              <select
                aria-label="Market scope"
                value={activeMarketScope}
                onChange={(e) => setActiveMarketScope(e.target.value as 'All' | PrimusMarket)}
                className="hidden sm:block h-9 px-2.5 bg-[#F6F4EF] border border-[#DDD7CB] font-semibold text-[#0D1829]"
              >
                <option value="All">All Markets</option>
                <option value="Singapore">Singapore</option>
                <option value="London">London</option>
              </select>

              <select
                aria-label="Consolidated display currency"
                value={consolidatedCurrency}
                onChange={(e) => setConsolidatedCurrency(e.target.value as PrimusCurrency)}
                className="h-9 px-2 bg-[#F6F4EF] border border-[#DDD7CB] font-bold text-[#0D1829]"
              >
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="SGD">SGD</option>
              </select>

              <div className="flex items-center gap-1.5 bg-[#0D1829] text-white px-2.5 h-9">
                <UserCheck className="w-3.5 h-3.5 text-[#DFC285] shrink-0" />
                <select
                  aria-label="Switch Demo Role"
                  value={activeRole}
                  onChange={(e) => setActiveRole(e.target.value as PrimusRole)}
                  className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer"
                >
                  <option value="acquisitions_analyst" className="text-[#0D1829]">
                    Role: Acquisitions Analyst
                  </option>
                  <option value="committee_reviewer" className="text-[#0D1829]">
                    Role: Committee Reviewer
                  </option>
                  <option value="asset_manager" className="text-[#0D1829]">
                    Role: Asset Manager
                  </option>
                  <option value="investor_relations" className="text-[#0D1829]">
                    Role: Investor Relations
                  </option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setGuidedDemoActive(!guidedDemoActive)}
                className={`hidden xl:inline-flex items-center gap-1 px-2.5 h-9 border font-semibold cursor-pointer ${
                  guidedDemoActive
                    ? 'bg-[#FBF6EA] border-[#9E7C3B] text-[#0D1829]'
                    : 'bg-white border-[#DDD7CB] text-[#475569]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#9E7C3B]" />
                <span>Guide</span>
              </button>

              <button
                type="button"
                onClick={() => setResetModalOpen(true)}
                className="h-9 px-2.5 border border-[#DDD7CB] bg-white hover:border-[#9E7C3B] text-[#0D1829] inline-flex items-center gap-1 font-semibold cursor-pointer"
                title="Reset Demo Data"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#9E7C3B]" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Dismissible 6-Step Guided Walkthrough Bar */}
          {guidedDemoActive && (
            <div className="bg-[#0D1829] text-white px-4 sm:px-6 py-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#DFC285] mr-1">
                  Guided Walkthrough:
                </span>
                {GUIDED_STEPS.map((st) => (
                  <button
                    key={st.step}
                    type="button"
                    title={st.hint}
                    onClick={() => {
                      if (st.step <= 5) {
                        setActiveAssetId('meridian-logistics-park');
                      }
                      if (st.step === 5) {
                        setActiveRole('committee_reviewer');
                      }
                      navigateModule(st.module);
                    }}
                    className={`px-2.5 py-1 border text-[11px] font-semibold cursor-pointer ${
                      activeModule === st.module
                        ? 'bg-[#9E7C3B] border-[#9E7C3B] text-[#07101D]'
                        : 'bg-[#192D4D] border-slate-700 text-slate-200 hover:border-[#D6B572]'
                    }`}
                  >
                    {st.step}. {st.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setGuidedDemoActive(false)}
                className="text-slate-300 hover:text-white inline-flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <span>Dismiss</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </header>

        {/* Active Module Body */}
        <main className="p-4 sm:p-6 flex-1 max-w-[1600px] w-full mx-auto">
          {activeModule === 'dashboard' && (
            <ExecutiveDashboardModule
              onNavigateModule={(m) => navigateModule(m as PrimusModuleId)}
              onOpenAsset={(slug) => navigate(`/showcase/primus-capital/assets/${slug}`)}
            />
          )}

          {activeModule === 'discovery' && (
            <AssetDiscoveryModule
              onOpenAsset={(slug) => navigate(`/showcase/primus-capital/assets/${slug}`)}
              onStartUnderwriting={(assetId) => {
                setActiveAssetId(assetId);
                navigateModule('underwriting');
              }}
            />
          )}

          {activeModule === 'underwriting' && (
            <UnderwritingStudioModule
              onOpenAsset={(slug) => navigate(`/showcase/primus-capital/assets/${slug}`)}
              onNavigateModule={(m) => navigateModule(m)}
              onOpenMemo={(asset) => setMemoState({ open: true, asset, submission: null })}
            />
          )}

          {activeModule === 'pipeline' && (
            <DealPipelineModule
              onOpenAsset={(slug) => navigate(`/showcase/primus-capital/assets/${slug}`)}
              onStartUnderwriting={(assetId) => {
                setActiveAssetId(assetId);
                navigateModule('underwriting');
              }}
            />
          )}

          {activeModule === 'diligence' && (
            <DiligenceDataRoomModule
              onOpenDoc={(doc) => setPreviewDoc(doc)}
              onNavigateCommittee={() => navigateModule('committee')}
            />
          )}

          {activeModule === 'committee' && (
            <CommitteeCenterModule
              onNavigateDiligence={() => navigateModule('diligence')}
              onOpenMemo={(asset, submission) =>
                setMemoState({ open: true, asset, submission: submission ?? null })
              }
            />
          )}

          {activeModule === 'portfolio' && (
            <PortfolioMonitoringModule
              onOpenAsset={(slug) => navigate(`/showcase/primus-capital/assets/${slug}`)}
              onOpenDoc={(doc) => setPreviewDoc(doc)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <PrimusDocumentPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
      {memoState && (
        <PrimusCommitteeMemoModal
          open={memoState.open}
          asset={memoState.asset}
          submission={memoState.submission}
          tasks={dataset.diligenceTasks.filter((t) => t.assetId === memoState.asset.id)}
          onClose={() => setMemoState(null)}
        />
      )}
      <PrimusConfirmResetModal
        open={resetModalOpen}
        onCancel={() => setResetModalOpen(false)}
        onConfirm={resetDemoData}
      />
      {/* Keep activeAsset referenced cleanly for assistive clarity */}
      <span className="sr-only">Active asset context: {activeAsset.name}</span>
    </div>
  );
};
