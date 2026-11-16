import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Download,
  FileText,
  Landmark,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { PrimusBrandLogo, usePrimusFavicon } from '../../components/primus/PrimusBrandLogo';
import {
  PrimusDocumentPreviewModal,
  downloadSampleFile,
} from '../../components/primus/PrimusModals';
import { usePrimusStore } from '../../context/PrimusStoreContext';
import { DataRoomDoc } from '../../data/primusCatalog';
import { formatPrimusMoney } from '../../utils/primusFinance';

type PortalTab = 'overview' | 'holdings' | 'reports' | 'documents';

export const PrimusInvestorPortalPage: React.FC = () => {
  usePrimusFavicon(true);
  const { tab: rawTab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();

  const { dataset, activeInvestorId, setActiveInvestorId } = usePrimusStore();

  const activeTab: PortalTab =
    rawTab === 'holdings' || rawTab === 'reports' || rawTab === 'documents'
      ? rawTab
      : 'overview';

  const investor =
    dataset.investors.find((lp) => lp.id === activeInvestorId) || dataset.investors[0];

  const [previewDoc, setPreviewDoc] = useState<DataRoomDoc | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.title = `Investor Portal (${investor.name}) | Primus Capital`;
  }, [investor.name, activeTab]);

  // Scoped strictly to selected LP profile
  const lpHoldingsWithAsset = investor.holdings
    .map((h) => ({
      ...h,
      asset: dataset.assets.find((a) => a.id === h.assetId),
    }))
    .filter((item): item is typeof item & { asset: NonNullable<typeof item.asset> } =>
      Boolean(item.asset)
    );

  const lpDocuments = dataset.documents.filter((d) => investor.documentIds.includes(d.id));
  const currentNavUsd = investor.holdings.reduce((s, h) => s + h.currentValueUsd, 0);
  const unfundedUsd = Math.max(0, investor.commitmentUsd - investor.contributedUsd);

  const switchTab = (next: PortalTab) => {
    navigate(
      next === 'overview'
        ? '/showcase/primus-capital/portal'
        : `/showcase/primus-capital/portal/${next}`
    );
  };

  const handleDownloadStatement = () => {
    const lines = [
      'PRIMUS CAPITAL — READ-ONLY PARTNER CAPITAL ACCOUNT STATEMENT (CONCEPT DEMO)',
      `Partner: ${investor.name} (${investor.id})`,
      `Mandate: ${investor.mandateType} | Domicile: ${investor.city}`,
      `Total Commitment: ${formatPrimusMoney(investor.commitmentUsd, 'USD')}`,
      `Paid-In Capital: ${formatPrimusMoney(investor.contributedUsd, 'USD')}`,
      `Cumulative Distributions: ${formatPrimusMoney(investor.distributionsUsd, 'USD')}`,
      `Current Ending NAV: ${formatPrimusMoney(currentNavUsd, 'USD')}`,
      '',
      'ASSIGNED PROPERTY STAKES:',
      ...lpHoldingsWithAsset.map(
        (h) =>
          `- ${h.asset.name} (${h.ownershipPct}% stake): Cost ${formatPrimusMoney(h.costBasisUsd, 'USD')} | Current Value ${formatPrimusMoney(h.currentValueUsd, 'USD')}`
      ),
      '',
      'DISCLAIMER: Fictional sample partner figures for demonstration only.',
    ];
    downloadSampleFile(`${investor.id.toLowerCase()}_capital_statement.txt`, lines.join('\n'));
  };

  return (
    <div className="primus-showcase min-h-screen flex flex-col bg-[#F6F4EF]">
      {/* Concept & Portfolio Exit Strip */}
      <div className="pr-no-print bg-[#07101D] text-slate-300 border-b border-slate-800 px-4 sm:px-8 py-2 text-[11px] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase tracking-wider text-[#DFC285]">
            Read-Only LP Portal · Interactive Concept Demo
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline">
            Strictly scoped to selected Sample Investor Profile
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/showcase/primus-capital/app" className="text-[#DFC285] font-semibold hover:underline">
            Return to Investment Workspace
          </Link>
          <Link to="/" className="text-slate-200 hover:text-white font-semibold inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>Back to Genmax Portfolio</span>
          </Link>
        </div>
      </div>

      {/* Portal Header */}
      <header className="pr-no-print bg-white border-b border-[#DDD7CB] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/showcase/primus-capital">
              <PrimusBrandLogo variant="full" tone="dark" size="sm" />
            </Link>

            <nav className="flex items-center gap-1 sm:gap-2 text-xs font-semibold">
              {(
                [
                  { id: 'overview', label: 'Overview' },
                  { id: 'holdings', label: 'Holdings' },
                  { id: 'reports', label: 'Reports' },
                  { id: 'documents', label: 'Documents' },
                ] as { id: PortalTab; label: string }[]
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => switchTab(t.id)}
                  className={`px-3 py-1.5 cursor-pointer ${
                    activeTab === t.id
                      ? 'bg-[#0D1829] text-white'
                      : 'text-[#475569] hover:text-[#0D1829]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Sample Investor Profile Switcher */}
          <div className="flex items-center gap-2 text-xs">
            <Landmark className="w-4 h-4 text-[#9E7C3B] shrink-0" />
            <select
              aria-label="Sample Investor Profile Switcher"
              value={investor.id}
              onChange={(e) => setActiveInvestorId(e.target.value)}
              className="h-9 px-3 bg-[#F6F4EF] border border-[#DDD7CB] font-bold text-[#0D1829]"
            >
              {dataset.investors.map((lp) => (
                <option key={lp.id} value={lp.id}>
                  {lp.name} ({lp.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-6 flex-1">
        {/* Partner Banner */}
        <div className="bg-[#0D1829] text-white p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#DFC285]">
              {investor.id} · {investor.mandateType} · {investor.city}
            </span>
            <h1 className="text-2xl sm:text-3xl pr-serif">{investor.name}</h1>
            <p className="text-xs text-slate-300">
              Read-only partner view · Consolidated in {investor.reportingCurrency}
            </p>
          </div>

          <div className="pr-no-print flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-[#192D4D] border border-slate-700 text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#DFC285]" />
              <span>Print Statement</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadStatement}
              className="px-3.5 py-2 bg-[#9E7C3B] hover:bg-[#B8934A] text-[#07101D] font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Summary (.TXT)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pr-tabular">
              <div className="bg-white border border-[#DDD7CB] p-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                  Capital Commitment
                </p>
                <p className="text-2xl font-bold text-[#0D1829] mt-1">
                  {formatPrimusMoney(investor.commitmentUsd, 'USD', true)}
                </p>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Unfunded: {formatPrimusMoney(unfundedUsd, 'USD', true)}
                </p>
              </div>
              <div className="bg-white border border-[#DDD7CB] p-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                  Contributed Capital
                </p>
                <p className="text-2xl font-bold text-[#0D1829] mt-1">
                  {formatPrimusMoney(investor.contributedUsd, 'USD', true)}
                </p>
                <p className="text-[11px] text-[#64748B] mt-1">
                  {Math.round((investor.contributedUsd / investor.commitmentUsd) * 100)}% Called
                </p>
              </div>
              <div className="bg-white border border-[#DDD7CB] p-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                  Current Partner NAV
                </p>
                <p className="text-2xl font-bold text-[#9E7C3B] mt-1">
                  {formatPrimusMoney(currentNavUsd, 'USD', true)}
                </p>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Across {lpHoldingsWithAsset.length} Operating Holdings
                </p>
              </div>
              <div className="bg-white border border-[#DDD7CB] p-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                  Cumulative Distributions
                </p>
                <p className="text-2xl font-bold text-[#065F46] mt-1">
                  {formatPrimusMoney(investor.distributionsUsd, 'USD', true)}
                </p>
                <p className="text-[11px] text-[#64748B] mt-1">Sample realized payouts</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7 bg-white border border-[#DDD7CB] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[#0D1829] pr-sans">
                    Assigned Operating Asset Stakes
                  </h2>
                  <button
                    type="button"
                    onClick={() => switchTab('holdings')}
                    className="text-xs font-semibold text-[#9E7C3B] hover:underline cursor-pointer"
                  >
                    View Holdings Table →
                  </button>
                </div>
                <div className="divide-y divide-[#EAE5DA] text-xs pr-tabular">
                  {lpHoldingsWithAsset.map(({ asset, ownershipPct, currentValueUsd, ytdDistributionUsd }) => (
                    <div key={asset.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-[#0D1829]">{asset.name}</p>
                        <p className="text-[#475569]">
                          {asset.district} · Partner Ownership: {ownershipPct}%
                        </p>
                      </div>
                      <div className="text-right">
                        <strong className="text-[#0D1829] block">
                          {formatPrimusMoney(currentValueUsd, 'USD', true)}
                        </strong>
                        <span className="text-[11px] text-[#065F46]">
                          YTD Dist: {formatPrimusMoney(ytdDistributionUsd, 'USD', true)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 bg-white border border-[#DDD7CB] p-5 space-y-4">
                <h2 className="text-sm font-bold text-[#0D1829] pr-sans">
                  Latest Quarterly Capital Statement
                </h2>
                {investor.quarterlyReports[0] && (
                  <div className="p-4 bg-[#F6F4EF] border border-[#DDD7CB] space-y-2 text-xs">
                    <span className="font-mono font-bold text-[#9E7C3B]">
                      {investor.quarterlyReports[0].quarter} · Published{' '}
                      {investor.quarterlyReports[0].publishedDate}
                    </span>
                    <h3 className="text-sm font-bold text-[#0D1829]">
                      {investor.quarterlyReports[0].title}
                    </h3>
                    <p className="text-[#475569] leading-relaxed">
                      {investor.quarterlyReports[0].summary}
                    </p>
                    <div className="pt-2 border-t border-[#DDD7CB] flex justify-between pr-tabular">
                      <span>
                        NAV:{' '}
                        <strong>
                          {formatPrimusMoney(investor.quarterlyReports[0].navUsd, 'USD', true)}
                        </strong>
                      </span>
                      <span>
                        Dist Yield: <strong>{investor.quarterlyReports[0].distributionYieldPct}%</strong>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Holdings */}
        {activeTab === 'holdings' && (
          <div className="bg-white border border-[#DDD7CB] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#9E7C3B]" />
              <h2 className="text-sm font-bold text-[#0D1829] pr-sans">
                Partner Property Allocations ({lpHoldingsWithAsset.length} Scoped Operating Holdings)
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#DDD7CB] pr-tabular">
                <thead className="bg-[#0D1829] text-white">
                  <tr>
                    <th className="p-3">Operating Asset</th>
                    <th className="p-3">Market</th>
                    <th className="p-3">LP Stake %</th>
                    <th className="p-3">Cost Basis (USD)</th>
                    <th className="p-3">Current Value (USD)</th>
                    <th className="p-3">YTD Distribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE5DA]">
                  {lpHoldingsWithAsset.map((h) => (
                    <tr key={h.assetId}>
                      <td className="p-3 font-bold text-[#0D1829]">
                        <Link
                          to={`/showcase/primus-capital/assets/${h.asset.slug}`}
                          className="hover:text-[#9E7C3B]"
                        >
                          {h.asset.name}
                        </Link>
                      </td>
                      <td className="p-3 text-[#475569]">{h.asset.market}</td>
                      <td className="p-3 font-semibold">{h.ownershipPct}%</td>
                      <td className="p-3">{formatPrimusMoney(h.costBasisUsd, 'USD', true)}</td>
                      <td className="p-3 font-bold text-[#9E7C3B]">
                        {formatPrimusMoney(h.currentValueUsd, 'USD', true)}
                      </td>
                      <td className="p-3 text-[#065F46] font-semibold">
                        {formatPrimusMoney(h.ytdDistributionUsd, 'USD', true)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Quarterly Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {investor.quarterlyReports.map((rpt) => (
              <div
                key={rpt.id}
                className="bg-white border border-[#DDD7CB] p-5 flex flex-wrap items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <span className="font-mono font-bold text-[#9E7C3B]">
                    {rpt.id} · {rpt.quarter} · {rpt.publishedDate}
                  </span>
                  <h2 className="text-base font-bold text-[#0D1829] pr-sans">{rpt.title}</h2>
                  <p className="text-[#475569] leading-relaxed">{rpt.summary}</p>
                </div>
                <div className="text-right pr-tabular space-y-1">
                  <p className="font-bold text-sm text-[#0D1829]">
                    NAV: {formatPrimusMoney(rpt.navUsd, 'USD', true)}
                  </p>
                  <p className="text-[#065F46] font-semibold">
                    Annualized Yield: {rpt.distributionYieldPct}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Scoped LP Documents */}
        {activeTab === 'documents' && (
          <div className="bg-white border border-[#DDD7CB] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#9E7C3B]" />
              <h2 className="text-sm font-bold text-[#0D1829] pr-sans">
                Permitted Partner Document Vault ({lpDocuments.length} Documents)
              </h2>
            </div>

            <div className="space-y-3">
              {lpDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 bg-[#F6F4EF] border border-[#DDD7CB] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-[#9E7C3B] shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-[#0D1829] truncate">{doc.title}</p>
                      <p className="text-[11px] text-[#475569]">{doc.previewSummary}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(doc)}
                    className="px-3.5 py-1.5 bg-[#0D1829] text-white font-semibold shrink-0 cursor-pointer"
                  >
                    Preview
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <PrimusDocumentPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
    </div>
  );
};
