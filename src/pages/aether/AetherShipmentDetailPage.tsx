import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Phone,
  Smartphone,
  ThermometerSnowflake,
  Truck,
} from 'lucide-react';
import { AetherBrandLogo, useAetherFavicon } from '../../components/aether/AetherBrandLogo';
import { AetherStatusBadge } from '../../components/aether/AetherStatusBadge';
import { AetherTempChart } from '../../components/aether/AetherTempChart';
import { useAetherStore } from '../../context/AetherStoreContext';

export const AetherShipmentDetailPage: React.FC = () => {
  useAetherFavicon(true);
  const { code } = useParams<{ code: string }>();
  const { dataset } = useAetherStore();

  const shipment =
    dataset.shipments.find((s) => s.code.toLowerCase() === (code || 'AFL-2048').toLowerCase()) ||
    dataset.shipments[0];
  const vehicle = dataset.vehicles.find((v) => v.id === shipment.assignedVehicleId);
  const openIncident = dataset.incidents.find(
    (inc) => inc.shipmentId === shipment.id && inc.status !== 'resolved'
  );

  return (
    <div className="aether-showcase min-h-screen bg-slate-50 text-[#0C131F]">
      {/* Header */}
      <header className="bg-[#0C131F] text-white border-b border-[#223047]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/showcase/aether-fleet">
              <AetherBrandLogo tone="light" size="sm" />
            </Link>
            <span className="hidden sm:inline px-2 py-0.5 bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold uppercase">
              Shipment Operations Dossier
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              to="/showcase/aether-fleet/app/shipments"
              className="inline-flex items-center gap-1 text-slate-300 hover:text-cyan-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Control Tower</span>
            </Link>
            <Link
              to={`/showcase/aether-fleet/track/${shipment.code}`}
              className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-bold inline-flex items-center gap-1"
            >
              <span>Customer View</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Top Summary Card */}
        <div className="bg-white border border-slate-200 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-2xl font-bold text-[#0C131F]">{shipment.code}</span>
              <AetherStatusBadge status={shipment.status} />
              {shipment.sensorRecovered && <AetherStatusBadge status="recovered" />}
              {openIncident && <AetherStatusBadge status={openIncident.severity} />}
            </div>
            <h1 className="text-lg font-bold text-slate-900">
              {shipment.customerCompany} · {shipment.cargoDescription}
            </h1>
            <p className="text-xs text-slate-600">
              <strong>Route:</strong> {shipment.origin} → {shipment.destination} ·{' '}
              <strong>Window:</strong> {shipment.serviceWindow} ·{' '}
              <strong>ETA:</strong> {shipment.etaLabel}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 p-4 text-xs af-tabular shrink-0">
            <div>
              <span className="text-[10px] text-slate-500 block">Progress vs Plan</span>
              <strong className="text-base text-[#0C131F]">
                {shipment.actualProgressPct}%{' '}
                <span className="text-xs font-normal text-slate-500">
                  ({shipment.plannedProgressPct}%)
                </span>
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Weight</span>
              <strong className="text-base text-[#0C131F]">
                {shipment.weightKg.toLocaleString()} kg
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Thermal Policy</span>
              <strong className="text-base text-cyan-800">
                {shipment.requiresReefer
                  ? `${shipment.tempThresholdMinC}°–${shipment.tempThresholdMaxC}°C`
                  : 'Dry'}
              </strong>
            </div>
          </div>
        </div>

        {/* Assigned Vehicle + Driver & Planned Stops */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white border border-slate-200 p-5 space-y-3 text-xs">
              <h2 className="text-sm font-bold text-[#0C131F] inline-flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-cyan-600" />
                <span>Assigned Vehicle &amp; Driver</span>
              </h2>
              {vehicle ? (
                <div className="space-y-2 af-tabular">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vehicle Plate:</span>
                    <strong className="font-mono text-[#0C131F]">{vehicle.plate}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Unit Class:</span>
                    <strong>{vehicle.model}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Driver:</span>
                    <strong>{vehicle.driverName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ops Contact:</span>
                    <span className="inline-flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-cyan-600" />
                      {vehicle.driverPhone}
                    </span>
                  </div>
                  {shipment.code === 'AFL-2048' && (
                    <div className="pt-2">
                      <Link
                        to="/showcase/aether-fleet/driver"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0C131F] text-white font-semibold text-[11px]"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Open Live Driver App for This Run</span>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-500">Awaiting vehicle assignment on Dispatch Board.</p>
              )}
            </div>

            {/* Route Stops */}
            <div className="bg-white border border-slate-200 p-5 space-y-3 text-xs">
              <h2 className="text-sm font-bold text-[#0C131F] inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-600" />
                <span>Planned Corridor Stops</span>
              </h2>
              <div className="space-y-2.5">
                {shipment.stops.map((st) => (
                  <div
                    key={st.id}
                    className="p-3 bg-slate-50 border border-slate-200 flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-[#0C131F]">
                        Stop {st.sequence}: {st.location}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {st.type.toUpperCase()} · Window: {st.windowLabel}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                        st.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : st.status === 'checked_in'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {st.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* POD Summary if Delivered */}
            {shipment.pod && (
              <div className="bg-emerald-50 border border-emerald-200 p-5 space-y-3 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Proof of Delivery</span>
                </div>
                <p>
                  <strong>Recipient:</strong> {shipment.pod.recipientName}
                  <br />
                  <strong>Timestamp:</strong> {shipment.pod.receivedAtLabel}
                </p>
                {shipment.pod.photoUrl && (
                  <img
                    src={shipment.pod.photoUrl}
                    alt="Proof of delivery parcel image"
                    className="w-full aspect-video object-cover border border-emerald-300"
                  />
                )}
                {shipment.pod.signatureSvgPath && (
                  <div className="bg-white border border-emerald-300 p-2">
                    <svg viewBox="0 0 300 90" className="w-full h-20">
                      <path
                        d={shipment.pod.signatureSvgPath}
                        fill="none"
                        stroke="#0C131F"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Cold-Chain Chart + Complete Event Timeline */}
          <div className="lg:col-span-7 space-y-5">
            {shipment.requiresReefer && shipment.tempThresholdMinC !== null && shipment.tempThresholdMaxC !== null && (
              <AetherTempChart
                points={shipment.tempHistory}
                minC={shipment.tempThresholdMinC}
                maxC={shipment.tempThresholdMaxC}
                shipmentCode={shipment.code}
              />
            )}

            <div className="bg-white border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#0C131F] inline-flex items-center gap-1.5">
                  <ThermometerSnowflake className="w-4 h-4 text-cyan-600" />
                  <span>Full Operational Event &amp; Packet Timeline</span>
                </h2>
                <span className="text-[11px] text-slate-500">
                  Includes internal alerts &amp; public milestones
                </span>
              </div>

              <div className="space-y-2.5">
                {shipment.timeline.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-[#0C131F] flex items-center gap-2">
                        <span>{ev.title}</span>
                        {!ev.customerVisible && (
                          <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 text-[9px] uppercase font-bold">
                            Internal Ops Only
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600">{ev.detail}</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ev.timestampLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
