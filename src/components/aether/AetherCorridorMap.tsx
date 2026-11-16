import React from 'react';
import {
  AlertTriangle,
  FastForward,
  MapPin,
  Pause,
  Play,
  RotateCcw,
  ThermometerSnowflake,
  Truck,
} from 'lucide-react';
import { Depot, FleetVehicle, Shipment } from '../../data/aetherCatalog';
import { ReplayMode } from '../../context/AetherStoreContext';

interface AetherCorridorMapProps {
  depots: Depot[];
  vehicles: FleetVehicle[];
  shipments: Shipment[];
  selectedVehicleId: string;
  onSelectVehicle: (vehicleId: string, shipmentId: string | null) => void;
  replayMode: ReplayMode;
  replaySpeed: 1 | 3;
  onToggleSpeed: () => void;
  onPlayRoute: () => void;
  onPause: () => void;
  onRestart: () => void;
  onTriggerIncident: () => void;
  sensorCheckLabel: string;
}

export const AetherCorridorMap: React.FC<AetherCorridorMapProps> = ({
  depots,
  vehicles,
  shipments,
  selectedVehicleId,
  onSelectVehicle,
  replayMode,
  replaySpeed,
  onToggleSpeed,
  onPlayRoute,
  onPause,
  onRestart,
  onTriggerIncident,
  sensorCheckLabel,
}) => {
  const selectedVeh = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  const linkedShp = shipments.find((s) => s.id === selectedVeh?.activeShipmentId);

  return (
    <div className="bg-[#0C131F] border border-[#223047] text-white flex flex-col">
      {/* Map Controls & Replay Strip */}
      <div className="px-4 py-3 border-b border-[#223047] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-cyan-300 inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>Indian Logistics Corridor Vector Map</span>
          </span>
          <span className="text-slate-400 text-[11px]">
            Last telemetry packet: <strong className="text-slate-200 af-tabular">{sensorCheckLabel}</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          {replayMode === 'playing_route' ? (
            <button
              type="button"
              onClick={onPause}
              className="px-2.5 py-1.5 bg-amber-500 text-slate-950 font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <Pause className="w-3 h-3" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onPlayRoute}
              className="px-2.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3 h-3" />
              <span>Play Route</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleSpeed}
            className={`px-2.5 py-1.5 border font-semibold inline-flex items-center gap-1 cursor-pointer ${
              replaySpeed === 3
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                : 'bg-[#131D2E] border-[#223047] text-slate-200'
            }`}
          >
            <FastForward className="w-3 h-3" />
            <span>{replaySpeed}x Speed</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="px-2.5 py-1.5 bg-[#131D2E] border border-[#223047] hover:border-cyan-500 text-slate-200 font-semibold inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restart</span>
          </button>

          <button
            type="button"
            onClick={onTriggerIncident}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold inline-flex items-center gap-1 cursor-pointer"
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Replay Cold-Chain Incident</span>
          </button>
        </div>
      </div>

      {/* Offline-Resilient Interactive Vector Map Canvas */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[#090F1A] overflow-hidden select-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          {/* Subtle Telemetry Grid */}
          <defs>
            <pattern id="afGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(34,211,238,0.06)" strokeWidth="0.25" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#afGrid)" />

          {/* Simplified Stylized Western/Northern/Southern Freight Coastline & Corridor Spine */}
          <path
            d="M 22 10 L 68 12 L 82 40 L 66 86 L 44 95 L 26 84 L 14 55 L 18 28 Z"
            fill="rgba(19, 29, 46, 0.72)"
            stroke="rgba(51, 65, 85, 0.7)"
            strokeWidth="0.45"
          />

          {/* Freight Highway Polylines */}
          {/* Pune Chakan (28,58) <-> Mumbai Hub (17,51) */}
          <line x1="28" y1="58" x2="17" y2="51" stroke="#334155" strokeWidth="1.2" strokeDasharray="1.5 1" />
          {/* Flagship Highlight Route for AFL-2048 */}
          <line
            x1="28"
            y1="58"
            x2="17"
            y2="51"
            stroke={selectedVeh?.id === 'VEH-01' ? '#22D3EE' : '#0E7490'}
            strokeWidth={selectedVeh?.id === 'VEH-01' ? '1.3' : '0.6'}
          />
          {/* Delhi NCR Corridor */}
          <polyline points="48,24 41,31 54,27 62,33" fill="none" stroke="#1E293B" strokeWidth="0.9" />
          {/* Bengaluru South Corridor */}
          <polyline points="44,79 64,76 47,66 40,83" fill="none" stroke="#1E293B" strokeWidth="0.9" />

          {/* City Labels */}
          <text x="14.5" y="48.5" fill="#94A3B8" fontSize="2.4" fontWeight="700">Mumbai Hub</text>
          <text x="29.5" y="60.5" fill="#94A3B8" fontSize="2.2">Pune Chakan</text>
          <text x="49.5" y="21.5" fill="#94A3B8" fontSize="2.2">Delhi NCR</text>
          <text x="45.5" y="83" fill="#94A3B8" fontSize="2.2">Bengaluru</text>
          <text x="65" y="74.5" fill="#64748B" fontSize="2">Chennai</text>
        </svg>

        {/* Depot Squares */}
        {depots.map((d) => (
          <div
            key={d.id}
            style={{ left: `${d.mapCoord.xPct}%`, top: `${d.mapCoord.yPct}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div className="w-3.5 h-3.5 bg-slate-900 border-2 border-cyan-400 rotate-45" />
          </div>
        ))}

        {/* Interactive Clickable Vehicle Markers */}
        {vehicles.map((veh) => {
          const shp = shipments.find((s) => s.id === veh.activeShipmentId);
          const isSelected = veh.id === selectedVehicleId;
          const isExcursion = shp?.inActiveExcursion;
          const isDelayed = shp?.status === 'delayed';

          return (
            <button
              key={veh.id}
              type="button"
              onClick={() => onSelectVehicle(veh.id, veh.activeShipmentId)}
              style={{ left: `${veh.mapCoord.xPct}%`, top: `${veh.mapCoord.yPct}%` }}
              aria-label={`Select vehicle ${veh.plate} (${shp?.code || 'Idle'})`}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform ${
                isSelected ? 'z-20 scale-115' : 'z-10 hover:scale-110'
              }`}
            >
              <span
                className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-bold border shadow-md whitespace-nowrap ${
                  isExcursion
                    ? 'bg-rose-600 border-white text-white'
                    : isSelected
                    ? 'bg-cyan-400 border-slate-950 text-slate-950'
                    : isDelayed
                    ? 'bg-amber-500 border-slate-950 text-slate-950'
                    : 'bg-[#131D2E]/95 border-cyan-500/50 text-cyan-200'
                }`}
              >
                <Truck className="w-2.5 h-2.5 shrink-0" />
                <span>{shp ? shp.code : veh.id}</span>
              </span>
            </button>
          );
        })}

        {/* Selected Route Live Telemetry Overlay Card (Bottom-Left) */}
        {selectedVeh && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-80 bg-[#0C131F]/95 border border-[#223047] p-3 text-xs space-y-1.5 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-cyan-300">
                {linkedShp ? linkedShp.code : 'IDLE UNIT'} · {selectedVeh.plate}
              </span>
              <span className="text-[11px] font-mono text-slate-300 af-tabular">
                {selectedVeh.speedKmh} km/h
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate">
              {linkedShp ? `${linkedShp.origin} → ${linkedShp.destination}` : `${selectedVeh.model} staged at depot`}
            </p>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#223047] af-tabular">
              <span className="inline-flex items-center gap-1 text-slate-200">
                <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {selectedVeh.currentTempC !== null ? `${selectedVeh.currentTempC}°C` : 'Dry Freight'}
                </span>
              </span>
              <span className="text-slate-300">
                Progress: <strong>{linkedShp?.actualProgressPct ?? selectedVeh.progressPct}%</strong> (Plan{' '}
                {linkedShp?.plannedProgressPct ?? 0}%)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
