import React, { useMemo, useState } from 'react';
import { ArrowRight, Building2, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';
import { usePrimusStore } from '../../../context/PrimusStoreContext';
import { DataRoomDoc } from '../../../data/primusCatalog';
import {
  FIXED_FX_TO_USD,
  convertPrimusCurrency,
  formatPrimusMoney,
} from '../../../utils/primusFinance';
import { PrimusStatusBadge } from '../PrimusStatusBadge';

interface PortfolioMonitoringModuleProps {
  onOpenAsset: (slug: string) => void;
  onOpenDoc: (doc: DataRoomDoc) => void;
}

export const PortfolioMonitoringModule: React.FC<PortfolioMonitoringModuleProps> = ({
  onOpenAsset,
  onOpenDoc,
}) => {
  const {
    dataset,
    activeMarketScope,
    consolidatedCurrency,
    simulateCloseDeal,
  } = usePrimusStore();

  const [closeNotice, setCloseNotice] = useState<string | null>(null);

  const operatingAssets = useMemo(
    () =>
      dataset.assets.filter(
        (a) =>
          a.stage === 'operating_holding' &&
          (activeMarketScope === 'All' || a.market === activeMarketScope)
      ),
    [dataset.assets, activeMarketScope]
  );

  const approvedAwaitingClose = useMemo(
    () =>
      dataset.assets.filter(
        (a) =>
          a.stage === 'approved' &&
          (activeMarketScope === 'All' || a.market === activeMarketScope)
      ),
    [dataset.assets, activeMarketScope]
  );

  const totals = useMemo(() => {
    const gav = operatingAssets.reduce(
      (s, a) => s + convertPrimusCurrency(a.askingPrice, a.currency, consolidatedCurrency),
      0
    );
    const noi = operatingAssets.reduce(
      (s, a) => s + convertPrimusCurrency(a.currentAnnualNoi, a.currency, consolidatedCurrency),
      0
    );
    const totalSqFt = operatingAssets.reduce((s, a) => s + a.floorAreaSqFt, 0);
    const occWeighted =
      totalSqFt > 0
        ? operatingAssets.reduce((s, a) => s + a.occupancyPct * a.floorAreaSqFt, 0) / totalSqFt
        : 0;
    return { gav, noi, totalSqFt, occWeighted };
  }, [operatingAssets, consolidatedCurrency]);

  // Consolidated Lease Expiry Ladder across operating holdings
  const consolidatedExpiries = useMemo(() => {
    const map: Record<number, number> = {};
    operatingAssets.forEach((a) => {
      a.expirySchedule.forEach((b) => {
        map[b.year] = (map[b.year] || 0) + b.sqFtExpiring;
      });
    });
    return Object.entries(map)
      .map(([yr, sqFt]) => ({ year: Number(yr), sqFt }))
      .sort((a, b) => a.year - b.year);
  }, [operatingAssets]);

  const maxExpirySqFt = Math.max(1, ...consolidatedExpiries.map((e) => e.sqFt));

  return (
    <div className="space-y-5">
      {closeNotice && (
        <div className="p-3.5 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{closeNotice}</span>
          </span>
          <button type="button" onClick={() => setCloseNotice(null)} className="font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Approved Pipeline Awaiting Simulated Close */}
      {approvedAwaitingClose.length > 0 && (
        <div className="bg-[#FBF6EA] border border-[#9E7C3B] p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-[#0D1829]">
                Committee-Approved Deals Pending Simulated Close ({approvedAwaitingClose.length})
              </p>
              <p className="text-[11px] text-[#475569]">
                Approved pipeline assets are tracked separately until explicitly transferred into Operating Holdings.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {approvedAwaitingClose.map((deal) => (
              <div
                key={deal.id}
                className="bg-white border border-[#DDD7CB] p-3 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-[#9E7C3B] mr-2">{deal.code}</span>
                  <strong className="text-[#0D1829]">{deal.name}</strong>
                  <span className="text-[#475569] ml-2 pr-tabular">
                    ({formatPrimusMoney(deal.askingPrice, deal.currency, true)})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const res = simulateCloseDeal(deal.id);
                    if (res.ok) {
                      setCloseNotice(
                        `${deal.name} closed into Operating Holdings and added to Portfolio Monitoring.`
                      );
                    }
                  }}
                  className="px-3.5 py-1.5 bg-[#065F46] hover:bg-[#047857] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Simulate Close into Operating Portfolio</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consolidated Operating KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pr-tabular">
        <div className="bg-white border border-[#DDD7CB] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
            Operating Holdings
          </p>
          <p className="text-2xl font-bold text-[#0D1829] mt-1">{operatingAssets.length}</p>
          <p className="text-[11px] text-[#64748B] mt-1">
            {totals.totalSqFt.toLocaleString()} sq ft total
          </p>
        </div>

        <div className="bg-white border border-[#DDD7CB] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
            Gross Asset Value ({consolidatedCurrency})
          </p>
          <p className="text-2xl font-bold text-[#0D1829] mt-1">
            {formatPrimusMoney(totals.gav, consolidatedCurrency, true)}
          </p>
          <p className="text-[11px] text-[#64748B] mt-1">
            FX: 1 GBP={FIXED_FX_TO_USD.GBP} USD · 1 SGD={FIXED_FX_TO_USD.SGD} USD
          </p>
        </div>

        <div className="bg-white border border-[#DDD7CB] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
            Annualized NOI ({consolidatedCurrency})
          </p>
          <p className="text-2xl font-bold text-[#9E7C3B] mt-1">
            {formatPrimusMoney(totals.noi, consolidatedCurrency, true)}
          </p>
          <p className="text-[11px] text-[#64748B] mt-1">
            {totals.gav > 0 ? `${((totals.noi / totals.gav) * 100).toFixed(2)}% portfolio yield` : '—'}
          </p>
        </div>

        <div className="bg-white border border-[#DDD7CB] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
            Weighted Occupancy
          </p>
          <p className="text-2xl font-bold text-[#065F46] mt-1">
            {totals.occWeighted.toFixed(1)}%
          </p>
          <p className="text-[11px] text-[#64748B] mt-1">Sample stabilized asset base</p>
        </div>
      </div>

      {/* Operating Holdings Table + Lease Expiry Ladder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-white border border-[#DDD7CB] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0D1829] pr-sans">
              Active Operating Holdings Ledger
            </h2>
            <Building2 className="w-4 h-4 text-[#9E7C3B]" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#DDD7CB] pr-tabular">
              <thead className="bg-[#0D1829] text-white">
                <tr>
                  <th className="p-3">Asset</th>
                  <th className="p-3">District</th>
                  <th className="p-3">Native Value</th>
                  <th className="p-3">Annual NOI</th>
                  <th className="p-3">Occ / WAULT</th>
                  <th className="p-3">Reports</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5DA]">
                {operatingAssets.map((a) => {
                  const assetDoc = dataset.documents.find((d) => d.assetId === a.id);
                  return (
                    <tr key={a.id} className="hover:bg-[#F6F4EF]/60">
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => onOpenAsset(a.slug)}
                          className="font-bold text-[#0D1829] hover:text-[#9E7C3B] text-left cursor-pointer"
                        >
                          {a.name}
                        </button>
                        <div className="mt-0.5">
                          <PrimusStatusBadge status={a.stage} />
                        </div>
                      </td>
                      <td className="p-3 text-[#475569]">{a.district}</td>
                      <td className="p-3 font-semibold">
                        {formatPrimusMoney(a.askingPrice, a.currency, true)} ({a.currency})
                      </td>
                      <td className="p-3 font-semibold text-[#9E7C3B]">
                        {formatPrimusMoney(a.currentAnnualNoi, a.currency, true)}
                      </td>
                      <td className="p-3">
                        {a.occupancyPct}% · {a.waultYears}y
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {assetDoc && (
                            <button
                              type="button"
                              onClick={() => onOpenDoc(assetDoc)}
                              className="px-2.5 py-1 border border-[#DDD7CB] bg-[#F6F4EF] font-semibold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <FileText className="w-3 h-3 text-[#9E7C3B]" />
                              <span>Report</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onOpenAsset(a.slug)}
                            className="p-1 text-[#0D1829] hover:text-[#9E7C3B] cursor-pointer"
                            aria-label={`View ${a.name}`}
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-[#DDD7CB] p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#0D1829] pr-sans">
            Consolidated Lease Expiry Ladder (sq ft)
          </h3>
          <div className="space-y-3 pr-tabular text-xs">
            {consolidatedExpiries.map((bucket) => (
              <div key={bucket.year} className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold text-[#0D1829]">{bucket.year}</span>
                  <span className="text-[#475569]">
                    {bucket.sqFt.toLocaleString()} sq ft (
                    {Math.round((bucket.sqFt / Math.max(1, totals.totalSqFt)) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#EFECE5]">
                  <div
                    className="h-full bg-[#0D1829]"
                    style={{ width: `${(bucket.sqFt / maxExpirySqFt) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
