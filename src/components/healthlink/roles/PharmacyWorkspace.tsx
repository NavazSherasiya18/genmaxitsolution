import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Package,
  Pill,
  Printer,
} from 'lucide-react';
import { useHealthLinkStore } from '../../../context/HealthLinkStoreContext';
import { HealthLinkStatusBadge } from '../HealthLinkStatusBadge';
import { PrintPayload } from '../HealthLinkPrintModal';
import { DispensingRecord, formatCurrencyUsd } from '../../../data/healthlinkCatalog';

interface PharmacyWorkspaceProps {
  onPrint: (payload: PrintPayload) => void;
  onNavigateRole: (role: 'billing') => void;
}

export const PharmacyWorkspace: React.FC<PharmacyWorkspaceProps> = ({
  onPrint,
  onNavigateRole,
}) => {
  const { dataset, activeFacilityId, dispensePrescription, setFocusedVisitId } =
    useHealthLinkStore();

  const [tab, setTab] = useState<'queue' | 'inventory'>('queue');
  const [selectedRxId, setSelectedRxId] = useState<string>('');
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lastBatch, setLastBatch] = useState<DispensingRecord | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const rxList = dataset.prescriptions.filter(
    (rx) => rx.facilityId === activeFacilityId && rx.status !== 'draft'
  );
  const selectedRx = rxList.find((r) => r.id === selectedRxId) || rxList[0];

  useEffect(() => {
    if (!selectedRx) {
      setAllocations({});
      return;
    }
    const init: Record<string, number> = {};
    selectedRx.lines.forEach((line) => {
      const inv = dataset.inventory.find((m) => m.id === line.medicineId);
      const remaining = Math.max(0, line.prescribedQty - line.dispensedQty);
      const maxAllowed = Math.min(remaining, inv?.stockQty ?? 0);
      init[line.medicineId] = maxAllowed;
    });
    setAllocations(init);
    setFeedback(null);
  }, [selectedRx?.id, dataset.inventory]);

  const currentFacility =
    dataset.facilities.find((f) => f.id === activeFacilityId) || dataset.facilities[0];

  const handleDispense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRx || submitting) return;
    setSubmitting(true);
    setFeedback(null);

    const payload = selectedRx.lines.map((l) => ({
      medicineId: l.medicineId,
      quantity: Math.max(0, Math.round(allocations[l.medicineId] || 0)),
    }));

    const res = dispensePrescription({
      prescriptionId: selectedRx.id,
      allocations: payload,
      pharmacistNote: note,
    });

    setSubmitting(false);

    if (!res.ok || !res.data) {
      setFeedback({ type: 'err', text: res.error || 'Could not dispense prescription.' });
      return;
    }

    setLastBatch(res.data);
    setNote('');
    setFeedback({
      type: 'ok',
      text: `Recorded batch ${res.data.id} ($${res.data.batchSubtotal.toFixed(
        2
      )}). Inventory deducted cleanly.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex bg-white border border-[#DCE6EE] p-1">
          <button
            type="button"
            onClick={() => setTab('queue')}
            className={`px-4 py-2 text-xs font-semibold cursor-pointer ${
              tab === 'queue' ? 'bg-[#0A2540] text-white' : 'text-[#475569] hover:text-[#0A2540]'
            }`}
          >
            Prescription Queue ({rxList.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('inventory')}
            className={`px-4 py-2 text-xs font-semibold cursor-pointer ${
              tab === 'inventory'
                ? 'bg-[#0A2540] text-white'
                : 'text-[#475569] hover:text-[#0A2540]'
            }`}
          >
            Pharmacy Stock Ledger ({dataset.inventory.length})
          </button>
        </div>
      </div>

      {feedback && (
        <div
          role={feedback.type === 'err' ? 'alert' : 'status'}
          className={`p-4 border text-xs flex flex-wrap items-center justify-between gap-3 ${
            feedback.type === 'err'
              ? 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
              : 'bg-[#EDF7F5] border-[#CBE8E2] text-[#0F766E]'
          }`}
        >
          <span className="inline-flex items-center gap-2 font-medium">
            {feedback.type === 'err' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            {feedback.text}
          </span>

          {feedback.type === 'ok' && lastBatch && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const p = dataset.patients.find((pt) => pt.id === lastBatch.patientId)!;
                  const rx = dataset.prescriptions.find((r) => r.id === lastBatch.prescriptionId);
                  onPrint({
                    type: 'medicine_slip',
                    dispense: lastBatch,
                    prescription: rx,
                    patient: p,
                    facility: currentFacility,
                  });
                }}
                className="px-3 py-1.5 bg-white border border-[#CBE8E2] text-[#0A2540] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Medicine Slip
              </button>
              <button
                type="button"
                onClick={() => {
                  setFocusedVisitId(lastBatch.visitId);
                  onNavigateRole('billing');
                }}
                className="px-3 py-1.5 bg-[#0F766E] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Generate Invoice in Billing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {tab === 'queue' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Prescriptions Queue List */}
          <div className="xl:col-span-5 bg-white border border-[#DCE6EE] p-4 space-y-3">
            <h2 className="text-sm font-bold text-[#0A2540]">
              Signed Prescriptions ({currentFacility.name})
            </h2>
            <div className="divide-y divide-[#EAEFF4] border border-[#DCE6EE]">
              {rxList.length === 0 ? (
                <p className="p-5 text-xs text-[#64748B] text-center">
                  No signed prescriptions at {currentFacility.name} yet. Sign one in the Doctor
                  workspace or switch facilities.
                </p>
              ) : (
                rxList.map((rx) => {
                  const pat = dataset.patients.find((p) => p.id === rx.patientId);
                  const active = rx.id === selectedRx?.id;
                  return (
                    <button
                      key={rx.id}
                      type="button"
                      onClick={() => setSelectedRxId(rx.id)}
                      className={`w-full text-left p-3.5 space-y-1.5 cursor-pointer transition-colors ${
                        active ? 'bg-[#EDF7F5]' : 'bg-white hover:bg-[#F7FAFC]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-[#0F766E]">{rx.id}</span>
                        <HealthLinkStatusBadge status={rx.status} />
                      </div>
                      <p className="text-xs font-bold text-[#0A2540]">
                        {pat?.name} ({pat?.id})
                      </p>
                      <p className="text-[11px] text-[#475569]">
                        {rx.lines.length} medicine line(s) · {rx.createdDateIso}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Dispensing Workbench */}
          <div className="xl:col-span-7 bg-white border border-[#DCE6EE] p-5 sm:p-6 space-y-5">
            {!selectedRx ? (
              <p className="text-xs text-[#64748B] py-12 text-center">
                Select a prescription to review quantities and dispense.
              </p>
            ) : (
              <form onSubmit={handleDispense} className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-[#EAEFF4]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-[#0F766E]">
                        {selectedRx.id} · Visit {selectedRx.visitId}
                      </span>
                      <HealthLinkStatusBadge status={selectedRx.status} />
                    </div>
                    <h2 className="text-lg font-bold text-[#0A2540]">
                      {dataset.patients.find((p) => p.id === selectedRx.patientId)?.name}
                    </h2>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-[#DCE6EE]">
                    <thead className="bg-[#F7FAFC] border-b border-[#DCE6EE] text-[#475569]">
                      <tr>
                        <th className="p-3">Medication</th>
                        <th className="p-3 text-right">Prescribed</th>
                        <th className="p-3 text-right">Issued</th>
                        <th className="p-3 text-right">Balance</th>
                        <th className="p-3 text-right">In Stock</th>
                        <th className="p-3 text-right">Issue Now</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAEFF4] hl-tabular">
                      {selectedRx.lines.map((line) => {
                        const inv = dataset.inventory.find((m) => m.id === line.medicineId);
                        const stock = inv?.stockQty ?? 0;
                        const remaining = Math.max(0, line.prescribedQty - line.dispensedQty);
                        const maxAllowed = Math.min(remaining, stock);
                        const val = allocations[line.medicineId] ?? 0;

                        return (
                          <tr key={line.medicineId}>
                            <td className="p-3">
                              <p className="font-bold text-[#0A2540]">{line.medicineName}</p>
                              <p className="text-[11px] text-[#64748B]">{line.dosageInstruction}</p>
                            </td>
                            <td className="p-3 text-right font-mono">{line.prescribedQty}</td>
                            <td className="p-3 text-right font-mono">{line.dispensedQty}</td>
                            <td className="p-3 text-right font-mono font-semibold text-[#0A2540]">
                              {remaining}
                            </td>
                            <td className="p-3 text-right">
                              {stock === 0 ? (
                                <HealthLinkStatusBadge status="out_of_stock" />
                              ) : (
                                <span className="font-mono font-semibold text-[#0F766E]">
                                  {stock}
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <input
                                type="number"
                                min={0}
                                max={maxAllowed}
                                disabled={selectedRx.status === 'dispensed' || remaining === 0 || stock === 0}
                                value={val}
                                onChange={(e) => {
                                  const nextQty = Math.max(
                                    0,
                                    Math.min(maxAllowed, Number(e.target.value))
                                  );
                                  setAllocations((prev) => ({
                                    ...prev,
                                    [line.medicineId]: nextQty,
                                  }));
                                }}
                                className="w-16 h-8 px-2 text-right bg-white border border-[#DCE6EE] font-mono text-[#0A2540] disabled:bg-slate-100"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {selectedRx.status !== 'dispensed' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1">
                        Pharmacist Dispensing Note (Optional)
                      </label>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="e.g., Partial issue on PulmoEase; remaining balance held."
                        className="w-full h-9 px-3 bg-white border border-[#DCE6EE] text-xs text-[#0A2540]"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#EAEFF4]">
                      <p className="text-[11px] text-[#475569]">
                        Supports full or partial issue; cannot exceed balance or available stock.
                      </p>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2.5 bg-[#0F766E] hover:bg-[#0D9488] disabled:bg-slate-400 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Pill className="w-4 h-4" />
                        <span>Record Dispense &amp; Update Stock</span>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      ) : (
        /* STOCK LEDGER */
        <div className="bg-white border border-[#DCE6EE] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0A2540] inline-flex items-center gap-2">
              <Package className="w-4 h-4 text-[#0F766E]" />
              Dispensary Inventory Ledger (Shared Across Demo Facilities)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#DCE6EE]">
              <thead className="bg-[#F7FAFC] border-b border-[#DCE6EE] text-[#475569]">
                <tr>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Catalog Item</th>
                  <th className="p-3">Strength</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Available</th>
                  <th className="p-3">Stock State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEFF4] hl-tabular">
                {dataset.inventory.map((m) => {
                  const status =
                    m.stockQty === 0
                      ? 'out_of_stock'
                      : m.stockQty <= m.reorderThreshold
                      ? 'low_stock'
                      : 'in_stock';
                  return (
                    <tr key={m.id}>
                      <td className="p-3 font-mono font-semibold text-[#0F766E]">{m.id}</td>
                      <td className="p-3 font-bold text-[#0A2540]">
                        {m.name} ({m.form})
                      </td>
                      <td className="p-3 text-[#475569]">{m.strength}</td>
                      <td className="p-3 text-right font-mono">{formatCurrencyUsd(m.unitPrice)}</td>
                      <td className="p-3 text-right font-mono font-bold text-[#0A2540]">
                        {m.stockQty}
                      </td>
                      <td className="p-3">
                        <HealthLinkStatusBadge status={status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
