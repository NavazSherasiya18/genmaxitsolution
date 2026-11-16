import React, { useEffect } from 'react';
import { Printer, X } from 'lucide-react';
import { HealthLinkBrandLogo } from './HealthLinkBrandLogo';
import {
  DispensingRecord,
  HealthLinkFacility,
  InvoiceRecord,
  PatientRecord,
  PrescriptionRecord,
  VisitCase,
  Clinician,
  formatCurrencyUsd,
} from '../../data/healthlinkCatalog';

export type PrintPayload =
  | {
      type: 'queue_slip';
      visit: VisitCase;
      patient: PatientRecord;
      facility: HealthLinkFacility;
      clinician?: Clinician;
    }
  | {
      type: 'case_summary';
      visit: VisitCase;
      patient: PatientRecord;
      facility: HealthLinkFacility;
      clinician?: Clinician;
      prescription?: PrescriptionRecord;
    }
  | {
      type: 'medicine_slip';
      dispense: DispensingRecord;
      prescription?: PrescriptionRecord;
      patient: PatientRecord;
      facility: HealthLinkFacility;
    }
  | {
      type: 'payment_receipt';
      invoice: InvoiceRecord;
      patient: PatientRecord;
      facility: HealthLinkFacility;
    };

export const HealthLinkPrintModal: React.FC<{
  payload: PrintPayload | null;
  onClose: () => void;
}> = ({ payload, onClose }) => {
  useEffect(() => {
    if (!payload) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [payload, onClose]);

  if (!payload) return null;

  const docTitle =
    payload.type === 'queue_slip'
      ? `Reception Queue Slip · ${payload.visit.queueToken}`
      : payload.type === 'case_summary'
      ? `Consultation & RX Summary · ${payload.visit.id}`
      : payload.type === 'medicine_slip'
      ? `Pharmacy Dispense Slip · ${payload.dispense.id}`
      : `Official Payment Receipt · ${payload.invoice.id}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2540]/60 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={docTitle}
    >
      <div className="bg-white border border-[#DCE6EE] shadow-2xl w-full max-w-2xl overflow-hidden my-6">
        {/* Toolbar (hidden when printing) */}
        <div className="hl-no-print bg-[#F7FAFC] border-b border-[#DCE6EE] px-6 py-4 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-[#0A2540]">{docTitle}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 border border-[#DCE6EE] bg-white text-[#0A2540] hover:bg-slate-50 cursor-pointer"
              aria-label="Close print preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="hl-print-sheet p-7 sm:p-9 space-y-6 text-[#0A2540]">
          {/* Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#DCE6EE]">
            <div className="space-y-2">
              <HealthLinkBrandLogo variant="full" tone="dark" size="sm" subtitle="Interactive Concept Demo" />
              <p className="text-xs text-[#475569]">
                {payload.facility.name} · {payload.facility.address} ({payload.facility.phone})
              </p>
            </div>
            <div className="text-left sm:text-right text-xs text-[#475569] hl-tabular space-y-0.5">
              <p className="font-semibold text-[#0A2540] uppercase tracking-wider">{docTitle}</p>
              <p>Patient: {payload.patient.name} ({payload.patient.id})</p>
              <p>Location: {payload.patient.cityOrVillage} · Phone: {payload.patient.phone}</p>
            </div>
          </div>

          {/* Template 1: Queue Token Slip */}
          {payload.type === 'queue_slip' && (
            <div className="space-y-5">
              <div className="bg-[#EDF7F5] border border-[#CBE8E2] p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#0F766E] font-semibold">
                    Assigned Queue Token
                  </span>
                  <div className="text-4xl font-bold font-mono text-[#0A2540] mt-1">
                    {payload.visit.queueToken}
                  </div>
                </div>
                <div className="text-right text-xs text-[#475569] hl-tabular space-y-1">
                  <p>Case ID: <strong className="text-[#0A2540]">{payload.visit.id}</strong></p>
                  <p>Checked In: {payload.visit.createdAtLabel}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs border border-[#DCE6EE] p-4">
                <div>
                  <span className="text-[#475569] block">Department</span>
                  <strong className="text-sm">{payload.visit.department}</strong>
                </div>
                <div>
                  <span className="text-[#475569] block">Consulting Clinician</span>
                  <strong className="text-sm">{payload.clinician?.name || 'On-duty Physician'}</strong>
                </div>
                <div className="col-span-2 pt-2 border-t border-[#EAEFF4]">
                  <span className="text-[#475569] block">Visit Reason</span>
                  <p className="text-sm font-medium mt-0.5">{payload.visit.visitReason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Template 2: Case Summary & Prescription */}
          {payload.type === 'case_summary' && (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7FAFC] border border-[#DCE6EE] p-3.5 hl-tabular">
                <div>
                  <span className="text-[#475569] block">BP</span>
                  <strong className="text-sm">{payload.visit.vitals.bp}</strong>
                </div>
                <div>
                  <span className="text-[#475569] block">Pulse</span>
                  <strong className="text-sm">{payload.visit.vitals.pulse}</strong>
                </div>
                <div>
                  <span className="text-[#475569] block">Temp</span>
                  <strong className="text-sm">{payload.visit.vitals.temp}</strong>
                </div>
                <div>
                  <span className="text-[#475569] block">SpO2</span>
                  <strong className="text-sm">{payload.visit.vitals.spo2}</strong>
                </div>
              </div>

              <div className="space-y-2 border border-[#DCE6EE] p-4">
                <p>
                  <strong className="text-[#0A2540]">Clinician:</strong>{' '}
                  {payload.clinician?.name || 'Clinician'} ({payload.visit.department})
                </p>
                <p>
                  <strong className="text-[#0A2540]">Diagnosis / Summary:</strong>{' '}
                  {payload.visit.diagnosis || 'Clinical assessment logged'}
                </p>
                <p>
                  <strong className="text-[#0A2540]">Clinical Notes:</strong>{' '}
                  {payload.visit.clinicalNotes || '—'}
                </p>
                <p>
                  <strong className="text-[#0A2540]">Follow-up Instructions:</strong>{' '}
                  {payload.visit.followUpInstructions || 'Return as advised'}
                </p>
              </div>

              {payload.prescription && (
                <div className="space-y-2">
                  <p className="font-semibold uppercase tracking-wider text-[#0F766E]">
                    Signed Prescription ({payload.prescription.id})
                  </p>
                  <table className="w-full border border-[#DCE6EE] text-left">
                    <thead className="bg-[#F7FAFC] border-b border-[#DCE6EE]">
                      <tr>
                        <th className="p-2.5">Medicine</th>
                        <th className="p-2.5">Directions</th>
                        <th className="p-2.5 text-right">Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payload.prescription.lines.map((line) => (
                        <tr key={line.medicineId} className="border-b border-[#EAEFF4]">
                          <td className="p-2.5 font-medium">{line.medicineName}</td>
                          <td className="p-2.5 text-[#475569]">{line.dosageInstruction}</td>
                          <td className="p-2.5 text-right font-mono">{line.prescribedQty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Template 3: Pharmacy Medicine Slip */}
          {payload.type === 'medicine_slip' && (
            <div className="space-y-4 text-xs">
              <div className="flex justify-between text-[#475569] hl-tabular">
                <span>Dispense Batch: <strong className="text-[#0A2540]">{payload.dispense.id}</strong></span>
                <span>Prescription: <strong className="text-[#0A2540]">{payload.dispense.prescriptionId}</strong></span>
                <span>Time: {payload.dispense.dispensedAtLabel}</span>
              </div>

              <table className="w-full border border-[#DCE6EE] text-left">
                <thead className="bg-[#F7FAFC] border-b border-[#DCE6EE]">
                  <tr>
                    <th className="p-2.5">Item Issued</th>
                    <th className="p-2.5 text-right">Issued Qty</th>
                    <th className="p-2.5 text-right">Unit Price</th>
                    <th className="p-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="hl-tabular">
                  {payload.dispense.items.map((item) => (
                    <tr key={item.medicineId} className="border-b border-[#EAEFF4]">
                      <td className="p-2.5 font-medium">{item.medicineName}</td>
                      <td className="p-2.5 text-right font-mono">{item.quantityIssued}</td>
                      <td className="p-2.5 text-right font-mono">{formatCurrencyUsd(item.unitPrice)}</td>
                      <td className="p-2.5 text-right font-mono font-semibold">
                        {formatCurrencyUsd(item.lineTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center pt-2 font-semibold text-sm hl-tabular">
                <span>Batch Subtotal (Demo Pharmacy Tariff)</span>
                <span>{formatCurrencyUsd(payload.dispense.batchSubtotal)}</span>
              </div>

              {payload.prescription && payload.prescription.status === 'partially_dispensed' && (
                <p className="bg-[#FFF7ED] border border-[#FDBA74] p-3 text-[#9A3412]">
                  Partial dispense note: Remaining prescribed quantities remain open on{' '}
                  {payload.prescription.id}.
                </p>
              )}
            </div>
          )}

          {/* Template 4: Payment Receipt */}
          {payload.type === 'payment_receipt' && (
            <div className="space-y-4 text-xs">
              <div className="flex flex-wrap justify-between gap-2 text-[#475569] hl-tabular">
                <span>Invoice ID: <strong className="text-[#0A2540]">{payload.invoice.id}</strong></span>
                <span>Visit ID: <strong className="text-[#0A2540]">{payload.invoice.visitId}</strong></span>
                <span>
                  Status:{' '}
                  <strong className="text-[#065F46] uppercase">{payload.invoice.status.replace('_', ' ')}</strong>
                </span>
              </div>

              <table className="w-full border border-[#DCE6EE] text-left">
                <thead className="bg-[#F7FAFC] border-b border-[#DCE6EE]">
                  <tr>
                    <th className="p-2.5">Description</th>
                    <th className="p-2.5 text-right">Qty</th>
                    <th className="p-2.5 text-right">Rate</th>
                    <th className="p-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="hl-tabular">
                  {payload.invoice.items.map((item, idx) => (
                    <tr key={`${item.description}-${idx}`} className="border-b border-[#EAEFF4]">
                      <td className="p-2.5 font-medium">{item.description}</td>
                      <td className="p-2.5 text-right font-mono">{item.quantity}</td>
                      <td className="p-2.5 text-right font-mono">{formatCurrencyUsd(item.unitPrice)}</td>
                      <td className="p-2.5 text-right font-mono">{formatCurrencyUsd(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-[#DCE6EE] pt-3 space-y-1 text-right hl-tabular">
                <p>Subtotal: <strong>{formatCurrencyUsd(payload.invoice.subtotal)}</strong></p>
                {payload.invoice.demoFacilityFee > 0 && (
                  <p>Clinic Coordination Fee: {formatCurrencyUsd(payload.invoice.demoFacilityFee)}</p>
                )}
                {payload.invoice.discountAmount > 0 && (
                  <p className="text-[#0F766E]">
                    Demo Discount: -{formatCurrencyUsd(payload.invoice.discountAmount)}
                  </p>
                )}
                <p className="text-base font-bold pt-1 text-[#0A2540]">
                  Total: {formatCurrencyUsd(payload.invoice.totalAmount)}
                </p>
                {payload.invoice.paymentMethod && (
                  <p className="text-[#475569]">
                    Settled via {payload.invoice.paymentMethod} ({payload.invoice.paidAtLabel})
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Footer Disclaimer */}
          <div className="pt-4 border-t border-[#EAEFF4] text-[11px] text-[#64748B] flex flex-wrap justify-between gap-2">
            <span>HealthLink — Interactive Concept Demo (Sample Clinical Workflow)</span>
            <span>Simulated facility record · Not a medical diagnosis</span>
          </div>
        </div>
      </div>
    </div>
  );
};
