import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';

export const HealthLinkConfirmResetModal: React.FC<{
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2540]/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm reset demo data"
    >
      <div className="bg-white border border-[#DCE6EE] shadow-2xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 text-[#9A3412]">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h2 className="text-lg font-bold text-[#0A2540]">Reset HealthLink Demo Data?</h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 text-[#475569] hover:text-[#0A2540] cursor-pointer"
            aria-label="Cancel reset"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-[#475569] leading-relaxed">
          This restores the factory sample clinics (Northside General &amp; Harborview Specialist),
          patients, stock quantities (including low/zero stock items), queue tokens, prescriptions,
          and invoices in browser storage. Any walk-in or telehealth edits you made will be cleared.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-[#DCE6EE] bg-white hover:bg-slate-50 text-xs font-semibold text-[#0A2540] cursor-pointer"
          >
            Keep Current Data
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className="px-4 py-2 bg-[#9A3412] hover:bg-[#7C2D12] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
