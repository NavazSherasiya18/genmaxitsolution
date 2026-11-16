import heroHospitalImg from '../assets/images/healthlink_hero_hospital_1794823198073.jpg';
import doctorConsultImg from '../assets/images/healthlink_doctor_consult_1794823199394.jpg';
import pharmacyDispenseImg from '../assets/images/healthlink_pharmacy_dispense_1794823200790.jpg';
import telehealthHomeImg from '../assets/images/healthlink_telehealth_home_1794823200556.jpg';

export const HEALTHLINK_MEDIA = {
  heroHospital: heroHospitalImg,
  doctorConsult: doctorConsultImg,
  pharmacyDispense: pharmacyDispenseImg,
  telehealthHome: telehealthHomeImg,
};

export type HealthLinkRole = 'reception' | 'doctor' | 'pharmacy' | 'billing' | 'admin';

export type VisitProgressStatus = 'waiting' | 'in_consultation' | 'telehealth_live' | 'completed';
export type PrescriptionDispenseStatus =
  | 'draft'
  | 'pending_pharmacy'
  | 'partially_dispensed'
  | 'dispensed';
export type BillingStatus = 'unbilled' | 'pending_payment' | 'paid';
export type AppointmentStatus = 'scheduled' | 'checked_in' | 'waiting_room' | 'live' | 'completed';

export interface HealthLinkFacility {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  departments: string[];
}

export interface Clinician {
  id: string;
  name: string;
  specialty: string;
  department: string;
  facilityId: string;
  consultationFee: number;
  telehealthSlots: string[];
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  dob: string;
  cityOrVillage: string;
  phone: string;
  bloodGroup: string;
  allergiesNote: string;
  registeredAt: string;
}

export interface AppointmentRecord {
  id: string;
  patientId: string;
  facilityId: string;
  department: string;
  clinicianId: string;
  dateIso: string;
  timeSlot: string;
  mode: 'in_person' | 'telehealth';
  reason: string;
  status: AppointmentStatus;
  linkedVisitId?: string;
}

export interface ClinicalVitals {
  bp: string;
  pulse: string;
  temp: string;
  spo2: string;
}

export interface VisitCase {
  id: string;
  patientId: string;
  facilityId: string;
  department: string;
  clinicianId: string;
  appointmentId?: string;
  queueToken: string;
  visitType: 'walk_in' | 'scheduled' | 'telehealth';
  visitReason: string;
  visitDateIso: string;
  createdAtLabel: string;
  progressStatus: VisitProgressStatus;
  vitals: ClinicalVitals;
  diagnosis: string;
  clinicalNotes: string;
  followUpInstructions: string;
  consultationFee: number;
  consultationBilled: boolean;
  releasedToPatient: boolean;
}

export interface MedicineInventoryItem {
  id: string;
  name: string;
  form: string;
  strength: string;
  unitPrice: number;
  stockQty: number;
  reorderThreshold: number;
}

export interface PrescriptionLine {
  medicineId: string;
  medicineName: string;
  dosageInstruction: string;
  prescribedQty: number;
  dispensedQty: number;
}

export interface PrescriptionRecord {
  id: string;
  visitId: string;
  patientId: string;
  clinicianId: string;
  facilityId: string;
  createdDateIso: string;
  status: PrescriptionDispenseStatus;
  lines: PrescriptionLine[];
  pharmacistNote?: string;
}

export interface DispensingBatchItem {
  medicineId: string;
  medicineName: string;
  quantityIssued: number;
  unitPrice: number;
  lineTotal: number;
}

export interface DispensingRecord {
  id: string;
  prescriptionId: string;
  visitId: string;
  patientId: string;
  facilityId: string;
  dispensedAtLabel: string;
  items: DispensingBatchItem[];
  batchSubtotal: number;
  billedInvoiceId: string | null;
}

export interface InvoiceLineItem {
  description: string;
  category: 'consultation' | 'pharmacy' | 'facility_fee';
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceRecord {
  id: string;
  visitId: string;
  patientId: string;
  facilityId: string;
  issuedDateIso: string;
  issuedTimeLabel: string;
  dispensingRecordIds: string[];
  includesConsultation: boolean;
  items: InvoiceLineItem[];
  subtotal: number;
  demoFacilityFee: number;
  discountAmount: number;
  totalAmount: number;
  status: Exclude<BillingStatus, 'unbilled'>;
  paymentMethod?: string;
  paidAtLabel?: string;
}

export interface ActivityEvent {
  id: string;
  timestampLabel: string;
  facilityId: string;
  department: string;
  actorRole: HealthLinkRole | 'patient';
  patientId?: string;
  title: string;
  detail: string;
  unread: boolean;
}

export interface HealthLinkDataset {
  version: number;
  facilities: HealthLinkFacility[];
  clinicians: Clinician[];
  patients: PatientRecord[];
  appointments: AppointmentRecord[];
  visits: VisitCase[];
  inventory: MedicineInventoryItem[];
  prescriptions: PrescriptionRecord[];
  dispensingRecords: DispensingRecord[];
  invoices: InvoiceRecord[];
  activityLog: ActivityEvent[];
  tokenCounter: number;
}

export function getDemoTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDemoDaysIso(iso: string, deltaDays: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d) + deltaDays * 86_400_000);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(
    dt.getUTCDate()
  ).padStart(2, '0')}`;
}

export function formatCurrencyUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function createSeededHealthLinkDataset(): HealthLinkDataset {
  const today = getDemoTodayIso();
  const yesterday = addDemoDaysIso(today, -1);
  const lastMonth = addDemoDaysIso(today, -28);
  const threeMonthsAgo = addDemoDaysIso(today, -92);
  const tomorrow = addDemoDaysIso(today, 1);

  const facilities: HealthLinkFacility[] = [
    {
      id: 'fac-northside',
      name: 'Northside General Clinic',
      code: 'NS',
      city: 'Pune West',
      address: '142 Residency Road, Kothrud Wing',
      phone: '+91 20 4000 1120',
      departments: ['General Medicine', 'Pediatrics', 'Orthopedics'],
    },
    {
      id: 'fac-harborview',
      name: 'Harborview Specialist Center',
      code: 'HV',
      city: 'Thane Coast',
      address: '88 Lakefront Medical Plaza, Suite 4B',
      phone: '+91 22 4900 3380',
      departments: ['Cardiology', 'Pulmonology', 'Endocrinology'],
    },
  ];

  const clinicians: Clinician[] = [
    {
      id: 'doc-mehta',
      name: 'Dr. Ananya Mehta, MD',
      specialty: 'Internal Medicine',
      department: 'General Medicine',
      facilityId: 'fac-northside',
      consultationFee: 45,
      telehealthSlots: ['10:30 AM', '11:30 AM', '03:00 PM', '04:30 PM'],
    },
    {
      id: 'doc-kapoor',
      name: 'Dr. Kabir Kapoor, MS',
      specialty: 'Pediatrics & Family Care',
      department: 'Pediatrics',
      facilityId: 'fac-northside',
      consultationFee: 40,
      telehealthSlots: ['09:45 AM', '01:15 PM', '05:00 PM'],
    },
    {
      id: 'doc-evans',
      name: 'Dr. Sarah Evans, MD',
      specialty: 'Preventive Cardiology',
      department: 'Cardiology',
      facilityId: 'fac-harborview',
      consultationFee: 65,
      telehealthSlots: ['10:00 AM', '12:00 PM', '02:30 PM', '04:00 PM'],
    },
    {
      id: 'doc-chen',
      name: 'Dr. Marcus Chen, MD',
      specialty: 'Pulmonology & Sleep',
      department: 'Pulmonology',
      facilityId: 'fac-harborview',
      consultationFee: 60,
      telehealthSlots: ['11:00 AM', '01:45 PM', '03:45 PM'],
    },
  ];

  const patients: PatientRecord[] = [
    {
      id: 'PT-1042',
      name: 'Aarav Kulkarni',
      age: 38,
      dob: '1988-04-12',
      cityOrVillage: 'Kothrud, Pune',
      phone: '9820451120',
      bloodGroup: 'O+',
      allergiesNote: 'Mild sensitivity to sulfa formulations',
      registeredAt: threeMonthsAgo,
    },
    {
      id: 'PT-1018',
      name: 'Meera Joshi',
      age: 44,
      dob: '1982-09-21',
      cityOrVillage: 'Thane West',
      phone: '9819244019',
      bloodGroup: 'B+',
      allergiesNote: 'No known drug allergies',
      registeredAt: threeMonthsAgo,
    },
    {
      id: 'PT-1056',
      name: 'Samuel Brooks',
      age: 52,
      dob: '1974-11-03',
      cityOrVillage: 'Harborview District',
      phone: '5552394812',
      bloodGroup: 'A+',
      allergiesNote: 'No known drug allergies',
      registeredAt: lastMonth,
    },
    {
      id: 'PT-1063',
      name: 'Nadia Patel',
      age: 29,
      dob: '1997-02-18',
      cityOrVillage: 'Alkapuri Town',
      phone: '9725088412',
      bloodGroup: 'AB+',
      allergiesNote: 'No known drug allergies',
      registeredAt: lastMonth,
    },
    {
      id: 'PT-1071',
      name: 'David Kim',
      age: 61,
      dob: '1965-07-09',
      cityOrVillage: 'Brookside',
      phone: '5558149023',
      bloodGroup: 'A-',
      allergiesNote: 'Seasonal pollen sensitivity',
      registeredAt: yesterday,
    },
  ];

  const appointments: AppointmentRecord[] = [
    {
      id: 'APT-401',
      patientId: 'PT-1056',
      facilityId: 'fac-northside',
      department: 'General Medicine',
      clinicianId: 'doc-mehta',
      dateIso: today,
      timeSlot: '11:30 AM',
      mode: 'in_person',
      reason: 'Scheduled annual metabolic & blood pressure review',
      status: 'scheduled',
    },
    {
      id: 'APT-402',
      patientId: 'PT-1018',
      facilityId: 'fac-harborview',
      department: 'Cardiology',
      clinicianId: 'doc-evans',
      dateIso: tomorrow,
      timeSlot: '10:00 AM',
      mode: 'telehealth',
      reason: 'Home blood pressure log follow-up via video',
      status: 'scheduled',
    },
  ];

  const visits: VisitCase[] = [
    // PT-1042 Aarav Kulkarni historical visits (proves rich case history on returning walk-in)
    {
      id: 'VIS-901',
      patientId: 'PT-1042',
      facilityId: 'fac-northside',
      department: 'General Medicine',
      clinicianId: 'doc-mehta',
      queueToken: 'NS-002',
      visitType: 'walk_in',
      visitReason: 'Seasonal viral fever & fatigue',
      visitDateIso: threeMonthsAgo,
      createdAtLabel: `${threeMonthsAgo} · 09:40 AM`,
      progressStatus: 'completed',
      vitals: { bp: '118/76', pulse: '78 bpm', temp: '99.4 °F', spo2: '99%' },
      diagnosis: 'Upper respiratory viral recovery (Sample)',
      clinicalNotes: 'Hydration protocol advised. Chest auscultation clear bilaterally.',
      followUpInstructions: 'Return only if fever persists beyond 72 hours.',
      consultationFee: 45,
      consultationBilled: true,
      releasedToPatient: true,
    },
    {
      id: 'VIS-904',
      patientId: 'PT-1042',
      facilityId: 'fac-northside',
      department: 'General Medicine',
      clinicianId: 'doc-mehta',
      queueToken: 'NS-006',
      visitType: 'scheduled',
      visitReason: 'Routine lipid screening & mild wrist sprain check',
      visitDateIso: lastMonth,
      createdAtLabel: `${lastMonth} · 11:15 AM`,
      progressStatus: 'completed',
      vitals: { bp: '120/78', pulse: '72 bpm', temp: '98.4 °F', spo2: '99%' },
      diagnosis: 'Baseline health review normal; mild wrist strain (Sample)',
      clinicalNotes: 'Reviewed baseline lab work and ergonomic wrist support.',
      followUpInstructions: 'Continue daily stretching and routine 6-month wellness check.',
      consultationFee: 45,
      consultationBilled: true,
      releasedToPatient: true,
    },
    // PT-1063 Nadia Patel today: demonstrates coexisting partially dispensed prescription + paid consultation invoice!
    {
      id: 'VIS-910',
      patientId: 'PT-1063',
      facilityId: 'fac-harborview',
      department: 'Pulmonology',
      clinicianId: 'doc-chen',
      queueToken: 'HV-004',
      visitType: 'walk_in',
      visitReason: 'Seasonal wheezing & nighttime cough assessment',
      visitDateIso: today,
      createdAtLabel: 'Today · 09:15 AM',
      progressStatus: 'completed',
      vitals: { bp: '112/72', pulse: '80 bpm', temp: '98.6 °F', spo2: '97%' },
      diagnosis: 'Mild seasonal bronchial reactivity (Sample)',
      clinicalNotes: 'Prescribed bronchodilator inhaler and hydration sachets.',
      followUpInstructions: 'Check inhaler spacer technique and schedule 14-day review.',
      consultationFee: 60,
      consultationBilled: true,
      releasedToPatient: true,
    },
    // PT-1071 David Kim today: Doctor already signed prescription; ready in Pharmacy!
    {
      id: 'VIS-911',
      patientId: 'PT-1071',
      facilityId: 'fac-harborview',
      department: 'Cardiology',
      clinicianId: 'doc-evans',
      queueToken: 'HV-005',
      visitType: 'walk_in',
      visitReason: 'Mild morning dizziness & hypertension check',
      visitDateIso: today,
      createdAtLabel: 'Today · 09:45 AM',
      progressStatus: 'completed',
      vitals: { bp: '136/84', pulse: '74 bpm', temp: '98.5 °F', spo2: '98%' },
      diagnosis: 'Essential hypertension review (Sample)',
      clinicalNotes: 'Adjusted daily maintenance tablet; advise standing slowly in morning.',
      followUpInstructions: 'Log seated morning readings for 7 days in Patient Portal.',
      consultationFee: 65,
      consultationBilled: false,
      releasedToPatient: true,
    },
  ];

  const inventory: MedicineInventoryItem[] = [
    {
      id: 'MED-201',
      name: 'Calmoxil 500mg',
      form: 'Tablet',
      strength: '500mg · Strip of 10',
      unitPrice: 4.5,
      stockQty: 42,
      reorderThreshold: 12,
    },
    {
      id: 'MED-202',
      name: 'AtorvaClear 10mg',
      form: 'Tablet',
      strength: '10mg · Strip of 10',
      unitPrice: 3.8,
      stockQty: 28,
      reorderThreshold: 10,
    },
    {
      id: 'MED-203',
      name: 'PulmoEase 100mcg',
      form: 'Inhaler',
      strength: '100mcg Metered Dose',
      unitPrice: 18.0,
      stockQty: 4, // Low stock! Ideal for partial dispensing test
      reorderThreshold: 6,
    },
    {
      id: 'MED-204',
      name: 'NeuroCalm 25mg',
      form: 'Capsule',
      strength: '25mg · Blister Pack',
      unitPrice: 9.2,
      stockQty: 0, // Out of stock! Verifies zero-stock guard
      reorderThreshold: 8,
    },
    {
      id: 'MED-205',
      name: 'HydraLytes Oral',
      form: 'Sachet',
      strength: '21g Oral Solution',
      unitPrice: 2.4,
      stockQty: 65,
      reorderThreshold: 15,
    },
    {
      id: 'MED-206',
      name: 'CardioSteady 5mg',
      form: 'Tablet',
      strength: '5mg · Daily Maintenance',
      unitPrice: 6.5,
      stockQty: 18,
      reorderThreshold: 10,
    },
  ];

  const prescriptions: PrescriptionRecord[] = [
    {
      id: 'RX-501',
      visitId: 'VIS-901',
      patientId: 'PT-1042',
      clinicianId: 'doc-mehta',
      facilityId: 'fac-northside',
      createdDateIso: threeMonthsAgo,
      status: 'dispensed',
      lines: [
        {
          medicineId: 'MED-205',
          medicineName: 'HydraLytes Oral (Sachet)',
          dosageInstruction: '1 sachet in water twice daily for 3 days',
          prescribedQty: 6,
          dispensedQty: 6,
        },
      ],
    },
    {
      id: 'RX-508',
      visitId: 'VIS-910',
      patientId: 'PT-1063',
      clinicianId: 'doc-chen',
      facilityId: 'fac-harborview',
      createdDateIso: today,
      status: 'partially_dispensed',
      lines: [
        {
          medicineId: 'MED-203',
          medicineName: 'PulmoEase 100mcg (Inhaler)',
          dosageInstruction: '2 puffs morning & evening',
          prescribedQty: 4,
          dispensedQty: 2, // 2 dispensed, 2 remaining!
        },
        {
          medicineId: 'MED-205',
          medicineName: 'HydraLytes Oral (Sachet)',
          dosageInstruction: '1 sachet daily as needed',
          prescribedQty: 4,
          dispensedQty: 4,
        },
      ],
      pharmacistNote: 'Partial batch issued; remaining 2 inhalers reserved on next restock.',
    },
    {
      id: 'RX-509',
      visitId: 'VIS-911',
      patientId: 'PT-1071',
      clinicianId: 'doc-evans',
      facilityId: 'fac-harborview',
      createdDateIso: today,
      status: 'pending_pharmacy',
      lines: [
        {
          medicineId: 'MED-206',
          medicineName: 'CardioSteady 5mg (Tablet)',
          dosageInstruction: '1 tablet every morning with water',
          prescribedQty: 4,
          dispensedQty: 0,
        },
        {
          medicineId: 'MED-202',
          medicineName: 'AtorvaClear 10mg (Tablet)',
          dosageInstruction: '1 tablet at bedtime',
          prescribedQty: 3,
          dispensedQty: 0,
        },
      ],
    },
  ];

  const dispensingRecords: DispensingRecord[] = [
    {
      id: 'DSP-701',
      prescriptionId: 'RX-501',
      visitId: 'VIS-901',
      patientId: 'PT-1042',
      facilityId: 'fac-northside',
      dispensedAtLabel: `${threeMonthsAgo} · 10:05 AM`,
      items: [
        {
          medicineId: 'MED-205',
          medicineName: 'HydraLytes Oral (Sachet)',
          quantityIssued: 6,
          unitPrice: 2.4,
          lineTotal: 14.4,
        },
      ],
      batchSubtotal: 14.4,
      billedInvoiceId: 'INV-801',
    },
    {
      id: 'DSP-708',
      prescriptionId: 'RX-508',
      visitId: 'VIS-910',
      patientId: 'PT-1063',
      facilityId: 'fac-harborview',
      dispensedAtLabel: 'Today · 09:38 AM',
      items: [
        {
          medicineId: 'MED-203',
          medicineName: 'PulmoEase 100mcg (Inhaler)',
          quantityIssued: 2,
          unitPrice: 18.0,
          lineTotal: 36.0,
        },
        {
          medicineId: 'MED-205',
          medicineName: 'HydraLytes Oral (Sachet)',
          quantityIssued: 4,
          unitPrice: 2.4,
          lineTotal: 9.6,
        },
      ],
      batchSubtotal: 45.6,
      billedInvoiceId: 'INV-808',
    },
  ];

  const invoices: InvoiceRecord[] = [
    {
      id: 'INV-801',
      visitId: 'VIS-901',
      patientId: 'PT-1042',
      facilityId: 'fac-northside',
      issuedDateIso: threeMonthsAgo,
      issuedTimeLabel: '10:12 AM',
      dispensingRecordIds: ['DSP-701'],
      includesConsultation: true,
      items: [
        {
          description: 'General Medicine Consultation — Dr. Ananya Mehta',
          category: 'consultation',
          quantity: 1,
          unitPrice: 45.0,
          amount: 45.0,
        },
        {
          description: 'HydraLytes Oral (Sachet) [Batch DSP-701]',
          category: 'pharmacy',
          quantity: 6,
          unitPrice: 2.4,
          amount: 14.4,
        },
      ],
      subtotal: 59.4,
      demoFacilityFee: 5.0,
      discountAmount: 0,
      totalAmount: 64.4,
      status: 'paid',
      paymentMethod: 'Demo Card •••• 4242',
      paidAtLabel: `${threeMonthsAgo} · 10:14 AM`,
    },
    {
      id: 'INV-808',
      visitId: 'VIS-910',
      patientId: 'PT-1063',
      facilityId: 'fac-harborview',
      issuedDateIso: today,
      issuedTimeLabel: '09:42 AM',
      dispensingRecordIds: ['DSP-708'],
      includesConsultation: true,
      items: [
        {
          description: 'Pulmonology Consultation — Dr. Marcus Chen',
          category: 'consultation',
          quantity: 1,
          unitPrice: 60.0,
          amount: 60.0,
        },
        {
          description: 'PulmoEase 100mcg (Inhaler) [Batch DSP-708]',
          category: 'pharmacy',
          quantity: 2,
          unitPrice: 18.0,
          amount: 36.0,
        },
        {
          description: 'HydraLytes Oral (Sachet) [Batch DSP-708]',
          category: 'pharmacy',
          quantity: 4,
          unitPrice: 2.4,
          amount: 9.6,
        },
      ],
      subtotal: 105.6,
      demoFacilityFee: 5.0,
      discountAmount: 0,
      totalAmount: 110.6,
      status: 'paid',
      paymentMethod: 'Demo UPI / Instant',
      paidAtLabel: 'Today · 09:45 AM',
    },
  ];

  const activityLog: ActivityEvent[] = [
    {
      id: 'ACT-1',
      timestampLabel: 'Today · 09:48 AM',
      facilityId: 'fac-harborview',
      department: 'Cardiology',
      actorRole: 'doctor',
      patientId: 'PT-1071',
      title: 'Signed prescription RX-509 sent to Pharmacy',
      detail: 'David Kim (HV-005) — CardioSteady 5mg & AtorvaClear 10mg ready for dispensing.',
      unread: true,
    },
    {
      id: 'ACT-2',
      timestampLabel: 'Today · 09:45 AM',
      facilityId: 'fac-harborview',
      department: 'Billing',
      actorRole: 'billing',
      patientId: 'PT-1063',
      title: 'Invoice INV-808 settled ($110.60)',
      detail: 'Nadia Patel consultation + Batch DSP-708 settled while remaining RX balance stays pending.',
      unread: true,
    },
    {
      id: 'ACT-3',
      timestampLabel: 'Today · 09:38 AM',
      facilityId: 'fac-harborview',
      department: 'Pharmacy',
      actorRole: 'pharmacy',
      patientId: 'PT-1063',
      title: 'Partial dispense recorded (DSP-708)',
      detail: 'PulmoEase 100mcg stock dropped to 4 units; NeuroCalm 25mg is currently at 0 stock.',
      unread: true,
    },
    {
      id: 'ACT-4',
      timestampLabel: 'Today · 09:10 AM',
      facilityId: 'fac-northside',
      department: 'Reception',
      actorRole: 'reception',
      patientId: 'PT-1056',
      title: 'Scheduled appointment pending check-in',
      detail: 'Samuel Brooks booked for 11:30 AM with Dr. Ananya Mehta (APT-401).',
      unread: false,
    },
  ];

  return {
    version: 1,
    facilities,
    clinicians,
    patients,
    appointments,
    visits,
    inventory,
    prescriptions,
    dispensingRecords,
    invoices,
    activityLog,
    tokenCounter: 12,
  };
}
