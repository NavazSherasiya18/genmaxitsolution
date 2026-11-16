import React, { useState } from 'react';
import { BarChart3, Download } from 'lucide-react';
import { useAetherStore } from '../../../context/AetherStoreContext';
import { ShipmentStatus } from '../../../data/aetherCatalog';
import { buildCsvDownload } from '../../../utils/aetherEngine';
import { AetherStatusBadge } from '../AetherStatusBadge';

export const ReportingModule: React.FC = () => {
  const { dataset, activeDepotFilter } = useAetherStore();
  const [statusFilter, setStatusFilter] = useState<'all' | ShipmentStatus>('all');
  const [exportedNote, setExportedNote] = useState<string | null>(null);

  const filtered = dataset.shipments.filter((s) => {
    if (activeDepotFilter !== 'ALL' && s.originDepotId !== activeDepotFilter) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  const delayedList = filtered.filter((s) => s.status === 'delayed');
  const otdEligible = filtered.filter((s) => s.status !== 'unassigned');
  const onTimeCount = otdEligible.filter((s) => s.status !== 'delayed' && !s.inActiveExcursion).length;
  const otdRate = otdEligible.length ? Math.round((onTimeCount / otdEligible.length) * 100) : 100;

  const depotVehicles = dataset.vehicles.filter(
    (v) => activeDepotFilter === 'ALL' || v.homeDepotId === activeDepotFilter
  );
  const utilizedPct = depotVehicles.length
    ? Math.round((depotVehicles.filter((v) => v.activeShipmentId).length / depotVehicles.length) * 100)
    : 0;

  const coldIncidents = dataset.incidents.filter((inc) =>
    filtered.some((s) => s.id === inc.shipmentId)
  ).length;

  const handleExportCsv = () => {
    const headers = [
      'Shipment Code',
      'Customer',
      'Origin Depot',
      'Destination',
      'Status',
      'Weight (kg)',
      'Reefer Required',
      'Progress (%)',
      'ETA / Completion',
    ];
    const rows = filtered.map((s) => [
      s.code,
      s.customerCompany,
      s.origin,
      s.destination,
      s.status,
      s.weightKg,
      s.requiresReefer ? `${s.tempThresholdMinC}C to ${s.tempThresholdMaxC}C` : 'No (Dry)',
      s.actualProgressPct,
      s.etaLabel,
    ]);
    buildCsvDownload(`aether-fleet-report-${activeDepotFilter.toLowerCase()}.csv`, headers, rows);
    setExportedNote(`Downloaded CSV with ${filtered.length} filtered logistics records.`);
  };

  return (
    <div className="space-y-5">
      {/* Header & Export */}
      <div className="bg-white border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-[#0C131F] inline-flex items-center gap-1.5 mr-1">
            <BarChart3 className="w-4 h-4 text-cyan-600" />
            <span>Operational Analytics Filter:</span>
          </span>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | ShipmentStatus)}
            aria-label="Filter report status"
            className="px-2.5 py-1.5 border border-slate-300 bg-slate-50 cursor-pointer"
          >
            <option value="all">All Shipments ({dataset.shipments.length})</option>
            <option value="in_transit">In Transit</option>
            <option value="delayed">Delayed</option>
            <option value="arrived">Arrived (POD Pending)</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="px-4 py-2 bg-[#0C131F] hover:bg-slate-800 text-white font-bold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Filtered CSV Report</span>
        </button>
      </div>

      {exportedNote && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
          {exportedNote}
        </div>
      )}

      {/* Derived KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            On-Time Dispatch Rate
          </span>
          <p className="text-2xl font-bold text-[#0C131F] mt-1 af-tabular">{otdRate}%</p>
        </div>
        <div className="bg-white border border-slate-200 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Fleet Utilization
          </span>
          <p className="text-2xl font-bold text-[#0C131F] mt-1 af-tabular">{utilizedPct}%</p>
        </div>
        <div className="bg-white border border-slate-200 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Active Delays
          </span>
          <p className="text-2xl font-bold text-amber-700 mt-1 af-tabular">{delayedList.length}</p>
        </div>
        <div className="bg-white border border-slate-200 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Cold-Chain Incidents
          </span>
          <p className="text-2xl font-bold text-rose-700 mt-1 af-tabular">{coldIncidents}</p>
        </div>
      </div>

      {/* Delay Reasons Breakdown */}
      <div className="bg-white border border-slate-200 p-5 space-y-3">
        <h3 className="text-sm font-bold text-[#0C131F]">Delay Reasons Breakdown</h3>
        {delayedList.length === 0 ? (
          <p className="text-xs text-slate-500">No delayed orders in the selected filter.</p>
        ) : (
          <div className="space-y-2 text-xs">
            {delayedList.map((d) => (
              <div
                key={d.id}
                className="flex flex-wrap items-center justify-between gap-2 p-3 bg-amber-50/70 border border-amber-200"
              >
                <div>
                  <span className="font-mono font-bold text-[#0C131F]">{d.code}</span>{' '}
                  <span className="text-slate-600">({d.origin} → {d.destination})</span>
                  <div className="text-[11px] text-amber-950 font-medium mt-0.5">
                    {d.delayReason || 'Corridor traffic or telemetry checkhold'}
                  </div>
                </div>
                <AetherStatusBadge status="delayed" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Table */}
      <div className="bg-white border border-slate-200 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-4">Code</th>
              <th className="py-2.5 px-4">Customer</th>
              <th className="py-2.5 px-4">Destination</th>
              <th className="py-2.5 px-4">Progress</th>
              <th className="py-2.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="py-2.5 px-4 font-mono font-bold text-[#0C131F]">{s.code}</td>
                <td className="py-2.5 px-4 text-slate-800">{s.customerCompany}</td>
                <td className="py-2.5 px-4 text-slate-600">{s.destination}</td>
                <td className="py-2.5 px-4 af-tabular">{s.actualProgressPct}%</td>
                <td className="py-2.5 px-4">
                  <AetherStatusBadge status={s.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
