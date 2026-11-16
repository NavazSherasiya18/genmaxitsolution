import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  ExternalLink,
  MapPin,
  MessageSquare,
  PenTool,
  RotateCcw,
  ThermometerSnowflake,
  Truck,
} from 'lucide-react';
import { AetherBrandLogo, useAetherFavicon } from '../../components/aether/AetherBrandLogo';
import { AetherStatusBadge } from '../../components/aether/AetherStatusBadge';
import { useAetherStore } from '../../context/AetherStoreContext';
import { AETHER_MEDIA } from '../../data/aetherCatalog';

export const AetherDriverWorkspacePage: React.FC = () => {
  useAetherFavicon(true);
  const {
    dataset,
    acknowledgeDriverInstruction,
    checkInStop,
    completeStop,
    logDriverException,
    triggerSensorRecoveryReplay,
    recordProofOfDelivery,
  } = useAetherStore();

  // Primary driver run focuses on VEH-01 / AFL-2048
  const vehicle = dataset.vehicles.find((v) => v.id === 'VEH-01') || dataset.vehicles[0];
  const shipment =
    dataset.shipments.find((s) => s.id === 'SHP-2048') || dataset.shipments[0];
  const instructions = dataset.instructions.filter((ins) => ins.shipmentId === shipment.id);

  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [exceptionNote, setExceptionNote] = useState('');
  const [recipientName, setRecipientName] = useState('Dr. Arvind Kulkarni (Receiving Pharmacist)');
  const [podMethod, setPodMethod] = useState<'preset_photo' | 'signature_pad'>('preset_photo');
  const [podNotes, setPodNotes] = useState('Seal intact; cold cabinet verified at 4.1°C on handoff.');
  const [sigPath, setSigPath] = useState<string>('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const nextPendingStop =
    shipment.stops.find((st) => st.status !== 'completed') ||
    shipment.stops[shipment.stops.length - 1];

  const handlePrimaryAction = () => {
    if (!nextPendingStop) return;
    if (nextPendingStop.status === 'pending') {
      const res = checkInStop(shipment.id, nextPendingStop.id);
      if (res.ok) {
        setFeedback({
          ok: true,
          text:
            nextPendingStop.type === 'delivery'
              ? `Arrived at ${nextPendingStop.location}. Capture Proof of Delivery below to mark Delivered.`
              : `Checked in at ${nextPendingStop.location}.`,
        });
      }
      return;
    }
    if (nextPendingStop.status === 'checked_in') {
      const res = completeStop(shipment.id, nextPendingStop.id);
      if (!res.ok) {
        setFeedback({ ok: false, text: res.error || 'Action required before closing stop.' });
        return;
      }
      setFeedback({ ok: true, text: `Completed ${nextPendingStop.location}.` });
    }
  };

  const handleReplyInstruction = (insId: string) => {
    const text =
      replyTextMap[insId] ||
      'Rear seal checked & re-latched at Lonavala layby; reefer compressor switched to Boost mode.';
    acknowledgeDriverInstruction(insId, text);
    setFeedback({ ok: true, text: 'Acknowledgment synced back to Control Tower Incident Center.' });
  };

  const handleSensorRecovery = () => {
    triggerSensorRecoveryReplay();
    setFeedback({
      ok: true,
      text: 'Reefer temperature stabilized inside 2°C–8°C band. Incident remains open in Control Tower until dispatcher sign-off.',
    });
  };

  const handleLogException = (e: React.FormEvent) => {
    e.preventDefault();
    const res = logDriverException(shipment.id, exceptionNote);
    if (!res.ok) {
      setFeedback({ ok: false, text: res.error || 'Enter exception text.' });
      return;
    }
    setExceptionNote('');
    setFeedback({ ok: true, text: 'Field exception synced to Dispatcher dossier.' });
  };

  const getPointerPt = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 300);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 90);
    return { x, y };
  };

  const handleSigDown = (e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = getPointerPt(e);
    setIsDrawing(true);
    setSigPath((prev) => (prev ? `${prev} M ${x} ${y}` : `M ${x} ${y}`));
  };

  const handleSigMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDrawing) return;
    const { x, y } = getPointerPt(e);
    setSigPath((prev) => `${prev} L ${x} ${y}`);
  };

  const handleSigUp = () => {
    setIsDrawing(false);
  };

  const handleSubmitPod = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSig =
      sigPath || 'M 24 58 C 48 24, 72 68, 108 42 C 138 22, 165 65, 224 38';
    const res = recordProofOfDelivery(shipment.id, {
      recipientName,
      method: podMethod,
      photoUrl: podMethod === 'preset_photo' ? AETHER_MEDIA.podDelivery : undefined,
      signatureSvgPath: podMethod === 'signature_pad' ? finalSig : undefined,
      notes: podNotes,
    });
    setFeedback({
      ok: res.ok,
      text: res.ok
        ? `Delivery complete! ${shipment.code} Proof of Delivery published to Customer Tracking Portal.`
        : res.error || 'POD submission blocked.',
    });
  };

  return (
    <div className="aether-showcase min-h-screen bg-slate-100 text-[#0C131F] pb-12">
      {/* Mobile-First Header Showing Vehicle, Current Stop & Connection State */}
      <header className="bg-[#0C131F] text-white border-b border-[#223047] sticky top-0 z-30">
        <div className="max-w-xl mx-auto px-4 py-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Link to="/showcase/aether-fleet">
              <AetherBrandLogo tone="light" size="sm" />
            </Link>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{dataset.sensorCheckLabel}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-[#223047]">
            <div className="inline-flex items-center gap-1.5 text-cyan-300 font-mono font-bold">
              <Truck className="w-3.5 h-3.5" />
              <span>{vehicle.plate}</span>
              <span className="text-slate-400 font-sans font-normal">· {vehicle.driverName}</span>
            </div>
            <div className="text-[11px] text-slate-300 truncate max-w-[220px]">
              Next: {nextPendingStop?.location}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-5 space-y-5">
        {/* Quick Cross-Navigation Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <Link
            to="/showcase/aether-fleet/app/incidents"
            className="inline-flex items-center gap-1 font-semibold text-cyan-800 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Control Tower</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to={`/showcase/aether-fleet/track/${shipment.code}`}
              className="inline-flex items-center gap-1 font-semibold text-cyan-800 hover:underline"
            >
              <span>Customer Portal</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link to="/portfolio" className="text-slate-500 hover:text-slate-900">
              Genmax Portfolio
            </Link>
          </div>
        </div>

        {feedback && (
          <div
            role="status"
            className={`p-3.5 border text-xs font-medium flex items-start gap-2 ${
              feedback.ok
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Active Assignment Summary + Primary Action */}
        <section className="bg-white border border-slate-200 p-4 space-y-4 shadow-2xs">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700">
                Active Assignment · {shipment.code}
              </span>
              <h1 className="text-lg font-bold text-[#0C131F] mt-0.5">
                {shipment.customerCompany}
              </h1>
              <p className="text-xs text-slate-600">{shipment.cargoDescription}</p>
            </div>
            <AetherStatusBadge status={shipment.status} />
          </div>

          <div className="grid grid-cols-2 gap-3 bg-[#0C131F] text-white p-3 text-xs af-tabular">
            <div>
              <span className="text-[10px] text-slate-400 block">Reefer Probe</span>
              <strong className="text-base text-cyan-300 inline-flex items-center gap-1">
                <ThermometerSnowflake className="w-4 h-4" />
                <span>{vehicle.currentTempC !== null ? `${vehicle.currentTempC}°C` : 'Dry'}</span>
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Policy Target</span>
              <strong className="text-base text-white">
                {shipment.tempThresholdMinC}°C – {shipment.tempThresholdMaxC}°C
              </strong>
            </div>
          </div>

          {/* Primary Single Clear Next Action Button (min 44px touch height) */}
          {shipment.status !== 'delivered' && nextPendingStop && nextPendingStop.status !== 'completed' && (
            <button
              type="button"
              onClick={handlePrimaryAction}
              className="w-full min-h-[48px] px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>
                {nextPendingStop.status === 'pending'
                  ? nextPendingStop.type === 'delivery'
                    ? 'Mark Arrived at Receiving Bay'
                    : `Check In: ${nextPendingStop.location}`
                  : nextPendingStop.type === 'delivery'
                  ? 'Final Delivery Requires POD Below'
                  : `Complete Stop: ${nextPendingStop.location}`}
              </span>
            </button>
          )}
        </section>

        {/* Dispatcher Instructions Inbox */}
        <section className="bg-white border border-slate-200 p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0C131F] inline-flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-cyan-600" />
              <span>Dispatcher Instructions ({instructions.length})</span>
            </h2>
            <button
              type="button"
              onClick={handleSensorRecovery}
              className="min-h-[44px] px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Sensor Recovery</span>
            </button>
          </div>

          {instructions.length === 0 ? (
            <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 p-3">
              No pending dispatcher alerts. Trigger Replay Cold-Chain Incident &amp; send an instruction from Control Tower to see live 2-way handoff here.
            </p>
          ) : (
            <div className="space-y-3">
              {instructions.map((ins) => (
                <div key={ins.id} className="p-3 bg-amber-50 border border-amber-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-amber-900">
                    <strong>{ins.sender}</strong>
                    <span>{ins.sentAtLabel}</span>
                  </div>
                  <p className="font-semibold text-[#0C131F]">{ins.message}</p>

                  {ins.acknowledged ? (
                    <div className="p-2 bg-white border border-emerald-200 text-emerald-900 text-[11px]">
                      <strong>Replied ({ins.repliedAtLabel}):</strong> {ins.driverReply}
                    </div>
                  ) : (
                    <div className="space-y-2 pt-1">
                      <input
                        type="text"
                        value={
                          replyTextMap[ins.id] ??
                          'Rear latch secured; boost cooling engaged.'
                        }
                        onChange={(e) =>
                          setReplyTextMap((prev) => ({ ...prev, [ins.id]: e.target.value }))
                        }
                        className="w-full min-h-[44px] px-3 py-2 bg-white border border-slate-300 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleReplyInstruction(ins.id)}
                        className="w-full min-h-[44px] bg-[#0C131F] text-white font-bold text-xs cursor-pointer"
                      >
                        Acknowledge &amp; Reply to Dispatch
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Stop Sequence Check-In List */}
        <section className="bg-white border border-slate-200 p-4 space-y-3 shadow-2xs">
          <h2 className="text-sm font-bold text-[#0C131F]">Trip Stop Sequence</h2>
          <div className="space-y-2.5 text-xs">
            {shipment.stops.map((st) => (
              <div key={st.id} className="p-3 bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-[#0C131F]">
                      {st.sequence}. {st.location}
                    </div>
                    <div className="text-[11px] text-slate-500">Window: {st.windowLabel}</div>
                  </div>
                  <span className="px-2 py-0.5 bg-white border border-slate-200 text-[10px] font-bold uppercase">
                    {st.status.replace('_', ' ')}
                  </span>
                </div>

                {st.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => {
                      const res = checkInStop(shipment.id, st.id);
                      if (res.ok) setFeedback({ ok: true, text: `Checked in: ${st.location}` });
                    }}
                    className="w-full min-h-[44px] border border-cyan-600 text-cyan-800 font-bold hover:bg-cyan-50 cursor-pointer"
                  >
                    Check In Stop {st.sequence}
                  </button>
                )}

                {st.status === 'checked_in' && st.type !== 'delivery' && (
                  <button
                    type="button"
                    onClick={() => {
                      const res = completeStop(shipment.id, st.id);
                      if (res.ok) setFeedback({ ok: true, text: `Completed stop ${st.sequence}` });
                    }}
                    className="w-full min-h-[44px] bg-[#0C131F] text-white font-bold cursor-pointer"
                  >
                    Mark Stop {st.sequence} Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Proof of Delivery Capture */}
        <section className="bg-white border border-slate-200 p-4 space-y-3 shadow-2xs">
          <h2 className="text-sm font-bold text-[#0C131F]">Proof of Delivery Capture</h2>

          {shipment.pod ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 space-y-2 text-xs">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Delivered &amp; Locked ({shipment.pod.receivedAtLabel})</span>
              </div>
              <p className="text-emerald-950">
                Received by <strong>{shipment.pod.recipientName}</strong>. Duplicate POD submission is locked.
              </p>
              <Link
                to={`/showcase/aether-fleet/track/${shipment.code}`}
                className="inline-flex items-center gap-1 font-bold text-cyan-800 underline"
              >
                Verify in Customer Tracking Portal →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmitPod} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPodMethod('preset_photo')}
                  className={`min-h-[44px] border font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                    podMethod === 'preset_photo'
                      ? 'bg-[#0C131F] text-white border-[#0C131F]'
                      : 'bg-slate-50 text-slate-700 border-slate-300'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>Sample Dock Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPodMethod('signature_pad')}
                  className={`min-h-[44px] border font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                    podMethod === 'signature_pad'
                      ? 'bg-[#0C131F] text-white border-[#0C131F]'
                      : 'bg-slate-50 text-slate-700 border-slate-300'
                  }`}
                >
                  <PenTool className="w-4 h-4" />
                  <span>Signature Pad</span>
                </button>
              </div>

              {podMethod === 'preset_photo' ? (
                <div className="border border-slate-200 p-2 bg-slate-50">
                  <img
                    src={AETHER_MEDIA.podDelivery}
                    alt="Sealed chilled pharma parcel POD sample"
                    className="w-full aspect-video object-cover"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Sign inside pad below (touch or mouse):</span>
                    <button
                      type="button"
                      onClick={() => setSigPath('')}
                      className="text-cyan-700 font-semibold cursor-pointer"
                    >
                      Clear Pad
                    </button>
                  </div>
                  <svg
                    ref={svgRef}
                    viewBox="0 0 300 90"
                    onPointerDown={handleSigDown}
                    onPointerMove={handleSigMove}
                    onPointerUp={handleSigUp}
                    className="w-full h-24 bg-slate-50 border border-slate-300 touch-none cursor-crosshair"
                  >
                    {sigPath && (
                      <path
                        d={sigPath}
                        fill="none"
                        stroke="#0C131F"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Handoff Condition Note
                </label>
                <input
                  type="text"
                  value={podNotes}
                  onChange={(e) => setPodNotes(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 border border-slate-300"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer"
              >
                Complete Delivery &amp; Record POD
              </button>
            </form>
          )}
        </section>

        {/* Field Exception Form */}
        <form
          onSubmit={handleLogException}
          className="bg-white border border-slate-200 p-4 space-y-2.5 text-xs"
        >
          <label className="font-bold text-[#0C131F] inline-flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Log Corridor Exception (Internal Dispatch Only)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Toll plaza queue +12m"
              value={exceptionNote}
              onChange={(e) => setExceptionNote(e.target.value)}
              className="flex-1 min-h-[44px] px-3 py-2 border border-slate-300"
            />
            <button
              type="submit"
              className="min-h-[44px] px-4 bg-[#0C131F] text-white font-bold cursor-pointer"
            >
              Log Note
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
