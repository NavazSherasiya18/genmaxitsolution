import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';

export const AetherConfirmResetModal: React.FC<{
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C131F]/70 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Reset Aether Fleet demo data"
    >
      <div className="bg-white border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h2 className="text-lg font-bold text-[#0C131F]">Reset Demo Fleet State?</h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 text-slate-500 hover:text-[#0C131F] cursor-pointer"
            aria-label="Cancel reset"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          This restores the initial 15 vehicles, 30 shipments across 3 Indian depots, fresh
          AFL-2048 baseline temperature readings, IoT sensor states, and clears simulated incidents
          or proof of delivery records so you can replay the guided walkthrough from step 1.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 bg-white text-xs font-semibold text-[#0C131F] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className="px-4 py-2 bg-[#0C131F] hover:bg-[#131D2E] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
