import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  History,
  Plus,
  Printer,
  Stethoscope,
  Trash2,
  Video,
} from 'lucide-react';
import { useHealthLinkStore } from '../../../context/HealthLinkStoreContext';
import { HealthLinkStatusBadge } from '../HealthLinkStatusBadge';
import { PrintPayload } from '../HealthLinkPrintModal';
import { HealthLinkSimulatedVideoModal } from '../HealthLinkSimulatedVideoModal';

interface DoctorWorkspaceProps {
  onOpenTimeline: (patientId: string) => void;
  onPrint: (payload: PrintPayload) => void;
  onNavigateRole: (role: 'pharmacy') => void;
}

export const DoctorWorkspace: React.FC<DoctorWorkspaceProps> = ({
  onOpenTimeline,
  onPrint,
  onNavigateRole,
}) => {
  const {
    dataset,
    activeFacilityId,
    focusedVisitId,
    setFocusedVisitId,
    setFocusedPatientId,
    startConsultation,
    saveConsultation,
    startTelehealthConsultation,
    completeTelehealthVisit,
  } = useHealthLinkStore();

  const [clinicianFilter, setClinicianFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'active' | 'all'>('active');

  const facilityCases = dataset.visits.filter((v) => {
    if (v.facilityId !== activeFacilityId) return false;
    if (clinicianFilter !== 'all' && v.clinicianId !== clinicianFilter) return false;
    if (statusFilter === 'active') return v.progressStatus !== 'completed';
    return true;
  });

  const activeCase =
    dataset.visits.find((v) => v.id === focusedVisitId && v.facilityId === activeFacilityId) ||
    facilityCases[0] ||
    dataset.visits.find((v) => v.facilityId === activeFacilityId);

  const patient = activeCase
    ? dataset.patients.find((p) => p.id === activeCase.patientId)
    : undefined;
  const clinician = activeCase
    ? dataset.clinicians.find((c) => c.id === activeCase.clinicianId)
    : undefined;
  const existingRx = activeCase
    ? dataset.prescriptions.find((r) => r.visitId === activeCase.id)
    : undefined;

  const [bp, setBp] = useState('122/78');
  const [pulse, setPulse] = useState('76 bpm');
  const [temp, setTemp] = useState('98.6 °F');
  const [spo2, setSpo2] = useState('99%');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [rxLines, setRxLines] = useState<
    { medicineId: string; dosageInstruction: string; prescribedQty: number }[]
  >([
    {
      medicineId: 'MED-201',
      dosageInstruction: '1 tablet twice daily after meals for 5 days',
      prescribedQty: 10,
    },
  ]);

  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  useEffect(() => {
    if (!activeCase) return;
    setBp(activeCase.vitals.bp);
    setPulse(activeCase.vitals.pulse);
    setTemp(activeCase.vitals.temp);
    setSpo2(activeCase.vitals.spo2);
    setDiagnosis(activeCase.diagnosis || '');
    setNotes(activeCase.clinicalNotes || '');
    setFollowUp(activeCase.followUpInstructions || '');

    if (existingRx) {
      setRxLines(
        existingRx.lines.map((l) => ({
          medicineId: l.medicineId,
          dosageInstruction: l.dosageInstruction,
          prescribedQty: l.prescribedQty,
        }))
      );
    } else {
      setRxLines([
        {
          medicineId: 'MED-201',
          dosageInstruction: '1 tablet twice daily after meals for 3 days',
          prescribedQty: 6,
        },
      ]);
    }
    setFeedback(null);
  }, [activeCase?.id, existingRx?.id]);

  const facilityClinicians = dataset.clinicians.filter((c) => c.facilityId === activeFacilityId);
  const currentFacility =
    dataset.facilities.find((f) => f.id === activeFacilityId) || dataset.facilities[0];

  const handleSave = (signAndSend: boolean) => {
    if (!activeCase) return;
    setFeedback(null);
    const res = saveConsultation({
      visitId: activeCase.id,
      vitals: { bp, pulse, temp, spo2 },
      diagnosis,
      clinicalNotes: notes,
      followUpInstructions: followUp,
      prescriptionLines: rxLines,
      signAndSend,
    });

    if (!res.ok) {
      setFeedback({ type: 'err', text: res.error || 'Could not update consultation.' });
      return;
    }

    setFeedback({
      type: 'ok',
      text: signAndSend
        ? `Consultation signed and prescription ${
            res.data?.prescription?.id || ''
          } routed to Pharmacy.`
        : 'Consultation draft saved.',
    });
  };

  const rxLocked =
    existingRx?.status === 'partially_dispensed' || existingRx?.status === 'dispensed';

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

          {feedback.type === 'ok' && existingRx && (
            <button
              type="button"
              onClick={() => onNavigateRole('pharmacy')}
              className="px-3.5 py-1.5 bg-[#0F766E] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>View in Pharmacy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT QUEUE COLUMN */}
        <div className="xl:col-span-4 bg-white border border-[#DCE6EE] p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#0A2540]">Assigned Queue</h2>
              <div className="flex items-center gap-1 text-[11px] bg-[#F7FAFC] p-0.5 border border-[#DCE6EE]">
                <button
                  type="button"
                  onClick={() => setStatusFilter('active')}
                  className={`px-2 py-1 font-semibold cursor-pointer ${
                    statusFilter === 'active' ? 'bg-[#0A2540] text-white' : 'text-[#475569]'
                  }`}
                >
                  Open
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-2 py-1 font-semibold cursor-pointer ${
                    statusFilter === 'all' ? 'bg-[#0A2540] text-white' : 'text-[#475569]'
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            <select
              value={clinicianFilter}
              onChange={(e) => setClinicianFilter(e.target.value)}
              className="w-full h-9 px-2.5 bg-[#F7FAFC] border border-[#DCE6EE] text-xs text-[#0A2540]"
              aria-label="Filter queue by clinician"
            >
              <option value="all">All Clinicians ({currentFacility.name})</option>
              {facilityClinicians.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="divide-y divide-[#EAEFF4] border border-[#DCE6EE] max-h-[520px] overflow-y-auto">
            {facilityCases.length === 0 ? (
              <p className="p-5 text-xs text-[#64748B] text-center">
                No {statusFilter === 'active' ? 'open' : ''} consultations in this facility queue.
              </p>
            ) : (
              facilityCases.map((v) => {
                const pat = dataset.patients.find((p) => p.id === v.patientId);
                const doc = dataset.clinicians.find((c) => c.id === v.clinicianId);
                const selected = v.id === activeCase?.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setFocusedVisitId(v.id);
                      setFocusedPatientId(v.patientId);
                      if (v.progressStatus === 'waiting') startConsultation(v.id);
                    }}
                    className={`w-full text-left p-3.5 space-y-1.5 cursor-pointer transition-colors ${
                      selected ? 'bg-[#EDF7F5]' : 'bg-white hover:bg-[#F7FAFC]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-[#0F766E]">
                        {v.queueToken}
                      </span>
                      <HealthLinkStatusBadge status={v.progressStatus} />
                    </div>
                    <p className="text-xs font-bold text-[#0A2540]">{pat?.name}</p>
                    <p className="text-[11px] text-[#475569] truncate">
                      {doc?.name} · {v.visitReason}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT ENCOUNTER WORKBENCH */}
        <div className="xl:col-span-8 bg-white border border-[#DCE6EE] p-5 sm:p-6 space-y-6">
          {!activeCase || !patient ? (
            <div className="py-16 text-center text-sm text-[#64748B]">
              Select a patient case from the left queue or route one from Reception.
            </div>
          ) : (
            <>
              {/* Case Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#EAEFF4]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[#0F766E]">
                      {activeCase.queueToken} · {activeCase.id}
                    </span>
                    <HealthLinkStatusBadge status={activeCase.progressStatus} />
                    {existingRx && <HealthLinkStatusBadge status={existingRx.status} />}
                  </div>
                  <h2 className="text-xl font-bold text-[#0A2540]">{patient.name}</h2>
                  <p className="text-xs text-[#475569] hl-tabular">
                    {patient.id} · {patient.age}y · {patient.cityOrVillage} · Sensitivity:{' '}
                    {patient.allergiesNote}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenTimeline(patient.id)}
                    className="px-3 py-2 border border-[#DCE6EE] bg-[#F7FAFC] hover:border-[#0D9488] text-xs font-semibold text-[#0A2540] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span>Past Visits</span>
                  </button>

                  {activeCase.visitType === 'telehealth' && (
                    <button
                      type="button"
                      onClick={() => {
                        startTelehealthConsultation(activeCase.id);
                        setVideoModalOpen(true);
                      }}
                      className="px-3 py-2 bg-[#0A2540] hover:bg-[#163659] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5 text-[#5EEAD4]" />
                      <span>Open Simulated Video Room</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      onPrint({
                        type: 'case_summary',
                        visit: activeCase,
                        patient,
                        facility: currentFacility,
                        clinician,
                        prescription: existingRx,
                      })
                    }
                    className="px-3 py-2 border border-[#DCE6EE] bg-white hover:border-[#0D9488] text-xs font-semibold text-[#0A2540] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Case</span>
                  </button>
                </div>
              </div>

              {/* Chief Complaint & Vitals */}
              <div className="bg-[#F7FAFC] border border-[#DCE6EE] p-4 space-y-3 text-xs">
                <p>
                  <strong className="text-[#0A2540]">Visit Reason:</strong> {activeCase.visitReason}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 hl-tabular">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                      Blood Pressure
                    </label>
                    <input
                      type="text"
                      value={bp}
                      onChange={(e) => setBp(e.target.value)}
                      className="w-full h-9 px-2.5 bg-white border border-[#DCE6EE] font-mono text-[#0A2540]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                      Pulse
                    </label>
                    <input
                      type="text"
                      value={pulse}
                      onChange={(e) => setPulse(e.target.value)}
                      className="w-full h-9 px-2.5 bg-white border border-[#DCE6EE] font-mono text-[#0A2540]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                      Temperature
                    </label>
                    <input
                      type="text"
                      value={temp}
                      onChange={(e) => setTemp(e.target.value)}
                      className="w-full h-9 px-2.5 bg-white border border-[#DCE6EE] font-mono text-[#0A2540]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                      SpO2
                    </label>
                    <input
                      type="text"
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      className="w-full h-9 px-2.5 bg-white border border-[#DCE6EE] font-mono text-[#0A2540]"
                    />
                  </div>
                </div>
              </div>

              {/* Clinical Assessment Fields */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#0A2540] mb-1">
                    Working Diagnosis / Summary * (Sample clinical note)
                  </label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g., Acute seasonal rhinitis & mild cough (Sample)"
                    className="w-full h-10 px-3 bg-white border border-[#DCE6EE] text-[#0A2540]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#0A2540] mb-1">Clinical Notes</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Examination observations and clinician discussion..."
                      className="w-full p-2.5 bg-white border border-[#DCE6EE] text-[#0A2540]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#0A2540] mb-1">
                      Patient Follow-up Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={followUp}
                      onChange={(e) => setFollowUp(e.target.value)}
                      placeholder="Rest, hydration, and 7-day portal review..."
                      className="w-full p-2.5 bg-white border border-[#DCE6EE] text-[#0A2540]"
                    />
                  </div>
                </div>
              </div>

              {/* Prescription Line Builder */}
              <div className="border-t border-[#EAEFF4] pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0A2540] inline-flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-[#0F766E]" />
                    <span>Sample Prescription Lines</span>
                  </h3>
                  {!rxLocked && (
                    <button
                      type="button"
                      onClick={() =>
                        setRxLines((prev) => [
                          ...prev,
                          {
                            medicineId: 'MED-205',
                            dosageInstruction: '1 sachet daily in water',
                            prescribedQty: 4,
                          },
                        ])
                      }
                      className="px-3 py-1.5 border border-[#DCE6EE] bg-[#F7FAFC] text-xs font-semibold text-[#0A2540] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Medicine
                    </button>
                  )}
                </div>

                {rxLocked && (
                  <p className="text-xs text-[#9A3412] bg-[#FFF7ED] border border-[#FDBA74] p-3">
                    Prescription {existingRx?.id} has already started Pharmacy dispensing and is
                    locked from clinician edits.
                  </p>
                )}

                <div className="space-y-2.5 text-xs">
                  {rxLines.map((line, idx) => (
                    <div
                      key={`${line.medicineId}-${idx}`}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center bg-[#F7FAFC] border border-[#DCE6EE] p-3"
                    >
                      <div className="sm:col-span-5">
                        <select
                          disabled={rxLocked}
                          value={line.medicineId}
                          onChange={(e) =>
                            setRxLines((prev) =>
                              prev.map((row, i) =>
                                i === idx ? { ...row, medicineId: e.target.value } : row
                              )
                            )
                          }
                          className="w-full h-9 px-2 bg-white border border-[#DCE6EE] text-[#0A2540]"
                        >
                          {dataset.inventory.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} ({m.stockQty} stock)
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-4">
                        <input
                          disabled={rxLocked}
                          type="text"
                          value={line.dosageInstruction}
                          onChange={(e) =>
                            setRxLines((prev) =>
                              prev.map((row, i) =>
                                i === idx ? { ...row, dosageInstruction: e.target.value } : row
                              )
                            )
                          }
                          placeholder="Dosage directions"
                          className="w-full h-9 px-2.5 bg-white border border-[#DCE6EE] text-[#0A2540]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          disabled={rxLocked}
                          type="number"
                          min={1}
                          max={50}
                          value={line.prescribedQty}
                          onChange={(e) =>
                            setRxLines((prev) =>
                              prev.map((row, i) =>
                                i === idx
                                  ? { ...row, prescribedQty: Math.max(1, Number(e.target.value)) }
                                  : row
                              )
                            )
                          }
                          className="w-full h-9 px-2 bg-white border border-[#DCE6EE] font-mono text-[#0A2540]"
                        />
                      </div>
                      <div className="sm:col-span-1 text-right">
                        {!rxLocked && rxLines.length > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              setRxLines((prev) => prev.filter((_, i) => i !== idx))
                            }
                            className="p-2 text-rose-700 hover:bg-rose-50 cursor-pointer"
                            aria-label="Remove medicine line"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-3 border-t border-[#EAEFF4]">
                <button
                  type="button"
                  disabled={rxLocked}
                  onClick={() => handleSave(false)}
                  className="px-4 py-2.5 border border-[#DCE6EE] bg-white hover:bg-slate-50 disabled:opacity-50 text-xs font-semibold text-[#0A2540] cursor-pointer"
                >
                  Save Draft Notes
                </button>
                <button
                  type="button"
                  disabled={rxLocked}
                  onClick={() => handleSave(true)}
                  className="px-5 py-2.5 bg-[#0F766E] hover:bg-[#0D9488] disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Sign RX &amp; Send to Pharmacy</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Simulated Telehealth Video Consultation Room */}
      {activeCase && patient && (
        <HealthLinkSimulatedVideoModal
          open={videoModalOpen}
          viewerRole="doctor"
          clinicianName={clinician?.name || 'Attending Clinician'}
          patientName={patient.name}
          appointmentReason={activeCase.visitReason}
          queueToken={activeCase.queueToken}
          onClose={() => setVideoModalOpen(false)}
          onCompleteSession={(summary) => {
            completeTelehealthVisit({
              visitId: activeCase.id,
              diagnosis: summary.diagnosis,
              clinicalNotes: summary.clinicalNotes,
              followUpInstructions: summary.followUpInstructions,
            });
            setVideoModalOpen(false);
            setFeedback({
              type: 'ok',
              text: 'Telehealth consultation ended and follow-up summary released to Patient Portal.',
            });
          }}
        />
      )}
    </div>
  );
};
