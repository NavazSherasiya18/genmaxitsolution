import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Navigation,
  ThermometerSnowflake,
  Truck,
  Wifi,
} from 'lucide-react';
import { useAetherStore } from '../../../context/AetherStoreContext';
import { deriveDeviceState } from '../../../utils/aetherEngine';
import { AetherStatusBadge } from '../AetherStatusBadge';
import { AetherCorridorMap } from '../AetherCorridorMap';

interface OperationsOverviewModuleProps {
  onNavigateModule: (mod: string) => void;
  searchQuery: string;
}

export const OperationsOverviewModule: React.FC<OperationsOverviewModuleProps> = ({
  onNavigateModule,
  searchQuery,
}) => {
  const {
    dataset,
    activeDepotFilter,
    selectedVehicleId,
    setSelectedVehicleId,
    setSelectedShipmentId,
    replayMode,
    replaySpeed,
    setReplaySpeed,
    playRouteSimulation,
    pauseSimulation,
    restartSimulation,
    triggerColdChainIncidentReplay,
  } = useAetherStore();

  const q = searchQuery.trim().toLowerCase();

  const filteredShipments = dataset.shipments.filter((s) => {
    const depotOk = activeDepotFilter === 'ALL' || s.originDepotId === activeDepotFilter;
    const matchQ =
      !q ||
      s.code.toLowerCase().includes(q) ||
      s.origin.toLowerCase().includes(q) ||
      s.destination.toLowerCase().includes(q) ||
      s.customerCompany.toLowerCase().includes(q);
    return depotOk && matchQ;
  });

  const filteredVehicles = dataset.vehicles.filter(
    (v) => activeDepotFilter === 'ALL' || v.homeDepotId === activeDepotFilter
  );

  const activeInTransit = filteredShipments.filter(
    (s) => s.status === 'in_transit' || s.status === 'delayed' || s.status === 'arrived'
  ).length;
  const openIncidents = dataset.incidents.filter((i) => i.status !== 'resolved');
  const onlineDevices = dataset.devices.filter((d) => deriveDeviceState(d.lastSeenSecAgo) === 'online').length;
  const completedCount = filteredShipments.filter((s) => s.status === 'delivered').length;
  const reeferCompliantCount = filteredShipments.filter((s) => s.requiresReefer && !s.inActiveExcursion).length;
  const totalReeferCount = filteredShipments.filter((s) => s.requiresReefer).length;
  const tempCompliancePct = totalReeferCount
    ? Math.round((reeferCompliantCount / totalReeferCount) * 100)
    : 100;

  const flagship = dataset.shipments.find((s) => s.code === 'AFL-2048') || dataset.shipments[0];
  const flagshipInc = dataset.incidents.find((i) => i.shipmentCode === 'AFL-2048' && i.status !== 'resolved');

  return (
    <div className="space-y-6">
      {/* KPI Telemetry Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Active Shipments</span>
            <Navigation className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-2xl font-bold text-[#0C131F] af-tabular">{activeInTransit}</p>
          <p className="text-[11px] text-slate-500 af-tabular">
            {filteredShipments.length} total orders · {completedCount} delivered with POD
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-4 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Fleet Utilization</span>
            <Truck className="w-4 h-4 text-slate-700" />
          </div>
          <p className="text-2xl font-bold text-[#0C131F] af-tabular">
            {filteredVehicles.filter((v) => v.activeShipmentId).length} / {filteredVehicles.length}
          </p>
          <p className="text-[11px] text-slate-500 af-tabular">
            Active assigned vehicles across corridor depots
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-4 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Cold-Chain Compliance</span>
            <ThermometerSnowflake className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-2xl font-bold text-[#0C131F] af-tabular">{tempCompliancePct}%</p>
          <p className="text-[11px] text-slate-500 af-tabular">
            {reeferCompliantCount} of {totalReeferCount} chilled orders inside band
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-4 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Open Alerts & Devices</span>
            <Wifi className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-[#0C131F] af-tabular">
            {openIncidents.length} Open
          </p>
          <p className="text-[11px] text-slate-500 af-tabular">
            {onlineDevices} of {dataset.devices.length} IoT nodes online
          </p>
        </div>
      </div>

      {/* Main Split: Live Corridor Map + Flagship Attention Queue */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-7 space-y-3">
          <AetherCorridorMap
            depots={dataset.depots}
            vehicles={filteredVehicles}
            shipments={dataset.shipments}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={(vehId, shpId) => {
              setSelectedVehicleId(vehId);
              if (shpId) setSelectedShipmentId(shpId);
            }}
            replayMode={replayMode}
            replaySpeed={replaySpeed}
            onToggleSpeed={() => setReplaySpeed(replaySpeed === 1 ? 3 : 1)}
            onPlayRoute={playRouteSimulation}
            onPause={pauseSimulation}
            onRestart={restartSimulation}
            onTriggerIncident={triggerColdChainIncidentReplay}
            sensorCheckLabel={dataset.sensorCheckLabel}
          />
        </div>

        <div className="xl:col-span-5 space-y-4">
          {/* Flagship AFL-2048 Priority Card */}
          {flagship && (
            <div className="bg-white border border-slate-200 p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700">
                    Priority Biopharma Run
                  </span>
                  <h3 className="text-base font-bold text-[#0C131F]">
                    {flagship.code} · {flagship.customerCompany}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {flagship.origin} → {flagship.destination}
                  </p>
                </div>
                <AetherStatusBadge status={flagship.status} />
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 border border-slate-200 p-2.5 af-tabular">
                <div>
                  <span className="text-[10px] text-slate-500 block">Progress</span>
                  <strong className="text-[#0C131F]">{flagship.actualProgressPct}%</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Probe Band</span>
                  <strong className="text-[#0C131F]">
                    {flagship.tempThresholdMinC}°–{flagship.tempThresholdMaxC}°C
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">ETA</span>
                  <strong className="text-[#0C131F]">{flagship.etaLabel.split(' ')[0]}</strong>
                </div>
              </div>

              {flagshipInc && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                    <span>{flagshipInc.id}: {flagshipInc.status.toUpperCase()}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigateModule('incidents')}
                    className="underline font-bold text-rose-800 cursor-pointer"
                  >
                    Open Queue
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link
                  to={`/showcase/aether-fleet/shipments/${flagship.code}`}
                  className="px-3 py-1.5 bg-[#0C131F] text-white text-xs font-semibold hover:bg-slate-800 inline-flex items-center gap-1"
                >
                  <span>Inspect Shipment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedShipmentId(flagship.id);
                    onNavigateModule('cold-chain');
                  }}
                  className="px-3 py-1.5 border border-slate-300 text-xs font-semibold text-slate-700 hover:border-cyan-600 cursor-pointer"
                >
                  Cold-Chain Chart
                </button>
              </div>
            </div>
          )}

          {/* Active Exception Queue */}
          <div className="bg-white border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0C131F]">
                Live Exception & Alert Queue ({openIncidents.length})
              </h3>
              <button
                type="button"
                onClick={() => onNavigateModule('incidents')}
                className="text-xs font-semibold text-cyan-700 hover:underline cursor-pointer"
              >
                Incident Center →
              </button>
            </div>

            {openIncidents.length === 0 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All corridor alerts currently resolved. Trigger Replay Cold-Chain Incident on the map to demonstrate exception resolution.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {openIncidents.map((inc) => (
                  <div key={inc.id} className="p-3 bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-[#0C131F]">
                        {inc.id} · {inc.shipmentCode}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <AetherStatusBadge status={inc.severity} />
                        <AetherStatusBadge status={inc.status} />
                      </div>
                    </div>
                    <p className="text-xs text-slate-700">{inc.title}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Opened {inc.openedAtLabel} · {inc.durationOutsideRangeMin}m breach</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigateModule('incidents')}
                        className="text-cyan-700 font-semibold hover:underline cursor-pointer"
                      >
                        Manage →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Shipment Operations Table */}
      <div className="bg-white border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0C131F]">
            Corridor Shipments Snapshot ({filteredShipments.length})
          </h3>
          <button
            type="button"
            onClick={() => onNavigateModule('shipments')}
            className="text-xs font-semibold text-cyan-700 hover:underline cursor-pointer"
          >
            View All 30 Shipments →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-4">Code</th>
                <th className="py-2.5 px-4">Customer & Cargo</th>
                <th className="py-2.5 px-4">Corridor Route</th>
                <th className="py-2.5 px-4">Progress</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredShipments.slice(0, 8).map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-4 font-mono font-bold text-[#0C131F]">{s.code}</td>
                  <td className="py-2.5 px-4">
                    <div className="font-semibold text-slate-900">{s.customerCompany}</div>
                    <div className="text-[11px] text-slate-500">{s.cargoDescription}</div>
                  </td>
                  <td className="py-2.5 px-4 text-slate-700">
                    {s.origin} → {s.destination}
                  </td>
                  <td className="py-2.5 px-4 af-tabular">
                    <div className="w-24 bg-slate-200 h-1.5 overflow-hidden mb-1">
                      <div
                        className={`h-full ${s.inActiveExcursion ? 'bg-rose-500' : 'bg-cyan-600'}`}
                        style={{ width: `${s.actualProgressPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {s.actualProgressPct}% (Plan {s.plannedProgressPct}%)
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <AetherStatusBadge status={s.status} />
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <Link
                      to={`/showcase/aether-fleet/shipments/${s.code}`}
                      className="text-cyan-700 font-semibold hover:underline"
                    >
                      Open →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
