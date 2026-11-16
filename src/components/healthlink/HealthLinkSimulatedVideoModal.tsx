import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
  X,
} from 'lucide-react';
import { HEALTHLINK_MEDIA } from '../../data/healthlinkCatalog';

interface HealthLinkSimulatedVideoModalProps {
  open: boolean;
  viewerRole: 'doctor' | 'patient';
  clinicianName: string;
  patientName: string;
  appointmentReason: string;
  queueToken: string;
  onClose: () => void;
  onCompleteSession: (summary: {
    diagnosis: string;
    followUpInstructions: string;
    clinicalNotes: string;
  }) => void;
}

/**
 * Simulated Clinical Video Room (browser-local only; zero real WebRTC/camera/mic access).
 */
export const HealthLinkSimulatedVideoModal: React.FC<HealthLinkSimulatedVideoModalProps> = ({
  open,
  viewerRole,
  clinicianName,
  patientName,
  appointmentReason,
  queueToken,
  onClose,
  onCompleteSession,
}) => {
  const [stage, setStage] = useState<'waiting_room' | 'connected'>('waiting_room');
  const [micMuted, setMicMuted] = useState(false);
  const [camPaused, setCamPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [diagnosis, setDiagnosis] = useState('Remote follow-up check completed (Sample)');
  const [notes, setNotes] = useState('Reviewed home vitals readings cleanly during simulated video check-in.');
  const [followUp, setFollowUp] = useState('Continue home blood pressure log for 7 days and schedule routine follow-up.');

  useEffect(() => {
    if (!open) {
      setStage('waiting_room');
      setSeconds(0);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || stage !== 'connected') return;
    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, [open, stage]);

  if (!open) return null;

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2540]/75 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Simulated Telehealth Consultation Room"
    >
      <div className="bg-white border border-[#DCE6EE] shadow-2xl w-full max-w-4xl overflow-hidden my-4">
        {/* Top Bar */}
        <div className="bg-[#0A2540] text-white px-5 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Video className="w-4 h-4 text-[#5EEAD4]" />
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-[#5EEAD4]">
                Simulated Telehealth Visit · {queueToken}
              </p>
              <p className="text-sm font-medium">
                {clinicianName} ↔ {patientName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {stage === 'connected' && (
              <span className="font-mono text-xs bg-white/10 px-2.5 py-1 hl-tabular">
                {mins}:{secs} (Demo Video)
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white cursor-pointer"
              aria-label="Exit simulated video room"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        {stage === 'waiting_room' ? (
          <div className="p-8 sm:p-10 text-center space-y-5 bg-[#F7FAFC]">
            <div className="max-w-lg mx-auto space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0F766E]">
                Simulated Waiting Room
              </p>
              <h2 className="text-2xl font-bold text-[#0A2540]">
                {viewerRole === 'patient'
                  ? `Waiting for ${clinicianName}`
                  : `${patientName} is ready in the waiting room`}
              </h2>
              <p className="text-sm text-[#475569]">
                Visit Reason: <strong className="text-[#0A2540]">{appointmentReason}</strong>. No
                device camera or microphone permission is needed in this browser-local preview.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStage('connected')}
                className="px-6 py-3 bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>
                  {viewerRole === 'patient'
                    ? 'Join Simulated Call'
                    : 'Start Simulated Consultation'}
                </span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 border border-[#DCE6EE] bg-white text-xs font-semibold text-[#0A2540] cursor-pointer"
              >
                Return to Screen
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Simulated Video Canvas */}
            <div className="lg:col-span-7 bg-[#0A2540] p-4 flex flex-col justify-between gap-4">
              <div className="relative aspect-[4/3] bg-[#0F3152] border border-white/15 overflow-hidden">
                <img
                  src={
                    viewerRole === 'patient'
                      ? HEALTHLINK_MEDIA.doctorConsult
                      : HEALTHLINK_MEDIA.telehealthHome
                  }
                  alt="Simulated telehealth consultation visual feed"
                  className={`w-full h-full object-cover ${camPaused ? 'opacity-25' : ''}`}
                />
                <div className="absolute bottom-3 left-3 bg-[#0A2540]/85 text-white px-3 py-1.5 text-xs">
                  {viewerRole === 'patient' ? clinicianName : patientName} (Simulated Feed)
                </div>
                <div className="absolute bottom-3 right-3 bg-white/90 text-[#0A2540] px-2.5 py-1 text-[11px] font-semibold">
                  You ({viewerRole === 'patient' ? patientName : clinicianName})
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setMicMuted((m) => !m)}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {micMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{micMuted ? 'Unmute Demo' : 'Mute Demo'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCamPaused((c) => !c)}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {camPaused ? (
                    <VideoOff className="w-3.5 h-3.5" />
                  ) : (
                    <Video className="w-3.5 h-3.5" />
                  )}
                  <span>{camPaused ? 'Resume Feed' : 'Pause Feed'}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <PhoneOff className="w-3.5 h-3.5" />
                  <span>Leave Room</span>
                </button>
              </div>
            </div>

            {/* Session Completion & Follow-up Release */}
            <div className="lg:col-span-5 p-6 bg-white space-y-4 border-l border-[#DCE6EE]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#0F766E]">
                  End Consultation &amp; Release Summary
                </p>
                <p className="text-xs text-[#475569] mt-1">
                  Completing releases the visit summary and follow-up plan directly to the Patient
                  Portal.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#0A2540] mb-1">
                    Clinical Summary
                  </label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full h-9 px-3 border border-[#DCE6EE] bg-[#F7FAFC] text-[#0A2540]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0A2540] mb-1">Visit Notes</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 border border-[#DCE6EE] bg-[#F7FAFC] text-[#0A2540]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0A2540] mb-1">
                    Patient Follow-up Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    className="w-full p-2.5 border border-[#DCE6EE] bg-[#F7FAFC] text-[#0A2540]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onCompleteSession({
                    diagnosis,
                    clinicalNotes: notes,
                    followUpInstructions: followUp,
                  })
                }
                className="w-full py-3 px-4 bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>End Visit &amp; Publish Follow-up to Portal</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
