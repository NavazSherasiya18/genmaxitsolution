import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Gavel,
  History,
  Send,
  ShieldAlert,
  XCircle,
} from 'lucide-react';
import { usePrimusStore } from '../../../context/PrimusStoreContext';
import { CommercialAsset, CommitteeSubmission } from '../../../data/primusCatalog';
import { formatPrimusMoney, runUnderwritingModel } from '../../../utils/primusFinance';
import { PrimusStatusBadge } from '../PrimusStatusBadge';

interface CommitteeCenterModuleProps {
  onOpenMemo: (asset: CommercialAsset, submission?: CommitteeSubmission | null) => void;
  onNavigateDiligence: () => void;
}

export const CommitteeCenterModule: React.FC<CommitteeCenterModuleProps> = ({
  onOpenMemo,
  onNavigateDiligence,
}) => {
  const {
    dataset,
    activeRole,
    setActiveRole,
    activeAssetId,
    setActiveAssetId,
    selectedScenarioId,
    setSelectedScenarioId,
    submitToCommittee,
    recordCommitteeDecision,
  } = usePrimusStore();

  const [submissionNote, setSubmissionNote] = useState('');
  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const asset =
    dataset.assets.find((a) => a.id === activeAssetId) || dataset.assets[0];
  const scenario = asset.scenarios[selectedScenarioId];
  const modeled = runUnderwritingModel(scenario);

  const assetTasks = dataset.diligenceTasks.filter((t) => t.assetId === asset.id);
  const reqTasks = assetTasks.filter((t) => t.required);
  const doneReqTasks = reqTasks.filter((t) => t.status === 'completed');
  const openRequiredCount = reqTasks.length - doneReqTasks.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = submitToCommittee({
      assetId: asset.id,
      scenarioId: selectedScenarioId,
      submissionNote,
    });
    if (!res.ok) {
      setBanner({ type: 'err', text: res.error || 'Submission blocked.' });
    } else {
      setSubmissionNote('');
      setBanner({
        type: 'ok',
        text: `Locked Snapshot REV-${res.data?.revisionNumber} for ${asset.name}. Switch role to Committee Reviewer below to approve or request revisions.`,
      });
    }
  };

  const handleVote = (
    submissionId: string,
    decision: 'approved' | 'rejected' | 'revision_requested'
  ) => {
    const res = recordCommitteeDecision({
      submissionId,
      decision,
      reason: decisionNotes[submissionId] || '',
    });
    if (!res.ok) {
      setBanner({ type: 'err', text: res.error || 'Decision blocked.' });
    } else {
      setBanner({
        type: 'ok',
        text: `Committee decision (${decision.replace('_', ' ')}) recorded cleanly in permanent audit log.`,
      });
    }
  };

  return (
    <div className="space-y-5">
      {banner && (
        <div
          className={`p-3.5 border text-xs flex items-center justify-between gap-3 ${
            banner.type === 'ok'
              ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
              : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            {banner.type === 'ok' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{banner.text}</span>
          </span>
          <button
            type="button"
            onClick={() => setBanner(null)}
            className="font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Submit Underwriting Package Panel */}
      <div className="bg-white border border-[#DDD7CB] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAE5DA] pb-3">
          <div>
            <h2 className="text-sm font-bold text-[#0D1829] pr-sans">
              Submit Frozen Underwriting Package to Investment Committee
            </h2>
            <p className="text-[11px] text-[#475569]">
              Submission freezes scenario assumptions &amp; return outputs into an immutable Committee revision.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenMemo(asset)}
            className="px-3.5 py-2 border border-[#DDD7CB] bg-[#F6F4EF] hover:border-[#9E7C3B] text-xs font-semibold text-[#0D1829] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#9E7C3B]" />
            <span>Preview Working IC Memo</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
          <div className="lg:col-span-4 space-y-2">
            <label className="block font-bold text-[#475569]">Target Property</label>
            <select
              value={asset.id}
              onChange={(e) => setActiveAssetId(e.target.value)}
              className="w-full h-10 px-3 bg-[#F6F4EF] border border-[#DDD7CB] text-[#0D1829] font-bold"
            >
              {dataset.assets
                .filter((a) => a.stage !== 'operating_holding')
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.code} · {a.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="lg:col-span-3 space-y-2">
            <label className="block font-bold text-[#475569]">Scenario Snapshot</label>
            <select
              value={selectedScenarioId}
              onChange={(e) => setSelectedScenarioId(e.target.value as 'base' | 'upside' | 'downside')}
              className="w-full h-10 px-3 bg-[#F6F4EF] border border-[#DDD7CB] text-[#0D1829] font-semibold"
            >
              <option value="base">Base Case</option>
              <option value="upside">Upside Case</option>
              <option value="downside">Downside Stress</option>
            </select>
          </div>

          <div className="lg:col-span-5 space-y-2">
            <label className="block font-bold text-[#475569]">Analyst Rationale / Submission Note</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={submissionNote}
                onChange={(e) => setSubmissionNote(e.target.value)}
                placeholder="e.g. Submitting Base Case after final Tuas sprinkler clear..."
                className="flex-1 h-10 px-3 bg-[#F6F4EF] border border-[#DDD7CB] text-[#0D1829]"
              />
              <button
                type="submit"
                className="px-4 h-10 bg-[#0D1829] hover:bg-[#192D4D] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-[#D6B572]" />
                <span>Submit to IC</span>
              </button>
            </div>
          </div>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#EAE5DA] text-xs pr-tabular">
          <div className="p-2.5 bg-[#F6F4EF] border border-[#DDD7CB]">
            <span className="text-[#64748B] block">Required Diligence</span>
            <strong className={openRequiredCount > 0 ? 'text-[#9A3412]' : 'text-[#065F46]'}>
              {doneReqTasks.length} / {reqTasks.length} Verified
            </strong>
            {openRequiredCount > 0 && (
              <button
                type="button"
                onClick={onNavigateDiligence}
                className="block text-[11px] font-semibold text-[#9E7C3B] hover:underline mt-0.5 cursor-pointer"
              >
                Clear Remaining ({openRequiredCount}) →
              </button>
            )}
          </div>
          <div className="p-2.5 bg-[#F6F4EF] border border-[#DDD7CB]">
            <span className="text-[#64748B] block">Scenario Exit Cap</span>
            <strong>{scenario.exitCapRatePct}% ({scenario.occupancyPct}% Occ)</strong>
          </div>
          <div className="p-2.5 bg-[#F6F4EF] border border-[#DDD7CB]">
            <span className="text-[#64748B] block">Projected IRR</span>
            <strong className="text-[#9E7C3B]">
              {modeled.leveredIrrPct !== null ? `${modeled.leveredIrrPct}%` : 'N/A'}
            </strong>
          </div>
          <div className="p-2.5 bg-[#F6F4EF] border border-[#DDD7CB]">
            <span className="text-[#64748B] block">Gross Exit Value</span>
            <strong>
              {modeled.grossExitValuation !== null
                ? formatPrimusMoney(modeled.grossExitValuation, asset.currency, true)
                : 'N/A'}
            </strong>
          </div>
        </div>
      </div>

      {/* 2. Role Check Banner & Committee Decision Queue */}
      <div className="bg-white border border-[#DDD7CB] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAE5DA] pb-3">
          <div className="flex items-center gap-2">
            <Gavel className="w-4 h-4 text-[#9E7C3B]" />
            <h2 className="text-sm font-bold text-[#0D1829] pr-sans">
              Committee Decision Queue ({dataset.submissions.length} Frozen Revisions)
            </h2>
          </div>

          {activeRole !== 'committee_reviewer' && (
            <div className="flex items-center gap-2 bg-[#FFF7ED] border border-[#FDBA74] px-3 py-1.5 text-xs text-[#9A3412]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Viewing as {activeRole.replace('_', ' ')}.</span>
              <button
                type="button"
                onClick={() => setActiveRole('committee_reviewer')}
                className="font-bold underline cursor-pointer text-[#0D1829]"
              >
                Switch Role to Committee Reviewer
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {dataset.submissions.map((sub) => {
            const subAsset = dataset.assets.find((a) => a.id === sub.assetId);
            if (!subAsset) return null;
            const isPending = sub.status === 'pending_review';
            return (
              <div
                key={sub.id}
                className={`p-4 border ${
                  isPending ? 'border-[#9E7C3B] bg-[#F6F4EF]/60' : 'border-[#DDD7CB] bg-white'
                } space-y-3`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#0D1829]">
                        {sub.id} · REV-{sub.revisionNumber}
                      </span>
                      <PrimusStatusBadge status={sub.status} />
                      <span className="text-[11px] font-semibold px-2 py-0.5 bg-white border border-[#DDD7CB] text-[#475569]">
                        Frozen: {sub.frozenAssumptions.scenarioLabel}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#0D1829] mt-1 pr-sans">
                      {subAsset.name}
                    </h3>
                    <p className="text-xs text-[#475569]">
                      Submitted {sub.submittedAtLabel} by {sub.submittedBy} · {sub.diligenceSummary}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenMemo(subAsset, sub)}
                    className="px-3.5 py-2 bg-[#0D1829] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#D6B572]" />
                    <span>Open Frozen Memo</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 bg-white border border-[#DDD7CB] p-3 text-xs pr-tabular">
                  <div>
                    <span className="text-[#64748B] block">Purchase Basis</span>
                    <strong>
                      {formatPrimusMoney(sub.frozenAssumptions.purchasePrice, subAsset.currency, true)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Occ / Exit Cap</span>
                    <strong>
                      {sub.frozenAssumptions.occupancyPct}% / {sub.frozenAssumptions.exitCapRatePct}%
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Projected IRR</span>
                    <strong className="text-[#9E7C3B]">
                      {sub.frozenResult.leveredIrrPct !== null
                        ? `${sub.frozenResult.leveredIrrPct}%`
                        : 'N/A'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Equity Multiple</span>
                    <strong>
                      {sub.frozenResult.equityMultiple !== null
                        ? `${sub.frozenResult.equityMultiple}x`
                        : 'N/A'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Gross Exit Value</span>
                    <strong>
                      {sub.frozenResult.grossExitValuation !== null
                        ? formatPrimusMoney(sub.frozenResult.grossExitValuation, subAsset.currency, true)
                        : 'N/A'}
                    </strong>
                  </div>
                </div>

                <p className="text-xs text-[#475569]">
                  <strong className="text-[#0D1829]">Analyst Submission Note:</strong>{' '}
                  {sub.submissionNote}
                </p>

                {isPending ? (
                  <div className="pt-2 border-t border-[#DDD7CB] flex flex-wrap items-center gap-2 text-xs">
                    <input
                      type="text"
                      value={decisionNotes[sub.id] || ''}
                      onChange={(e) =>
                        setDecisionNotes((prev) => ({ ...prev, [sub.id]: e.target.value }))
                      }
                      placeholder="Enter required Committee decision rationale..."
                      className="flex-1 min-w-[220px] h-9 px-3 bg-white border border-[#DDD7CB] text-[#0D1829]"
                    />
                    <button
                      type="button"
                      onClick={() => handleVote(sub.id, 'approved')}
                      className="px-3.5 h-9 bg-[#065F46] hover:bg-[#047857] text-white font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVote(sub.id, 'revision_requested')}
                      className="px-3.5 h-9 bg-[#B45309] hover:bg-[#92400E] text-white font-semibold cursor-pointer"
                    >
                      Request Revisions
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVote(sub.id, 'rejected')}
                      className="px-3.5 h-9 bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-[#EAE5DA] text-xs text-[#0D1829]">
                    <strong>
                      Recorded Decision ({sub.decisionBy} · {sub.decisionAtLabel}):
                    </strong>{' '}
                    {sub.decisionReason}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Institutional Audit Log */}
      <div className="bg-white border border-[#DDD7CB] p-5 space-y-3">
        <div className="flex items-center gap-2 border-b border-[#EAE5DA] pb-3">
          <History className="w-4 h-4 text-[#9E7C3B]" />
          <h2 className="text-sm font-bold text-[#0D1829] pr-sans">
            Platform Activity &amp; Governance Log
          </h2>
        </div>

        <div className="divide-y divide-[#EAE5DA] text-xs">
          {dataset.activityLog.map((ev) => (
            <div key={ev.id} className="py-2.5 flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-bold text-[#0D1829]">{ev.title}</p>
                <p className="text-[#475569]">{ev.detail}</p>
              </div>
              <span className="text-[11px] font-mono text-[#64748B] whitespace-nowrap">
                {ev.actor} · {ev.timestampLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
