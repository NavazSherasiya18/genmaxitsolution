import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Snowflake,
  Truck,
} from 'lucide-react';
import { useAetherStore } from '../../../context/AetherStoreContext';
import { AetherStatusBadge } from '../AetherStatusBadge';

export const DispatchBoardModule: React.FC = () => {
  const {
    dataset,
    activeDepotFilter,
    assignShipmentToVehicle,
    reorderShipmentStop,
    activeRole,
  } = useAetherStore();

  const [selectedVehicleMap, setSelectedVehicleMap] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const visibleShipments = dataset.shipments.filter(
    (s) => activeDepotFilter === 'ALL' || s.originDepotId === activeDepotFilter
  );

  const lanes = [
    {
      key: 'unassigned',
      title: 'Unassigned Queue',
      items: visibleShipments.filter((s) => s.status === 'unassigned'),
    },
    {
      key: 'assigned',
      title: 'Assigned & Staging',
      items: visibleShipments.filter((s) => s.status === 'assigned'),
    },
    {
      key: 'in_transit',
      title: 'In Transit / Active',
      items: visibleShipments.filter(
        (s) => s.status === 'in_transit' || s.status === 'delayed' || s.status === 'arrived'
      ),
    },
    {
      key: 'delivered',
      title: 'Delivered (POD Verified)',
      items: visibleShipments.filter((s) => s.status === 'delivered'),
    },
  ];

  const handleAssign = (shipmentId: string) => {
    if (activeRole === 'ops_viewer') {
      setFeedback({ ok: false, text: 'Read-Only Viewer role cannot modify dispatch assignments.' });
      return;
    }
    const vehId = selectedVehicleMap[shipmentId] || dataset.vehicles[0].id;
    const res = assignShipmentToVehicle(shipmentId, vehId);
    if (!res.ok) {
      setFeedback({ ok: false, text: res.error || 'Assignment blocked by dispatch guardrail.' });
      return;
    }
    const veh = dataset.vehicles.find((v) => v.id === vehId);
    const shp = dataset.shipments.find((s) => s.id === shipmentId);
    setFeedback({
      ok: true,
      text: `Assigned ${shp?.code} to ${veh?.plate} (${veh?.driverName}). Capacity & reefer compatibility verified.`,
    });
  };

  const handleMoveStop = (shipmentId: string, stopId: string, dir: 'up' | 'down') => {
    if (activeRole === 'ops_viewer') {
      setFeedback({ ok: false, text: 'Read-Only Viewer role cannot reorder stops.' });
      return;
    }
    const res = reorderShipmentStop(shipmentId, stopId, dir);
    if (!res.ok && res.error) {
      setFeedback({ ok: false, text: res.error });
    } else if (res.ok) {
      setFeedback({ ok: true, text: 'Updated route stop sequence cleanly.' });
    }
  };

  return (
    <div className="space-y-5">
      {/* Guardrail Notice */}
      <div className="bg-white border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-slate-700">
          <strong className="text-[#0C131F]">Dispatch Validation Guardrails Active:</strong>{' '}
          Rejects refrigerated orders placed on non-reefer trucks, enforces payload limits, prevents active-run conflicts, and supports accessible stop reordering.
        </div>
        <span className="font-mono text-[11px] text-cyan-700 font-semibold">
          {dataset.vehicles.length} Fleet Units Online
        </span>
      </div>

      {feedback && (
        <div
          role="alert"
          className={`p-3.5 border text-xs flex items-start gap-2 ${
            feedback.ok
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          {feedback.ok ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span className="font-medium">{feedback.text}</span>
        </div>
      )}

      {/* 4 Dispatch Lanes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {lanes.map((lane) => (
          <div key={lane.key} className="bg-slate-100/80 border border-slate-200 p-3 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0C131F]">
                {lane.title}
              </h3>
              <span className="px-2 py-0.5 bg-white border border-slate-200 text-[11px] font-mono font-bold text-slate-700 af-tabular">
                {lane.items.length}
              </span>
            </div>

            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-0.5">
              {lane.items.slice(0, 6).map((shp) => {
                const currentVeh = dataset.vehicles.find((v) => v.id === shp.assignedVehicleId);
                return (
                  <div key={shp.id} className="bg-white border border-slate-200 p-3 space-y-2.5 text-xs shadow-2xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-[#0C131F]">{shp.code}</span>
                      <AetherStatusBadge status={shp.status} />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">{shp.customerCompany}</p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {shp.origin} → {shp.destination}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 af-tabular">
                      <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200">
                        {shp.weightKg.toLocaleString()} kg
                      </span>
                      {shp.requiresReefer ? (
                        <span className="px-1.5 py-0.5 bg-cyan-50 border border-cyan-200 text-cyan-800 inline-flex items-center gap-1">
                          <Snowflake className="w-3 h-3" />
                          <span>Reefer Required</span>
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200">
                          Dry Freight
                        </span>
                      )}
                    </div>

                    {/* Assign / Reassign Vehicle */}
                    {lane.key !== 'delivered' && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          {currentVeh ? `Assigned: ${currentVeh.plate}` : 'Assign Fleet Unit'}
                        </label>
                        <div className="flex items-center gap-1.5">
                          <select
                            value={selectedVehicleMap[shp.id] || shp.assignedVehicleId || dataset.vehicles[0].id}
                            onChange={(e) =>
                              setSelectedVehicleMap((prev) => ({
                                ...prev,
                                [shp.id]: e.target.value,
                              }))
                            }
                            aria-label={`Select vehicle for ${shp.code}`}
                            className="flex-1 min-w-0 px-2 py-1.5 border border-slate-300 bg-slate-50 text-[11px]"
                          >
                            {dataset.vehicles.map((v) => (
                              <option key={v.id} value={v.id}>
                                {v.plate} ({v.reeferCapable ? 'Reefer' : 'Dry'} · {(v.maxCapacityKg / 1000).toFixed(1)}t)
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleAssign(shp.id)}
                            className="px-2.5 py-1.5 bg-[#0C131F] text-white text-[11px] font-semibold hover:bg-slate-800 cursor-pointer shrink-0 inline-flex items-center gap-1"
                          >
                            <Truck className="w-3 h-3 text-cyan-400" />
                            <span>{currentVeh ? 'Reassign' : 'Assign'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Keyboard-Accessible Stop Ordering */}
                    {shp.stops.length > 1 && lane.key !== 'delivered' && (
                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                          Stop Sequence
                        </span>
                        {shp.stops.map((st, idx) => (
                          <div
                            key={st.id}
                            className="flex items-center justify-between gap-1.5 text-[11px] bg-slate-50 px-2 py-1 border border-slate-200"
                          >
                            <span className="truncate text-slate-700">
                              <strong className="font-mono text-[#0C131F]">{st.sequence}.</strong>{' '}
                              {st.location}
                            </span>
                            <div className="flex items-center gap-0.5 shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveStop(shp.id, st.id, 'up')}
                                aria-label={`Move stop ${st.sequence} up`}
                                className="p-1 text-slate-600 hover:text-cyan-700 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === shp.stops.length - 1}
                                onClick={() => handleMoveStop(shp.id, st.id, 'down')}
                                aria-label={`Move stop ${st.sequence} down`}
                                className="p-1 text-slate-600 hover:text-cyan-700 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
