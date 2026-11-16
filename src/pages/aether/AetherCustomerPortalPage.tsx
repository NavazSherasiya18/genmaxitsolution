import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { AetherBrandLogo, useAetherFavicon } from '../../components/aether/AetherBrandLogo';
import { AetherStatusBadge } from '../../components/aether/AetherStatusBadge';
import { useAetherStore } from '../../context/AetherStoreContext';

export const AetherCustomerPortalPage: React.FC = () => {
  useAetherFavicon(true);
  const { trackingCode } = useParams<{ trackingCode?: string }>();
  const navigate = useNavigate();
  const { dataset } = useAetherStore();

  const [lookupInput, setLookupInput] = useState(trackingCode || 'AFL-2048');
  const activeCode = (trackingCode || 'AFL-2048').trim().toUpperCase();

  const shipment = dataset.shipments.find(
    (s) => s.code.toUpperCase() === activeCode
  );

  // Strictly public milestones only — exclude internal incidents, internal driver phone numbers, and ops notes!
  const publicMilestones = shipment
    ? shipment.timeline.filter((ev) => ev.customerVisible)
    : [];

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = lookupInput.trim().toUpperCase();
    if (!cleaned) return;
    navigate(`/showcase/aether-fleet/track/${cleaned}`);
  };

  return (
    <div className="aether-showcase min-h-screen bg-slate-50 text-[#0C131F]">
      {/* Clean Customer Tracking Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link to="/showcase/aether-fleet">
            <AetherBrandLogo tone="dark" size="sm" />
          </Link>
          <div className="flex items-center gap-3 text-xs">
            <Link
              to="/showcase/aether-fleet/app"
              className="text-cyan-700 font-semibold hover:underline"
            >
              Control Tower
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-[#0C131F]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Genmax</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Concept Disclaimer & Tracking Lookup Bar */}
        <div className="bg-white border border-slate-200 p-5 space-y-4 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700">
                Customer Shipment Portal · Interactive Concept Demo
              </span>
              <h1 className="text-xl font-bold text-[#0C131F] mt-0.5">
                Track Your Shipment &amp; Delivery Proof
              </h1>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Public-Safe View</span>
            </span>
          </div>

          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={lookupInput}
                onChange={(e) => setLookupInput(e.target.value)}
                placeholder="Enter tracking code (e.g. AFL-2048)"
                className="w-full min-h-[44px] pl-9 pr-3 py-2 border border-slate-300 text-sm font-mono uppercase bg-slate-50 focus:outline-none focus:border-cyan-600"
              />
            </div>
            <button
              type="submit"
              className="min-h-[44px] px-5 bg-[#0C131F] hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
            >
              Track Reference
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
            <span>Quick Samples:</span>
            {['AFL-2048', 'AFL-2050', 'AFL-2073'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setLookupInput(sample);
                  navigate(`/showcase/aether-fleet/track/${sample}`);
                }}
                className={`px-2.5 py-1 border font-mono font-bold cursor-pointer ${
                  activeCode === sample
                    ? 'bg-cyan-50 border-cyan-600 text-cyan-900'
                    : 'bg-slate-50 border-slate-200 hover:border-cyan-500'
                }`}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {!shipment ? (
          <div className="bg-white border border-slate-200 p-8 text-center space-y-2">
            <Package className="w-8 h-8 text-slate-400 mx-auto" />
            <h2 className="text-base font-bold text-[#0C131F]">
              Tracking Reference Not Found ({activeCode})
            </h2>
            <p className="text-xs text-slate-600">
              Try sample shipment <strong>AFL-2048</strong> (active Pune–Mumbai run) or <strong>AFL-2073</strong> (delivered with Proof of Delivery).
            </p>
          </div>
        ) : (
          <>
            {/* Live Progress & ETA Card */}
            <div className="bg-white border border-slate-200 p-5 space-y-4 shadow-2xs">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xl font-bold text-[#0C131F]">
                      {shipment.code}
                    </span>
                    <AetherStatusBadge status={shipment.status} />
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {shipment.cargoDescription} · Window: {shipment.serviceWindow}
                  </p>
                </div>

                <div className="text-right af-tabular">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
                    Estimated Arrival
                  </span>
                  <strong className="text-sm text-[#0C131F]">{shipment.etaLabel}</strong>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-600 af-tabular">
                  <span>{shipment.origin}</span>
                  <strong>{shipment.actualProgressPct}% Complete</strong>
                  <span>{shipment.destination}</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      shipment.status === 'delivered' ? 'bg-emerald-600' : 'bg-cyan-600'
                    }`}
                    style={{ width: `${shipment.actualProgressPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Proof of Delivery Card (ONLY shown once shipment is Delivered & POD exists) */}
            {shipment.status === 'delivered' && shipment.pod && (
              <div className="bg-emerald-50 border border-emerald-200 p-5 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Proof of Delivery Verified</span>
                </div>
                <div className="text-xs text-emerald-900 space-y-1">
                  <p>
                    <strong>Received By:</strong> {shipment.pod.recipientName}
                  </p>
                  <p>
                    <strong>Confirmed Timestamp:</strong> {shipment.pod.receivedAtLabel}
                  </p>
                  {shipment.pod.notes && (
                    <p>
                      <strong>Delivery Note:</strong> {shipment.pod.notes}
                    </p>
                  )}
                </div>
                {shipment.pod.photoUrl && (
                  <img
                    src={shipment.pod.photoUrl}
                    alt="Verified delivery parcel receipt"
                    className="w-full max-w-md aspect-video object-cover border border-emerald-300"
                  />
                )}
                {shipment.pod.signatureSvgPath && (
                  <div className="bg-white border border-emerald-300 p-3 max-w-md">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                      Recipient Digital Signature
                    </span>
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

            {/* Public Milestones Timeline */}
            <div className="bg-white border border-slate-200 p-5 space-y-4 shadow-2xs">
              <h2 className="text-sm font-bold text-[#0C131F] inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-600" />
                <span>Public Delivery Milestones</span>
              </h2>

              <div className="space-y-3">
                {publicMilestones.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-[#0C131F]">{ev.title}</div>
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
          </>
        )}
      </main>
    </div>
  );
};
