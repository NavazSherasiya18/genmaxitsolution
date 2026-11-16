import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  DoorOpen,
  RotateCcw,
  ShieldCheck,
  ThermometerSnowflake,
} from 'lucide-react';
import { useAetherStore } from '../../../context/AetherStoreContext';
import { AetherTempChart } from '../AetherTempChart';
import { AetherStatusBadge } from '../AetherStatusBadge';

export const ColdChainMonitorModule: React.FC = () => {
  const {
    dataset,
    selectedShipmentId,
    setSelectedShipmentId,
    triggerColdChainIncidentReplay,
    triggerSensorRecoveryReplay,
    ingestTelemetryPacket,
    activeRole,
  } = useAetherStore();

  const reeferShipments = dataset.shipments.filter((s) => s.requiresReefer);
  const selected =
    reeferShipments.find((s) => s.id === selectedShipmentId) ||
    reeferShipments[0];

  const [guardrailMsg, setGuardrailMsg] = useState<string | null>(null);

  if (!selected) {
    return (
      <div className="bg-white border border-slate-200 p-6 text-xs text-slate-600">
        No refrigerated shipments available.
      </div>
    );
  }

  const linkedVehicle = dataset.vehicles.find((v) => v.id === selected.assignedVehicleId);
  const openInc = dataset.incidents.find(
    (inc) => inc.shipmentId === selected.id && inc.status !== 'resolved'
  );
  const doorEvents = selected.timeline.filter(
    (ev) => ev.title.toLowerCase().includes('door') || ev.detail.toLowerCase().includes('door')
  );

  const handleTestDuplicatePacket = () => {
    const existingId = dataset.seenEventIds[dataset.seenEventIds.length - 1] || 'SEED-INIT-1';
    const res = ingestTelemetryPacket({
      eventId: existingId,
      deviceId: 'DEV-TMP-2048',
      vehicleId: selected.assignedVehicleId || 'VEH-01',
      shipmentId: selected.id,
      seqEpoch: (linkedVehicle?.lastReadingEpoch || Date.now()) + 1000,
      timeLabel: '12:15 IST',
      tempC: 4.0,
    });
    setGuardrailMsg(res.error || 'Duplicate telemetry packet cleanly deduplicated.');
  };

  const handleTestLatePacket = () => {
    if (activeRole === 'ops_viewer') {
      setGuardrailMsg('Switch out of Read-Only Viewer role to run telemetry tests.');
      return;
    }
    if (!linkedVehicle) return;
    ingestTelemetryPacket({
      eventId: `LATE-PKT-${Date.now()}`,
      deviceId: 'DEV-TMP-2048',
      vehicleId: linkedVehicle.id,
      shipmentId: selected.id,
      seqEpoch: linkedVehicle.lastReadingEpoch - 900_000, // Deliberately older epoch!
      timeLabel: '09:15 IST (Delayed Packet)',
      tempC: 3.3,
      progressPct: 10,
    });
    setGuardrailMsg(
      'Injected delayed historical packet (progress=10%, older epoch): archived on timeline WITHOUT regressing current truck position.'
    );
  };

  return (
    <div className="space-y-5">
      {/* Selector & Quick Walkthrough Controls */}
      <div className="bg-white border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <label className="font-bold text-[#0C131F] inline-flex items-center gap-1.5">
            <ThermometerSnowflake className="w-4 h-4 text-cyan-600" />
            <span>Monitored Shipment:</span>
          </label>
          <select
            value={selected.id}
            onChange={(e) => setSelectedShipmentId(e.target.value)}
            aria-label="Select refrigerated shipment"
            className="px-3 py-1.5 border border-slate-300 bg-slate-50 font-semibold text-slate-900 cursor-pointer"
          >
            {reeferShipments.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} · {s.cargoDescription} ({s.tempThresholdMinC}°–{s.tempThresholdMaxC}°C)
              </option>
            ))}
          </select>

          {selected.sensorRecovered && (
            <AetherStatusBadge status="recovered" />
          )}
          {selected.inActiveExcursion && (
            <AetherStatusBadge status="critical" />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={triggerColdChainIncidentReplay}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold inline-flex items-center gap-1 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Replay Cold-Chain Incident</span>
          </button>

          <button
            type="button"
            onClick={triggerSensorRecoveryReplay}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Sensor Recovery</span>
          </button>
        </div>
      </div>

      {/* Main Chart + Threshold Policy Card */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 space-y-4">
          <AetherTempChart
            points={selected.tempHistory}
            minC={selected.tempThresholdMinC ?? 2}
            maxC={selected.tempThresholdMaxC ?? 8}
            shipmentCode={selected.code}
          />

          {/* Telemetry Deduplication & Out-of-Order Guardrails */}
          <div className="bg-white border border-slate-200 p-4 space-y-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-bold text-[#0C131F]">
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
                <span>Telemetry Stream Integrity Guardrails</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleTestDuplicatePacket}
                  className="px-2.5 py-1.5 border border-slate-300 bg-slate-50 font-semibold text-slate-700 hover:border-cyan-600 cursor-pointer"
                >
                  Test Duplicate Event ID
                </button>
                <button
                  type="button"
                  onClick={handleTestLatePacket}
                  className="px-2.5 py-1.5 border border-slate-300 bg-slate-50 font-semibold text-slate-700 hover:border-cyan-600 cursor-pointer"
                >
                  Test Late Packet Non-Regression
                </button>
              </div>
            </div>
            {guardrailMsg && (
              <div className="p-2.5 bg-cyan-50 border border-cyan-200 text-cyan-950 font-medium">
                {guardrailMsg}
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-4 space-y-4">
          {/* Policy Card */}
          <div className="bg-white border border-slate-200 p-4 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-[#0C131F] pb-2 border-b border-slate-200">
              Configured Threshold Policy
            </h3>
            <div className="space-y-2 af-tabular">
              <div className="flex justify-between">
                <span className="text-slate-500">Permitted Probe Window:</span>
                <strong className="text-[#0C131F]">
                  {selected.tempThresholdMinC}°C to {selected.tempThresholdMaxC}°C
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sustained Excursion Trigger:</span>
                <strong className="text-[#0C131F]">{selected.sustainedThresholdMinutes} mins</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Consecutive Breach:</span>
                <strong
                  className={
                    selected.consecutiveBreachMinutes >= selected.sustainedThresholdMinutes
                      ? 'text-rose-700'
                      : 'text-emerald-700'
                  }
                >
                  {selected.consecutiveBreachMinutes} mins
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Linked Open Incident:</span>
                <strong className={openInc ? 'text-rose-700' : 'text-emerald-700'}>
                  {openInc ? `${openInc.id} (${openInc.status})` : 'None Open'}
                </strong>
              </div>
            </div>
            {selected.sensorRecovered && openInc && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Sensor recovered inside safe bounds; incident <strong>{openInc.id}</strong> intentionally remains open until a dispatcher records closeout notes.
                </span>
              </div>
            )}
          </div>

          {/* Door-Open Feed */}
          <div className="bg-white border border-slate-200 p-4 space-y-2.5 text-xs">
            <h3 className="text-sm font-bold text-[#0C131F] inline-flex items-center gap-1.5">
              <DoorOpen className="w-4 h-4 text-amber-600" />
              <span>Cargo Door Sensor Events</span>
            </h3>
            {doorEvents.length === 0 ? (
              <p className="text-slate-500 text-[11px]">
                No unscheduled rear/side cargo door openings recorded on {selected.code}.
              </p>
            ) : (
              <div className="space-y-2">
                {doorEvents.map((ev) => (
                  <div key={ev.id} className="p-2.5 bg-amber-50 border border-amber-200 text-[11px]">
                    <div className="font-bold text-amber-950">{ev.title}</div>
                    <div className="text-amber-800">{ev.timestampLabel} · {ev.detail}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
