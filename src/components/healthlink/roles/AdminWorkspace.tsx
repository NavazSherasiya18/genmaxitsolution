import React, { useMemo, useState } from 'react';
import { Activity, AlertTriangle, BarChart3, Search } from 'lucide-react';
import { useHealthLinkStore } from '../../../context/HealthLinkStoreContext';
import { HealthLinkStatusBadge } from '../HealthLinkStatusBadge';
import { formatCurrencyUsd, getDemoTodayIso } from '../../../data/healthlinkCatalog';

export const AdminWorkspace: React.FC = () => {
  const { dataset, activeFacilityId } = useHealthLinkStore();
  const today = getDemoTodayIso();

  const [scopeFacility, setScopeFacility] = useState<string>(activeFacilityId);
  const [dateScope, setDateScope] = useState<'today' | 'all'>('all');
  const [logSearch, setLogSearch] = useState('');

  const scopedVisits = useMemo(
    () =>
      dataset.visits.filter((v) => {
        if (scopeFacility !== 'all' && v.facilityId !== scopeFacility) return false;
        if (dateScope === 'today' && v.visitDateIso !== today) return false;
        return true;
      }),
    [dataset.visits, scopeFacility, dateScope, today]
  );

  const scopedInvoices = useMemo(
    () =>
      dataset.invoices.filter((i) => {
        if (scopeFacility !== 'all' && i.facilityId !== scopeFacility) return false;
        if (dateScope === 'today' && i.issuedDateIso !== today) return false;
        return true;
      }),
    [dataset.invoices, scopeFacility, dateScope, today]
  );

  const waitingVisits = scopedVisits.filter((v) => v.progressStatus === 'waiting').length;
  const completedVisits = scopedVisits.filter((v) => v.progressStatus === 'completed').length;
  const totalRevenue = scopedInvoices
    .filter((i) => i.status === 'paid')
    .reduce((acc, inv) => acc + inv.totalAmount, 0);
  const pendingBilling = scopedInvoices
    .filter((i) => i.status === 'pending_payment')
    .reduce((acc, inv) => acc + inv.totalAmount, 0);

  const stockAlerts = dataset.inventory.filter((m) => m.stockQty <= m.reorderThreshold);

  const clinicianWorkload = dataset.clinicians
    .filter((c) => scopeFacility === 'all' || c.facilityId === scopeFacility)
    .map((doc) => ({
      doc,
      cases: scopedVisits.filter((v) => v.clinicianId === doc.id).length,
      open: scopedVisits.filter(
        (v) => v.clinicianId === doc.id && v.progressStatus !== 'completed'
      ).length,
    }));

  const maxDocCases = Math.max(1, ...clinicianWorkload.map((w) => w.cases));

  const filteredLogs = dataset.activityLog.filter((evt) => {
    if (scopeFacility !== 'all' && evt.facilityId !== scopeFacility) return false;
    const q = logSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      evt.title.toLowerCase().includes(q) ||
      evt.detail.toLowerCase().includes(q) ||
      evt.department.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Scope Controls */}
      <div className="bg-white border border-[#DCE6EE] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <label htmlFor="hl-adm-fac" className="font-semibold text-[#475569]">
            Facility View:
          </label>
          <select
            id="hl-adm-fac"
            value={scopeFacility}
            onChange={(e) => setScopeFacility(e.target.value)}
            className="h-9 px-2.5 bg-[#F7FAFC] border border-[#DCE6EE] font-medium text-[#0A2540]"
          >
            <option value="all">All Sample Facilities (2)</option>
            {dataset.facilities.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          <div className="inline-flex border border-[#DCE6EE] bg-[#F7FAFC] p-0.5">
            <button
              type="button"
              onClick={() => setDateScope('today')}
              className={`px-3 py-1 font-semibold cursor-pointer ${
                dateScope === 'today' ? 'bg-[#0A2540] text-white' : 'text-[#475569]'
              }`}
            >
              Today Only
            </button>
            <button
              type="button"
              onClick={() => setDateScope('all')}
              className={`px-3 py-1 font-semibold cursor-pointer ${
                dateScope === 'all' ? 'bg-[#0A2540] text-white' : 'text-[#475569]'
              }`}
            >
              All Demo Dates
            </button>
          </div>
        </div>

        <p className="text-[11px] text-[#64748B]">
          Computed live from shared browser-local clinical records
        </p>
      </div>

      {/* 4 Real Data-Driven KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 hl-tabular">
        <div className="bg-white border border-[#DCE6EE] p-5 space-y-1">
          <span className="text-xs font-semibold text-[#475569]">Patient Encounters</span>
          <p className="text-2xl font-bold font-mono text-[#0A2540]">{scopedVisits.length}</p>
          <p className="text-[11px] text-[#0F766E]">
            {completedVisits} completed · {waitingVisits} waiting in queue
          </p>
        </div>

        <div className="bg-white border border-[#DCE6EE] p-5 space-y-1">
          <span className="text-xs font-semibold text-[#475569]">Settled Demo Billing</span>
          <p className="text-2xl font-bold font-mono text-[#0A2540]">
            {formatCurrencyUsd(totalRevenue)}
          </p>
          <p className="text-[11px] text-[#475569]">
            {formatCurrencyUsd(pendingBilling)} pending settlement
          </p>
        </div>

        <div className="bg-white border border-[#DCE6EE] p-5 space-y-1">
          <span className="text-xs font-semibold text-[#475569]">Dispensing Batches</span>
          <p className="text-2xl font-bold font-mono text-[#0A2540]">
            {
              dataset.dispensingRecords.filter(
                (d) => scopeFacility === 'all' || d.facilityId === scopeFacility
              ).length
            }
          </p>
          <p className="text-[11px] text-[#475569]">
            {
              dataset.prescriptions.filter(
                (r) =>
                  (scopeFacility === 'all' || r.facilityId === scopeFacility) &&
                  (r.status === 'pending_pharmacy' || r.status === 'partially_dispensed')
              ).length
            }{' '}
            open RX in queue
          </p>
        </div>

        <div className="bg-white border border-[#DCE6EE] p-5 space-y-1">
          <span className="text-xs font-semibold text-[#475569]">Pharmacy Stock Alerts</span>
          <p className="text-2xl font-bold font-mono text-[#9A3412]">{stockAlerts.length}</p>
          <p className="text-[11px] text-[#475569]">
            {dataset.inventory.filter((m) => m.stockQty === 0).length} out of stock
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Clinician Workload Bars */}
        <div className="lg:col-span-6 bg-white border border-[#DCE6EE] p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#0A2540] inline-flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#0F766E]" />
            Clinician Case Workload
          </h2>
          <div className="space-y-3 text-xs hl-tabular">
            {clinicianWorkload.map(({ doc, cases, open }) => (
              <div key={doc.id} className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#0A2540]">
                    {doc.name}{' '}
                    <span className="font-normal text-[#64748B]">({doc.department})</span>
                  </span>
                  <span className="font-mono text-[#0F766E]">
                    {cases} cases ({open} open)
                  </span>
                </div>
                <div className="h-2 bg-[#F1F5F9] overflow-hidden">
                  <div
                    className="h-full bg-[#0D9488]"
                    style={{ width: `${Math.max(6, (cases / maxDocCases) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low & Out-of-Stock Alerts */}
        <div className="lg:col-span-6 bg-white border border-[#DCE6EE] p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#0A2540] inline-flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#9A3412]" />
            Pharmacy Stock Threshold Alerts
          </h2>
          <div className="divide-y divide-[#EAEFF4] border border-[#DCE6EE] text-xs hl-tabular">
            {stockAlerts.map((item) => (
              <div key={item.id} className="p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-[#0A2540]">
                    {item.name} ({item.id})
                  </p>
                  <p className="text-[#64748B]">
                    Available: {item.stockQty} · Reorder threshold: {item.reorderThreshold}
                  </p>
                </div>
                <HealthLinkStatusBadge
                  status={item.stockQty === 0 ? 'out_of_stock' : 'low_stock'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Searchable Activity Log */}
      <div className="bg-white border border-[#DCE6EE] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-[#0A2540] inline-flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#0F766E]" />
            Searchable Hospital Operations Log ({filteredLogs.length})
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              placeholder="Filter audit log by department or event..."
              className="w-full h-9 pl-8 pr-3 bg-[#F7FAFC] border border-[#DCE6EE] text-xs text-[#0A2540]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-[#DCE6EE]">
            <thead className="bg-[#F7FAFC] border-b border-[#DCE6EE] text-[#475569]">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Role / Dept</th>
                <th className="p-3">Event</th>
                <th className="p-3">Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEFF4]">
              {filteredLogs.map((evt) => (
                <tr key={evt.id}>
                  <td className="p-3 whitespace-nowrap text-[#64748B] hl-tabular">
                    {evt.timestampLabel}
                  </td>
                  <td className="p-3 whitespace-nowrap font-semibold text-[#0F766E] capitalize">
                    {evt.actorRole} · {evt.department}
                  </td>
                  <td className="p-3 font-bold text-[#0A2540]">{evt.title}</td>
                  <td className="p-3 text-[#475569]">{evt.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
