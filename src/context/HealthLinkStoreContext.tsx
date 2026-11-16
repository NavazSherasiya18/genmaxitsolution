import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ActivityEvent,
  AppointmentRecord,
  ClinicalVitals,
  DispensingRecord,
  HealthLinkDataset,
  HealthLinkRole,
  InvoiceLineItem,
  InvoiceRecord,
  PatientRecord,
  PrescriptionLine,
  PrescriptionRecord,
  VisitCase,
  createSeededHealthLinkDataset,
  getDemoTodayIso,
} from '../data/healthlinkCatalog';

const STORAGE_KEY = 'healthlink_demo_state_v1';

export interface ActionResult<T = undefined> {
  ok: boolean;
  error?: string;
  data?: T;
}

export type GuidedJourneyMode = 'none' | 'walk_in' | 'telehealth';

interface HealthLinkContextValue {
  dataset: HealthLinkDataset;
  activeRole: HealthLinkRole;
  setActiveRole: (role: HealthLinkRole) => void;
  activeFacilityId: string;
  setActiveFacilityId: (facilityId: string) => void;
  activePatientPortalId: string;
  setActivePatientPortalId: (patientId: string) => void;
  focusedPatientId: string | null;
  setFocusedPatientId: (patientId: string | null) => void;
  focusedVisitId: string | null;
  setFocusedVisitId: (visitId: string | null) => void;
  guidedMode: GuidedJourneyMode;
  setGuidedMode: (mode: GuidedJourneyMode) => void;

  // Reception Actions
  registerPatient: (input: {
    name: string;
    age: number;
    dob: string;
    cityOrVillage: string;
    phone: string;
    allergiesNote?: string;
  }) => ActionResult<PatientRecord>;
  createWalkInVisit: (input: {
    patientId: string;
    facilityId: string;
    department: string;
    clinicianId: string;
    visitReason: string;
  }) => ActionResult<VisitCase>;
  checkInAppointment: (appointmentId: string) => ActionResult<VisitCase>;

  // Doctor Actions
  startConsultation: (visitId: string) => ActionResult<VisitCase>;
  saveConsultation: (input: {
    visitId: string;
    vitals: ClinicalVitals;
    diagnosis: string;
    clinicalNotes: string;
    followUpInstructions: string;
    prescriptionLines: {
      medicineId: string;
      dosageInstruction: string;
      prescribedQty: number;
    }[];
    signAndSend: boolean;
  }) => ActionResult<{ visit: VisitCase; prescription?: PrescriptionRecord }>;

  // Pharmacy Actions
  dispensePrescription: (input: {
    prescriptionId: string;
    allocations: { medicineId: string; quantity: number }[];
    pharmacistNote?: string;
  }) => ActionResult<DispensingRecord>;

  // Billing Actions
  generateInvoiceForVisit: (input: {
    visitId: string;
    demoFacilityFee?: number;
    discountAmount?: number;
  }) => ActionResult<InvoiceRecord>;
  recordInvoicePayment: (input: {
    invoiceId: string;
    method: string;
  }) => ActionResult<InvoiceRecord>;

  // Patient Portal & Telehealth Actions
  bookAppointment: (input: {
    patientId: string;
    facilityId: string;
    clinicianId: string;
    dateIso: string;
    timeSlot: string;
    mode: 'in_person' | 'telehealth';
    reason: string;
  }) => ActionResult<AppointmentRecord>;
  enterTelehealthWaitingRoom: (appointmentId: string) => ActionResult<VisitCase>;
  startTelehealthConsultation: (visitId: string) => ActionResult<VisitCase>;
  completeTelehealthVisit: (input: {
    visitId: string;
    diagnosis: string;
    followUpInstructions: string;
    clinicalNotes: string;
  }) => ActionResult<VisitCase>;

  // Notifications & Demo Reset
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
}

const HealthLinkStoreContext = createContext<HealthLinkContextValue | undefined>(undefined);

function nowTimeLabel(): string {
  return `Today · ${new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())}`;
}

export const HealthLinkStoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dataset, setDataset] = useState<HealthLinkDataset>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === 1 && Array.isArray(parsed.patients)) {
          return parsed as HealthLinkDataset;
        }
      }
    } catch {
      // Ignore parse failures and fall back to fresh seed
    }
    return createSeededHealthLinkDataset();
  });

  const [activeRole, setActiveRole] = useState<HealthLinkRole>('reception');
  const [activeFacilityId, setActiveFacilityId] = useState<string>('fac-northside');
  const [activePatientPortalId, setActivePatientPortalId] = useState<string>('PT-1042');
  const [focusedPatientId, setFocusedPatientId] = useState<string | null>('PT-1042');
  const [focusedVisitId, setFocusedVisitId] = useState<string | null>(null);
  const [guidedMode, setGuidedMode] = useState<GuidedJourneyMode>('none');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataset));
    } catch {
      // Ignore storage quota issues gracefully
    }
  }, [dataset]);

  const registerPatient = useCallback(
    (input: {
      name: string;
      age: number;
      dob: string;
      cityOrVillage: string;
      phone: string;
      allergiesNote?: string;
    }): ActionResult<PatientRecord> => {
      const cleanName = input.name.trim();
      const cleanPhone = input.phone.replace(/\D/g, '');
      const cleanCity = input.cityOrVillage.trim();
      if (!cleanName) return { ok: false, error: 'Patient full name is required.' };
      if (!cleanCity) return { ok: false, error: 'Village or city is required.' };
      if (cleanPhone.length < 7) {
        return { ok: false, error: 'Enter a valid sample phone number (at least 7 digits).' };
      }

      const duplicate = dataset.patients.find((p) => p.phone.replace(/\D/g, '') === cleanPhone);
      if (duplicate) {
        return {
          ok: false,
          error: `A patient record (${duplicate.name} · ${duplicate.id}) already uses that phone number.`,
        };
      }

      const nextNum = 1080 + dataset.patients.length;
      const newPatient: PatientRecord = {
        id: `PT-${nextNum}`,
        name: cleanName,
        age: Math.max(0, Math.min(120, Math.round(input.age || 30))),
        dob: input.dob || '1994-01-15',
        cityOrVillage: cleanCity,
        phone: cleanPhone,
        bloodGroup: 'O+',
        allergiesNote: input.allergiesNote?.trim() || 'No known drug allergies',
        registeredAt: getDemoTodayIso(),
      };

      const act: ActivityEvent = {
        id: `ACT-${Date.now()}`,
        timestampLabel: nowTimeLabel(),
        facilityId: activeFacilityId,
        department: 'Reception',
        actorRole: 'reception',
        patientId: newPatient.id,
        title: `New patient registered (${newPatient.id})`,
        detail: `${newPatient.name} (${newPatient.cityOrVillage}) added to directory.`,
        unread: true,
      };

      setDataset((prev) => ({
        ...prev,
        patients: [newPatient, ...prev.patients],
        activityLog: [act, ...prev.activityLog],
      }));
      setFocusedPatientId(newPatient.id);
      return { ok: true, data: newPatient };
    },
    [dataset.patients, activeFacilityId]
  );

  const createWalkInVisit = useCallback(
    (input: {
      patientId: string;
      facilityId: string;
      department: string;
      clinicianId: string;
      visitReason: string;
    }): ActionResult<VisitCase> => {
      const today = getDemoTodayIso();
      const reason = input.visitReason.trim();
      if (!reason) {
        return { ok: false, error: 'Enter a brief visit reason or chief complaint.' };
      }

      const existingActive = dataset.visits.find(
        (v) =>
          v.patientId === input.patientId &&
          v.visitDateIso === today &&
          v.progressStatus !== 'completed'
      );
      if (existingActive) {
        return {
          ok: false,
          error: `Duplicate queue prevented: Patient already has active token ${existingActive.queueToken} today.`,
        };
      }

      const fac = dataset.facilities.find((f) => f.id === input.facilityId);
      const doc = dataset.clinicians.find((c) => c.id === input.clinicianId);
      const pat = dataset.patients.find((p) => p.id === input.patientId);
      if (!fac || !doc || !pat) {
        return { ok: false, error: 'Selected facility, doctor, or patient could not be found.' };
      }

      const nextCounter = dataset.tokenCounter + 1;
      const queueToken = `${fac.code}-${String(nextCounter).padStart(3, '0')}`;
      const newVisit: VisitCase = {
        id: `VIS-${915 + dataset.visits.length}`,
        patientId: pat.id,
        facilityId: fac.id,
        department: input.department || doc.department,
        clinicianId: doc.id,
        queueToken,
        visitType: 'walk_in',
        visitReason: reason,
        visitDateIso: today,
        createdAtLabel: nowTimeLabel(),
        progressStatus: 'waiting',
        vitals: { bp: '122/78', pulse: '76 bpm', temp: '98.6 °F', spo2: '98%' },
        diagnosis: '',
        clinicalNotes: '',
        followUpInstructions: '',
        consultationFee: doc.consultationFee,
        consultationBilled: false,
        releasedToPatient: false,
      };

      const act: ActivityEvent = {
        id: `ACT-${Date.now()}`,
        timestampLabel: nowTimeLabel(),
        facilityId: fac.id,
        department: newVisit.department,
        actorRole: 'reception',
        patientId: pat.id,
        title: `Queue token ${queueToken} issued for ${pat.name}`,
        detail: `Assigned to ${doc.name} (${newVisit.department}).`,
        unread: true,
      };

      setDataset((prev) => ({
        ...prev,
        tokenCounter: nextCounter,
        visits: [newVisit, ...prev.visits],
        activityLog: [act, ...prev.activityLog],
      }));
      setFocusedPatientId(pat.id);
      setFocusedVisitId(newVisit.id);
      return { ok: true, data: newVisit };
    },
    [dataset]
  );

  const checkInAppointment = useCallback(
    (appointmentId: string): ActionResult<VisitCase> => {
      const today = getDemoTodayIso();
      const apt = dataset.appointments.find((a) => a.id === appointmentId);
      if (!apt) return { ok: false, error: 'Appointment not found.' };
      if (apt.status !== 'scheduled') {
        return { ok: false, error: `Appointment is already ${apt.status.replace('_', ' ')}.` };
      }

      const existingActive = dataset.visits.find(
        (v) =>
          v.patientId === apt.patientId &&
          v.visitDateIso === today &&
          v.progressStatus !== 'completed'
      );
      if (existingActive) {
        return {
          ok: false,
          error: `Patient already holds active queue token ${existingActive.queueToken}.`,
        };
      }

      const fac = dataset.facilities.find((f) => f.id === apt.facilityId);
      const doc = dataset.clinicians.find((c) => c.id === apt.clinicianId);
      const pat = dataset.patients.find((p) => p.id === apt.patientId);
      if (!fac || !doc || !pat) {
        return { ok: false, error: 'Appointment metadata is incomplete.' };
      }

      const nextCounter = dataset.tokenCounter + 1;
      const queueToken = `${fac.code}-${String(nextCounter).padStart(3, '0')}`;
      const newVisit: VisitCase = {
        id: `VIS-${915 + dataset.visits.length}`,
        patientId: pat.id,
        facilityId: fac.id,
        department: apt.department,
        clinicianId: apt.clinicianId,
        appointmentId: apt.id,
        queueToken,
        visitType: apt.mode === 'telehealth' ? 'telehealth' : 'scheduled',
        visitReason: apt.reason,
        visitDateIso: today,
        createdAtLabel: nowTimeLabel(),
        progressStatus: 'waiting',
        vitals: { bp: '120/78', pulse: '74 bpm', temp: '98.5 °F', spo2: '99%' },
        diagnosis: '',
        clinicalNotes: '',
        followUpInstructions: '',
        consultationFee: doc.consultationFee,
        consultationBilled: false,
        releasedToPatient: false,
      };

      const act: ActivityEvent = {
        id: `ACT-${Date.now()}`,
        timestampLabel: nowTimeLabel(),
        facilityId: fac.id,
        department: apt.department,
        actorRole: 'reception',
        patientId: pat.id,
        title: `Appointment ${apt.id} checked in (${queueToken})`,
        detail: `${pat.name} checked in for ${doc.name}.`,
        unread: true,
      };

      setDataset((prev) => ({
        ...prev,
        tokenCounter: nextCounter,
        appointments: prev.appointments.map((a) =>
          a.id === apt.id ? { ...a, status: 'checked_in', linkedVisitId: newVisit.id } : a
        ),
        visits: [newVisit, ...prev.visits],
        activityLog: [act, ...prev.activityLog],
      }));
      setFocusedPatientId(pat.id);
      setFocusedVisitId(newVisit.id);
      return { ok: true, data: newVisit };
    },
    [dataset]
  );

  const startConsultation = useCallback(
    (visitId: string): ActionResult<VisitCase> => {
      const target = dataset.visits.find((v) => v.id === visitId);
      if (!target) return { ok: false, error: 'Visit record not found.' };

      const updated: VisitCase = {
        ...target,
        progressStatus:
          target.visitType === 'telehealth' ? 'telehealth_live' : 'in_consultation',
      };

      setDataset((prev) => ({
        ...prev,
        visits: prev.visits.map((v) => (v.id === visitId ? updated : v)),
      }));
      setFocusedVisitId(visitId);
      setFocusedPatientId(target.patientId);
      return { ok: true, data: updated };
    },
    [dataset.visits]
  );

  const saveConsultation = useCallback(
    (input: {
      visitId: string;
      vitals: ClinicalVitals;
      diagnosis: string;
      clinicalNotes: string;
      followUpInstructions: string;
      prescriptionLines: {
        medicineId: string;
        dosageInstruction: string;
        prescribedQty: number;
      }[];
      signAndSend: boolean;
    }): ActionResult<{ visit: VisitCase; prescription?: PrescriptionRecord }> => {
      const visit = dataset.visits.find((v) => v.id === input.visitId);
      if (!visit) return { ok: false, error: 'Visit case not found.' };

      if (input.signAndSend && !input.diagnosis.trim()) {
        return {
          ok: false,
          error: 'Enter a clinical summary or working diagnosis before signing the consultation.',
        };
      }

      const existingRx = dataset.prescriptions.find((p) => p.visitId === visit.id);
      if (
        existingRx &&
        (existingRx.status === 'partially_dispensed' || existingRx.status === 'dispensed')
      ) {
        return {
          ok: false,
          error: 'Prescription already entered Pharmacy dispensing and cannot be overwritten.',
        };
      }

      const validLines: PrescriptionLine[] = input.prescriptionLines
        .filter((l) => l.medicineId && l.prescribedQty > 0)
        .map((l) => {
          const med = dataset.inventory.find((m) => m.id === l.medicineId);
          return {
            medicineId: l.medicineId,
            medicineName: med ? `${med.name} (${med.form})` : l.medicineId,
            dosageInstruction: l.dosageInstruction.trim() || 'Take as directed',
            prescribedQty: Math.max(1, Math.round(l.prescribedQty)),
            dispensedQty: 0,
          };
        });

      const updatedVisit: VisitCase = {
        ...visit,
        vitals: input.vitals,
        diagnosis: input.diagnosis.trim(),
        clinicalNotes: input.clinicalNotes.trim(),
        followUpInstructions: input.followUpInstructions.trim(),
        progressStatus: input.signAndSend ? 'completed' : 'in_consultation',
        releasedToPatient: input.signAndSend ? true : visit.releasedToPatient,
      };

      let savedRx: PrescriptionRecord | undefined = existingRx;
      let nextPrescriptions = [...dataset.prescriptions];

      if (validLines.length > 0) {
        if (existingRx) {
          savedRx = {
            ...existingRx,
            status: input.signAndSend ? 'pending_pharmacy' : 'draft',
            lines: validLines,
          };
          nextPrescriptions = nextPrescriptions.map((r) =>
            r.id === existingRx.id ? savedRx! : r
          );
        } else {
          savedRx = {
            id: `RX-${512 + dataset.prescriptions.length}`,
            visitId: visit.id,
            patientId: visit.patientId,
            clinicianId: visit.clinicianId,
            facilityId: visit.facilityId,
            createdDateIso: getDemoTodayIso(),
            status: input.signAndSend ? 'pending_pharmacy' : 'draft',
            lines: validLines,
          };
          nextPrescriptions = [savedRx, ...nextPrescriptions];
        }
      }

      const patient = dataset.patients.find((p) => p.id === visit.patientId);
      const act: ActivityEvent = {
        id: `ACT-${Date.now()}`,
        timestampLabel: nowTimeLabel(),
        facilityId: visit.facilityId,
        department: visit.department,
        actorRole: 'doctor',
        patientId: visit.patientId,
        title: input.signAndSend
          ? `Signed consultation ${visit.queueToken} (${patient?.name || visit.patientId})`
          : `Saved draft notes for ${visit.queueToken}`,
        detail: savedRx
          ? `${savedRx.id} ${
              input.signAndSend ? 'routed to Pharmacy' : 'saved as Draft'
            } (${validLines.length} medicine line${validLines.length === 1 ? '' : 's'}).`
          : 'Visit notes updated without medication lines.',
        unread: input.signAndSend,
      };

      setDataset((prev) => ({
        ...prev,
        visits: prev.visits.map((v) => (v.id === visit.id ? updatedVisit : v)),
        appointments: prev.appointments.map((a) =>
          a.linkedVisitId === visit.id && input.signAndSend ? { ...a, status: 'completed' } : a
        ),
        prescriptions: nextPrescriptions,
        activityLog: [act, ...prev.activityLog],
      }));

      return { ok: true, data: { visit: updatedVisit, prescription: savedRx } };
    },
    [dataset]
  );

  const dispensePrescription = useCallback(
    (input: {
      prescriptionId: string;
      allocations: { medicineId: string; quantity: number }[];
      pharmacistNote?: string;
    }): ActionResult<DispensingRecord> => {
      const rx = dataset.prescriptions.find((p) => p.id === input.prescriptionId);
      if (!rx) return { ok: false, error: 'Prescription record not found.' };
      if (rx.status === 'draft') {
        return { ok: false, error: 'Draft prescriptions must be signed by a clinician first.' };
      }
      if (rx.status === 'dispensed') {
        return { ok: false, error: `${rx.id} is already fully dispensed.` };
      }

      const nonZero = input.allocations.filter((a) => a.quantity > 0);
      if (nonZero.length === 0) {
        return { ok: false, error: 'Select a positive dispense quantity for at least one item.' };
      }

      const batchItems: DispensingRecord['items'] = [];

      for (const alloc of nonZero) {
        const line = rx.lines.find((l) => l.medicineId === alloc.medicineId);
        const inv = dataset.inventory.find((m) => m.id === alloc.medicineId);
        if (!line || !inv) {
          return { ok: false, error: `Unknown medicine allocation: ${alloc.medicineId}.` };
        }
        const remaining = line.prescribedQty - line.dispensedQty;
        if (inv.stockQty <= 0) {
          return {
            ok: false,
            error: `${inv.name} is out of stock (0 available). Uncheck or reduce to 0.`,
          };
        }
        if (alloc.quantity > inv.stockQty) {
          return {
            ok: false,
            error: `Cannot dispense ${alloc.quantity} of ${inv.name}: only ${inv.stockQty} in stock.`,
          };
        }
        if (alloc.quantity > remaining) {
          return {
            ok: false,
            error: `Cannot dispense ${alloc.quantity} of ${inv.name}: only ${remaining} remaining on RX.`,
          };
        }
        batchItems.push({
          medicineId: inv.id,
          medicineName: `${inv.name} (${inv.form})`,
          quantityIssued: alloc.quantity,
          unitPrice: inv.unitPrice,
          lineTotal: Number((alloc.quantity * inv.unitPrice).toFixed(2)),
        });
      }

      const updatedLines = rx.lines.map((line) => {
        const issued = batchItems.find((b) => b.medicineId === line.medicineId)?.quantityIssued || 0;
        return {
          ...line,
          dispensedQty: line.dispensedQty + issued,
        };
      });

      const allFulfilled = updatedLines.every((l) => l.dispensedQty >= l.prescribedQty);
      const updatedRx: PrescriptionRecord = {
        ...rx,
        status: allFulfilled ? 'dispensed' : 'partially_dispensed',
        lines: updatedLines,
        pharmacistNote: input.pharmacistNote?.trim() || rx.pharmacistNote,
      };

      const batchSubtotal = Number(
        batchItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2)
      );

      const newDispense: DispensingRecord = {
        id: `DSP-${710 + dataset.dispensingRecords.length}`,
        prescriptionId: rx.id,
        visitId: rx.visitId,
        patientId: rx.patientId,
        facilityId: rx.facilityId,
        dispensedAtLabel: nowTimeLabel(),
        items: batchItems,
        batchSubtotal,
        billedInvoiceId: null,
      };

      const patient = dataset.patients.find((p) => p.id === rx.patientId);
      const act: ActivityEvent = {
        id: `ACT-${Date.now()}`,
        timestampLabel: nowTimeLabel(),
        facilityId: rx.facilityId,
        department: 'Pharmacy',
        actorRole: 'pharmacy',
        patientId: rx.patientId,
        title: `${allFulfilled ? 'Dispensed' : 'Partially dispensed'} ${rx.id} (${newDispense.id})`,
        detail: `${patient?.name || rx.patientId}: issued ${batchItems
          .map((b) => `${b.quantityIssued}× ${b.medicineName}`)
          .join(', ')}.`,
        unread: true,
      };

      setDataset((prev) => ({
        ...prev,
        inventory: prev.inventory.map((item) => {
          const used = batchItems.find((b) => b.medicineId === item.id)?.quantityIssued || 0;
          return used > 0 ? { ...item, stockQty: Math.max(0, item.stockQty - used) } : item;
        }),
        prescriptions: prev.prescriptions.map((r) => (r.id === rx.id ? updatedRx : r)),
        dispensingRecords: [newDispense, ...prev.dispensingRecords],
        activityLog: [act, ...prev.activityLog],
      }));

      return { ok: true, data: newDispense };
    },
    [dataset]
  );

  const generateInvoiceForVisit = useCallback(
    (input: {
      visitId: string;
      demoFacilityFee?: number;
      discountAmount?: number;
    }): ActionResult<InvoiceRecord> => {
      const visit = dataset.visits.find((v) => v.id === input.visitId);
      if (!visit) return { ok: false, error: 'Visit record not found.' };

      const unbilledBatches = dataset.dispensingRecords.filter(
        (d) => d.visitId === visit.id && d.billedInvoiceId === null
      );

      if (visit.consultationBilled && unbilledBatches.length === 0) {
        return {
          ok: false,
          error:
            'No unbilled consultation fee or dispensed medicine batches remain for this visit.',
        };
      }

      const items: InvoiceLineItem[] = [];
      const clinician = dataset.clinicians.find((c) => c.id === visit.clinicianId);

      if (!visit.consultationBilled) {
        items.push({
          description: `${visit.department} Consultation — ${clinician?.name || 'Clinician'}`,
          category: 'consultation',
          quantity: 1,
          unitPrice: visit.consultationFee,
          amount: visit.consultationFee,
        });
      }

      for (const batch of unbilledBatches) {
        for (const item of batch.items) {
          items.push({
            description: `${item.medicineName} [Batch ${batch.id}]`,
            category: 'pharmacy',
            quantity: item.quantityIssued,
            unitPrice: item.unitPrice,
            amount: item.lineTotal,
          });
        }
      }

      const subtotal = Number(items.reduce((s, i) => s + i.amount, 0).toFixed(2));
      const fee = !visit.consultationBilled ? Math.max(0, Number(input.demoFacilityFee ?? 5)) : 0;
      const discount = Math.max(
        0,
        Math.min(subtotal + fee, Number(input.discountAmount ?? 0))
      );
      const totalAmount = Number(Math.max(0, subtotal + fee - discount).toFixed(2));

      const newInvoice: InvoiceRecord = {
        id: `INV-${810 + dataset.invoices.length}`,
        visitId: visit.id,
        patientId: visit.patientId,
        facilityId: visit.facilityId,
        issuedDateIso: getDemoTodayIso(),
        issuedTimeLabel: new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date()),
        dispensingRecordIds: unbilledBatches.map((b) => b.id),
        includesConsultation: !visit.consultationBilled,
        items,
        subtotal,
        demoFacilityFee: fee,
        discountAmount: discount,
        totalAmount,
        status: 'pending_payment',
      };

      const patient = dataset.patients.find((p) => p.id === visit.patientId);
      const batchIdSet = new Set(unbilledBatches.map((b) => b.id));
      const act: ActivityEvent = {
        id: `ACT-${Date.now()}`,
        timestampLabel: nowTimeLabel(),
        facilityId: visit.facilityId,
        department: 'Billing',
        actorRole: 'billing',
        patientId: visit.patientId,
        title: `Generated invoice ${newInvoice.id} ($${totalAmount.toFixed(2)})`,
        detail: `${patient?.name || visit.patientId} — includes ${items.length} itemized line(s).`,
        unread: true,
      };

      setDataset((prev) => ({
        ...prev,
        visits: prev.visits.map((v) =>
          v.id === visit.id ? { ...v, consultationBilled: true } : v
        ),
        dispensingRecords: prev.dispensingRecords.map((d) =>
          batchIdSet.has(d.id) ? { ...d, billedInvoiceId: newInvoice.id } : d
        ),
        invoices: [newInvoice, ...prev.invoices],
        activityLog: [act, ...prev.activityLog],
      }));

      return { ok: true, data: newInvoice };
    },
    [dataset]
  );

  const recordInvoicePayment = useCallback(
    (input: { invoiceId: string; method: string }): ActionResult<InvoiceRecord> => {
      const inv = dataset.invoices.find((i) => i.id === input.invoiceId);
      if (!inv) return { ok: false, error: 'Invoice not found.' };
      if (inv.status === 'paid') {
        return { ok: false, error: `Invoice ${inv.id} is already marked Paid.` };
      }

      const paidInvoice: InvoiceRecord = {
        ...inv,
        status: 'paid',
        paymentMethod: input.method || 'Demo Card •••• 4242',
        paidAtLabel: nowTimeLabel(),
      };

      const patient = dataset.patients.find((p) => p.id === inv.patientId);
      const act: ActivityEvent = {
        id: `ACT-${Date.now()}`,
        timestampLabel: nowTimeLabel(),
        facilityId: inv.facilityId,
        department: 'Billing',
        actorRole: 'billing',
        patientId: inv.patientId,
        title: `Simulated payment settled for ${inv.id}`,
        detail: `${patient?.name || inv.patientId} paid $${inv.totalAmount.toFixed(2)} via ${
          paidInvoice.paymentMethod
        }.`,
        unread: true,
      };

      setDataset((prev) => ({
        ...prev,
        invoices: prev.invoices.map((i) => (i.id === inv.id ? paidInvoice : i)),
        activityLog: [act, ...prev.activityLog],
      }));

      return { ok: true, data: paidInvoice };
    },
    [dataset]
  );

  const bookAppointment = useCallback(
    (input: {
      patientId: string;
      facilityId: string;
      clinicianId: string;
      dateIso: string;
      timeSlot: string;
      mode: 'in_person' | 'telehealth';
      reason: string;
    }): ActionResult<AppointmentRecord> => {
      const doc = dataset.clinicians.find((c) => c.id === input.clinicianId);
      const pat = dataset.patients.find((p) => p.id === input.patientId);
      if (!doc || !pat) return { ok: false, error: 'Clinician or patient record missing.' };

      const clash = dataset.appointments.find(
        (a) =>
          a.clinicianId === doc.id &&
          a.dateIso === input.dateIso &&
          a.timeSlot === input.timeSlot &&
          a.status !== 'completed'
      );
      if (clash) {
        return {
          ok: false,
          error: `${doc.name} already has an appointment at ${input.timeSlot} on ${input.dateIso}.`,
        };
      }

      const newApt: AppointmentRecord = {
        id: `APT-${405 + dataset.appointments.length}`,
        patientId: pat.id,
        facilityId: doc.facilityId,
        department: doc.department,
        clinicianId: doc.id,
        dateIso: input.dateIso,
        timeSlot: input.timeSlot,
        mode: input.mode,
        reason: input.reason.trim() || 'Telehealth outpatient consultation',
        status: 'scheduled',
      };

      let linkedVisit: VisitCase | null = null;
      let nextCounter = dataset.tokenCounter;

      // For Telehealth requests on today's schedule, automatically register into doctor telehealth queue so flow is immediate!
      if (input.mode === 'telehealth') {
        const fac = dataset.facilities.find((f) => f.id === doc.facilityId);
        nextCounter += 1;
        const queueToken = `${fac?.code || 'HL'}-${String(nextCounter).padStart(3, '0')}V`;
        linkedVisit = {
          id: `VIS-${915 + dataset.visits.length}`,
          patientId: pat.id,
          facilityId: doc.facilityId,
          department: doc.department,
          clinicianId: doc.id,
          appointmentId: newApt.id,
          queueToken,
          visitType: 'telehealth',
          visitReason: newApt.reason,
          visitDateIso: input.dateIso,
          createdAtLabel: `${input.dateIso} · ${input.timeSlot}`,
          progressStatus: 'waiting',
          vitals: { bp: '118/76 (Home)', pulse: '72 bpm', temp: '98.5 °F', spo2: '99%' },
          diagnosis: '',
          clinicalNotes: '',
          followUpInstructions: '',
          consultationFee: doc.consultationFee,
          consultationBilled: false,
          releasedToPatient: false,
        };
        newApt.linkedVisitId = linkedVisit.id;
      }

      const act: ActivityEvent = {
        id: `ACT-${Date.now()}`,
        timestampLabel: nowTimeLabel(),
        facilityId: doc.facilityId,
        department: doc.department,
        actorRole: 'patient',
        patientId: pat.id,
        title: `New ${input.mode === 'telehealth' ? 'Telehealth' : 'Clinic'} slot booked (${newApt.id})`,
        detail: `${pat.name} booked ${doc.name} for ${input.dateIso} at ${input.timeSlot}.`,
        unread: true,
      };

      setDataset((prev) => ({
        ...prev,
        tokenCounter: nextCounter,
        appointments: [newApt, ...prev.appointments],
        visits: linkedVisit ? [linkedVisit, ...prev.visits] : prev.visits,
        activityLog: [act, ...prev.activityLog],
      }));

      return { ok: true, data: newApt };
    },
    [dataset]
  );

  const enterTelehealthWaitingRoom = useCallback(
    (appointmentId: string): ActionResult<VisitCase> => {
      const apt = dataset.appointments.find((a) => a.id === appointmentId);
      if (!apt) return { ok: false, error: 'Telehealth appointment not found.' };

      const existingVisit = dataset.visits.find((v) => v.id === apt.linkedVisitId);
      if (existingVisit) {
        setDataset((prev) => ({
          ...prev,
          appointments: prev.appointments.map((a) =>
            a.id === appointmentId ? { ...a, status: 'waiting_room' } : a
          ),
        }));
        return { ok: true, data: existingVisit };
      }
      return { ok: false, error: 'Linked consultation record missing.' };
    },
    [dataset.appointments, dataset.visits]
  );

  const startTelehealthConsultation = useCallback(
    (visitId: string): ActionResult<VisitCase> => {
      const target = dataset.visits.find((v) => v.id === visitId);
      if (!target) return { ok: false, error: 'Telehealth visit not found.' };

      const updated: VisitCase = {
        ...target,
        progressStatus: 'telehealth_live',
      };
      setDataset((prev) => ({
        ...prev,
        visits: prev.visits.map((v) => (v.id === visitId ? updated : v)),
        appointments: prev.appointments.map((a) =>
          a.linkedVisitId === visitId ? { ...a, status: 'live' } : a
        ),
      }));
      return { ok: true, data: updated };
    },
    [dataset.visits]
  );

  const completeTelehealthVisit = useCallback(
    (input: {
      visitId: string;
      diagnosis: string;
      followUpInstructions: string;
      clinicalNotes: string;
    }): ActionResult<VisitCase> => {
      const visit = dataset.visits.find((v) => v.id === input.visitId);
      if (!visit) return { ok: false, error: 'Visit not found.' };

      const updated: VisitCase = {
        ...visit,
        diagnosis: input.diagnosis.trim() || 'Telehealth consultation completed (Sample)',
        clinicalNotes: input.clinicalNotes.trim() || 'Reviewed symptoms cleanly via remote video.',
        followUpInstructions:
          input.followUpInstructions.trim() || 'Schedule follow-up review in 14 days via portal.',
        progressStatus: 'completed',
        releasedToPatient: true,
      };

      const pat = dataset.patients.find((p) => p.id === visit.patientId);
      const act: ActivityEvent = {
        id: `ACT-${Date.now()}`,
        timestampLabel: nowTimeLabel(),
        facilityId: visit.facilityId,
        department: visit.department,
        actorRole: 'doctor',
        patientId: visit.patientId,
        title: `Telehealth summary released (${visit.queueToken})`,
        detail: `${pat?.name || visit.patientId} follow-up note published to Patient Portal.`,
        unread: true,
      };

      setDataset((prev) => ({
        ...prev,
        visits: prev.visits.map((v) => (v.id === visit.id ? updated : v)),
        appointments: prev.appointments.map((a) =>
          a.linkedVisitId === visit.id ? { ...a, status: 'completed' } : a
        ),
        activityLog: [act, ...prev.activityLog],
      }));

      return { ok: true, data: updated };
    },
    [dataset]
  );

  const markAllNotificationsRead = useCallback(() => {
    setDataset((prev) => ({
      ...prev,
      activityLog: prev.activityLog.map((item) => ({ ...item, unread: false })),
    }));
  }, []);

  const resetDemoData = useCallback(() => {
    const fresh = createSeededHealthLinkDataset();
    setDataset(fresh);
    setActiveRole('reception');
    setActiveFacilityId('fac-northside');
    setActivePatientPortalId('PT-1042');
    setFocusedPatientId('PT-1042');
    setFocusedVisitId(null);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // Ignore write failures
    }
  }, []);

  const value = useMemo<HealthLinkContextValue>(
    () => ({
      dataset,
      activeRole,
      setActiveRole,
      activeFacilityId,
      setActiveFacilityId,
      activePatientPortalId,
      setActivePatientPortalId,
      focusedPatientId,
      setFocusedPatientId,
      focusedVisitId,
      setFocusedVisitId,
      guidedMode,
      setGuidedMode,
      registerPatient,
      createWalkInVisit,
      checkInAppointment,
      startConsultation,
      saveConsultation,
      dispensePrescription,
      generateInvoiceForVisit,
      recordInvoicePayment,
      bookAppointment,
      enterTelehealthWaitingRoom,
      startTelehealthConsultation,
      completeTelehealthVisit,
      markAllNotificationsRead,
      resetDemoData,
    }),
    [
      dataset,
      activeRole,
      activeFacilityId,
      activePatientPortalId,
      focusedPatientId,
      focusedVisitId,
      guidedMode,
      registerPatient,
      createWalkInVisit,
      checkInAppointment,
      startConsultation,
      saveConsultation,
      dispensePrescription,
      generateInvoiceForVisit,
      recordInvoicePayment,
      bookAppointment,
      enterTelehealthWaitingRoom,
      startTelehealthConsultation,
      completeTelehealthVisit,
      markAllNotificationsRead,
      resetDemoData,
    ]
  );

  return (
    <HealthLinkStoreContext.Provider value={value}>
      {children}
    </HealthLinkStoreContext.Provider>
  );
};

export function useHealthLinkStore() {
  const ctx = useContext(HealthLinkStoreContext);
  if (!ctx) {
    throw new Error('useHealthLinkStore must be used inside HealthLinkStoreProvider');
  }
  return ctx;
}
