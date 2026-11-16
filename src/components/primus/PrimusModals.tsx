import React, { useEffect } from 'react';
import { AlertTriangle, Download, Printer, RotateCcw, X } from 'lucide-react';
import {
  CommercialAsset,
  CommitteeSubmission,
  DataRoomDoc,
  DiligenceTask,
} from '../../data/primusCatalog';
import { formatPrimusMoney, runUnderwritingModel } from '../../utils/primusFinance';
import { PrimusBrandLogo } from './PrimusBrandLogo';
import { PrimusStatusBadge } from './PrimusStatusBadge';

export function downloadSampleFile(filename: string, content: string) {
  try {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch {
    // Graceful fallback
  }
}

export const PrimusDocumentPreviewModal: React.FC<{
  doc: DataRoomDoc | null;
  onClose: () => void;
}> = ({ doc, onClose }) => {
  useEffect(() => {
    if (!doc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doc, onClose]);

  if (!doc) return null;

  const isCsv = doc.fileType.includes('CSV');
  const ext = isCsv ? 'csv' : 'txt';
  const safeName = `${doc.id.toLowerCase()}_${doc.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.${ext}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#07101D]/65 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={doc.title}
    >
      <div className="bg-white border border-[#DDD7CB] shadow-2xl w-full max-w-2xl overflow-hidden my-6">
        <div className="bg-[#0D1829] text-white px-6 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-mono uppercase tracking-wider text-[#D6B572]">
              Data Room Document · {doc.id} · {doc.fileType}
            </p>
            <h2 className="text-base font-bold truncate pr-sans">{doc.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white cursor-pointer"
            aria-label="Close document preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-[#475569]">{doc.previewSummary}</p>

          <pre className="bg-[#F6F4EF] border border-[#DDD7CB] p-4 text-xs font-mono text-[#0D1829] overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {doc.sampleContent}
          </pre>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#EAE5DA]">
            <span className="text-[11px] text-[#64748B]">
              Sample concept extract · Size {doc.sizeLabel} · Updated {doc.updatedAt}
            </span>
            <button
              type="button"
              onClick={() => downloadSampleFile(safeName, doc.sampleContent)}
              className="px-4 py-2 bg-[#0D1829] hover:bg-[#192D4D] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#D6B572]" />
              <span>Download Sample ({ext.toUpperCase()})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrimusCommitteeMemoModal: React.FC<{
  open: boolean;
  asset: CommercialAsset;
  submission?: CommitteeSubmission | null;
  tasks: DiligenceTask[];
  onClose: () => void;
}> = ({ open, asset, submission, tasks, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const activeAssumptions = submission ? submission.frozenAssumptions : asset.scenarios.base;
  const activeResult = submission
    ? submission.frozenResult
    : runUnderwritingModel(activeAssumptions);

  const requiredTasks = tasks.filter((t) => t.required);
  const completedRequired = requiredTasks.filter((t) => t.status === 'completed');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#07101D]/70 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`Investment Committee Memorandum: ${asset.name}`}
    >
      <div className="bg-white border border-[#DDD7CB] shadow-2xl w-full max-w-3xl overflow-hidden my-6">
        <div className="pr-no-print bg-[#F6F4EF] border-b border-[#DDD7CB] px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0D1829]">
              {submission
                ? `Frozen Committee Revision · REV-${submission.revisionNumber}`
                : 'Working Draft Investment Committee Memo'}
            </span>
            {submission && <PrimusStatusBadge status={submission.status} />}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-[#0D1829] hover:bg-[#192D4D] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#D6B572]" />
              <span>Print Memo</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 border border-[#DDD7CB] bg-white text-[#0D1829] cursor-pointer"
              aria-label="Close memo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pr-print-sheet p-7 sm:p-10 space-y-6 text-[#0D1829]">
          {/* Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#DDD7CB]">
            <div className="space-y-1.5">
              <PrimusBrandLogo variant="full" tone="dark" size="sm" />
              <p className="text-xs text-[#475569]">
                Investment Committee Memorandum · Interactive Concept Demo
              </p>
            </div>
            <div className="text-left sm:text-right text-xs text-[#475569] pr-tabular space-y-0.5">
              <p className="font-bold text-[#0D1829]">
                {asset.code} · {asset.name}
              </p>
              <p>
                {asset.district} ({asset.currency})
              </p>
              <p>
                {submission
                  ? `Submitted ${submission.submittedAtLabel} by ${submission.submittedBy}`
                  : 'Prepared Working Scenario Draft'}
              </p>
            </div>
          </div>

          {/* Underwriting Output Summary */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#9E7C3B]">
              1. Transaction Basis &amp; Illustrative Projections ({activeAssumptions.scenarioLabel} ·{' '}
              {activeAssumptions.holdYears}-Year Hold)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F6F4EF] border border-[#DDD7CB] p-4 text-xs pr-tabular">
              <div>
                <span className="text-[#475569] block">Purchase Price</span>
                <strong className="text-sm">
                  {formatPrimusMoney(activeAssumptions.purchasePrice, asset.currency, true)}
                </strong>
              </div>
              <div>
                <span className="text-[#475569] block">Entry Cap Rate</span>
                <strong className="text-sm">
                  {activeResult.entryCapRatePct !== null
                    ? `${activeResult.entryCapRatePct}%`
                    : 'N/A'}
                </strong>
              </div>
              <div>
                <span className="text-[#475569] block">Projected Levered IRR</span>
                <strong className="text-sm text-[#9E7C3B]">
                  {activeResult.leveredIrrPct !== null
                    ? `${activeResult.leveredIrrPct}%`
                    : 'N/A'}
                </strong>
              </div>
              <div>
                <span className="text-[#475569] block">Projected Equity Multiple</span>
                <strong className="text-sm">
                  {activeResult.equityMultiple !== null
                    ? `${activeResult.equityMultiple}x`
                    : 'N/A'}
                </strong>
              </div>
              <div>
                <span className="text-[#475569] block">Stabilized Occupancy</span>
                <strong className="text-sm">{activeAssumptions.occupancyPct}%</strong>
              </div>
              <div>
                <span className="text-[#475569] block">Exit Cap Rate</span>
                <strong className="text-sm">{activeAssumptions.exitCapRatePct}%</strong>
              </div>
              <div>
                <span className="text-[#475569] block">Gross Exit Valuation</span>
                <strong className="text-sm">
                  {activeResult.grossExitValuation !== null
                    ? formatPrimusMoney(activeResult.grossExitValuation, asset.currency, true)
                    : 'N/A'}
                </strong>
              </div>
              <div>
                <span className="text-[#475569] block">Year-1 DSCR</span>
                <strong className="text-sm">
                  {activeResult.year1Dscr !== null ? `${activeResult.year1Dscr}x` : 'N/A'}
                </strong>
              </div>
            </div>
          </div>

          {/* Diligence Verification */}
          <div className="space-y-2 text-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-[#9E7C3B]">
              2. Required Diligence Readiness ({completedRequired.length} of {requiredTasks.length}{' '}
              Verified)
            </p>
            <div className="border border-[#DDD7CB] divide-y divide-[#EAE5DA]">
              {tasks.map((t) => (
                <div key={t.id} className="p-2.5 flex items-center justify-between gap-2">
                  <span>
                    <strong className="text-[#0D1829]">[{t.category}]</strong> {t.title}{' '}
                    {t.required && <span className="text-[#9E7C3B] font-semibold">(Required)</span>}
                  </span>
                  <PrimusStatusBadge status={t.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Submission Note & Decision Record */}
          {submission && (
            <div className="border border-[#DDD7CB] bg-[#F6F4EF] p-4 space-y-2 text-xs">
              <p>
                <strong>Analyst Submission Note:</strong> {submission.submissionNote}
              </p>
              {submission.decisionReason && (
                <p className="pt-2 border-t border-[#DDD7CB]">
                  <strong>
                    Committee Decision ({submission.decisionBy} · {submission.decisionAtLabel}):
                  </strong>{' '}
                  {submission.decisionReason}
                </p>
              )}
            </div>
          )}

          <div className="pt-3 border-t border-[#EAE5DA] text-[11px] text-[#64748B] flex flex-wrap justify-between gap-2">
            <span>Primus Capital · Illustrative Projections Only (Interactive Concept Demo)</span>
            <span>All properties, entities &amp; figures are fictional sample data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrimusConfirmResetModal: React.FC<{
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}> = ({ open, onCancel, onConfirm }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#07101D]/65 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Reset Primus Capital demo data"
    >
      <div className="bg-white border border-[#DDD7CB] shadow-2xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-[#9E7C3B]">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h2 className="text-lg font-bold text-[#0D1829] pr-sans">Reset Demo Workspace?</h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 text-[#475569] hover:text-[#0D1829] cursor-pointer"
            aria-label="Cancel reset"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-[#475569] leading-relaxed">
          This restores the factory 12 London and Singapore assets, Meridian Logistics Park scenario
          assumptions, open required diligence task, Committee queue, and watchlist in browser
          storage so you can replay the guided walkthrough cleanly.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-[#DDD7CB] bg-white text-xs font-semibold text-[#0D1829] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className="px-4 py-2 bg-[#0D1829] hover:bg-[#192D4D] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#D6B572]" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
