import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  History,
  Printer,
  Search,
  UserPlus,
} from 'lucide-react';
import { useHealthLinkStore } from '../../../context/HealthLinkStoreContext';
import { HealthLinkStatusBadge } from '../HealthLinkStatusBadge';
import { PrintPayload } from '../HealthLinkPrintModal';
import { getDemoTodayIso, VisitCase } from '../../../data/healthlinkCatalog';

interface ReceptionWorkspaceProps {
  onOpenTimeline: (patientId: string) => void;
  onPrint: (payload: PrintPayload) => void;
  onNavigateRole: (role: 'doctor') => void;
}

export const ReceptionWorkspace: React.FC<ReceptionWorkspaceProps> = ({
  onOpenTimeline,
  onPrint,
  onNavigateRole,
}) => {
  const {
    dataset,
    activeFacilityId,
    focusedPatientId,
    setFocusedPatientId,
    setFocusedVisitId,
    registerPatient,
    createWalkInVisit,
    checkInAppointment,
  } = useHealthLinkStore();

  const today = getDemoTodayIso();
  const [searchQuery, setSearchQuery] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // New Patient Registration State
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('32');
  const [newDob, setNewDob] = useState('1994-06-15');
  const [newCity, setNewCity] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAllergies, setNewAllergies] = useState('');

  // Walk-in Consultation Form State
  const selectedPatient =
    dataset.patients.find((p) => p.id === focusedPatientId) || dataset.patients[0];

  const facilityClinicians = dataset.clinicians.filter(
    (c) => c.facilityId === activeFacilityId
  );
  const currentFacility =
    dataset.facilities.find((f) => f.id === activeFacilityId) || dataset.facilities[0];

  const [selectedDept, setSelectedDept] = useState(currentFacility.departments[0]);
  const [selectedClinicianId, setSelectedClinicianId] = useState(
    facilityClinicians[0]?.id || dataset.clinicians[0].id
  );
  const [visitReason, setVisitReason] = useState('Routine consultation & vitals check');

  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [lastIssuedVisit, setLastIssuedVisit] = useState<VisitCase | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const effectiveClinician =
    facilityClinicians.find((c) => c.id === selectedClinicianId) || facilityClinicians[0];

  const filteredPatients = dataset.patients.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.cityOrVillage.toLowerCase().includes(q)
    );
  });

  const todayVisits = dataset.visits.filter(
    (v) => v.visitDateIso === today && v.facilityId === activeFacilityId
  );

  const scheduledAppointments = dataset.appointments.filter(
    (a) => a.facilityId === activeFacilityId && a.status === 'scheduled'
  );

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const res = registerPatient({
      name: newName,
      age: Number(newAge),
      dob: newDob,
      cityOrVillage: newCity,
      phone: newPhone,
      allergiesNote: newAllergies,
    });
    if (!res.ok) {
      setFeedback({ type: 'err', text: res.error || 'Could not register patient.' });
      return;
    }
    setFeedback({
      type: 'ok',
      text: `Registered ${res.data?.name} (${res.data?.id}). Ready for walk-in case assignment.`,
    });
    setNewName('');
    setNewCity('');
    setNewPhone('');
    setNewAllergies('');
    setShowRegisterForm(false);
  };

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !selectedPatient || !effectiveClinician) return;
    setSubmitting(true);
    setFeedback(null);

    const res = createWalkInVisit({
      patientId: selectedPatient.id,
      facilityId: activeFacilityId,
      department: effectiveClinician.department,
      clinicianId: effectiveClinician.id,
      visitReason,
    });

    setSubmitting(false);

    if (!res.ok || !res.data) {
      setFeedback({ type: 'err', text: res.error || 'Unable to generate queue token.' });
      return;
    }

    setLastIssuedVisit(res.data);
    setFeedback({
      type: 'ok',
      text: `Queue token ${res.data.queueToken} generated for ${selectedPatient.name} and routed to ${effectiveClinician.name}.`,
    });
  };

  const handleCheckInAppointment = (aptId: string) => {
    setFeedback(null);
    const res = checkInAppointment(aptId);
    if (!res.ok || !res.data) {
      setFeedback({ type: 'err', text: res.error || 'Could not check in appointment.' });
      return;
    }
    setLastIssuedVisit(res.data);
    setFeedback({
      type: 'ok',
      text: `Checked in appointment — Queue token ${res.data.queueToken} assigned.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Status Banner */}
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

          {feedback.type === 'ok' && lastIssuedVisit && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const p = dataset.patients.find((pt) => pt.id === lastIssuedVisit.patientId)!;
                  const f = dataset.facilities.find((fc) => fc.id === lastIssuedVisit.facilityId)!;
                  const c = dataset.clinicians.find((cl) => cl.id === lastIssuedVisit.clinicianId);
                  onPrint({
                    type: 'queue_slip',
                    visit: lastIssuedVisit,
                    patient: p,
                    facility: f,
                    clinician: c,
                  });
                }}
                className="px-3 py-1.5 bg-white border border-[#CBE8E2] text-[#0A2540] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Reception Slip
              </button>
              <button
                type="button"
                onClick={() => {
                  setFocusedVisitId(lastIssuedVisit.id);
                  onNavigateRole('doctor');
                }}
                className="px-3 py-1.5 bg-[#0F766E] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Assigned Doctor Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Top Split: Patient Directory & Walk-In Token Assignment */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Search Directory + Register Toggle */}
        <div className="xl:col-span-6 bg-white border border-[#DCE6EE] p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#0A2540]">Patient Directory Search</h2>
              <p className="text-xs text-[#475569]">
                Search by name, ID (e.g. PT-1042), or sample phone number.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowRegisterForm((s) => !s)}
              className="px-3 py-2 border border-[#DCE6EE] bg-[#F7FAFC] hover:border-[#0D9488] text-xs font-semibold text-[#0A2540] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{showRegisterForm ? 'Close Form' : 'Register New Patient'}</span>
            </button>
          </div>

          {showRegisterForm && (
            <form
              onSubmit={handleRegisterSubmit}
              className="bg-[#F7FAFC] border border-[#DCE6EE] p-4 space-y-3 text-xs"
            >
              <p className="font-bold text-[#0A2540]">New Outpatient Registration (Demo)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#475569] mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Priya Nair"
                    className="w-full h-9 px-2.5 bg-white border border-[#DCE6EE] text-[#0A2540]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#475569] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="9820112233"
                    className="w-full h-9 px-2.5 bg-white border border-[#DCE6EE] text-[#0A2540]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#475569] mb-1">Age (Years)</label>
                  <input
                    type="number"
                    min={0}
                    max={120}
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full h-9 px-2.5 bg-white border border-[#DCE6EE] text-[#0A2540] hl-tabular"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#475569] mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={newDob}
                    onChange={(e) => setNewDob(e.target.value)}
                    className="w-full h-9 px-2.5 bg-white border border-[#DCE6EE] text-[#0A2540] hl-tabular"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#475569] mb-1">Village / City *</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="Kothrud, Pune"
                    className="w-full h-9 px-2.5 bg-white border border-[#DCE6EE] text-[#0A2540]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#475569] mb-1">Allergy Note</label>
                  <input
                    type="text"
                    value={newAllergies}
                    onChange={(e) => setNewAllergies(e.target.value)}
                    placeholder="None noted"
                    className="w-full h-9 px-2.5 bg-white border border-[#DCE6EE] text-[#0A2540]"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0F766E] hover:bg-[#0D9488] text-white font-semibold cursor-pointer"
              >
                Save Patient to Directory
              </button>
            </form>
          )}

          {/* Search Field */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients by name, PT-ID, phone, or city..."
              className="w-full h-10 pl-9 pr-3 bg-[#F7FAFC] border border-[#DCE6EE] text-sm text-[#0A2540]"
            />
          </div>

          {/* Patient List */}
          <div className="divide-y divide-[#EAEFF4] border border-[#DCE6EE] max-h-80 overflow-y-auto">
            {filteredPatients.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#64748B]">
                No patients match “{searchQuery}”. Register a new patient above or clear search.
              </div>
            ) : (
              filteredPatients.map((p) => {
                const isSelected = p.id === selectedPatient?.id;
                const priorCount = dataset.visits.filter((v) => v.patientId === p.id).length;
                return (
                  <div
                    key={p.id}
                    className={`p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs transition-colors ${
                      isSelected ? 'bg-[#EDF7F5]' : 'bg-white hover:bg-[#F7FAFC]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setFocusedPatientId(p.id)}
                      className="text-left flex-1 cursor-pointer"
                    >
                      <p className="font-bold text-[#0A2540]">
                        {p.name}{' '}
                        <span className="font-mono font-medium text-[#0F766E] ml-1">{p.id}</span>
                      </p>
                      <p className="text-[#475569] hl-tabular mt-0.5">
                        {p.age}y · {p.cityOrVillage} · Phone {p.phone} · {priorCount} prior visit
                        {priorCount === 1 ? '' : 's'}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenTimeline(p.id)}
                      className="px-2.5 py-1.5 border border-[#DCE6EE] bg-white hover:border-[#0D9488] text-[#0A2540] font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <History className="w-3.5 h-3.5 text-[#0F766E]" />
                      <span>History</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Create Consultation Case & Generate Token */}
        <form
          onSubmit={handleCreateWalkIn}
          className="xl:col-span-6 bg-white border border-[#DCE6EE] p-5 space-y-4"
        >
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#EAEFF4]">
            <div>
              <h2 className="text-base font-bold text-[#0A2540]">
                Create Consultation &amp; Issue Queue Token
              </h2>
              <p className="text-xs text-[#475569]">
                Selected Patient:{' '}
                <strong className="text-[#0A2540]">
                  {selectedPatient?.name} ({selectedPatient?.id})
                </strong>
              </p>
            </div>
            {selectedPatient && (
              <button
                type="button"
                onClick={() => onOpenTimeline(selectedPatient.id)}
                className="text-xs font-semibold text-[#0F766E] hover:underline cursor-pointer"
              >
                Inspect Past Cases →
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#475569] mb-1">
                Active Facility
              </label>
              <input
                type="text"
                value={currentFacility.name}
                disabled
                className="w-full h-10 px-3 bg-[#F7FAFC] border border-[#DCE6EE] text-[#475569]"
              />
            </div>

            <div>
              <label
                htmlFor="hl-rec-dept"
                className="block font-semibold text-[#475569] mb-1"
              >
                Department
              </label>
              <select
                id="hl-rec-dept"
                value={selectedDept}
                onChange={(e) => {
                  const d = e.target.value;
                  setSelectedDept(d);
                  const matchDoc = facilityClinicians.find((c) => c.department === d);
                  if (matchDoc) setSelectedClinicianId(matchDoc.id);
                }}
                className="w-full h-10 px-3 bg-white border border-[#DCE6EE] text-[#0A2540]"
              >
                {currentFacility.departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="hl-rec-doc"
                className="block font-semibold text-[#475569] mb-1"
              >
                Assign Attending Clinician
              </label>
              <select
                id="hl-rec-doc"
                value={effectiveClinician?.id || ''}
                onChange={(e) => setSelectedClinicianId(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-[#DCE6EE] text-[#0A2540]"
              >
                {facilityClinicians.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.department} (Consult fee ${c.consultationFee})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="hl-rec-reason"
                className="block font-semibold text-[#475569] mb-1"
              >
                Visit Reason / Chief Complaint *
              </label>
              <textarea
                id="hl-rec-reason"
                rows={2}
                value={visitReason}
                onChange={(e) => setVisitReason(e.target.value)}
                placeholder="Describe reason for outpatient visit..."
                className="w-full p-2.5 bg-white border border-[#DCE6EE] text-[#0A2540]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !selectedPatient}
            className="w-full py-3 px-4 bg-[#0F766E] hover:bg-[#0D9488] disabled:bg-slate-400 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Generate Queue Token &amp; Route to Doctor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Scheduled Appointments Pending Check-In */}
      {scheduledAppointments.length > 0 && (
        <div className="bg-white border border-[#DCE6EE] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0A2540] inline-flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-[#0F766E]" />
              Scheduled Appointments Awaiting Check-In ({currentFacility.name})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scheduledAppointments.map((apt) => {
              const pat = dataset.patients.find((p) => p.id === apt.patientId);
              const doc = dataset.clinicians.find((c) => c.id === apt.clinicianId);
              return (
                <div
                  key={apt.id}
                  className="border border-[#DCE6EE] bg-[#F7FAFC] p-4 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-bold text-[#0A2540]">
                      {pat?.name} ({pat?.id}) · {apt.timeSlot}
                    </p>
                    <p className="text-[#475569]">
                      {doc?.name} · {apt.reason}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCheckInAppointment(apt.id)}
                    className="px-3.5 py-2 bg-[#0A2540] hover:bg-[#163659] text-white font-semibold cursor-pointer"
                  >
                    Check In &amp; Issue Token
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Today's Live Facility Queue */}
      <div className="bg-white border border-[#DCE6EE] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0A2540]">
            Today’s Queue — {currentFacility.name} ({todayVisits.length})
          </h2>
        </div>

        {todayVisits.length === 0 ? (
          <p className="text-xs text-[#64748B] py-4">
            No queue entries at {currentFacility.name} today yet. Issue a token above or switch
            facilities in the top header.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#DCE6EE]">
              <thead className="bg-[#F7FAFC] border-b border-[#DCE6EE] text-[#475569]">
                <tr>
                  <th className="p-3">Token</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Doctor &amp; Dept</th>
                  <th className="p-3">Visit Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEFF4] hl-tabular">
                {todayVisits.map((v) => {
                  const p = dataset.patients.find((pt) => pt.id === v.patientId);
                  const d = dataset.clinicians.find((cl) => cl.id === v.clinicianId);
                  return (
                    <tr key={v.id} className="hover:bg-[#F7FAFC]">
                      <td className="p-3 font-mono font-bold text-[#0A2540]">{v.queueToken}</td>
                      <td className="p-3">
                        <p className="font-semibold text-[#0A2540]">{p?.name}</p>
                        <p className="text-[#64748B]">{v.visitReason}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-medium text-[#0A2540]">{d?.name}</p>
                        <p className="text-[#64748B]">{v.department}</p>
                      </td>
                      <td className="p-3">
                        <HealthLinkStatusBadge status={v.progressStatus} />
                      </td>
                      <td className="p-3 text-right whitespace-nowrap space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (p) {
                              onPrint({
                                type: 'queue_slip',
                                visit: v,
                                patient: p,
                                facility: currentFacility,
                                clinician: d,
                              });
                            }
                          }}
                          className="px-2.5 py-1.5 border border-[#DCE6EE] bg-white hover:border-[#0D9488] text-[#0A2540] font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Printer className="w-3 h-3" />
                          Slip
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFocusedVisitId(v.id);
                            onNavigateRole('doctor');
                          }}
                          className="px-2.5 py-1.5 bg-[#EDF7F5] border border-[#CBE8E2] text-[#0F766E] font-semibold cursor-pointer"
                        >
                          Doctor Queue →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
