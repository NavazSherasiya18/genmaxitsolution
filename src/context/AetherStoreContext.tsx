import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AETHER_MEDIA,
  AetherDataset,
  AetherRole,
  ColdChainIncident,
  DepotId,
  DriverInstruction,
  IotDevice,
  ProofOfDelivery,
  Shipment,
  ShipmentTimelineEvent,
  createSeededAetherDataset,
} from '../data/aetherCatalog';
import {
  TelemetryReadingInput,
  evaluateColdChainReading,
} from '../utils/aetherEngine';

const STORAGE_KEY = 'aether_fleet_demo_v1';

export interface AetherActionResult<T = undefined> {
  ok: boolean;
  error?: string;
  data?: T;
}

export type ReplayMode = 'idle' | 'playing_route' | 'paused';

interface PersistedAetherState {
  dataset: AetherDataset;
}

interface AetherContextValue {
  dataset: AetherDataset;
  activeRole: AetherRole;
  setActiveRole: (role: AetherRole) => void;
  activeDepotFilter: 'ALL' | DepotId;
  setActiveDepotFilter: (depot: 'ALL' | DepotId) => void;
  selectedShipmentId: string;
  setSelectedShipmentId: (id: string) => void;
  selectedVehicleId: string;
  setSelectedVehicleId: (id: string) => void;
  guidedDemoActive: boolean;
  setGuidedDemoActive: (active: boolean) => void;
  lastEngineMessage: string | null;

  // Replay Engine Controls
  replayMode: ReplayMode;
  replaySpeed: 1 | 3;
  setReplaySpeed: (speed: 1 | 3) => void;
  playRouteSimulation: () => void;
  pauseSimulation: () => void;
  restartSimulation: () => void;
  triggerColdChainIncidentReplay: () => void;
  triggerSensorRecoveryReplay: () => void;
  ingestTelemetryPacket: (pkt: TelemetryReadingInput) => AetherActionResult;

  // Dispatch, Fleet & IoT Mutations
  createSampleShipment: (input: {
    originDepotId: DepotId;
    destination: string;
    customerCompany: string;
    cargoDescription: string;
    weightKg: number;
    requiresReefer: boolean;
  }) => AetherActionResult<Shipment>;
  assignShipmentToVehicle: (shipmentId: string, vehicleId: string) => AetherActionResult;
  reorderShipmentStop: (
    shipmentId: string,
    stopId: string,
    direction: 'up' | 'down'
  ) => AetherActionResult;
  registerIotDevice: (input: {
    type: IotDevice['type'];
    vehicleId: string;
  }) => AetherActionResult<IotDevice>;

  // Incident Workflow
  acknowledgeIncident: (incidentId: string, assignee: string) => AetherActionResult;
  updateIncidentStatus: (
    incidentId: string,
    status: ColdChainIncident['status'],
    resolutionNote?: string
  ) => AetherActionResult;
  sendDriverInstruction: (input: {
    shipmentId: string;
    vehicleId: string;
    incidentId?: string;
    message: string;
  }) => AetherActionResult<DriverInstruction>;

  // Driver App Actions
  acknowledgeDriverInstruction: (
    instructionId: string,
    replyText: string
  ) => AetherActionResult;
  checkInStop: (shipmentId: string, stopId: string) => AetherActionResult;
  completeStop: (shipmentId: string, stopId: string) => AetherActionResult;
  logDriverException: (shipmentId: string, note: string) => AetherActionResult;
  recordProofOfDelivery: (
    shipmentId: string,
    pod: Omit<ProofOfDelivery, 'receivedAtLabel'>
  ) => AetherActionResult;

  resetDemoData: () => void;
}

const AetherStoreContext = createContext<AetherContextValue | undefined>(undefined);

function nowIstLabel(): string {
  return `${new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())} IST`;
}

export const AetherStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [persisted, setPersisted] = useState<PersistedAetherState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.dataset?.version === 1 && Array.isArray(parsed.dataset.shipments)) {
          return parsed as PersistedAetherState;
        }
      }
    } catch {
      // Fall back to fresh seed
    }
    return { dataset: createSeededAetherDataset() };
  });

  const [activeRole, setActiveRole] = useState<AetherRole>('dispatcher');
  const [activeDepotFilter, setActiveDepotFilter] = useState<'ALL' | DepotId>('ALL');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>('SHP-2048');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('VEH-01');
  const [guidedDemoActive, setGuidedDemoActive] = useState<boolean>(false);
  const [replayMode, setReplayMode] = useState<ReplayMode>('idle');
  const [replaySpeed, setReplaySpeed] = useState<1 | 3>(1);
  const [lastEngineMessage, setLastEngineMessage] = useState<string | null>(null);

  const incidentTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // Ignore storage quota errors
    }
  }, [persisted]);

  const applyTelemetryPacketToState = useCallback(
    (prev: AetherDataset, pkt: TelemetryReadingInput, minutesDelta = 6): AetherDataset => {
      // 1. Deduplicate strictly by eventId
      if (prev.seenEventIds.includes(pkt.eventId)) {
        return prev;
      }

      const targetVehicle = prev.vehicles.find((v) => v.id === pkt.vehicleId);
      if (!targetVehicle) return prev;

      const isLatePacket = pkt.seqEpoch < targetVehicle.lastReadingEpoch;

      const nextSeenIds = [...prev.seenEventIds, pkt.eventId].slice(-300);
      const nextGeofences = [...prev.geofenceTriggeredKeys];
      let nextIncidents = [...prev.incidents];
      let spawnedMessage: string | null = null;

      // Update vehicle metrics ONLY if packet is not late (never rewind vehicle backward!)
      const updatedVehicles = prev.vehicles.map((v) => {
        if (v.id !== pkt.vehicleId) return v;
        if (isLatePacket) {
          return {
            ...v,
            lastUpdatedLabel: 'Just synced (late packet logged)',
          };
        }
        const prog =
          typeof pkt.progressPct === 'number'
            ? Math.max(v.progressPct, Math.min(100, pkt.progressPct))
            : v.progressPct;
        // Interpolate along Pune (28,58) -> Mumbai (17,51) corridor cleanly for VEH-01
        const newCoord =
          v.id === 'VEH-01'
            ? {
                xPct: Number((28 - (prog / 100) * 11).toFixed(1)),
                yPct: Number((58 - (prog / 100) * 7).toFixed(1)),
              }
            : v.mapCoord;

        return {
          ...v,
          speedKmh: pkt.speedKmh ?? v.speedKmh,
          currentTempC: pkt.tempC ?? v.currentTempC,
          doorOpen: pkt.doorOpen ?? v.doorOpen,
          progressPct: prog,
          mapCoord: newCoord,
          lastUpdatedLabel: pkt.timeLabel,
          lastReadingEpoch: pkt.seqEpoch,
        };
      });

      // Refresh linked device timestamps cleanly
      const updatedDevices = prev.devices.map((d) =>
        d.id === pkt.deviceId || d.vehicleId === pkt.vehicleId
          ? { ...d, lastSeenSecAgo: isLatePacket ? d.lastSeenSecAgo : 8, lastUpdatedLabel: pkt.timeLabel }
          : d
      );

      // Update target shipment if provided
      const updatedShipments = prev.shipments.map((s) => {
        if (s.id !== pkt.shipmentId) return s;

        let nextStatus = s.status;
        let nextActualProg = isLatePacket
          ? s.actualProgressPct
          : typeof pkt.progressPct === 'number'
          ? Math.max(s.actualProgressPct, Math.min(100, pkt.progressPct))
          : s.actualProgressPct;
        let nextConsecMins = s.consecutiveBreachMinutes;
        let nextInExcursion = s.inActiveExcursion;
        let nextRecovered = s.sensorRecovered;
        const addedTimeline: ShipmentTimelineEvent[] = [];

        if (isLatePacket) {
          addedTimeline.push({
            id: `TL-LATE-${pkt.eventId}`,
            timestampLabel: pkt.timeLabel,
            actor: 'Telemetry Guardrail',
            title: 'Out-of-order delayed packet recorded',
            detail: `Late packet (${pkt.tempC ?? 'GPS'}°) archived without regressing route position.`,
            category: 'telemetry',
            customerVisible: false,
          });
        }

        // Deduplicated Geofence Boundary Milestone
        if (pkt.geofenceEvent && !isLatePacket) {
          const gKey = `${s.id}:${pkt.geofenceEvent}`;
          if (!nextGeofences.includes(gKey)) {
            nextGeofences.push(gKey);
            if (pkt.geofenceEvent === 'arrived_destination' && s.status !== 'delivered') {
              nextStatus = 'arrived'; // Keeps Arrived distinct from Delivered!
              nextActualProg = 100;
              addedTimeline.push({
                id: `TL-GF-${pkt.eventId}`,
                timestampLabel: pkt.timeLabel,
                actor: 'Geofence Engine',
                title: `Arrived at ${s.destination} Geofence`,
                detail: 'Vehicle entered receiving geofence. Proof of Delivery still required for completion.',
                category: 'milestone',
                customerVisible: true,
              });
            }
          }
        }

        // Door Event Log
        if (pkt.doorOpen === true && !isLatePacket) {
          addedTimeline.push({
            id: `TL-DOOR-${pkt.eventId}`,
            timestampLabel: pkt.timeLabel,
            actor: 'IoT Door Sensor',
            title: 'Unscheduled Rear Cargo Door Opened',
            detail: `Door sensor (${pkt.deviceId}) opened outside approved depot gate.`,
            category: 'incident',
            customerVisible: false,
          });
        }

        // Cold-Chain Policy Evaluation (if shipment has configured bounds & reading has tempC)
        let nextTempHistory = [...s.tempHistory];
        if (
          typeof pkt.tempC === 'number' &&
          s.tempThresholdMinC !== null &&
          s.tempThresholdMaxC !== null
        ) {
          const evalRes = evaluateColdChainReading({
            tempC: pkt.tempC,
            minC: s.tempThresholdMinC,
            maxC: s.tempThresholdMaxC,
            previousBreachMinutes: s.consecutiveBreachMinutes,
            minutesDelta,
            sustainedThresholdMinutes: s.sustainedThresholdMinutes,
            previouslyInExcursion: s.inActiveExcursion,
          });

          if (!isLatePacket) {
            nextConsecMins = evalRes.nextConsecutiveBreachMinutes;
            nextInExcursion = !evalRes.inRange;
            if (evalRes.recoveredNow) {
              nextRecovered = true;
            } else if (!evalRes.inRange) {
              nextRecovered = false;
            }
          }

          nextTempHistory = [
            ...nextTempHistory,
            {
              timeLabel: pkt.timeLabel,
              tempC: pkt.tempC,
              doorOpen: pkt.doorOpen,
              excursion: !evalRes.inRange,
            },
          ].slice(-24);

          if (evalRes.shouldTriggerOrUpdateIncident && !isLatePacket) {
            // Keep ONE active incident open per shipment excursion!
            const existingOpen = nextIncidents.find(
              (inc) => inc.shipmentId === s.id && inc.status !== 'resolved'
            );
            if (existingOpen) {
              nextIncidents = nextIncidents.map((inc) =>
                inc.id === existingOpen.id
                  ? {
                      ...inc,
                      peakTempC: Math.max(inc.peakTempC ?? pkt.tempC!, pkt.tempC!),
                      durationOutsideRangeMin: nextConsecMins,
                      timeline: [
                        ...inc.timeline,
                        {
                          timeLabel: pkt.timeLabel,
                          note: `Sustained excursion reading ${pkt.tempC}°C (${nextConsecMins}m outside ${s.tempThresholdMinC}°C–${s.tempThresholdMaxC}°C limit).`,
                          actor: 'Cold-Chain Monitor',
                        },
                      ],
                    }
                  : inc
              );
              spawnedMessage = `Updated existing active incident ${existingOpen.id} at ${pkt.tempC}°C.`;
            } else {
              const newIncId = s.code === 'AFL-2048' ? 'INC-2048' : `INC-${Date.now()}`;
              const newIncident: ColdChainIncident = {
                id: newIncId,
                shipmentId: s.id,
                shipmentCode: s.code,
                vehicleId: pkt.vehicleId,
                severity: 'critical',
                status: 'open',
                title: `Sustained Thermal Excursion (${pkt.tempC}°C) — ${s.code}`,
                policyTriggered: `${s.cargoDescription.split(' ')[0]} Policy (${s.tempThresholdMinC}°C – ${s.tempThresholdMaxC}°C, ${s.sustainedThresholdMinutes}m sustained)`,
                owner: 'Unassigned',
                openedAtLabel: pkt.timeLabel,
                peakTempC: pkt.tempC,
                durationOutsideRangeMin: nextConsecMins,
                timeline: [
                  {
                    timeLabel: pkt.timeLabel,
                    note: `Triggered after ${nextConsecMins} min above ${s.tempThresholdMaxC}°C threshold (reading ${pkt.tempC}°C).`,
                    actor: 'Telemetry Policy Engine',
                  },
                ],
              };
              nextIncidents = [newIncident, ...nextIncidents];
              spawnedMessage = `Opened Critical Incident ${newIncId} on ${s.code}.`;
              addedTimeline.push({
                id: `TL-INC-${pkt.eventId}`,
                timestampLabel: pkt.timeLabel,
                actor: 'Policy Engine',
                title: `Cold-Chain Alert Opened (${newIncId})`,
                detail: `Sustained excursion at ${pkt.tempC}°C exceeded ${s.tempThresholdMaxC}°C ceiling.`,
                category: 'incident',
                customerVisible: false,
              });
            }
          } else if (evalRes.recoveredNow && !isLatePacket) {
            // Mark sensor recovered on BOTH shipment timeline & open incident, keeping incident OPEN until dispatcher resolves!
            addedTimeline.push({
              id: `TL-REC-${pkt.eventId}`,
              timestampLabel: pkt.timeLabel,
              actor: 'Temperature Sensor',
              title: `Temperature Recovered (${pkt.tempC}°C Within Range)`,
              detail: `Cabinet stabilized inside ${s.tempThresholdMinC}°C–${s.tempThresholdMaxC}°C limit. Incident awaits dispatcher resolution.`,
              category: 'telemetry',
              customerVisible: false,
            });
            nextIncidents = nextIncidents.map((inc) =>
              inc.shipmentId === s.id && inc.status !== 'resolved'
                ? {
                    ...inc,
                    timeline: [
                      ...inc.timeline,
                      {
                        timeLabel: pkt.timeLabel,
                        note: `Sensor recovered inside policy range (${pkt.tempC}°C). Ready for dispatcher verification & closeout.`,
                        actor: 'Telemetry Stream',
                      },
                    ],
                  }
                : inc
            );
            spawnedMessage = `Sensor recovered at ${pkt.tempC}°C; open incident retained for dispatcher resolution.`;
          }
        }

        return {
          ...s,
          status: nextStatus,
          actualProgressPct: nextActualProg,
          consecutiveBreachMinutes: nextConsecMins,
          inActiveExcursion: nextInExcursion,
          sensorRecovered: nextRecovered,
          tempHistory: nextTempHistory,
          timeline: [...addedTimeline, ...s.timeline],
        };
      });

      if (spawnedMessage) {
        setLastEngineMessage(spawnedMessage);
      }

      return {
        ...prev,
        vehicles: updatedVehicles,
        shipments: updatedShipments,
        devices: updatedDevices,
        incidents: nextIncidents,
        seenEventIds: nextSeenIds,
        geofenceTriggeredKeys: nextGeofences,
        sensorCheckLabel: isLatePacket ? prev.sensorCheckLabel : `Synced · ${pkt.timeLabel}`,
      };
    },
    []
  );

  // Clean route playback animation interval
  useEffect(() => {
    if (replayMode !== 'playing_route') return;
    const ms = replaySpeed === 3 ? 600 : 1600;
    const timer = window.setInterval(() => {
      setPersisted((prev) => {
        const veh = prev.dataset.vehicles.find((v) => v.id === 'VEH-01');
        if (!veh || veh.progressPct >= 95) {
          setReplayMode('idle');
          return prev;
        }
        const nextProg = Math.min(95, veh.progressPct + 5);
        const tsLabel = nowIstLabel();
        return {
          dataset: applyTelemetryPacketToState(prev.dataset, {
            eventId: `ROUTE-${Date.now()}-${nextProg}`,
            deviceId: 'DEV-GPS-2048',
            vehicleId: 'VEH-01',
            shipmentId: 'SHP-2048',
            seqEpoch: veh.lastReadingEpoch + 60000,
            timeLabel: tsLabel,
            speedKmh: 71,
            progressPct: nextProg,
            tempC: veh.currentTempC ?? 3.6,
          }),
        };
      });
    }, ms);
    return () => window.clearInterval(timer);
  }, [replayMode, replaySpeed, applyTelemetryPacketToState]);

  const playRouteSimulation = useCallback(() => {
    setReplayMode('playing_route');
    setLastEngineMessage('Playing live AFL-2048 Pune → Mumbai telemetry route.');
  }, []);

  const pauseSimulation = useCallback(() => {
    if (incidentTimerRef.current) {
      window.clearTimeout(incidentTimerRef.current);
      incidentTimerRef.current = null;
    }
    setReplayMode('paused');
    setLastEngineMessage('Telemetry stream paused.');
  }, []);

  const restartSimulation = useCallback(() => {
    if (incidentTimerRef.current) {
      window.clearTimeout(incidentTimerRef.current);
      incidentTimerRef.current = null;
    }
    setReplayMode('idle');
    setPersisted({ dataset: createSeededAetherDataset() });
    setLastEngineMessage('Replay reset to initial Pune → Mumbai baseline.');
  }, []);

  const triggerColdChainIncidentReplay = useCallback(() => {
    // Deterministic 3-step excursion replay on AFL-2048 -> Door Open + sustained > 8C rise!
    setSelectedShipmentId('SHP-2048');
    setSelectedVehicleId('VEH-01');

    const runStep = (idx: number) => {
      setPersisted((prev) => {
        const veh = prev.dataset.vehicles.find((v) => v.id === 'VEH-01');
        const baseEp = veh?.lastReadingEpoch || Date.now();
        const pkts: TelemetryReadingInput[] = [
          {
            eventId: `INC-STEP1-${Math.floor(baseEp / 1000)}`,
            deviceId: 'DEV-DOOR-2048',
            vehicleId: 'VEH-01',
            shipmentId: 'SHP-2048',
            seqEpoch: baseEp + 60_000,
            timeLabel: '11:42 IST',
            doorOpen: true,
            tempC: 6.4,
            progressPct: Math.min(80, (veh?.progressPct ?? 44) + 3),
            speedKmh: 18,
          },
          {
            eventId: `INC-STEP2-${Math.floor(baseEp / 1000)}`,
            deviceId: 'DEV-TMP-2048',
            vehicleId: 'VEH-01',
            shipmentId: 'SHP-2048',
            seqEpoch: baseEp + 420_000,
            timeLabel: '11:48 IST',
            doorOpen: true,
            tempC: 9.4,
            progressPct: Math.min(82, (veh?.progressPct ?? 47) + 2),
            speedKmh: 42,
          },
          {
            eventId: `INC-STEP3-${Math.floor(baseEp / 1000)}`,
            deviceId: 'DEV-TMP-2048',
            vehicleId: 'VEH-01',
            shipmentId: 'SHP-2048',
            seqEpoch: baseEp + 780_000,
            timeLabel: '11:54 IST',
            doorOpen: false,
            tempC: 10.6,
            progressPct: Math.min(85, (veh?.progressPct ?? 49) + 3),
            speedKmh: 61,
          },
        ];
        return {
          dataset: applyTelemetryPacketToState(prev.dataset, pkts[idx], 6),
        };
      });
    };

    runStep(0);
    window.setTimeout(() => runStep(1), replaySpeed === 3 ? 250 : 650);
    incidentTimerRef.current = window.setTimeout(
      () => runStep(2),
      replaySpeed === 3 ? 550 : 1350
    );
    setLastEngineMessage(
      'Replaying AFL-2048 Lonavala bypass door-open & sustained cold-chain excursion.'
    );
  }, [applyTelemetryPacketToState, replaySpeed]);

  const triggerSensorRecoveryReplay = useCallback(() => {
    setPersisted((prev) => {
      const veh = prev.dataset.vehicles.find((v) => v.id === 'VEH-01');
      const ep = (veh?.lastReadingEpoch || Date.now()) + 300_000;
      let nextDs = applyTelemetryPacketToState(
        prev.dataset,
        {
          eventId: `REC-STEP1-${Math.floor(ep / 1000)}`,
          deviceId: 'DEV-TMP-2048',
          vehicleId: 'VEH-01',
          shipmentId: 'SHP-2048',
          seqEpoch: ep,
          timeLabel: '12:04 IST',
          doorOpen: false,
          tempC: 6.2,
          speedKmh: 69,
          progressPct: Math.min(92, (veh?.progressPct ?? 54) + 6),
        },
        5
      );
      nextDs = applyTelemetryPacketToState(
        nextDs,
        {
          eventId: `REC-STEP2-${Math.floor(ep / 1000)}`,
          deviceId: 'DEV-TMP-2048',
          vehicleId: 'VEH-01',
          shipmentId: 'SHP-2048',
          seqEpoch: ep + 180_000,
          timeLabel: '12:08 IST',
          doorOpen: false,
          tempC: 4.3,
          speedKmh: 72,
          progressPct: Math.min(95, (veh?.progressPct ?? 60) + 4),
        },
        4
      );
      return { dataset: nextDs };
    });
  }, [applyTelemetryPacketToState]);

  const ingestTelemetryPacket = useCallback(
    (pkt: TelemetryReadingInput): AetherActionResult => {
      if (persisted.dataset.seenEventIds.includes(pkt.eventId)) {
        setLastEngineMessage(`Deduplicated duplicate telemetry event ${pkt.eventId}.`);
        return { ok: false, error: `Duplicate packet ${pkt.eventId} safely deduplicated.` };
      }
      setPersisted((prev) => ({
        dataset: applyTelemetryPacketToState(prev.dataset, pkt),
      }));
      return { ok: true };
    },
    [persisted.dataset.seenEventIds, applyTelemetryPacketToState]
  );

  const createSampleShipment = useCallback(
    (input: {
      originDepotId: DepotId;
      destination: string;
      customerCompany: string;
      cargoDescription: string;
      weightKg: number;
      requiresReefer: boolean;
    }): AetherActionResult<Shipment> => {
      if (!input.destination.trim() || !input.customerCompany.trim()) {
        return { ok: false, error: 'Destination and customer company are required.' };
      }
      const depot = persisted.dataset.depots.find((d) => d.id === input.originDepotId)!;
      const num = 2078 + persisted.dataset.shipments.length;
      const code = `AFL-${num}`;
      const newShipment: Shipment = {
        id: `SHP-${num}`,
        code,
        origin: depot.name,
        originDepotId: depot.id,
        destination: input.destination.trim(),
        customerCompany: input.customerCompany.trim(),
        cargoDescription: input.cargoDescription.trim() || 'Commercial Cold Freight',
        weightKg: Math.max(100, input.weightKg || 2500),
        requiresReefer: input.requiresReefer,
        tempThresholdMinC: input.requiresReefer ? 2.0 : null,
        tempThresholdMaxC: input.requiresReefer ? 8.0 : null,
        sustainedThresholdMinutes: 10,
        consecutiveBreachMinutes: 0,
        inActiveExcursion: false,
        sensorRecovered: false,
        status: 'unassigned',
        etaLabel: 'Awaiting Dispatch',
        serviceWindow: 'Same-Day Corridor Window',
        plannedProgressPct: 0,
        actualProgressPct: 0,
        assignedVehicleId: null,
        stops: [
          {
            id: `STP-${code}-1`,
            sequence: 1,
            location: depot.name,
            type: 'pickup',
            windowLabel: 'Next Gate Slot',
            status: 'pending',
          },
          {
            id: `STP-${code}-2`,
            sequence: 2,
            location: input.destination.trim(),
            type: 'delivery',
            windowLabel: '18:00 IST Cutoff',
            status: 'pending',
          },
        ],
        tempHistory: [],
        timeline: [
          {
            id: `TL-${code}-1`,
            timestampLabel: nowIstLabel(),
            actor: 'Dispatcher Console',
            title: `Created Shipment ${code}`,
            detail: `Queued unassigned order (${input.weightKg} kg) at ${depot.name}.`,
            category: 'dispatch',
            customerVisible: true,
          },
        ],
        pod: null,
      };
      setPersisted((prev) => ({
        dataset: {
          ...prev.dataset,
          shipments: [newShipment, ...prev.dataset.shipments],
        },
      }));
      return { ok: true, data: newShipment };
    },
    [persisted.dataset]
  );

  const assignShipmentToVehicle = useCallback(
    (shipmentId: string, vehicleId: string): AetherActionResult => {
      const shp = persisted.dataset.shipments.find((s) => s.id === shipmentId);
      const veh = persisted.dataset.vehicles.find((v) => v.id === vehicleId);
      if (!shp || !veh) return { ok: false, error: 'Shipment or vehicle not found.' };

      if (shp.requiresReefer && !veh.reeferCapable) {
        return {
          ok: false,
          error: `Assignment rejected: ${shp.code} requires temperature control, but ${veh.plate} (${veh.model}) is non-refrigerated.`,
        };
      }
      if (shp.weightKg > veh.maxCapacityKg) {
        return {
          ok: false,
          error: `Capacity exceeded: ${shp.code} is ${shp.weightKg.toLocaleString()} kg, exceeding ${veh.plate} payload (${veh.maxCapacityKg.toLocaleString()} kg).`,
        };
      }
      if (veh.activeShipmentId && veh.activeShipmentId !== shp.id) {
        const activeOther = persisted.dataset.shipments.find((s) => s.id === veh.activeShipmentId);
        if (activeOther && activeOther.status === 'in_transit') {
          return {
            ok: false,
            error: `Vehicle conflict: ${veh.plate} is currently executing active in-transit run ${activeOther.code}. Select an idle or same-corridor queued vehicle.`,
          };
        }
      }

      const ts = nowIstLabel();
      setPersisted((prev) => ({
        dataset: {
          ...prev.dataset,
          vehicles: prev.dataset.vehicles.map((v) =>
            v.id === veh.id ? { ...v, activeShipmentId: shp.id } : v
          ),
          shipments: prev.dataset.shipments.map((s) =>
            s.id === shp.id
              ? {
                  ...s,
                  assignedVehicleId: veh.id,
                  status: s.status === 'unassigned' ? 'assigned' : s.status,
                  etaLabel: s.status === 'unassigned' ? 'Assigned · Staging' : s.etaLabel,
                  timeline: [
                    {
                      id: `TL-ASN-${Date.now()}`,
                      timestampLabel: ts,
                      actor: 'Dispatch Board',
                      title: `Assigned to ${veh.plate} (${veh.driverName})`,
                      detail: `Verified capacity (${shp.weightKg} kg) and reefer telemetry pairing.`,
                      category: 'dispatch',
                      customerVisible: true,
                    },
                    ...s.timeline,
                  ],
                }
              : s
          ),
        },
      }));
      return { ok: true };
    },
    [persisted.dataset]
  );

  const reorderShipmentStop = useCallback(
    (shipmentId: string, stopId: string, direction: 'up' | 'down'): AetherActionResult => {
      const shp = persisted.dataset.shipments.find((s) => s.id === shipmentId);
      if (!shp) return { ok: false, error: 'Shipment not found.' };
      const idx = shp.stops.findIndex((st) => st.id === stopId);
      if (idx === -1) return { ok: false, error: 'Stop not found.' };
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= shp.stops.length) return { ok: false };
      if (shp.stops[idx].status === 'completed' || shp.stops[targetIdx].status === 'completed') {
        return { ok: false, error: 'Completed stops cannot be reordered.' };
      }

      const nextStops = [...shp.stops];
      const temp = nextStops[idx];
      nextStops[idx] = nextStops[targetIdx];
      nextStops[targetIdx] = temp;
      const renumbered = nextStops.map((st, i) => ({ ...st, sequence: i + 1 }));

      setPersisted((prev) => ({
        dataset: {
          ...prev.dataset,
          shipments: prev.dataset.shipments.map((s) =>
            s.id === shipmentId ? { ...s, stops: renumbered } : s
          ),
        },
      }));
      return { ok: true };
    },
    [persisted.dataset]
  );

  const registerIotDevice = useCallback(
    (input: { type: IotDevice['type']; vehicleId: string }): AetherActionResult<IotDevice> => {
      const prefix =
        input.type === 'GPS Tracker' ? 'GPS' : input.type === 'Temperature Probe' ? 'TMP' : 'DOOR';
      const newDev: IotDevice = {
        id: `DEV-${prefix}-${Math.floor(300 + Math.random() * 699)}`,
        type: input.type,
        vehicleId: input.vehicleId || null,
        batteryPct: 100,
        lastSeenSecAgo: 5,
        lastUpdatedLabel: 'Just provisioned',
        firmware: prefix === 'GPS' ? 'AF-GPS v4.2' : prefix === 'TMP' ? 'CRYO-T2 v3.1' : 'MAG-D1 v2.0',
      };
      setPersisted((prev) => ({
        dataset: {
          ...prev.dataset,
          devices: [newDev, ...prev.dataset.devices],
        },
      }));
      return { ok: true, data: newDev };
    },
    []
  );

  const acknowledgeIncident = useCallback(
    (incidentId: string, assignee: string): AetherActionResult => {
      const inc = persisted.dataset.incidents.find((i) => i.id === incidentId);
      if (!inc) return { ok: false, error: 'Incident not found.' };
      if (inc.status !== 'open') {
        return {
          ok: false,
          error: `Incident ${inc.id} is already ${inc.status.replace('_', ' ')}.`,
        };
      }
      const ts = nowIstLabel();
      setPersisted((prev) => ({
        dataset: {
          ...prev.dataset,
          incidents: prev.dataset.incidents.map((i) =>
            i.id === incidentId
              ? {
                  ...i,
                  status: 'acknowledged',
                  owner: assignee || 'Dispatcher Control',
                  timeline: [
                    ...i.timeline,
                    {
                      timeLabel: ts,
                      note: `Alert acknowledged and assigned to ${assignee || 'Dispatcher Control'}.`,
                      actor: assignee || 'Dispatcher Control',
                    },
                  ],
                }
              : i
          ),
        },
      }));
      return { ok: true };
    },
    [persisted.dataset]
  );

  const updateIncidentStatus = useCallback(
    (
      incidentId: string,
      status: ColdChainIncident['status'],
      resolutionNote?: string
    ): AetherActionResult => {
      const inc = persisted.dataset.incidents.find((i) => i.id === incidentId);
      if (!inc) return { ok: false, error: 'Incident not found.' };
      if (status === 'resolved' && !resolutionNote?.trim()) {
        return { ok: false, error: 'Enter a dispatcher resolution note before closing the incident.' };
      }
      const ts = nowIstLabel();
      setPersisted((prev) => ({
        dataset: {
          ...prev.dataset,
          incidents: prev.dataset.incidents.map((i) =>
            i.id === incidentId
              ? {
                  ...i,
                  status,
                  resolutionNote: status === 'resolved' ? resolutionNote?.trim() : i.resolutionNote,
                  resolvedAtLabel: status === 'resolved' ? ts : i.resolvedAtLabel,
                  timeline: [
                    ...i.timeline,
                    {
                      timeLabel: ts,
                      note:
                        status === 'resolved'
                          ? `Resolved: ${resolutionNote?.trim()}`
                          : `Status advanced to ${status.replace('_', ' ')}.`,
                      actor: 'Dispatcher Control',
                    },
                  ],
                }
              : i
          ),
          shipments:
            status === 'resolved'
              ? prev.dataset.shipments.map((s) =>
                  s.id === inc.shipmentId
                    ? {
                        ...s,
                        timeline: [
                          {
                            id: `TL-RES-${Date.now()}`,
                            timestampLabel: ts,
                            actor: 'Incident Desk',
                            title: `Incident ${inc.id} Resolved`,
                            detail: resolutionNote?.trim() || 'Resolved after telemetry recovery.',
                            category: 'incident',
                            customerVisible: false,
                          },
                          ...s.timeline,
                        ],
                      }
                    : s
                )
              : prev.dataset.shipments,
        },
      }));
      return { ok: true };
    },
    [persisted.dataset]
  );

  const sendDriverInstruction = useCallback(
    (input: {
      shipmentId: string;
      vehicleId: string;
      incidentId?: string;
      message: string;
    }): AetherActionResult<DriverInstruction> => {
      const clean = input.message.trim();
      if (!clean) return { ok: false, error: 'Enter an instruction message for the driver.' };
      const ts = nowIstLabel();
      const newIns: DriverInstruction = {
        id: `INS-${Date.now()}`,
        shipmentId: input.shipmentId,
        vehicleId: input.vehicleId,
        incidentId: input.incidentId,
        sentAtLabel: ts,
        sender: 'Control Tower Dispatch',
        message: clean,
        acknowledged: false,
      };
      setPersisted((prev) => ({
        dataset: {
          ...prev.dataset,
          instructions: [newIns, ...prev.dataset.instructions],
          incidents: input.incidentId
            ? prev.dataset.incidents.map((inc) =>
                inc.id === input.incidentId
                  ? {
                      ...inc,
                      status: inc.status === 'open' ? 'in_progress' : inc.status === 'acknowledged' ? 'in_progress' : inc.status,
                      timeline: [
                        ...inc.timeline,
                        { timeLabel: ts, note: `Sent instruction to driver: "${clean}"`, actor: 'Control Tower' },
                      ],
                    }
                  : inc
              )
            : prev.dataset.incidents,
          shipments: prev.dataset.shipments.map((s) =>
            s.id === input.shipmentId
              ? {
                  ...s,
                  timeline: [
                    {
                      id: `TL-INS-${Date.now()}`,
                      timestampLabel: ts,
                      actor: 'Control Tower Dispatch',
                      title: 'Driver Instruction Dispatched',
                      detail: clean,
                      category: 'dispatch',
                      customerVisible: false,
                    },
                    ...s.timeline,
                  ],
                }
              : s
          ),
        },
      }));
      return { ok: true, data: newIns };
    },
    []
  );

  const acknowledgeDriverInstruction = useCallback(
    (instructionId: string, replyText: string): AetherActionResult => {
      const ts = nowIstLabel();
      setPersisted((prev) => {
        const ins = prev.dataset.instructions.find((i) => i.id === instructionId);
        if (!ins) return prev;
        return {
          dataset: {
            ...prev.dataset,
            instructions: prev.dataset.instructions.map((i) =>
              i.id === instructionId
                ? {
                    ...i,
                    acknowledged: true,
                    driverReply: replyText.trim() || 'Received — checking cargo latch & reefer setpoint.',
                    repliedAtLabel: ts,
                  }
                : i
            ),
            incidents: ins.incidentId
              ? prev.dataset.incidents.map((inc) =>
                  inc.id === ins.incidentId
                    ? {
                        ...inc,
                        timeline: [
                          ...inc.timeline,
                          {
                            timeLabel: ts,
                            note: `Driver responded: "${replyText.trim() || 'Checking seal & setpoint.'}"`,
                            actor: 'Driver App',
                          },
                        ],
                      }
                    : inc
                )
              : prev.dataset.incidents,
            shipments: prev.dataset.shipments.map((s) =>
              s.id === ins.shipmentId
                ? {
                    ...s,
                    timeline: [
                      {
                        id: `TL-DR-${Date.now()}`,
                        timestampLabel: ts,
                        actor: 'Driver App',
                        title: 'Driver Acknowledged Dispatch Instruction',
                        detail: replyText.trim() || 'Checking reefer latch and cooling boost.',
                        category: 'dispatch',
                        customerVisible: false,
                      },
                      ...s.timeline,
                    ],
                  }
                : s
            ),
          },
        };
      });
      return { ok: true };
    },
    []
  );

  const checkInStop = useCallback(
    (shipmentId: string, stopId: string): AetherActionResult => {
      const ts = nowIstLabel();
      setPersisted((prev) => ({
        dataset: {
          ...prev.dataset,
          shipments: prev.dataset.shipments.map((s) => {
            if (s.id !== shipmentId) return s;
            const target = s.stops.find((st) => st.id === stopId);
            const isFinalDelivery = target?.type === 'delivery';
            return {
              ...s,
              status: isFinalDelivery && s.status !== 'delivered' ? 'arrived' : s.status,
              actualProgressPct: isFinalDelivery ? 100 : Math.max(s.actualProgressPct, 75),
              etaLabel: isFinalDelivery ? 'At Receiving Bay (POD Pending)' : s.etaLabel,
              stops: s.stops.map((st) =>
                st.id === stopId ? { ...st, status: 'checked_in' } : st
              ),
              timeline: [
                {
                  id: `TL-CHK-${Date.now()}`,
                  timestampLabel: ts,
                  actor: 'Driver App',
                  title: isFinalDelivery
                    ? `Arrived at ${target?.location}`
                    : `Checked in at ${target?.location}`,
                  detail: isFinalDelivery
                    ? 'Arrived inside final destination geofence. Ready for Proof of Delivery.'
                    : 'Driver logged waypoint arrival check-in.',
                  category: 'milestone',
                  customerVisible: true,
                },
                ...s.timeline,
              ],
            };
          }),
        },
      }));
      return { ok: true };
    },
    []
  );

  const completeStop = useCallback(
    (shipmentId: string, stopId: string): AetherActionResult => {
      const shp = persisted.dataset.shipments.find((s) => s.id === shipmentId);
      const stop = shp?.stops.find((st) => st.id === stopId);
      if (!shp || !stop) return { ok: false, error: 'Stop not found.' };
      if (stop.type === 'delivery' && !shp.pod) {
        return {
          ok: false,
          error: 'Final delivery stop requires capturing Proof of Delivery first.',
        };
      }
      const ts = nowIstLabel();
      setPersisted((prev) => ({
        dataset: {
          ...prev.dataset,
          shipments: prev.dataset.shipments.map((s) =>
            s.id === shipmentId
              ? {
                  ...s,
                  actualProgressPct: Math.max(s.actualProgressPct, 82),
                  stops: s.stops.map((st) =>
                    st.id === stopId
                      ? { ...st, status: 'completed', completedAtLabel: ts }
                      : st
                  ),
                  timeline: [
                    {
                      id: `TL-STP-${Date.now()}`,
                      timestampLabel: ts,
                      actor: 'Driver App',
                      title: `Completed Stop: ${stop.location}`,
                      detail: 'Proceeding toward next corridor destination.',
                      category: 'milestone',
                      customerVisible: true,
                    },
                    ...s.timeline,
                  ],
                }
              : s
          ),
        },
      }));
      return { ok: true };
    },
    [persisted.dataset]
  );

  const logDriverException = useCallback(
    (shipmentId: string, note: string): AetherActionResult => {
      const clean = note.trim();
      if (!clean) return { ok: false, error: 'Enter exception notes.' };
      const ts = nowIstLabel();
      setPersisted((prev) => ({
        dataset: {
          ...prev.dataset,
          shipments: prev.dataset.shipments.map((s) =>
            s.id === shipmentId
              ? {
                  ...s,
                  timeline: [
                    {
                      id: `TL-EXC-${Date.now()}`,
                      timestampLabel: ts,
                      actor: 'Driver Field Note',
                      title: 'Driver Exception Logged',
                      detail: clean,
                      category: 'incident',
                      customerVisible: false,
                    },
                    ...s.timeline,
                  ],
                }
              : s
          ),
        },
      }));
      return { ok: true };
    },
    []
  );

  const recordProofOfDelivery = useCallback(
    (
      shipmentId: string,
      pod: Omit<ProofOfDelivery, 'receivedAtLabel'>
    ): AetherActionResult => {
      const shp = persisted.dataset.shipments.find((s) => s.id === shipmentId);
      if (!shp) return { ok: false, error: 'Shipment not found.' };
      if (shp.pod || shp.status === 'delivered') {
        return {
          ok: false,
          error: `Proof of delivery is already recorded for ${shp.code} (received by ${shp.pod?.recipientName}).`,
        };
      }
      if (!pod.recipientName.trim()) {
        return { ok: false, error: 'Enter recipient name to complete delivery.' };
      }

      const ts = `Today · ${nowIstLabel()}`;
      const completePod: ProofOfDelivery = {
        ...pod,
        recipientName: pod.recipientName.trim(),
        receivedAtLabel: ts,
        photoUrl: pod.method === 'preset_photo' ? pod.photoUrl || AETHER_MEDIA.podDelivery : pod.photoUrl,
      };

      setPersisted((prev) => ({
        dataset: {
          ...prev.dataset,
          vehicles: prev.dataset.vehicles.map((v) =>
            v.id === shp.assignedVehicleId
              ? { ...v, progressPct: 100, speedKmh: 0, lastUpdatedLabel: ts }
              : v
          ),
          shipments: prev.dataset.shipments.map((s) =>
            s.id === shipmentId
              ? {
                  ...s,
                  status: 'delivered',
                  actualProgressPct: 100,
                  etaLabel: `Delivered (${ts})`,
                  pod: completePod,
                  stops: s.stops.map((st) => ({
                    ...st,
                    status: 'completed',
                    completedAtLabel: st.completedAtLabel || ts,
                  })),
                  timeline: [
                    {
                      id: `TL-POD-${Date.now()}`,
                      timestampLabel: ts,
                      actor: 'Driver POD Capture',
                      title: `Delivered · Signed by ${completePod.recipientName}`,
                      detail: `Digital proof captured at ${s.destination}. Chain-of-custody sealed.`,
                      category: 'delivery',
                      customerVisible: true,
                    },
                    ...s.timeline,
                  ],
                }
              : s
          ),
        },
      }));
      return { ok: true };
    },
    [persisted.dataset]
  );

  const resetDemoData = useCallback(() => {
    if (incidentTimerRef.current) {
      window.clearTimeout(incidentTimerRef.current);
      incidentTimerRef.current = null;
    }
    setReplayMode('idle');
    const fresh = { dataset: createSeededAetherDataset() };
    setPersisted(fresh);
    setActiveRole('dispatcher');
    setActiveDepotFilter('ALL');
    setSelectedShipmentId('SHP-2048');
    setSelectedVehicleId('VEH-01');
    setLastEngineMessage('Restored factory 15 vehicles, 30 shipments, and AFL-2048 walkthrough state.');
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // Ignore storage failures
    }
  }, []);

  const value = useMemo<AetherContextValue>(
    () => ({
      dataset: persisted.dataset,
      activeRole,
      setActiveRole,
      activeDepotFilter,
      setActiveDepotFilter,
      selectedShipmentId,
      setSelectedShipmentId,
      selectedVehicleId,
      setSelectedVehicleId,
      guidedDemoActive,
      setGuidedDemoActive,
      lastEngineMessage,
      replayMode,
      replaySpeed,
      setReplaySpeed,
      playRouteSimulation,
      pauseSimulation,
      restartSimulation,
      triggerColdChainIncidentReplay,
      triggerSensorRecoveryReplay,
      ingestTelemetryPacket,
      createSampleShipment,
      assignShipmentToVehicle,
      reorderShipmentStop,
      registerIotDevice,
      acknowledgeIncident,
      updateIncidentStatus,
      sendDriverInstruction,
      acknowledgeDriverInstruction,
      checkInStop,
      completeStop,
      logDriverException,
      recordProofOfDelivery,
      resetDemoData,
    }),
    [
      persisted.dataset,
      activeRole,
      activeDepotFilter,
      selectedShipmentId,
      selectedVehicleId,
      guidedDemoActive,
      lastEngineMessage,
      replayMode,
      replaySpeed,
      playRouteSimulation,
      pauseSimulation,
      restartSimulation,
      triggerColdChainIncidentReplay,
      triggerSensorRecoveryReplay,
      ingestTelemetryPacket,
      createSampleShipment,
      assignShipmentToVehicle,
      reorderShipmentStop,
      registerIotDevice,
      acknowledgeIncident,
      updateIncidentStatus,
      sendDriverInstruction,
      acknowledgeDriverInstruction,
      checkInStop,
      completeStop,
      logDriverException,
      recordProofOfDelivery,
      resetDemoData,
    ]
  );

  return (
    <AetherStoreContext.Provider value={value}>
      {children}
    </AetherStoreContext.Provider>
  );
};

export function useAetherStore() {
  const ctx = useContext(AetherStoreContext);
  if (!ctx) {
    throw new Error('useAetherStore must be used inside AetherStoreProvider');
  }
  return ctx;
}
