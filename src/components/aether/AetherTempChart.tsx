import React from 'react';
import { TempPoint } from '../../data/aetherCatalog';

interface AetherTempChartProps {
  points: TempPoint[];
  minC: number;
  maxC: number;
  shipmentCode: string;
}

export const AetherTempChart: React.FC<AetherTempChartProps> = ({
  points,
  minC,
  maxC,
  shipmentCode,
}) => {
  if (!points.length) {
    return (
      <div className="p-6 bg-[#0C131F] border border-[#223047] text-xs text-slate-400">
        Dry ambient freight — no refrigerated temperature probe stream configured for {shipmentCode}.
      </div>
    );
  }

  const width = 620;
  const height = 220;
  const padL = 44;
  const padR = 20;
  const padT = 18;
  const padB = 34;

  const temps = points.map((p) => p.tempC);
  const yMin = Math.floor(Math.min(minC - 2, ...temps));
  const yMax = Math.ceil(Math.max(maxC + 2.5, ...temps));
  const spanY = Math.max(2, yMax - yMin);

  const toX = (idx: number) =>
    points.length === 1
      ? padL + (width - padL - padR) / 2
      : padL + (idx / (points.length - 1)) * (width - padL - padR);

  const toY = (val: number) =>
    padT + ((yMax - val) / spanY) * (height - padT - padB);

  const yBandTop = toY(maxC);
  const yBandBot = toY(minC);
  const polyPoints = points.map((p, idx) => `${toX(idx)},${toY(p.tempC)}`).join(' ');
  const latest = points[points.length - 1];

  return (
    <figure className="bg-[#0C131F] border border-[#223047] p-4 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <figcaption className="font-bold text-white">
          Cold-Chain Probe Curve · {shipmentCode} (Policy Band {minC}°C to {maxC}°C)
        </figcaption>
        <span className="text-[11px] font-mono text-cyan-300">
          Latest: {latest.tempC}°C at {latest.timeLabel}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-52 overflow-visible"
        role="img"
        aria-label={`Temperature history chart for ${shipmentCode} showing allowed range ${minC} to ${maxC} degrees Celsius and latest reading ${latest.tempC} degrees Celsius.`}
      >
        {/* Allowed Safe Threshold Band */}
        <rect
          x={padL}
          y={yBandTop}
          width={width - padL - padR}
          height={Math.max(2, yBandBot - yBandTop)}
          fill="rgba(6, 182, 212, 0.14)"
        />
        <line
          x1={padL}
          y1={yBandTop}
          x2={width - padR}
          y2={yBandTop}
          stroke="#F59E0B"
          strokeDasharray="5 4"
          strokeWidth="1.5"
        />
        <line
          x1={padL}
          y1={yBandBot}
          x2={width - padR}
          y2={yBandBot}
          stroke="#06B6D4"
          strokeDasharray="4 4"
          strokeWidth="1.2"
        />

        {/* Y Axis Labels */}
        {[yMin, minC, maxC, yMax].map((tick) => (
          <g key={tick}>
            <text
              x={padL - 8}
              y={toY(tick) + 4}
              textAnchor="end"
              fill={tick === maxC ? '#FBBF24' : '#94A3B8'}
              fontSize="10"
              fontFamily="monospace"
            >
              {tick}°C
            </text>
          </g>
        ))}

        {/* Temperature Curve */}
        <polyline
          fill="none"
          stroke="#22D3EE"
          strokeWidth="2.5"
          strokeLinejoin="round"
          points={polyPoints}
        />

        {/* Points + Door / Excursion Markers */}
        {points.map((p, idx) => {
          const cx = toX(idx);
          const cy = toY(p.tempC);
          const isOut = p.tempC > maxC || p.tempC < minC;
          return (
            <g key={`${p.timeLabel}-${idx}`}>
              {p.doorOpen && (
                <line
                  x1={cx}
                  y1={padT}
                  x2={cx}
                  y2={height - padB}
                  stroke="#F59E0B"
                  strokeWidth="1.2"
                  strokeDasharray="2 2"
                />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={isOut ? 5 : 3.5}
                fill={isOut ? '#EF4444' : '#22D3EE'}
                stroke="#0C131F"
                strokeWidth="1.5"
              />
              {idx === 0 || idx === points.length - 1 || idx % 2 === 0 ? (
                <text
                  x={cx}
                  y={height - 10}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {p.timeLabel}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-300 pt-1">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-2 bg-cyan-500/30 border border-cyan-400 inline-block" />
          Safe Window ({minC}°C – {maxC}°C)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
          Out-of-Range Reading
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-amber-400 inline-block" />
          Door-Open Event Marker
        </span>
      </div>
    </figure>
  );
};
