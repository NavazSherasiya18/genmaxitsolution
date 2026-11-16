import React, { useMemo } from 'react';
import { ArrowRight, CheckSquare, TrendingUp } from 'lucide-react';
import { usePrimusStore } from '../../../context/PrimusStoreContext';
import {
  FIXED_FX_TO_USD,
  convertPrimusCurrency,
  formatPrimusMoney,
} from '../../../utils/primusFinance';
import { PrimusStatusBadge } from '../PrimusStatusBadge';

interface ExecutiveDashboardModuleProps {
  onNavigateModule: (mod: string) => void;
  onOpenAsset: (slug: string) => void;
}

export const ExecutiveDashboardModule: React.FC<ExecutiveDashboardModuleProps> = ({
  onNavigateModule,
  onOpenAsset,
}) => {
  const { dataset, activeMarketScope, consolidatedCurrency, setActiveAssetId } = usePrimusStore();

  const operatingAssets = useMemo(
    () =>
      dataset.assets.filter(
        (a) =>
          a.stage === 'operating_holding' &&
          (activeMarketScope === 'All' || a.market === activeMarketScope)
      ),
    [dataset.assets, activeMarketScope]
  );

  const pipelineAssets = useMemo(
    () =>
      dataset.assets.filter(
        (a) =>
          a.stage !== 'operating_holding' &&
          a.stage !== 'rejected' &&
          (activeMarketScope === 'All' || a.market === activeMarketScope)
      ),
    [dataset.assets, activeMarketScope]
  );

  const metrics = useMemo(() => {
    let totalGav = 0;
    let totalNoi = 0;
    let totalSqFt = 0;
    let weightedOccNumerator = 0;

    const byClass: Record<'office' | 'logistics' | 'mixed_use', number> = {
      office: 0,
      logistics: 0,
      mixed_use: 0,
    };

    for (const asset of operatingAssets) {
      const gavConv = convertPrimusCurrency(asset.askingPrice, asset.currency, consolidatedCurrency);
      const noiConv = convertPrimusCurrency(
        asset.currentAnnualNoi,
        asset.currency,
        consolidatedCurrency
      );
      totalGav += gavConv;
      totalNoi += noiConv;
      totalSqFt += asset.floorAreaSqFt;
      weightedOccNumerator += asset.occupancyPct * asset.floorAreaSqFt;
      byClass[asset.assetClass] += gavConv;
    }

    const weightedOcc = totalSqFt > 0 ? weightedOccNumerator / totalSqFt : 0;

    // Monthly NOI trend series across operating assets in consolidated currency
    const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    const monthlyTrend = months.map((m, i) => {
      const sum = operatingAssets.reduce((acc, a) => {
        const pt = a.monthlyNoiHistory[i]?.noi ?? a.currentAnnualNoi / 12;
        return acc + convertPrimusCurrency(pt, a.currency, consolidatedCurrency);
      }, 0);
      return { month: m, noi: sum };
    });

    // Near-term lease expiry calculation (2027-2028)
    const upcomingExpiringSqFt = operatingAssets.reduce(
      (sum, a) =>
        sum +
        a.expirySchedule
          .filter((e) => e.year <= 2028)
          .reduce((s, e) => s + e.sqFtExpiring, 0),
      0
    );

    return {
      totalGav,
      totalNoi,
      weightedOcc,
      byClass,
      monthlyTrend,
      upcomingExpiringSqFt,
    };
  }, [operatingAssets, consolidatedCurrency]);

  const maxTrend = Math.max(...metrics.monthlyTrend.map((m) => m.noi), 1);

  const openDiligenceTasks = dataset.diligenceTasks.filter((t) => t.status !== 'completed');

  return (
    <div className="space-y-6">
      {/* FX & Basis Transparency Notice */}
      <div className="bg-white border border-[#DDD7CB] px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#475569]">
        <span>
          <strong className="text-[#0D1829]">Portfolio Scope:</strong>{' '}
          {operatingAssets.length} Operating Holding(s) ({activeMarketScope}) · Pipeline deals kept
          separate until simulated close.
        </span>
        <span className="font-mono text-[11px] pr-tabular">
          Consolidated in {consolidatedCurrency} · Fixed Demo FX: 1 GBP = {FIXED_FX_TO_USD.GBP} USD |
          1 SGD = {FIXED_FX_TO_USD.SGD} USD
        </span>
      </div>

      {/* Clickable 4-KPI Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pr-tabular">
        <button
          type="button"
          onClick={() => onNavigateModule('portfolio')}
          className="bg-white border border-[#DDD7CB] hover:border-[#9E7C3B] p-5 text-left transition-colors cursor-pointer"
        >
          <p className="text-xs font-semibold text-[#475569]">Operating Gross Asset Value</p>
          <p className="text-2xl font-bold text-[#0D1829] mt-1">
            {formatPrimusMoney(metrics.totalGav, consolidatedCurrency, true)}
          </p>
          <p className="text-[11px] text-[#9E7C3B] font-semibold mt-1.5">
            Drill into Portfolio Holdings →
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateModule('portfolio')}
          className="bg-white border border-[#DDD7CB] hover:border-[#9E7C3B] p-5 text-left transition-colors cursor-pointer"
        >
          <p className="text-xs font-semibold text-[#475569]">Annualized Operating NOI</p>
          <p className="text-2xl font-bold text-[#0D1829] mt-1">
            {formatPrimusMoney(metrics.totalNoi, consolidatedCurrency, true)}
          </p>
          <p className="text-[11px] text-[#9E7C3B] font-semibold mt-1.5">
            {metrics.totalGav > 0
              ? `${((metrics.totalNoi / metrics.totalGav) * 100).toFixed(2)}% blended cap · Inspect →`
              : 'Inspect Portfolio →'}
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateModule('portfolio')}
          className="bg-white border border-[#DDD7CB] hover:border-[#9E7C3B] p-5 text-left transition-colors cursor-pointer"
        >
          <p className="text-xs font-semibold text-[#475569]">Weighted Occupancy (Area-Weighted)</p>
          <p className="text-2xl font-bold text-[#0D1829] mt-1">
            {metrics.weightedOcc.toFixed(1)}%
          </p>
          <p className="text-[11px] text-[#475569] mt-1.5">
            {metrics.upcomingExpiringSqFt.toLocaleString()} sq ft expiring 2027–28
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateModule('pipeline')}
          className="bg-white border border-[#DDD7CB] hover:border-[#9E7C3B] p-5 text-left transition-colors cursor-pointer"
        >
          <p className="text-xs font-semibold text-[#475569]">Active Acquisition Pipeline</p>
          <p className="text-2xl font-bold text-[#9E7C3B] mt-1">{pipelineAssets.length} Deals</p>
          <p className="text-[11px] text-[#0D1829] font-semibold mt-1.5">
            Open Screening &amp; Committee Board →
          </p>
        </button>
      </div>

      {/* Charts Split: Monthly NOI Trend + Sector Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-[#DDD7CB] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0D1829] pr-sans inline-flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#9E7C3B]" />
                Monthly Operating NOI Trend ({consolidatedCurrency})
              </h2>
              <p className="text-xs text-[#475569]">
                Trailing 6-month consolidated net operating income across closed holdings
              </p>
            </div>
          </div>

          <div
            className="grid grid-cols-6 gap-3 items-end h-44 pt-4 border-t border-[#EAE5DA]"
            role="img"
            aria-label="Bar chart of 6-month consolidated operating NOI"
          >
            {metrics.monthlyTrend.map((pt) => {
              const heightPct = Math.max(18, Math.round((pt.noi / maxTrend) * 100));
              return (
                <div key={pt.month} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[11px] font-mono text-[#475569] pr-tabular">
                    {formatPrimusMoney(pt.noi, consolidatedCurrency, true)}
                  </span>
                  <div className="w-full max-w-[44px] bg-[#EFECE5] h-28 flex items-end">
                    <div
                      className="w-full bg-[#0D1829] border-t-2 border-[#9E7C3B]"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#0D1829]">{pt.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-[#DDD7CB] p-5 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[#0D1829] pr-sans">
              Allocation by Asset Class ({consolidatedCurrency})
            </h2>
            <p className="text-xs text-[#475569]">
              Derived directly from closed operating portfolio valuation
            </p>
          </div>

          <div className="space-y-4 pt-2 border-t border-[#EAE5DA] text-xs pr-tabular">
            {(
              [
                { key: 'office', label: 'Commercial Office' },
                { key: 'mixed_use', label: 'Mixed-Use CBD' },
                { key: 'logistics', label: 'Logistics & Cold-Chain' },
              ] as const
            ).map((row) => {
              const val = metrics.byClass[row.key];
              const pct = metrics.totalGav > 0 ? Math.round((val / metrics.totalGav) * 100) : 0;
              return (
                <div key={row.key} className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-[#0D1829]">{row.label}</span>
                    <span className="text-[#475569]">
                      {formatPrimusMoney(val, consolidatedCurrency, true)} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 bg-[#EFECE5]">
                    <div className="h-full bg-[#9E7C3B]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Split: Active Pipeline Spotlight + Prioritized Diligence Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-[#DDD7CB] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0D1829] pr-sans">
              Active Pipeline &amp; Priority Transactions
            </h2>
            <button
              type="button"
              onClick={() => onNavigateModule('pipeline')}
              className="text-xs font-semibold text-[#9E7C3B] hover:underline cursor-pointer"
            >
              Open Full Pipeline →
            </button>
          </div>

          <div className="divide-y divide-[#EAE5DA] border border-[#DDD7CB]">
            {pipelineAssets.slice(0, 5).map((asset) => (
              <div
                key={asset.id}
                className="p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs hover:bg-[#F6F4EF]"
              >
                <div>
                  <p className="font-bold text-[#0D1829]">
                    {asset.name}{' '}
                    <span className="font-mono text-[#9E7C3B] ml-1">{asset.code}</span>
                  </p>
                  <p className="text-[#475569] pr-tabular">
                    {asset.market} ·{' '}
                    {formatPrimusMoney(asset.askingPrice, asset.currency, true)} ({asset.currency}) ·{' '}
                    {asset.owner}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <PrimusStatusBadge status={asset.stage} />
                  <button
                    type="button"
                    onClick={() => onOpenAsset(asset.slug)}
                    className="px-2.5 py-1 border border-[#DDD7CB] bg-white hover:border-[#9E7C3B] font-semibold cursor-pointer"
                  >
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-[#DDD7CB] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0D1829] pr-sans inline-flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#9E7C3B]" />
              Prioritized Open Tasks ({openDiligenceTasks.length})
            </h2>
            <button
              type="button"
              onClick={() => onNavigateModule('diligence')}
              className="text-xs font-semibold text-[#9E7C3B] hover:underline cursor-pointer"
            >
              Data Room →
            </button>
          </div>

          {openDiligenceTasks.length === 0 ? (
            <p className="text-xs text-[#64748B]">All diligence checklist items are complete.</p>
          ) : (
            <div className="space-y-2.5">
              {openDiligenceTasks.map((t) => {
                const asset = dataset.assets.find((a) => a.id === t.assetId);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      if (asset) setActiveAssetId(asset.id);
                      onNavigateModule('diligence');
                    }}
                    className="w-full p-3 border border-[#DDD7CB] bg-[#F6F4EF] hover:border-[#9E7C3B] text-left text-xs flex items-start justify-between gap-2 cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-[#0D1829]">{t.title}</p>
                      <p className="text-[#475569] mt-0.5">
                        {asset?.name} · Due {t.dueDate} ·{' '}
                        {t.required ? 'Required for IC' : 'Optional'}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#9E7C3B] shrink-0 mt-0.5" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
