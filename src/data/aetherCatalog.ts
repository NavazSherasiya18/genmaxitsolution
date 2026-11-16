import controlTowerPreviewImg from '../assets/images/aether_control_tower_ui_1794824770591.jpg';
import reeferHighwayImg from '../assets/images/aether_reefer_highway_1794824769801.jpg';
import loadingBaysImg from '../assets/images/aether_loading_bays_1794824770425.jpg';
import podDeliveryImg from '../assets/images/aether_pod_delivery_1794824770772.jpg';

export const AETHER_MEDIA = {
  controlTowerPreview: controlTowerPreviewImg,
  reeferHighway: reeferHighwayImg,
  loadingBays: loadingBaysImg,
  podDelivery: podDeliveryImg,
};

export type AetherRole =
  | 'dispatcher'
  | 'cold_chain_lead'
  | 'fleet_tech'
  | 'ops_viewer';

export type DepotId = 'DEP-PUNE' | 'DEP-DEL' | 'DEP-BLR';
export type VehicleType = 'reefer' | 'express_van' | 'heavy_truck';
export type ShipmentStatus =
  | 'unassigned'
  | 'assigned'
  | 'in_transit'
  | 'delayed'
  | 'arrived'
  | 'delivered';
export type IncidentStatus = 'open' | 'acknowledged' | 'in_progress' | 'resolved';
export type IncidentSeverity = 'critical' | 'warning';

export interface Depot {
  id: DepotId;
  name: string;
  city: string;
  corridor: string;
  mapCoord: { xPct: number; yPct: number };
}

export interface FleetVehicle {
  id: string;
  plate: string;
  model: string;
  type: VehicleType;
  homeDepotId: DepotId;
  driverName: string;
  driverPhone: string; // Internal only — excluded from Customer Portal
  maxCapacityKg: number;
  reeferCapable: boolean;
  activeShipmentId: string | null;
  speedKmh: number;
  currentTempC: number | null;
  doorOpen: boolean;
  fuelOrBatteryPct: number;
  lastUpdatedLabel: string;
  lastReadingEpoch: number;
  progressPct: number; // 0..100
  mapCoord: { xPct: number; yPct: number };
}

export interface RouteStop {
  id: string;
  sequence: number;
  location: string;
  type: 'pickup' | 'waypoint' | 'delivery';
  windowLabel: string;
  status: 'pending' | 'checked_in' | 'completed';
  completedAtLabel?: string;
}

export interface TempPoint {
  timeLabel: string;
  tempC: number;
  doorOpen?: boolean;
  excursion?: boolean;
}

export interface ShipmentTimelineEvent {
  id: string;
  timestampLabel: string;
  actor: string;
  title: string;
  detail: string;
  category: 'milestone' | 'telemetry' | 'incident' | 'dispatch' | 'delivery';
  customerVisible: boolean; // Controls strict separation between ops internal & public portal
}

export interface ProofOfDelivery {
  recipientName: string;
  receivedAtLabel: string;
  method: 'preset_photo' | 'signature_pad';
  photoUrl?: string;
  signatureSvgPath?: string;
  notes?: string;
}

export interface Shipment {
  id: string;
  code: string;
  origin: string;
  originDepotId: DepotId;
  destination: string;
  customerCompany: string;
  cargoDescription: string;
  weightKg: number;
  requiresReefer: boolean;
  tempThresholdMinC: number | null;
  tempThresholdMaxC: number | null;
  sustainedThresholdMinutes: number;
  consecutiveBreachMinutes: number;
  inActiveExcursion: boolean;
  sensorRecovered: boolean;
  status: ShipmentStatus;
  delayReason?: string;
  etaLabel: string;
  serviceWindow: string;
  plannedProgressPct: number;
  actualProgressPct: number;
  assignedVehicleId: string | null;
  stops: RouteStop[];
  tempHistory: TempPoint[];
  timeline: ShipmentTimelineEvent[];
  pod: ProofOfDelivery | null;
}

export interface IotDevice {
  id: string;
  type: 'GPS Tracker' | 'Temperature Probe' | 'Door Sensor';
  vehicleId: string | null;
  batteryPct: number;
  lastSeenSecAgo: number;
  lastUpdatedLabel: string;
  firmware: string;
}

export interface ColdChainIncident {
  id: string;
  shipmentId: string;
  shipmentCode: string;
  vehicleId: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  title: string;
  policyTriggered: string;
  owner: string;
  openedAtLabel: string;
  peakTempC?: number;
  durationOutsideRangeMin: number;
  resolutionNote?: string;
  resolvedAtLabel?: string;
  timeline: { timeLabel: string; note: string; actor: string }[];
}

export interface DriverInstruction {
  id: string;
  shipmentId: string;
  vehicleId: string;
  incidentId?: string;
  sentAtLabel: string;
  sender: string;
  message: string;
  acknowledged: boolean;
  driverReply?: string;
  repliedAtLabel?: string;
}

export interface AetherDataset {
  version: number;
  depots: Depot[];
  vehicles: FleetVehicle[];
  shipments: Shipment[];
  devices: IotDevice[];
  incidents: ColdChainIncident[];
  instructions: DriverInstruction[];
  seenEventIds: string[];
  geofenceTriggeredKeys: string[];
  sensorCheckLabel: string;
}

const DEPOTS: Depot[] = [
  {
    id: 'DEP-PUNE',
    name: 'Pune Chakan Cold Hub',
    city: 'Pune / Mumbai Corridor',
    corridor: 'Mumbai–Pune Expressway (NH-48)',
    mapCoord: { xPct: 28, yPct: 58 },
  },
  {
    id: 'DEP-DEL',
    name: 'Delhi NCR Manesar Hub',
    city: 'Gurugram / NCR Corridor',
    corridor: 'NH-48 Jaipur & Yamuna Expressway',
    mapCoord: { xPct: 48, yPct: 24 },
  },
  {
    id: 'DEP-BLR',
    name: 'Bengaluru Peenya Depot',
    city: 'Bengaluru / South Corridor',
    corridor: 'NH-44 / NH-48 South Spine',
    mapCoord: { xPct: 44, yPct: 79 },
  },
];

export function createSeededAetherDataset(): AetherDataset {
  const baseEpoch = 1794825000000;

  const vehicles: FleetVehicle[] = [
    {
      id: 'VEH-01',
      plate: 'MH-12-TR-4820',
      model: 'Tata Prima 5530 Reefer',
      type: 'reefer',
      homeDepotId: 'DEP-PUNE',
      driverName: 'Rohan Deshmukh',
      driverPhone: '+91 98220 41102',
      maxCapacityKg: 14000,
      reeferCapable: true,
      activeShipmentId: 'SHP-2048',
      speedKmh: 68,
      currentTempC: 3.6,
      doorOpen: false,
      fuelOrBatteryPct: 84,
      lastUpdatedLabel: '18s ago',
      lastReadingEpoch: baseEpoch,
      progressPct: 44,
      mapCoord: { xPct: 23, yPct: 55 },
    },
    {
      id: 'VEH-02',
      plate: 'MH-14-RF-3319',
      model: 'Eicher Pro 6028 Reefer',
      type: 'reefer',
      homeDepotId: 'DEP-PUNE',
      driverName: 'Vikram Pawar',
      driverPhone: '+91 98221 50291',
      maxCapacityKg: 11000,
      reeferCapable: true,
      activeShipmentId: 'SHP-2049',
      speedKmh: 62,
      currentTempC: 4.1,
      doorOpen: false,
      fuelOrBatteryPct: 76,
      lastUpdatedLabel: '24s ago',
      lastReadingEpoch: baseEpoch,
      progressPct: 68,
      mapCoord: { xPct: 21, yPct: 53 },
    },
    {
      id: 'VEH-03',
      plate: 'MH-04-EV-7741',
      model: 'Euler HiLoad Refrigerated Van',
      type: 'express_van',
      homeDepotId: 'DEP-PUNE',
      driverName: 'Sameer Joshi',
      driverPhone: '+91 98223 11408',
      maxCapacityKg: 2600,
      reeferCapable: true,
      activeShipmentId: 'SHP-2050',
      speedKmh: 46,
      currentTempC: 5.2,
      doorOpen: false,
      fuelOrBatteryPct: 91,
      lastUpdatedLabel: '12s ago',
      lastReadingEpoch: baseEpoch,
      progressPct: 100,
      mapCoord: { xPct: 18, yPct: 52 },
    },
    {
      id: 'VEH-04',
      plate: 'MH-12-HB-9012',
      model: 'Ashok Leyland 4825 Heavy Box',
      type: 'heavy_truck',
      homeDepotId: 'DEP-PUNE',
      driverName: 'Nilesh Patil',
      driverPhone: '+91 98224 90012',
      maxCapacityKg: 18000,
      reeferCapable: false,
      activeShipmentId: 'SHP-2051',
      speedKmh: 58,
      currentTempC: null,
      doorOpen: false,
      fuelOrBatteryPct: 67,
      lastUpdatedLabel: '42s ago',
      lastReadingEpoch: baseEpoch,
      progressPct: 35,
      mapCoord: { xPct: 31, yPct: 61 },
    },
    {
      id: 'VEH-05',
      plate: 'MH-12-EX-1104',
      model: 'Tata Ultra T.7 Express',
      type: 'express_van',
      homeDepotId: 'DEP-PUNE',
      driverName: 'Kiran Bhosale',
      driverPhone: '+91 98225 33904',
      maxCapacityKg: 4200,
      reeferCapable: false,
      activeShipmentId: null,
      speedKmh: 0,
      currentTempC: null,
      doorOpen: false,
      fuelOrBatteryPct: 95,
      lastUpdatedLabel: '35s ago',
      lastReadingEpoch: baseEpoch,
      progressPct: 0,
      mapCoord: { xPct: 28, yPct: 58 },
    },
    // Delhi NCR Corridor (5)
    {
      id: 'VEH-06',
      plate: 'HR-26-RF-6190',
      model: 'BharatBenz 3528R Cold-Chain',
      type: 'reefer',
      homeDepotId: 'DEP-DEL',
      driverName: 'Arvind Yadav',
      driverPhone: '+91 98110 88219',
      maxCapacityKg: 15000,
      reeferCapable: true,
      activeShipmentId: 'SHP-2052',
      speedKmh: 54,
      currentTempC: -17.4,
      doorOpen: false,
      fuelOrBatteryPct: 72,
      lastUpdatedLabel: '29s ago',
      lastReadingEpoch: baseEpoch,
      progressPct: 58,
      mapCoord: { xPct: 43, yPct: 29 },
    },
    {
      id: 'VEH-07',
      plate: 'DL-1G-KC-9104',
      model: 'Eicher Pro 3015 Reefer',
      type: 'reefer',
      homeDepotId: 'DEP-DEL',
      driverName: 'Manoj Tiwari',
      driverPhone: '+91 98112 71042',
      maxCapacityKg: 9500,
      reeferCapable: true,
      activeShipmentId: 'SHP-2053',
      speedKmh: 38,
      currentTempC: 9.2,
      doorOpen: true,
      fuelOrBatteryPct: 61,
      lastUpdatedLabel: '280s ago',
      lastReadingEpoch: baseEpoch - 280000,
      progressPct: 64,
      mapCoord: { xPct: 54, yPct: 26 },
    },
    {
      id: 'VEH-08',
      plate: 'HR-55-HT-2041',
      model: 'Volvo FM 460 Freight Tractor',
      type: 'heavy_truck',
      homeDepotId: 'DEP-DEL',
      driverName: 'Harpreet Singh',
      driverPhone: '+91 98115 62004',
      maxCapacityKg: 20000,
      reeferCapable: false,
      activeShipmentId: 'SHP-2054',
      speedKmh: 71,
      currentTempC: null,
      doorOpen: false,
      fuelOrBatteryPct: 79,
      lastUpdatedLabel: '19s ago',
      lastReadingEpoch: baseEpoch,
      progressPct: 49,
      mapCoord: { xPct: 58, yPct: 30 },
    },
    {
      id: 'VEH-09',
      plate: 'DL-1L-EV-5582',
      model: 'Switch IeV4 City Express',
      type: 'express_van',
      homeDepotId: 'DEP-DEL',
      driverName: 'Deepak Verma',
      driverPhone: '+91 98118 44120',
      maxCapacityKg: 2200,
      reeferCapable: true,
      activeShipmentId: 'SHP-2055',
      speedKmh: 32,
      currentTempC: 4.8,
      doorOpen: false,
      fuelOrBatteryPct: 64,
      lastUpdatedLabel: '41s ago',
      lastReadingEpoch: baseEpoch,
      progressPct: 82,
      mapCoord: { xPct: 49, yPct: 23 },
    },
    {
      id: 'VEH-10',
      plate: 'HR-26-HT-8801',
      model: 'Tata Signa 4825 Heavy',
      type: 'heavy_truck',
      homeDepotId: 'DEP-DEL',
      driverName: 'Rajesh Kumar',
      driverPhone: '+91 98119 10944',
      maxCapacityKg: 17500,
      reeferCapable: false,
      activeShipmentId: null,
      speedKmh: 0,
      currentTempC: null,
      doorOpen: false,
      fuelOrBatteryPct: 89,
      lastUpdatedLabel: '52s ago',
      lastReadingEpoch: baseEpoch,
      progressPct: 0,
      mapCoord: { xPct: 48, yPct: 24 },
    },
    // Bengaluru South Corridor (5)
    {
      id: 'VEH-11',
      plate: 'KA-01-AG-3372',
      model: 'BharatBenz 2823R Insulated',
      type: 'reefer',
      homeDepotId: 'DEP-BLR',
      driverName: 'Karthik Gowda',
      driverPhone: '+91 98450 22914',
      maxCapacityKg: 12000,
      reeferCapable: true,
      activeShipmentId: 'SHP-2056',
      speedKmh: 66,
      currentTempC: 3.1,
      doorOpen: false,
      fuelOrBatteryPct: 81,
      lastUpdatedLabel: '16s ago',
      lastReadingEpoch: baseEpoch,
      progressPct: 73,
      mapCoord: { xPct: 55, yPct: 77 },
    },
    {
      id: 'VEH-12',
      plate: 'KA-04-RF-1198',
      model: 'Tata LPT 1918 Reefer',
      type: 'reefer',
      homeDepotId: 'DEP-BLR',
      driverName: 'Suresh Nair',
      driverPhone: '+91 98451 60382',
      maxCapacityKg: 10500,
      reeferCapable: true,
      activeShipmentId: 'SHP-2057',
      speedKmh: 59,
      currentTempC: -19.2,
      doorOpen: false,
      fuelOrBatteryPct: 74,
      lastUpdatedLabel: '31s ago',
      lastReadingEpoch: baseEpoch,
      progressPct: 51,
      mapCoord: { xPct: 47, yPct: 69 },
    },
    {
      id: 'VEH-13',
      plate: 'KA-02-HT-4090',
      model: 'Ashok Leyland 3520 Heavy',
      type: 'heavy_truck',
      homeDepotId: 'DEP-BLR',
      driverName: 'Prakash Shetty',
      driverPhone: '+91 98452 77810',
      maxCapacityKg: 16000,
      reeferCapable: false,
      activeShipmentId: 'SHP-2058',
      speedKmh: 63,
      currentTempC: null,
      doorOpen: false,
      fuelOrBatteryPct: 58,
      lastUpdatedLabel: '44s ago',
      lastReadingEpoch: baseEpoch,
      progressPct: 100,
      mapCoord: { xPct: 64, yPct: 76 },
    },
    {
      id: 'VEH-14',
      plate: 'KA-01-EV-9410',
      model: 'Mahindra Treo Zor Chilled',
      type: 'express_van',
      homeDepotId: 'DEP-BLR',
      driverName: 'Arun Murthy',
      driverPhone: '+91 98453 19022',
      maxCapacityKg: 2000,
      reeferCapable: true,
      activeShipmentId: 'SHP-2059',
      speedKmh: 41,
      currentTempC: 4.5,
      doorOpen: false,
      fuelOrBatteryPct: 77,
      lastUpdatedLabel: '1140s ago',
      lastReadingEpoch: baseEpoch - 1140000,
      progressPct: 39,
      mapCoord: { xPct: 41, yPct: 81 },
    },
    {
      id: 'VEH-15',
      plate: 'KA-51-HB-7721',
      model: 'Eicher Pro 5040 Container',
      type: 'heavy_truck',
      homeDepotId: 'DEP-BLR',
      driverName: 'Naveen Reddy',
      driverPhone: '+91 98455 80134',
      maxCapacityKg: 18000,
      reeferCapable: false,
      activeShipmentId: null,
      speedKmh: 0,
      currentTempC: null,
      doorOpen: false,
      fuelOrBatteryPct: 92,
      lastUpdatedLabel: '40s ago',
      lastReadingEpoch: baseEpoch,
      progressPct: 0,
      mapCoord: { xPct: 44, yPct: 79 },
    },
  ];

  // Flagship Shipment AFL-2048 + 29 Realistic Fleet Shipments (30 Total)
  const flagship: Shipment = {
    id: 'SHP-2048',
    code: 'AFL-2048',
    origin: 'Chakan Biopharma DC, Pune',
    originDepotId: 'DEP-PUNE',
    destination: 'Lilavati Clinical Supply Hub, Mumbai',
    customerCompany: 'Solstice Biopharma India Ltd',
    cargoDescription: 'Chilled Oncology Biologics & Diagnostic Reagents (Palletized)',
    weightKg: 3840,
    requiresReefer: true,
    tempThresholdMinC: 2.0,
    tempThresholdMaxC: 8.0,
    sustainedThresholdMinutes: 10,
    consecutiveBreachMinutes: 0,
    inActiveExcursion: false,
    sensorRecovered: false,
    status: 'in_transit',
    etaLabel: '14:25 IST (Today)',
    serviceWindow: '10:00 – 15:00 IST Strict 2–8°C',
    plannedProgressPct: 48,
    actualProgressPct: 44,
    assignedVehicleId: 'VEH-01',
    stops: [
      {
        id: 'STP-2048-1',
        sequence: 1,
        location: 'Chakan Biopharma DC, Pune (Gate B)',
        type: 'pickup',
        windowLabel: '09:30 – 10:15 IST',
        status: 'completed',
        completedAtLabel: '10:04 IST',
      },
      {
        id: 'STP-2048-2',
        sequence: 2,
        location: 'Khalapur Expressway Seal Check, MH-48',
        type: 'waypoint',
        windowLabel: '11:45 – 12:15 IST',
        status: 'pending',
      },
      {
        id: 'STP-2048-3',
        sequence: 3,
        location: 'Lilavati Clinical Supply Hub, Bandra West, Mumbai',
        type: 'delivery',
        windowLabel: '13:45 – 15:00 IST',
        status: 'pending',
      },
    ],
    tempHistory: [
      { timeLabel: '10:00', tempC: 3.4 },
      { timeLabel: '10:30', tempC: 3.5 },
      { timeLabel: '11:00', tempC: 3.8 },
      { timeLabel: '11:30', tempC: 3.6 },
    ],
    timeline: [
      {
        id: 'TL-2048-1',
        timestampLabel: '09:50 IST',
        actor: 'Dispatcher Control',
        title: 'Pre-cooled Reefer Unit Verified (3.4°C)',
        detail: 'MH-12-TR-4820 pre-chill check cleared at Chakan Cold Bay 04.',
        category: 'dispatch',
        customerVisible: true,
      },
      {
        id: 'TL-2048-2',
        timestampLabel: '10:04 IST',
        actor: 'Geofence Engine',
        title: 'Departed Pune Chakan Biopharma DC',
        detail: 'Cargo seal locked; GPS tracker & cryo temperature probes nominal.',
        category: 'milestone',
        customerVisible: true,
      },
      {
        id: 'TL-2048-3',
        timestampLabel: '11:30 IST',
        actor: 'Telemetry Stream',
        title: 'En Route Mumbai–Pune Expressway (Kilometer 44)',
        detail: 'Cabinet holding steady at 3.6°C within 2°C–8°C clinical threshold.',
        category: 'telemetry',
        customerVisible: true,
      },
    ],
    pod: null,
  };

  const extraRoutes: {
    code: string;
    origin: string;
    depot: DepotId;
    dest: string;
    cust: string;
    cargo: string;
    weight: number;
    reefer: boolean;
    status: ShipmentStatus;
    veh: string | null;
    progress: number;
    delayReason?: string;
    minC: number | null;
    maxC: number | null;
  }[] = [
    { code: 'AFL-2049', origin: 'Pune Chakan Cold Hub', depot: 'DEP-PUNE', dest: 'Bhiwandi Pharma Logistics Park', cust: 'Deccan Healthcare Systems', cargo: 'Insulin Cold Vials', weight: 4200, reefer: true, status: 'in_transit', veh: 'VEH-02', progress: 68, minC: 2, maxC: 8 },
    { code: 'AFL-2050', origin: 'Pune Hinjewadi Cold Store', depot: 'DEP-PUNE', dest: 'South Mumbai Hospital Chain', cust: 'Sahyadri Labs', cargo: 'Pathology Sample Packs', weight: 1450, reefer: true, status: 'arrived', veh: 'VEH-03', progress: 100, minC: 2, maxC: 8 },
    { code: 'AFL-2051', origin: 'Pune Pimpri Auto Plant', depot: 'DEP-PUNE', dest: 'Nhava Sheva JNPT Terminal', cust: 'Kalyani Mobility Exports', cargo: 'Precision Powertrain Axles', weight: 12400, reefer: false, status: 'in_transit', veh: 'VEH-04', progress: 35, minC: null, maxC: null },
    { code: 'AFL-2052', origin: 'Manesar Cryo Hub, NCR', depot: 'DEP-DEL', dest: 'Jaipur Medical Depot', cust: 'NorthStar Biotech', cargo: 'Frozen Plasma Boxes (-18°C)', weight: 5800, reefer: true, status: 'in_transit', veh: 'VEH-06', progress: 58, minC: -22, maxC: -15 },
    { code: 'AFL-2053', origin: 'Delhi NCR Manesar Hub', depot: 'DEP-DEL', dest: 'Noida Sector 62 Life Sciences', cust: 'Arogya Pharma Distributors', cargo: 'Pediatric Vaccines', weight: 3200, reefer: true, status: 'delayed', veh: 'VEH-07', progress: 64, delayReason: 'Unscheduled ambient door breach near Gurugram toll', minC: 2, maxC: 8 },
    { code: 'AFL-2054', origin: 'Delhi Okhla Freight Yard', depot: 'DEP-DEL', dest: 'Agra Electronics Warehouse', cust: 'Vortex Semicon India', cargo: 'Industrial Control Racks', weight: 14200, reefer: false, status: 'in_transit', veh: 'VEH-08', progress: 49, minC: null, maxC: null },
    { code: 'AFL-2055', origin: 'Gurugram Cold Annex', depot: 'DEP-DEL', dest: 'AIIMS Central Pharmacy, Delhi', cust: 'MedCare Clinical Group', cargo: 'Diagnostic Serum', weight: 1100, reefer: true, status: 'in_transit', veh: 'VEH-09', progress: 82, minC: 2, maxC: 8 },
    { code: 'AFL-2056', origin: 'Bengaluru Peenya Depot', depot: 'DEP-BLR', dest: 'Chennai Sriperumbudur Pharma Hub', cust: 'Southern Biologics Ltd', cargo: 'Bioreactor Reagents', weight: 6100, reefer: true, status: 'in_transit', veh: 'VEH-11', progress: 73, minC: 2, maxC: 8 },
    { code: 'AFL-2057', origin: 'Bengaluru Peenya Depot', depot: 'DEP-BLR', dest: 'Hyderabad Genome Valley', cust: 'Cauvery Cryogenics', cargo: 'Deep-Freeze mRNA Lots', weight: 4900, reefer: true, status: 'in_transit', veh: 'VEH-12', progress: 51, minC: -24, maxC: -16 },
    { code: 'AFL-2058', origin: 'Bengaluru Hosur Industrial', depot: 'DEP-BLR', dest: 'Chennai Port Container Gate', cust: 'Kaveri Precision Castings', cargo: 'EV Battery Enclosures', weight: 11800, reefer: false, status: 'arrived', veh: 'VEH-13', progress: 100, minC: null, maxC: null },
    { code: 'AFL-2059', origin: 'Bengaluru Whitefield Lab', depot: 'DEP-BLR', dest: 'Mysuru Clinical Center', cust: 'Helios BioLabs', cargo: 'Refrigerated Enzymes', weight: 950, reefer: true, status: 'delayed', veh: 'VEH-14', progress: 39, delayReason: 'Sensor gateway intermittent telemetry blackout', minC: 2, maxC: 8 },
    // Unassigned ready for Dispatch Board
    { code: 'AFL-2060', origin: 'Pune Chakan Cold Hub', depot: 'DEP-PUNE', dest: 'Thane Regional Vaccine Hub', cust: 'Solstice Biopharma India Ltd', cargo: 'Chilled Antibody Lot', weight: 3100, reefer: true, status: 'unassigned', veh: null, progress: 0, minC: 2, maxC: 8 },
    { code: 'AFL-2061', origin: 'Pune Ranjangaon Plant', depot: 'DEP-PUNE', dest: 'Aurangabad Assembly Hub', cust: 'Sahyadri Precision', cargo: 'CNC Stamping Coils', weight: 15500, reefer: false, status: 'unassigned', veh: null, progress: 0, minC: null, maxC: null },
    { code: 'AFL-2062', origin: 'Delhi NCR Manesar Hub', depot: 'DEP-DEL', dest: 'Chandigarh Pharma Store', cust: 'NorthStar Biotech', cargo: 'Cryo Blood Screening Kits', weight: 2800, reefer: true, status: 'unassigned', veh: null, progress: 0, minC: 2, maxC: 8 },
    { code: 'AFL-2063', origin: 'Bengaluru Peenya Depot', depot: 'DEP-BLR', dest: 'Coimbatore Textile Machinery Park', cust: 'Deccan Drives', cargo: 'Industrial Servo Motors', weight: 8200, reefer: false, status: 'unassigned', veh: null, progress: 0, minC: null, maxC: null },
    // Assigned queued for departure
    { code: 'AFL-2064', origin: 'Pune Chakan Cold Hub', depot: 'DEP-PUNE', dest: 'Nashik Fresh Cold Park', cust: 'Western Agro Cold', cargo: 'Perishable Grape Pallets', weight: 6400, reefer: true, status: 'assigned', veh: 'VEH-02', progress: 0, minC: 1, maxC: 5 },
    { code: 'AFL-2065', origin: 'Delhi NCR Manesar Hub', depot: 'DEP-DEL', dest: 'Faridabad Auto Warehouse', cust: 'Bharat Forgings', cargo: 'Machined Gear Housings', weight: 13200, reefer: false, status: 'assigned', veh: 'VEH-08', progress: 0, minC: null, maxC: null },
    { code: 'AFL-2066', origin: 'Bengaluru Peenya Depot', depot: 'DEP-BLR', dest: 'Kochi Seafood Export Cold Port', cust: 'Malabar Marine Foods', cargo: 'Frozen Export Shrimp', weight: 7400, reefer: true, status: 'assigned', veh: 'VEH-11', progress: 0, minC: -20, maxC: -14 },
    { code: 'AFL-2067', origin: 'Pune Chakan Cold Hub', depot: 'DEP-PUNE', dest: 'Nagpur MIHAN Cargo Hub', cust: 'Solstice Biopharma India Ltd', cargo: 'Sterile Diluents', weight: 3900, reefer: true, status: 'assigned', veh: 'VEH-01', progress: 0, minC: 2, maxC: 8 },
    // Delayed
    { code: 'AFL-2068', origin: 'Delhi NCR Manesar Hub', depot: 'DEP-DEL', dest: 'Lucknow Central Medical Hub', cust: 'Arogya Pharma Distributors', cargo: 'Thermal Stabilizers', weight: 4600, reefer: true, status: 'delayed', veh: 'VEH-06', progress: 42, delayReason: 'Fog congestion delay along Agra–Lucknow Expressway', minC: 2, maxC: 8 },
    // Additional in-transit
    { code: 'AFL-2069', origin: 'Pune Chakan Cold Hub', depot: 'DEP-PUNE', dest: 'Surat Industrial Zone', cust: 'Western Chem Lab', cargo: 'Ambient Polymers', weight: 9800, reefer: false, status: 'in_transit', veh: 'VEH-04', progress: 61, minC: null, maxC: null },
    { code: 'AFL-2070', origin: 'Bengaluru Peenya Depot', depot: 'DEP-BLR', dest: 'Pune Talegaon Logistics', cust: 'Kaveri Mobility', cargo: 'EV Inverter Packs', weight: 5200, reefer: false, status: 'in_transit', veh: 'VEH-13', progress: 44, minC: null, maxC: null },
    { code: 'AFL-2071', origin: 'Delhi NCR Manesar Hub', depot: 'DEP-DEL', dest: 'Ludhiana Cold Terminal', cust: 'Punjab Dairy Co-op', cargo: 'UHT Chilled Dairy', weight: 7100, reefer: true, status: 'in_transit', veh: 'VEH-06', progress: 55, minC: 2, maxC: 6 },
    { code: 'AFL-2072', origin: 'Bengaluru Peenya Depot', depot: 'DEP-BLR', dest: 'Mangaluru Port Reefer Yard', cust: 'Malabar Marine Foods', cargo: 'Chilled Tuna Boxes', weight: 5400, reefer: true, status: 'in_transit', veh: 'VEH-12', progress: 62, minC: -4, maxC: 2 },
    // Delivered (5 completed trips with PODs)
    { code: 'AFL-2073', origin: 'Pune Chakan Cold Hub', depot: 'DEP-PUNE', dest: 'Navi Mumbai Taloja Pharma Depot', cust: 'Solstice Biopharma India Ltd', cargo: 'Clinical Trial Vials', weight: 2100, reefer: true, status: 'delivered', veh: 'VEH-02', progress: 100, minC: 2, maxC: 8 },
    { code: 'AFL-2074', origin: 'Delhi NCR Manesar Hub', depot: 'DEP-DEL', dest: 'Gurgaon Cyberhub Clinic', cust: 'MedCare Clinical Group', cargo: 'Diagnostic Cold Kits', weight: 980, reefer: true, status: 'delivered', veh: 'VEH-09', progress: 100, minC: 2, maxC: 8 },
    { code: 'AFL-2075', origin: 'Bengaluru Peenya Depot', depot: 'DEP-BLR', dest: 'Electronic City Fab Annex', cust: 'Helios BioLabs', cargo: 'Cleanroom HEPA Modules', weight: 6500, reefer: false, status: 'delivered', veh: 'VEH-13', progress: 100, minC: null, maxC: null },
    { code: 'AFL-2076', origin: 'Pune Chakan Cold Hub', depot: 'DEP-PUNE', dest: 'Andheri West Medical Tower', cust: 'Deccan Healthcare Systems', cargo: 'Oncology Infusions', weight: 1850, reefer: true, status: 'delivered', veh: 'VEH-03', progress: 100, minC: 2, maxC: 8 },
    { code: 'AFL-2077', origin: 'Delhi NCR Manesar Hub', depot: 'DEP-DEL', dest: 'Panipat Refinery Stores', cust: 'Bharat Forgings', cargo: 'Industrial Valve Skids', weight: 14900, reefer: false, status: 'delivered', veh: 'VEH-08', progress: 100, minC: null, maxC: null },
  ];

  const restShipments: Shipment[] = extraRoutes.map((r, idx) => {
    const id = `SHP-${2049 + idx}`;
    const isDel = r.status === 'delivered';
    const isArr = r.status === 'arrived';
    const tempBase = r.minC !== null && r.maxC !== null ? Number(((r.minC + r.maxC) / 2).toFixed(1)) : 24.0;
    return {
      id,
      code: r.code,
      origin: r.origin,
      originDepotId: r.depot,
      destination: r.dest,
      customerCompany: r.cust,
      cargoDescription: r.cargo,
      weightKg: r.weight,
      requiresReefer: r.reefer,
      tempThresholdMinC: r.minC,
      tempThresholdMaxC: r.maxC,
      sustainedThresholdMinutes: 10,
      consecutiveBreachMinutes: r.code === 'AFL-2053' ? 14 : 0,
      inActiveExcursion: r.code === 'AFL-2053',
      sensorRecovered: false,
      status: r.status,
      delayReason: r.delayReason,
      etaLabel: isDel
        ? 'Completed'
        : isArr
        ? 'At Receiving Bay (POD Pending)'
        : r.status === 'delayed'
        ? '+45m Delayed (16:10 IST)'
        : r.status === 'unassigned'
        ? 'Awaiting Dispatch'
        : 'Today · 15:40 IST',
      serviceWindow: '08:00 – 18:00 IST',
      plannedProgressPct: isDel || isArr ? 100 : r.status === 'unassigned' ? 0 : Math.min(95, r.progress + 4),
      actualProgressPct: r.progress,
      assignedVehicleId: r.veh,
      stops: [
        {
          id: `STP-${r.code}-1`,
          sequence: 1,
          location: r.origin,
          type: 'pickup',
          windowLabel: '08:30 – 09:30 IST',
          status: r.progress > 0 || isDel || isArr ? 'completed' : 'pending',
        },
        {
          id: `STP-${r.code}-2`,
          sequence: 2,
          location: r.dest,
          type: 'delivery',
          windowLabel: '14:30 – 17:30 IST',
          status: isDel ? 'completed' : isArr ? 'checked_in' : 'pending',
        },
      ],
      tempHistory:
        r.reefer && r.minC !== null
          ? [
              { timeLabel: '09:00', tempC: tempBase - 0.3 },
              { timeLabel: '10:00', tempC: tempBase + 0.2 },
              {
                timeLabel: '11:00',
                tempC: r.code === 'AFL-2053' ? 9.2 : tempBase + 0.1,
                doorOpen: r.code === 'AFL-2053',
                excursion: r.code === 'AFL-2053',
              },
            ]
          : [],
      timeline: [
        {
          id: `TL-${r.code}-1`,
          timestampLabel: '08:40 IST',
          actor: 'Operations Control',
          title: `Manifest Registered (${r.code})`,
          detail: `${r.cargo} scheduled from ${r.origin} to ${r.dest}.`,
          category: 'dispatch',
          customerVisible: true,
        },
        ...(isArr
          ? [
              {
                id: `TL-${r.code}-ARR`,
                timestampLabel: '11:18 IST',
                actor: 'Geofence Engine',
                title: `Arrived at ${r.dest} Gate`,
                detail: 'Vehicle entered destination geofence; awaiting Proof of Delivery capture.',
                category: 'milestone' as const,
                customerVisible: true,
              },
            ]
          : []),
        ...(isDel
          ? [
              {
                id: `TL-${r.code}-DEL`,
                timestampLabel: '11:25 IST',
                actor: 'Driver App',
                title: 'Delivered · Proof of Delivery Verified',
                detail: 'Signed receipt and cold container image captured at receiving bay.',
                category: 'delivery' as const,
                customerVisible: true,
              },
            ]
          : []),
      ],
      pod: isDel
        ? {
            recipientName: 'Dr. Meera Kulkarni (Receiving Lead)',
            receivedAtLabel: 'Today · 11:25 IST',
            method: 'preset_photo',
            photoUrl: podDeliveryImg,
            notes: 'Seal intact; digital receipt logged cleanly.',
          }
        : null,
    };
  });

  const devices: IotDevice[] = [
    { id: 'DEV-GPS-2048', type: 'GPS Tracker', vehicleId: 'VEH-01', batteryPct: 92, lastSeenSecAgo: 18, lastUpdatedLabel: '18s ago', firmware: 'AF-GPS v4.2' },
    { id: 'DEV-TMP-2048', type: 'Temperature Probe', vehicleId: 'VEH-01', batteryPct: 88, lastSeenSecAgo: 18, lastUpdatedLabel: '18s ago', firmware: 'CRYO-T2 v3.1' },
    { id: 'DEV-DOOR-2048', type: 'Door Sensor', vehicleId: 'VEH-01', batteryPct: 95, lastSeenSecAgo: 20, lastUpdatedLabel: '20s ago', firmware: 'MAG-D1 v2.0' },
    { id: 'DEV-GPS-02', type: 'GPS Tracker', vehicleId: 'VEH-02', batteryPct: 84, lastSeenSecAgo: 24, lastUpdatedLabel: '24s ago', firmware: 'AF-GPS v4.2' },
    { id: 'DEV-TMP-02', type: 'Temperature Probe', vehicleId: 'VEH-02', batteryPct: 79, lastSeenSecAgo: 24, lastUpdatedLabel: '24s ago', firmware: 'CRYO-T2 v3.1' },
    { id: 'DEV-GPS-03', type: 'GPS Tracker', vehicleId: 'VEH-03', batteryPct: 91, lastSeenSecAgo: 12, lastUpdatedLabel: '12s ago', firmware: 'AF-GPS v4.2' },
    { id: 'DEV-TMP-06', type: 'Temperature Probe', vehicleId: 'VEH-06', batteryPct: 76, lastSeenSecAgo: 29, lastUpdatedLabel: '29s ago', firmware: 'CRYO-T2 v3.1' },
    // Intentionally STALE device (280s) for live Stale state demonstration
    { id: 'DEV-TMP-07', type: 'Temperature Probe', vehicleId: 'VEH-07', batteryPct: 38, lastSeenSecAgo: 280, lastUpdatedLabel: '4m 40s ago', firmware: 'CRYO-T2 v3.0' },
    { id: 'DEV-DOOR-07', type: 'Door Sensor', vehicleId: 'VEH-07', batteryPct: 54, lastSeenSecAgo: 280, lastUpdatedLabel: '4m 40s ago', firmware: 'MAG-D1 v2.0' },
    { id: 'DEV-GPS-11', type: 'GPS Tracker', vehicleId: 'VEH-11', batteryPct: 89, lastSeenSecAgo: 16, lastUpdatedLabel: '16s ago', firmware: 'AF-GPS v4.2' },
    // Intentionally OFFLINE device (1140s) for Offline health derivation
    { id: 'DEV-GPS-14', type: 'GPS Tracker', vehicleId: 'VEH-14', batteryPct: 11, lastSeenSecAgo: 1140, lastUpdatedLabel: '19m ago', firmware: 'AF-GPS v3.9' },
    { id: 'DEV-TMP-SPARE', type: 'Temperature Probe', vehicleId: null, batteryPct: 100, lastSeenSecAgo: 45, lastUpdatedLabel: '45s ago', firmware: 'CRYO-T2 v3.1' },
  ];

  const incidents: ColdChainIncident[] = [
    {
      id: 'INC-1982',
      shipmentId: 'SHP-2053',
      shipmentCode: 'AFL-2053',
      vehicleId: 'VEH-07',
      severity: 'warning',
      status: 'acknowledged',
      title: 'Sustained Thermal Breach (+9.2°C) & Side Door Open — AFL-2053',
      policyTriggered: 'Chilled Pharma Policy (2.0°C – 8.0°C, 10m sustained)',
      owner: 'Ananya Sen (Cold-Chain Lead)',
      openedAtLabel: '11:02 IST',
      peakTempC: 9.2,
      durationOutsideRangeMin: 14,
      timeline: [
        { timeLabel: '11:02 IST', note: 'Door sensor reported side latch open; temp rose past 8.0°C ceiling.', actor: 'Telemetry Rule' },
        { timeLabel: '11:10 IST', note: 'Alert acknowledged; awaiting Noida toll stop re-chill check.', actor: 'Ananya Sen' },
      ],
    },
    {
      id: 'INC-1979',
      shipmentId: 'SHP-2056',
      shipmentCode: 'AFL-2056',
      vehicleId: 'VEH-11',
      severity: 'warning',
      status: 'resolved',
      title: 'Loading Bay Defrost Cycle Spike Cleared — AFL-2056',
      policyTriggered: 'Biologics Corridor (2.0°C – 8.0°C)',
      owner: 'Dispatcher Desk',
      openedAtLabel: '07:45 IST',
      peakTempC: 8.4,
      durationOutsideRangeMin: 6,
      resolutionNote: 'Manual compressor boost verified back at 3.1°C before Sriperumbudur highway entry.',
      resolvedAtLabel: '08:02 IST',
      timeline: [
        { timeLabel: '07:45 IST', note: 'Brief defrost excursion logged during Peenya departure.', actor: 'Telemetry Rule' },
        { timeLabel: '08:02 IST', note: 'Resolved after steady 3.1°C recovery reading confirmed.', actor: 'Dispatcher Desk' },
      ],
    },
  ];

  const instructions: DriverInstruction[] = [
    {
      id: 'INS-2053-1',
      shipmentId: 'SHP-2053',
      vehicleId: 'VEH-07',
      incidentId: 'INC-1982',
      sentAtLabel: '11:11 IST',
      sender: 'Ananya Sen (Control Tower)',
      message: 'Verify rear reefer seal shut securely and enable Auxiliary Boost mode.',
      acknowledged: true,
      driverReply: 'Door latch reseated at toll bay; compressor set to boost.',
      repliedAtLabel: '11:15 IST',
    },
  ];

  return {
    version: 1,
    depots: DEPOTS,
    vehicles,
    shipments: [flagship, ...restShipments],
    devices,
    incidents,
    instructions,
    seenEventIds: ['SEED-INIT-1'],
    geofenceTriggeredKeys: ['SHP-2048:departed_depot'],
    sensorCheckLabel: 'Synced · 18s ago',
  };
}
