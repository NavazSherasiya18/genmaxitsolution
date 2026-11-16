import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Kanban,
  List,
  MessageSquarePlus,
  ShieldCheck,
  X,
} from 'lucide-react';
import { usePrimusStore } from '../../../context/PrimusStoreContext';
import { CommercialAsset, PrimusDealStage } from '../../../data/primusCatalog';
import { formatPrimusMoney } from '../../../utils/primusFinance';
import { PrimusStatusBadge } from '../PrimusStatusBadge';

interface DealPipelineModuleProps {
  onOpenAsset: (slug: string) => void;
  onStartUnderwriting: (assetId: string) => void;
}

const PIPELINE_STAGES: { id: Exclude<PrimusDealStage, 'operating_holding'>; label: string }[] = [
  { id: 'screening', label: 'Screening' },
  { id: 'underwriting', label: 'Underwriting' },
  { id: 'due_diligence', label: 'Due Diligence' },
  { id: 'committee', label: 'Committee' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Declined' },
];

export const DealPipelineModule: React.FC<DealPipelineModuleProps> = ({
  onOpenAsset,
  onStartUnderwriting,
}) => {
  const {
    dataset,
    activeMarketScope,
    moveDealStage,
    addAssetComment,
    simulateCloseDeal,
  } = usePrimusStore();

  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');
  const [drawerAssetId, setDrawerAssetId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [feedbackErr, setFeedbackErr] = useState<string | null>(null);

  const pipelineAssets = dataset.assets.filter((a) => {
    if (a.stage === 'operating_holding') return false;
    if (activeMarketScope !== 'All' && a.market !== activeMarketScope) return false;
    return true;
  });

  const operatingCount = dataset.assets.filter(
    (a) =>
      a.stage === 'operating_holding' &&
      (activeMarketScope === 'All' || a.market === activeMarketScope)
  ).length;

  const drawerAsset: CommercialAsset | null =
    dataset.assets.find((a) => a.id === drawerAssetId) || null;

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="bg-white border border-[#DDD7CB] p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[#0D1829] pr-sans">
            Acquisition Deal Pipeline ({pipelineAssets.length} Active / Screened Deals)
          </h2>
          <p className="text-[11px] text-[#475569]">
            {operatingCount} stabilized assets sit separately in Operating Holdings until approved deals undergo Simulated Close.
          </p>
        </div>

        <div className="flex border border-[#DDD7CB] bg-[#F6F4EF] text-xs">
          <button
            type="button"
            onClick={() => setViewMode('board')}
            className={`px-3 py-1.5 inline-flex items-center gap-1.5 font-semibold cursor-pointer ${
              viewMode === 'board' ? 'bg-white text-[#0D1829]' : 'text-[#475569]'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Board</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 inline-flex items-center gap-1.5 font-semibold cursor-pointer ${
              viewMode === 'table' ? 'bg-white text-[#0D1829]' : 'text-[#475569]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {feedbackErr && (
        <div className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{feedbackErr}</span>
          </span>
          <button type="button" onClick={() => setFeedbackErr(null)} className="font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {PIPELINE_STAGES.map((stage) => {
            const stageDeals = pipelineAssets.filter((a) => a.stage === stage.id);
            return (
              <div
                key={stage.id}
                className="bg-[#EFECE5] border border-[#DDD7CB] p-3 flex flex-col gap-3 min-h-[260px]"
              >
                <div className="flex items-center justify-between border-b border-[#DDD7CB] pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D1829]">
                    {stage.label}
                  </span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-white border border-[#DDD7CB] text-[#475569]">
                    {stageDeals.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {stageDeals.length === 0 ? (
                    <p className="text-[11px] text-[#64748B] italic py-4 text-center">No deals</p>
                  ) : (
                    stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="bg-white border border-[#DDD7CB] p-3 space-y-2 hover:border-[#9E7C3B] transition-colors"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                          <span>{deal.code}</span>
                          <span>{deal.market}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDrawerAssetId(deal.id)}
                          className="text-left text-xs font-bold text-[#0D1829] hover:text-[#9E7C3B] cursor-pointer block"
                        >
                          {deal.name}
                        </button>
                        <div className="text-[11px] pr-tabular text-[#475569]">
                          {formatPrimusMoney(deal.askingPrice, deal.currency, true)} ·{' '}
                          {deal.occupancyPct}% occ
                        </div>
                        <div className="pt-2 border-t border-[#EAE5DA] flex items-center justify-between gap-2 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setDrawerAssetId(deal.id)}
                            className="font-semibold text-[#0D1829] hover:underline cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => onStartUnderwriting(deal.id)}
                            className="font-semibold text-[#9E7C3B] hover:underline cursor-pointer"
                          >
                            Model →
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-[#DDD7CB] overflow-x-auto">
          <table className="w-full text-left text-xs pr-tabular">
            <thead className="bg-[#0D1829] text-white">
              <tr>
                <th className="p-3">Deal</th>
                <th className="p-3">Market / Class</th>
                <th className="p-3">Asking Price</th>
                <th className="p-3">Occupancy</th>
                <th className="p-3">Owner</th>
                <th className="p-3">Stage</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE5DA]">
              {pipelineAssets.map((deal) => (
                <tr key={deal.id} className="hover:bg-[#F6F4EF]/60">
                  <td className="p-3 font-bold text-[#0D1829]">{deal.name}</td>
                  <td className="p-3 text-[#475569]">
                    {deal.market} · {deal.assetClass.replace('_', '-')}
                  </td>
                  <td className="p-3 font-semibold">
                    {formatPrimusMoney(deal.askingPrice, deal.currency, true)}
                  </td>
                  <td className="p-3">{deal.occupancyPct}%</td>
                  <td className="p-3 text-[#475569]">{deal.owner}</td>
                  <td className="p-3">
                    <PrimusStatusBadge status={deal.stage} />
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDrawerAssetId(deal.id)}
                      className="px-2.5 py-1 border border-[#DDD7CB] bg-[#F6F4EF] font-semibold cursor-pointer"
                    >
                      Inspect
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenAsset(deal.slug)}
                      className="px-2.5 py-1 bg-[#0D1829] text-white font-semibold cursor-pointer"
                    >
                      Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Deal Detail Drawer */}
      {drawerAsset && (
        <div className="bg-white border-2 border-[#0D1829] p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#EAE5DA] pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono font-bold text-[#9E7C3B]">
                  {drawerAsset.code}
                </span>
                <PrimusStatusBadge status={drawerAsset.stage} />
              </div>
              <h3 className="text-lg font-bold text-[#0D1829] pr-sans">{drawerAsset.name}</h3>
              <p className="text-xs text-[#475569]">
                {drawerAsset.district} · Owner: {drawerAsset.owner}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDrawerAssetId(null)}
              className="p-1.5 border border-[#DDD7CB] text-[#0D1829] cursor-pointer"
              aria-label="Close deal drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
            {/* Stage Controls & History */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#9E7C3B] mb-2">
                  Pipeline Stage Transition
                </p>
                <div className="flex flex-wrap gap-2">
                  {PIPELINE_STAGES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        const res = moveDealStage(drawerAsset.id, st.id);
                        if (!res.ok) setFeedbackErr(res.error || null);
                        else setFeedbackErr(null);
                      }}
                      className={`px-3 py-1.5 border font-semibold cursor-pointer ${
                        drawerAsset.stage === st.id
                          ? 'bg-[#0D1829] border-[#0D1829] text-white'
                          : 'bg-[#F6F4EF] border-[#DDD7CB] text-[#475569] hover:border-[#9E7C3B]'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {drawerAsset.stage === 'approved' && (
                <div className="p-3.5 bg-[#ECFDF5] border border-[#A7F3D0] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-[#065F46]">Committee Approved — Ready for Simulated Close</p>
                    <p className="text-[11px] text-[#047857]">
                      Transfers asset into Operating Holdings inside Portfolio Monitoring.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const res = simulateCloseDeal(drawerAsset.id);
                      if (!res.ok) setFeedbackErr(res.error || null);
                      else setDrawerAssetId(null);
                    }}
                    className="px-3.5 py-2 bg-[#065F46] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Execute Simulated Close</span>
                  </button>
                </div>
              )}

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
                  Recorded Stage History
                </p>
                <div className="space-y-2 border-l-2 border-[#DDD7CB] pl-3">
                  {drawerAsset.stageHistory.map((h, i) => (
                    <div key={`${h.stage}-${i}`}>
                      <p className="font-bold text-[#0D1829]">
                        {h.stage.replace('_', ' ').toUpperCase()} · {h.dateLabel} ({h.actor})
                      </p>
                      <p className="text-[#475569]">{h.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Analyst Comments */}
            <div className="lg:col-span-6 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#9E7C3B]">
                Investment Team Notes ({drawerAsset.comments.length})
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addAssetComment(drawerAsset.id, commentInput);
                  setCommentInput('');
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add acquisition team note or lender follow-up..."
                  className="flex-1 h-9 px-3 bg-[#F6F4EF] border border-[#DDD7CB] text-[#0D1829]"
                />
                <button
                  type="submit"
                  className="px-3.5 h-9 bg-[#0D1829] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5 text-[#D6B572]" />
                  <span>Post</span>
                </button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {drawerAsset.comments.length === 0 ? (
                  <p className="text-[#64748B] italic">No team notes posted yet.</p>
                ) : (
                  drawerAsset.comments.map((c) => (
                    <div key={c.id} className="p-3 bg-[#F6F4EF] border border-[#EAE5DA]">
                      <p className="font-bold text-[#0D1829]">
                        {c.author} <span className="font-normal text-[#64748B]">· {c.dateLabel}</span>
                      </p>
                      <p className="mt-1 text-[#475569]">{c.text}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAsset(drawerAsset.slug)}
                  className="px-3.5 py-2 border border-[#DDD7CB] bg-[#F6F4EF] font-semibold cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Full Property Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#9E7C3B]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
