import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Printer,
  Receipt,
} from 'lucide-react';
import { useHealthLinkStore } from '../../../context/HealthLinkStoreContext';
import { HealthLinkStatusBadge } from '../HealthLinkStatusBadge';
import { PrintPayload } from '../HealthLinkPrintModal';
import { formatCurrencyUsd } from '../../../data/healthlinkCatalog';

interface BillingWorkspaceProps {
  onPrint: (payload: PrintPayload) => void;
  onOpenPatientPortal: (patientId: string) => void;
}

export const BillingWorkspace: React.FC<BillingWorkspaceProps> = ({
  onPrint,
  onOpenPatientPortal,
}) => {
  const {
    dataset,
    activeFacilityId,
    focusedVisitId,
    setFocusedVisitId,
    generateInvoiceForVisit,
    recordInvoicePayment,
  } = useHealthLinkStore();

  const [demoFacilityFee, setDemoFacilityFee] = useState('5');
  const [discountAmount, setDiscountAmount] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState('Demo Card •••• 4242');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const facilityVisits = dataset.visits.filter((v) => v.facilityId === activeFacilityId);
  const currentFacility =
    dataset.facilities.find((f) => f.id === activeFacilityId) || dataset.facilities[0];

  const pendingOrBilledVisits = facilityVisits.filter((v) => {
    const hasUnbilledBatch = dataset.dispensingRecords.some(
      (d) => d.visitId === v.id && d.billedInvoiceId === null
    );
    return !v.consultationBilled || hasUnbilledBatch;
  });

  const selectedVisit =
    facilityVisits.find((v) => v.id === focusedVisitId) ||
    pendingOrBilledVisits[0] ||
    facilityVisits[0];

  const unbilledBatches = selectedVisit
    ? dataset.dispensingRecords.filter(
        (d) => d.visitId === selectedVisit.id && d.billedInvoiceId === null
      )
    : [];

  const facilityInvoices = dataset.invoices.filter((i) => i.facilityId === activeFacilityId);

  const handleGenerateInvoice = () => {
    if (!selectedVisit || submitting) return;
    setSubmitting(true);
    setFeedback(null);
    const res = generateInvoiceForVisit({
      visitId: selectedVisit.id,
      demoFacilityFee: Number(demoFacilityFee || 0),
      discountAmount: Number(discountAmount || 0),
    });
    setSubmitting(false);

    if (!res.ok || !res.data) {
      setFeedback({ type: 'err', text: res.error || 'Could not generate invoice.' });
      return;
    }

    setFeedback({
      type: 'ok',
      text: `Created invoice ${res.data.id} ($${res.data.totalAmount.toFixed(
        2
      )}) with all unbilled items.`,
    });
  };

  const handlePayInvoice = (invoiceId: string) => {
    if (submitting) return;
    setSubmitting(true);
    setFeedback(null);
    const res = recordInvoicePayment({ invoiceId, method: paymentMethod });
    setSubmitting(false);
    if (!res.ok) {
      setFeedback({ type: 'err', text: res.error || 'Could not record payment.' });
      return;
    }
    setFeedback({
      type: 'ok',
      text: `Simulated payment recorded for ${invoiceId}. Updated receipt ready in Billing & Patient Portal.`,
    });
  };

  return (
    <div className="space-y-6">
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

          {feedback.type === 'ok' && selectedVisit && (
            <button
              type="button"
              onClick={() => onOpenPatientPortal(selectedVisit.patientId)}
              className="px-3.5 py-1.5 bg-[#0A2540] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Inspect Patient Portal</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#5EEAD4]" />
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT: Generate Incremental Invoice */}
        <div className="xl:col-span-5 bg-white border border-[#DCE6EE] p-5 space-y-4">
          <div className="border-b border-[#EAEFF4] pb-3">
            <h2 className="text-base font-bold text-[#0A2540] inline-flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#0F766E]" />
              Generate Itemized Invoice
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">
              Pulls unbilled consultation &amp; dispensed pharmacy batches once—supporting partial
              dispensing safely.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label
                htmlFor="hl-bill-visit"
                className="block font-semibold text-[#475569] mb-1"
              >
                Select Visit Case ({currentFacility.name})
              </label>
              <select
                id="hl-bill-visit"
                value={selectedVisit?.id || ''}
                onChange={(e) => setFocusedVisitId(e.target.value)}
                className="w-full h-10 px-2.5 bg-white border border-[#DCE6EE] text-[#0A2540]"
              >
                {facilityVisits.map((v) => {
                  const p = dataset.patients.find((pt) => pt.id === v.patientId);
                  const unbilled = dataset.dispensingRecords.some(
                    (d) => d.visitId === v.id && d.billedInvoiceId === null
                  );
                  const tag =
                    !v.consultationBilled || unbilled ? 'Unbilled items ready' : 'Fully invoiced';
                  return (
                    <option key={v.id} value={v.id}>
                      {v.queueToken} · {p?.name} ({tag})
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedVisit && (
              <div className="bg-[#F7FAFC] border border-[#DCE6EE] p-4 space-y-2 hl-tabular">
                <p className="font-bold text-[#0A2540]">Pending Charges Preview</p>
                {!selectedVisit.consultationBilled ? (
                  <div className="flex justify-between">
                    <span>Doctor Consultation ({selectedVisit.department})</span>
                    <span className="font-mono font-semibold">
                      {formatCurrencyUsd(selectedVisit.consultationFee)}
                    </span>
                  </div>
                ) : (
                  <p className="text-[#64748B]">• Consultation fee already invoiced.</p>
                )}

                {unbilledBatches.length > 0 ? (
                  unbilledBatches.map((b) => (
                    <div key={b.id} className="space-y-1 pt-1 border-t border-[#EAEFF4]">
                      <p className="font-semibold text-[#0F766E]">
                        Unbilled Dispense Batch {b.id}
                      </p>
                      {b.items.map((item) => (
                        <div key={item.medicineId} className="flex justify-between">
                          <span>
                            {item.quantityIssued}× {item.medicineName}
                          </span>
                          <span className="font-mono">{formatCurrencyUsd(item.lineTotal)}</span>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <p className="text-[#64748B]">• No unbilled pharmacy batches pending.</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Demo Coordination Fee ($)
                </label>
                <input
                  type="number"
                  min={0}
                  step="1"
                  value={demoFacilityFee}
                  onChange={(e) => setDemoFacilityFee(e.target.value)}
                  className="w-full h-9 px-2.5 bg-white border border-[#DCE6EE] font-mono text-[#0A2540]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#475569] mb-1">
                  Demo Discount ($)
                </label>
                <input
                  type="number"
                  min={0}
                  step="1"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  className="w-full h-9 px-2.5 bg-white border border-[#DCE6EE] font-mono text-[#0A2540]"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={submitting || !selectedVisit}
              onClick={handleGenerateInvoice}
              className="w-full py-3 px-4 bg-[#0F766E] hover:bg-[#0D9488] disabled:bg-slate-400 text-white font-semibold cursor-pointer"
            >
              Generate Invoice
            </button>
          </div>
        </div>

        {/* RIGHT: Invoices Ledger & Simulated Payment */}
        <div className="xl:col-span-7 bg-white border border-[#DCE6EE] p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAEFF4] pb-3">
            <h2 className="text-base font-bold text-[#0A2540]">
              Facility Invoices &amp; Receipts ({facilityInvoices.length})
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <label htmlFor="hl-pay-method" className="text-[#475569] font-semibold">
                Demo Tender:
              </label>
              <select
                id="hl-pay-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-8 px-2 bg-[#F7FAFC] border border-[#DCE6EE] text-[#0A2540]"
              >
                <option>Demo Card •••• 4242</option>
                <option>Demo UPI / Instant</option>
                <option>Clinic Counter Cash</option>
              </select>
            </div>
          </div>

          {facilityInvoices.length === 0 ? (
            <p className="text-xs text-[#64748B] py-8 text-center">
              No invoices created at {currentFacility.name} yet.
            </p>
          ) : (
            <div className="space-y-3">
              {facilityInvoices.map((inv) => {
                const pat = dataset.patients.find((p) => p.id === inv.patientId);
                return (
                  <div
                    key={inv.id}
                    className="border border-[#DCE6EE] bg-[#FCFDFE] p-4 space-y-3 text-xs hl-tabular"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-bold text-[#0A2540]">
                          <span className="font-mono text-[#0F766E] mr-2">{inv.id}</span>
                          {pat?.name} ({pat?.id})
                        </p>
                        <p className="text-[#475569]">
                          Visit {inv.visitId} · {inv.issuedDateIso} at {inv.issuedTimeLabel}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold font-mono text-[#0A2540]">
                          {formatCurrencyUsd(inv.totalAmount)}
                        </span>
                        <HealthLinkStatusBadge status={inv.status} />
                      </div>
                    </div>

                    <ul className="text-[11px] text-[#475569] space-y-1 border-t border-[#EAEFF4] pt-2">
                      {inv.items.map((item, idx) => (
                        <li key={`${item.description}-${idx}`} className="flex justify-between">
                          <span>
                            {item.quantity}× {item.description}
                          </span>
                          <span className="font-mono">{formatCurrencyUsd(item.amount)}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#EAEFF4]">
                      {pat && (
                        <button
                          type="button"
                          onClick={() =>
                            onPrint({
                              type: 'payment_receipt',
                              invoice: inv,
                              patient: pat,
                              facility: currentFacility,
                            })
                          }
                          className="px-3 py-1.5 border border-[#DCE6EE] bg-white hover:border-[#0D9488] text-[#0A2540] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Receipt</span>
                        </button>
                      )}

                      {inv.status === 'pending_payment' && (
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => handlePayInvoice(inv.id)}
                          className="px-3.5 py-1.5 bg-[#0F766E] hover:bg-[#0D9488] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Record Simulated Payment</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
