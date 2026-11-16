import React, { useEffect } from 'react';
import { Calendar, FileText, Pill, Receipt, X } from 'lucide-react';
import { useHealthLinkStore } from '../../context/HealthLinkStoreContext';
import { HealthLinkStatusBadge } from './HealthLinkStatusBadge';
import { PrintPayload } from './HealthLinkPrintModal';
import { formatCurrencyUsd } from '../../data/healthlinkCatalog';

export const HealthLinkUnifiedTimelineModal: React.FC<{
  patientId: string | null;
  onClose: () => void;
  onPrint?: (payload: PrintPayload) => void;
}> = ({ patientId, onClose, onPrint }) => {
  const { dataset } = useHealthLinkStore();

  useEffect(() => {
    if (!patientId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [patientId, onClose]);

  if (!patientId) return null;

  const patient = dataset.patients.find((p) => p.id === patientId);
  if (!patient) return null;

  const visits = dataset.visits.filter((v) => v.patientId === patient.id);
  const appointments = dataset.appointments.filter((a) => a.patientId === patient.id);
  const invoices = dataset.invoices.filter((i) => i.patientId === patient.id);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#0A2540]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={`Unified patient timeline for ${patient.name}`}
    >
      <div className="bg-white w-full max-w-2xl h-full overflow-y-auto border-l border-[#DCE6EE] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#DCE6EE] px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0F766E]">
              Unified Patient History · {patient.id}
            </p>
            <h2 className="text-xl font-bold text-[#0A2540]">{patient.name}</h2>
            <p className="text-xs text-[#475569] mt-0.5 hl-tabular">
              {patient.age} yrs · DOB {patient.dob} · {patient.cityOrVillage} · Phone {patient.phone}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 border border-[#DCE6EE] hover:bg-slate-50 text-[#0A2540] cursor-pointer"
            aria-label="Close patient timeline"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Patient Alerts */}
          <div className="bg-[#F7FAFC] border border-[#DCE6EE] p-4 text-xs text-[#475569] flex flex-wrap gap-x-6 gap-y-2">
            <span>
              <strong className="text-[#0A2540]">Blood Group:</strong> {patient.bloodGroup}
            </span>
            <span>
              <strong className="text-[#0A2540]">Notes / Allergies:</strong> {patient.allergiesNote}
            </span>
            <span>
              <strong className="text-[#0A2540]">Registered:</strong> {patient.registeredAt}
            </span>
          </div>

          {/* Upcoming / Scheduled Appointments */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0A2540] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0D9488]" />
              <span>Appointments ({appointments.length})</span>
            </h3>
            {appointments.length === 0 ? (
              <p className="text-xs text-[#64748B]">No appointments booked yet.</p>
            ) : (
              <div className="space-y-2">
                {appointments.map((apt) => {
                  const doc = dataset.clinicians.find((c) => c.id === apt.clinicianId);
                  return (
                    <div
                      key={apt.id}
                      className="border border-[#DCE6EE] p-3.5 text-xs flex flex-wrap items-center justify-between gap-2"
                    >
                      <div>
                        <p className="font-semibold text-[#0A2540]">
                          {apt.dateIso} at {apt.timeSlot} · {apt.mode === 'telehealth' ? 'Video Visit' : 'In-Clinic'}
                        </p>
                        <p className="text-[#475569]">
                          {doc?.name} ({apt.department}) — {apt.reason}
                        </p>
                      </div>
                      <HealthLinkStatusBadge status={apt.status} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Clinical Visits, Prescriptions & Dispensing */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0A2540] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0D9488]" />
              <span>Consultation &amp; Case History ({visits.length})</span>
            </h3>
            <div className="space-y-4">
              {visits.map((v) => {
                const doc = dataset.clinicians.find((c) => c.id === v.clinicianId);
                const fac = dataset.facilities.find((f) => f.id === v.facilityId);
                const rx = dataset.prescriptions.find((p) => p.visitId === v.id);
                const dispenses = dataset.dispensingRecords.filter((d) => d.visitId === v.id);
                return (
                  <div key={v.id} className="border border-[#DCE6EE] bg-[#FCFDFE] p-4 space-y-3 text-xs">
                    <div className="flex flex-wrap items-start justify-between gap-2 pb-2.5 border-b border-[#EAEFF4]">
                      <div>
                        <p className="font-bold text-[#0A2540] hl-tabular">
                          {v.queueToken} · {v.department} ({fac?.name})
                        </p>
                        <p className="text-[#475569]">
                          {v.createdAtLabel} · {doc?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <HealthLinkStatusBadge status={v.progressStatus} />
                        {onPrint && fac && (
                          <button
                            type="button"
                            onClick={() =>
                              onPrint({
                                type: 'case_summary',
                                visit: v,
                                patient,
                                facility: fac,
                                clinician: doc,
                                prescription: rx,
                              })
                            }
                            className="px-2.5 py-1 border border-[#DCE6EE] bg-white text-[#0A2540] font-semibold hover:border-[#0D9488] cursor-pointer"
                          >
                            Print Case
                          </button>
                        )}
                      </div>
                    </div>

                    <p>
                      <strong className="text-[#0A2540]">Reason:</strong> {v.visitReason}
                    </p>
                    {v.diagnosis && (
                      <p>
                        <strong className="text-[#0A2540]">Diagnosis:</strong> {v.diagnosis}
                      </p>
                    )}
                    {v.followUpInstructions && (
                      <p>
                        <strong className="text-[#0A2540]">Follow-up:</strong> {v.followUpInstructions}
                      </p>
                    )}

                    {rx && (
                      <div className="bg-[#F7FAFC] border border-[#DCE6EE] p-3 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#0A2540] inline-flex items-center gap-1.5">
                            <Pill className="w-3.5 h-3.5 text-[#0F766E]" />
                            Prescription {rx.id}
                          </span>
                          <HealthLinkStatusBadge status={rx.status} />
                        </div>
                        <ul className="space-y-1 text-[#475569] hl-tabular">
                          {rx.lines.map((l) => (
                            <li key={l.medicineId}>
                              • <strong className="text-[#0A2540]">{l.medicineName}</strong>: issued{' '}
                              {l.dispensedQty}/{l.prescribedQty} ({l.dosageInstruction})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {dispenses.length > 0 && (
                      <p className="text-[11px] text-[#475569]">
                        Pharmacy dispensing batches: {dispenses.map((d) => d.id).join(', ')}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Invoices */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0A2540] flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#0D9488]" />
              <span>Billing &amp; Invoices ({invoices.length})</span>
            </h3>
            {invoices.length === 0 ? (
              <p className="text-xs text-[#64748B]">No invoices issued for this patient yet.</p>
            ) : (
              <div className="space-y-2">
                {invoices.map((inv) => {
                  const fac = dataset.facilities.find((f) => f.id === inv.facilityId);
                  return (
                    <div
                      key={inv.id}
                      className="border border-[#DCE6EE] p-3.5 text-xs flex flex-wrap items-center justify-between gap-2 hl-tabular"
                    >
                      <div>
                        <p className="font-bold text-[#0A2540]">
                          {inv.id} — {formatCurrencyUsd(inv.totalAmount)}
                        </p>
                        <p className="text-[#475569]">
                          Issued {inv.issuedDateIso} ({inv.items.length} items)
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <HealthLinkStatusBadge status={inv.status} />
                        {onPrint && fac && (
                          <button
                            type="button"
                            onClick={() =>
                              onPrint({
                                type: 'payment_receipt',
                                invoice: inv,
                                patient,
                                facility: fac,
                              })
                            }
                            className="px-2.5 py-1 border border-[#DCE6EE] bg-white text-[#0A2540] font-semibold hover:border-[#0D9488] cursor-pointer"
                          >
                            Receipt
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
    </div>
  );
};
