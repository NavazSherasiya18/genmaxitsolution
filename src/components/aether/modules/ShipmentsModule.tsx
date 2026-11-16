import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Plus, Search, Snowflake, X } from 'lucide-react';
import { useAetherStore } from '../../../context/AetherStoreContext';
import { DepotId, ShipmentStatus } from '../../../data/aetherCatalog';
import { AetherStatusBadge } from '../AetherStatusBadge';

export const ShipmentsModule: React.FC<{ globalSearch: string }> = ({ globalSearch }) => {
  const { dataset, activeDepotFilter, createSampleShipment, activeRole } = useAetherStore();

  const [statusFilter, setStatusFilter] = useState<'all' | ShipmentStatus>('all');
  const [localSearch, setLocalSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [originDepotId, setOriginDepotId] = useState<DepotId>('DEP-PUNE');
  const [destination, setDestination] = useState('Pune Hadapsar Pharma Annex');
  const [customerCompany, setCustomerCompany] = useState('Solstice Biopharma India Ltd');
  const [cargoDescription, setCargoDescription] = useState('Chilled Biologics Batch #914');
  const [weightKg, setWeightKg] = useState(3200);
  const [requiresReefer, setRequiresReefer] = useState(true);
  const [formMsg, setFormMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const combinedSearch = (localSearch || globalSearch).trim().toLowerCase();

  const filtered = dataset.shipments.filter((s) => {
    if (activeDepotFilter !== 'ALL' && s.originDepotId !== activeDepotFilter) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (combinedSearch) {
      const hay = `${s.code} ${s.customerCompany} ${s.origin} ${s.destination} ${s.cargoDescription}`.toLowerCase();
      if (!hay.includes(combinedSearch)) return false;
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRole === 'ops_viewer') {
      setFormMsg({ ok: false, text: 'Switch out of Read-Only Viewer role to create shipments.' });
      return;
    }
    const res = createSampleShipment({
      originDepotId,
      destination,
      customerCompany,
      cargoDescription,
      weightKg: Number(weightKg),
      requiresReefer,
    });
    if (!res.ok) {
      setFormMsg({ ok: false, text: res.error || 'Could not create shipment.' });
      return;
    }
    setFormMsg({
      ok: true,
      text: `Created unassigned shipment ${res.data?.code}. Assign a vehicle in Dispatch Board.`,
    });
    setDrawerOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Toolbar */}
      <div className="bg-white border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[220px] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter AFL code, customer, route..."
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 text-xs text-slate-900 bg-slate-50 focus:outline-none focus:border-cyan-600"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | ShipmentStatus)}
            aria-label="Filter shipment status"
            className="px-2.5 py-1.5 border border-slate-300 bg-slate-50 text-xs text-slate-800 cursor-pointer"
          >
            <option value="all">All Statuses ({dataset.shipments.length})</option>
            <option value="unassigned">Unassigned</option>
            <option value="assigned">Assigned</option>
            <option value="in_transit">In Transit</option>
            <option value="delayed">Delayed</option>
            <option value="arrived">Arrived (POD Pending)</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormMsg(null);
            setDrawerOpen(!drawerOpen);
          }}
          className="px-3.5 py-2 bg-[#0C131F] hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-cyan-400" />
          <span>Create Sample Shipment</span>
        </button>
      </div>

      {formMsg && (
        <div
          className={`p-3 border text-xs ${
            formMsg.ok
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {formMsg.text}
        </div>
      )}

      {/* Create Sample Shipment Drawer */}
      {drawerOpen && (
        <form
          onSubmit={handleCreate}
          className="bg-white border-2 border-cyan-600 p-5 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0C131F]">
              New Corridor Freight Manifest
            </h3>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="text-slate-500 hover:text-slate-900 cursor-pointer"
              aria-label="Close form"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Origin Depot</label>
              <select
                value={originDepotId}
                onChange={(e) => setOriginDepotId(e.target.value as DepotId)}
                className="w-full px-3 py-2 border border-slate-300 bg-slate-50"
              >
                {dataset.depots.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Destination Hub *</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Customer Account *</label>
              <input
                type="text"
                required
                value={customerCompany}
                onChange={(e) => setCustomerCompany(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cargo Manifest *</label>
              <input
                type="text"
                required
                value={cargoDescription}
                onChange={(e) => setCargoDescription(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gross Weight (kg)</label>
              <input
                type="number"
                min={100}
                max={25000}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 af-tabular"
              />
            </div>

            <div className="flex items-end pb-1">
              <label className="inline-flex items-center gap-2 font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresReefer}
                  onChange={(e) => setRequiresReefer(e.target.checked)}
                  className="accent-cyan-600"
                />
                <span>Requires Cold-Chain Reefer (2°C – 8°C)</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="px-4 py-2 border border-slate-300 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 cursor-pointer"
            >
              Queue Unassigned Order
            </button>
          </div>
        </form>
      )}

      {/* Shipments Table */}
      <div className="bg-white border border-slate-200 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Order</th>
              <th className="py-3 px-4">Customer & Cargo</th>
              <th className="py-3 px-4">Origin → Destination</th>
              <th className="py-3 px-4">Vehicle</th>
              <th className="py-3 px-4">Threshold</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Links</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((s) => {
              const veh = dataset.vehicles.find((v) => v.id === s.assignedVehicleId);
              return (
                <tr key={s.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-[#0C131F] whitespace-nowrap">
                    {s.code}
                    <div className="text-[10px] font-normal text-slate-500 af-tabular">
                      {s.weightKg.toLocaleString()} kg
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{s.customerCompany}</div>
                    <div className="text-[11px] text-slate-500">{s.cargoDescription}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <div>{s.origin}</div>
                    <div className="text-[11px] text-slate-500">→ {s.destination}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                    {veh ? veh.plate : <span className="text-slate-400">Unassigned</span>}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap af-tabular">
                    {s.requiresReefer && s.tempThresholdMinC !== null ? (
                      <span className="inline-flex items-center gap-1 text-cyan-800 font-semibold">
                        <Snowflake className="w-3 h-3" />
                        <span>
                          {s.tempThresholdMinC}°–{s.tempThresholdMaxC}°C
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-500">Dry Ambient</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <AetherStatusBadge status={s.status} />
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap space-x-3">
                    <Link
                      to={`/showcase/aether-fleet/shipments/${s.code}`}
                      className="text-cyan-700 font-semibold hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Detail</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link
                      to={`/showcase/aether-fleet/track/${s.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 hover:text-cyan-700 inline-flex items-center gap-0.5"
                    >
                      <span>Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
