import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  DoorOpen,
  Filter,
  Phone,
  Radio,
  ThermometerSnowflake,
  Truck,
} from 'lucide-react';
import { useAetherStore } from '../../../context/AetherStoreContext';
import { ShipmentStatus, VehicleType } from '../../../data/aetherCatalog';
import { AetherCorridorMap } from '../AetherCorridorMap';
import { AetherStatusBadge } from '../AetherStatusBadge';

export const FleetMapModule: React.FC = () => {
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
    ingestTelemetryPacket,
    activeRole,
  } = useAetherStore();

  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<'all' | VehicleType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ShipmentStatus>('all');
  const [incidentOnly, setIncidentOnly] = useState(false);
  const [simNotice, setSimNotice] = useState<string | null>(null);

  const filteredVehicles = dataset.vehicles.filter((v) => {
    if (activeDepotFilter !== 'ALL' && v.homeDepotId !== activeDepotFilter) return false;
    if (vehicleTypeFilter !== 'all' && v.type !== vehicleTypeFilter) return false;
    const linked = dataset.shipments.find((s) => s.id === v.activeShipmentId);
    if (statusFilter !== 'all' && linked?.status !== statusFilter) return false;
    if (incidentOnly) {
      const hasOpen = dataset.incidents.some(
        (inc) => inc.vehicleId === v.id && inc.status !== 'resolved'
      );
      if (!hasOpen && !linked?.inActiveExcursion) return false;
    }
    return true;
  });

  const selectedVehicle =
    dataset.vehicles.find((v) => v.id === selectedVehicleId) ||
    filteredVehicles[0] ||
    dataset.vehicles[0];
  const selectedShipment = dataset.shipments.find(
    (s) => s.id === selectedVehicle?.activeShipmentId
  );
  const activeIncidents = dataset.incidents.filter(
    (i) => i.vehicleId === selectedVehicle?.id && i.status !== 'resolved'
  );

  const handleSimulateGeofenceArrival = () => {
    if (activeRole === 'ops_viewer') {
      setSimNotice('Read-Only Viewer role cannot inject telemetry events.');
      return;
    }
    if (!selectedVehicle || !selectedShipment) return;
    const res = ingestTelemetryPacket({
      eventId: `GF-ARR-${selectedShipment.code}-${Date.now()}`,
      deviceId: 'DEV-GPS-2048',
      vehicleId: selectedVehicle.id,
      shipmentId: selectedShipment.id,
      seqEpoch: selectedVehicle.lastReadingEpoch + 90_000,
      timeLabel: '14:18 IST',
      speedKmh: 0,
      progressPct: 100,
      tempC: selectedVehicle.currentTempC ?? undefined,
      geofenceEvent: 'arrived_destination',
    });
    setSimNotice(
      res.ok
        ? `Geofence entry recorded for ${selectedShipment.code} (status = Arrived; Proof of Delivery still required).`
        : res.error || 'Duplicate packet ignored.'
    );
  };

  return (
    <div className="space-y-5">
      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 font-bold text-[#0C131F] mr-1">
            <Filter className="w-3.5 h-3.5 text-cyan-600" />
            <span>Map Filters:</span>
          </span>

          <select
            value={vehicleTypeFilter}
            onChange={(e) => setVehicleTypeFilter(e.target.value as 'all' | VehicleType)}
            aria-label="Filter by vehicle type"
            className="px-2.5 py-1.5 border border-slate-300 bg-slate-50 text-xs text-slate-800 cursor-pointer"
          >
            <option value="all">All Vehicle Types</option>
            <option value="reefer">Refrigerated Trucks</option>
            <option value="express_van">Express Vans</option>
            <option value="heavy_truck">Heavy Freight</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | ShipmentStatus)}
            aria-label="Filter by shipment status"
            className="px-2.5 py-1.5 border border-slate-300 bg-slate-50 text-xs text-slate-800 cursor-pointer"
          >
            <option value="all">All Trip Statuses</option>
            <option value="in_transit">In Transit</option>
            <option value="delayed">Delayed</option>
            <option value="arrived">Arrived (POD Pending)</option>
          </select>

          <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-300 bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={incidentOnly}
              onChange={(e) => setIncidentOnly(e.target.checked)}
              className="accent-rose-600"
            />
            <span className="font-medium text-slate-800">Active Incidents Only</span>
          </label>
        </div>

        <span className="text-xs text-slate-500 af-tabular">
          Showing <strong>{filteredVehicles.length}</strong> of {dataset.vehicles.length} vehicles
        </span>
      </div>

      {/* Map + Selected Unit Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8">
          <AetherCorridorMap
            depots={dataset.depots}
            vehicles={filteredVehicles}
            shipments={dataset.shipments}
            selectedVehicleId={selectedVehicle?.id || 'VEH-01'}
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

        <div className="xl:col-span-4 bg-white border border-slate-200 p-5 space-y-4">
          {selectedVehicle ? (
            <>
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 font-bold">
                    Live Vehicle Telemetry · {selectedVehicle.id}
                  </span>
                  <h3 className="text-lg font-bold text-[#0C131F] mt-0.5">{selectedVehicle.plate}</h3>
                  <p className="text-xs text-slate-600">{selectedVehicle.model}</p>
                </div>
                <Truck className="w-5 h-5 text-cyan-600 shrink-0" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs af-tabular">
                <div className="p-2.5 bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Assigned Driver</span>
                  <strong className="text-[#0C131F]">{selectedVehicle.driverName}</strong>
                  <div className="text-[10px] text-slate-500 inline-flex items-center gap-1 mt-0.5">
                    <Phone className="w-2.5 h-2.5" />
                    <span>{selectedVehicle.driverPhone}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Speed & Fuel</span>
                  <strong className="text-[#0C131F]">{selectedVehicle.speedKmh} km/h</strong>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Reserve: {selectedVehicle.fuelOrBatteryPct}% · Sync: {selectedVehicle.lastUpdatedLabel}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Cold-Chain Probe</span>
                  <strong className="text-[#0C131F] inline-flex items-center gap-1">
                    <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-600" />
                    <span>
                      {selectedVehicle.currentTempC !== null
                        ? `${selectedVehicle.currentTempC}°C`
                        : 'Ambient'}
                    </span>
                  </strong>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Cargo Door Latch</span>
                  <strong
                    className={`inline-flex items-center gap-1 ${
                      selectedVehicle.doorOpen ? 'text-rose-700' : 'text-emerald-700'
                    }`}
                  >
                    <DoorOpen className="w-3.5 h-3.5" />
                    <span>{selectedVehicle.doorOpen ? 'OPEN (Alert)' : 'Sealed Closed'}</span>
                  </strong>
                </div>
              </div>

              {selectedShipment ? (
                <div className="p-3.5 bg-[#0C131F] text-white space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-cyan-300">
                      Active Order: {selectedShipment.code}
                    </span>
                    <AetherStatusBadge status={selectedShipment.status} />
                  </div>
                  <p className="text-slate-300">
                    {selectedShipment.origin} → {selectedShipment.destination}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                    <span>ETA: {selectedShipment.etaLabel}</span>
                    <span>
                      {selectedShipment.actualProgressPct}% vs Plan {selectedShipment.plannedProgressPct}%
                    </span>
                  </div>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <Link
                      to={`/showcase/aether-fleet/shipments/${selectedShipment.code}`}
                      className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-bold text-[11px] inline-flex items-center gap-1"
                    >
                      <span>Shipment Dossier</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <button
                      type="button"
                      onClick={handleSimulateGeofenceArrival}
                      className="px-3 py-1.5 border border-cyan-400/50 text-cyan-200 text-[11px] font-semibold hover:bg-cyan-950 cursor-pointer"
                    >
                      Simulate Geofence Arrival
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  Staged idle at depot ({selectedVehicle.homeDepotId}). Ready for assignment in Dispatch Board.
                </div>
              )}

              {activeIncidents.length > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                  <div className="font-bold inline-flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>{activeIncidents.length} Active Vehicle Incident</span>
                  </div>
                  <p className="text-[11px]">{activeIncidents[0].title}</p>
                </div>
              )}

              {simNotice && (
                <div className="p-2.5 bg-cyan-50 border border-cyan-200 text-[11px] text-cyan-950 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
                  <span>{simNotice}</span>
                </div>
              )}
            </>
          ) : (
            <p className="text-xs text-slate-500">Select a vehicle on the corridor map.</p>
          )}
        </div>
      </div>
    </div>
  );
};
