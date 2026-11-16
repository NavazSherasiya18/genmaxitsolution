import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  ShieldAlert,
} from 'lucide-react';
import { useAetherStore } from '../../../context/AetherStoreContext';
import { IncidentSeverity, IncidentStatus } from '../../../data/aetherCatalog';
import { AetherStatusBadge } from '../AetherStatusBadge';

export const IncidentCenterModule: React.FC = () => {
  const {
    dataset,
    acknowledgeIncident,
    updateIncidentStatus,
    sendDriverInstruction,
    activeRole,
  } = useAetherStore();

  const [statusFilter, setStatusFilter] = useState<'all' | IncidentStatus>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | IncidentSeverity>('all');
  const [instructionMap, setInstructionMap] = useState<Record<string, string>>({});
  const [resolutionMap, setResolutionMap] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const roleOwnerLabel =
    activeRole === 'cold_chain_lead'
      ? 'Ananya Sen (Cold-Chain Lead)'
      : activeRole === 'fleet_tech'
      ? 'Karthik Menon (Fleet Tech)'
      : 'Dispatcher Control';

  const filtered = dataset.incidents.filter((inc) => {
    if (statusFilter !== 'all' && inc.status !== statusFilter) return false;
    if (severityFilter !== 'all' && inc.severity !== severityFilter) return false;
    return true;
  });

  const handleAck = (incId: string) => {
    if (activeRole === 'ops_viewer') {
      setFeedback({ ok: false, text: 'Read-Only Viewer role cannot acknowledge incidents.' });
      return;
    }
    const res = acknowledgeIncident(incId, roleOwnerLabel);
    setFeedback({
      ok: res.ok,
      text: res.ok
        ? `Incident ${incId} acknowledged and assigned to ${roleOwnerLabel}.`
        : res.error || 'Already acknowledged.',
    });
  };

  const handleSendInstruction = (incId: string, shipmentId: string, vehicleId: string) => {
    if (activeRole === 'ops_viewer') {
      setFeedback({ ok: false, text: 'Read-Only Viewer role cannot dispatch driver instructions.' });
      return;
    }
    const msg =
      instructionMap[incId] ||
      'Pull over at nearest safe bay, inspect rear cargo latch, and engage reefer boost cooling.';
    const res = sendDriverInstruction({
      shipmentId,
      vehicleId,
      incidentId: incId,
      message: msg,
    });
    if (res.ok) {
      setFeedback({
        ok: true,
        text: `Instruction pushed to Driver Workspace for ${vehicleId}. Open Driver View (/showcase/aether-fleet/driver) to reply.`,
      });
      setInstructionMap((prev) => ({ ...prev, [incId]: '' }));
    } else {
      setFeedback({ ok: false, text: res.error || 'Could not send instruction.' });
    }
  };

  const handleResolve = (incId: string) => {
    if (activeRole === 'ops_viewer') {
      setFeedback({ ok: false, text: 'Read-Only Viewer role cannot resolve incidents.' });
      return;
    }
    const note = resolutionMap[incId] || '';
    const res = updateIncidentStatus(incId, 'resolved', note);
    setFeedback({
      ok: res.ok,
      text: res.ok
        ? `Incident ${incId} resolved and logged cleanly on shipment dossier.`
        : res.error || 'Resolution note required.',
    });
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="bg-white border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-[#0C131F] inline-flex items-center gap-1.5 mr-1">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Incident Filters:</span>
          </span>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | IncidentStatus)}
            aria-label="Filter incident status"
            className="px-2.5 py-1.5 border border-slate-300 bg-slate-50 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as 'all' | IncidentSeverity)}
            aria-label="Filter incident severity"
            className="px-2.5 py-1.5 border border-slate-300 bg-slate-50 cursor-pointer"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
          </select>
        </div>

        <span className="text-slate-500 af-tabular">
          Active Queue: <strong>{filtered.filter((i) => i.status !== 'resolved').length}</strong> open
        </span>
      </div>

      {feedback && (
        <div
          role="alert"
          className={`p-3.5 border text-xs flex items-center gap-2 ${
            feedback.ok
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          {feedback.ok ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Incident List */}
      <div className="space-y-4">
        {filtered.map((inc) => {
          const linkedShp = dataset.shipments.find((s) => s.id === inc.shipmentId);
          return (
            <div key={inc.id} className="bg-white border border-slate-200 p-5 space-y-4 shadow-2xs">
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#0C131F]">
                      {inc.id} · {inc.shipmentCode}
                    </span>
                    <AetherStatusBadge status={inc.severity} />
                    <AetherStatusBadge status={inc.status} />
                    {linkedShp?.sensorRecovered && inc.status !== 'resolved' && (
                      <AetherStatusBadge status="recovered" />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{inc.title}</h3>
                  <p className="text-xs text-slate-600">
                    Policy: {inc.policyTriggered} · Peak: <strong>{inc.peakTempC ?? 'N/A'}°C</strong> · Owner:{' '}
                    <strong>{inc.owner}</strong>
                  </p>
                </div>

                {inc.status === 'open' && (
                  <button
                    type="button"
                    onClick={() => handleAck(inc.id)}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold cursor-pointer"
                  >
                    Acknowledge & Assign Me
                  </button>
                )}
              </div>

              {/* Action Controls for Unresolved Incidents */}
              {inc.status !== 'resolved' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                  {/* Send Instruction to Driver */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 space-y-2">
                    <label className="block font-bold text-[#0C131F]">
                      Send Dispatch Instruction to Driver ({inc.vehicleId})
                    </label>
                    <input
                      type="text"
                      value={
                        instructionMap[inc.id] ??
                        'Pull over safely, verify cargo latch shut, and engage boost cooling.'
                      }
                      onChange={(e) =>
                        setInstructionMap((prev) => ({ ...prev, [inc.id]: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-slate-300 bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleSendInstruction(inc.id, inc.shipmentId, inc.vehicleId)
                      }
                      className="px-3.5 py-2 bg-[#0C131F] text-white font-bold hover:bg-slate-800 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Send Instruction to Driver App</span>
                    </button>
                  </div>

                  {/* Resolve Incident */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 space-y-2">
                    <label className="block font-bold text-[#0C131F]">
                      Closeout & Resolution Note
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Door seal secured; probe verified steady inside 2–8°C band."
                      value={resolutionMap[inc.id] ?? ''}
                      onChange={(e) =>
                        setResolutionMap((prev) => ({ ...prev, [inc.id]: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-slate-300 bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleResolve(inc.id)}
                      className="px-3.5 py-2 bg-emerald-600 text-white font-bold hover:bg-emerald-700 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolve Incident</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                  <strong>Resolved ({inc.resolvedAtLabel}):</strong> {inc.resolutionNote}
                </div>
              )}

              {/* Audit Timeline */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Incident Audit Trail
                </span>
                <div className="space-y-1.5">
                  {inc.timeline.map((ev, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 text-[11px] text-slate-700 bg-slate-50/70 px-3 py-1.5 border border-slate-100"
                    >
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-mono font-semibold text-slate-900">
                          {ev.timeLabel}
                        </span>{' '}
                        <span className="text-slate-500">({ev.actor}):</span> {ev.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
