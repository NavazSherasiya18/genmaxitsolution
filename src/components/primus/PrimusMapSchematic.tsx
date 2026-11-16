import React, { useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { CommercialAsset, PrimusMarket } from '../../data/primusCatalog';
import { formatPrimusMoney } from '../../utils/primusFinance';
import { PrimusStatusBadge } from './PrimusStatusBadge';

interface PrimusMapSchematicProps {
  assets: CommercialAsset[];
  selectedAssetId?: string;
  onOpenAsset: (slug: string) => void;
}

/**
 * Interactive illustrative market district schematic for London & Singapore assets.
 * Features accurate district labels and explicitly marks coordinates as illustrative demo positions.
 */
export const PrimusMapSchematic: React.FC<PrimusMapSchematicProps> = ({
  assets,
  selectedAssetId,
  onOpenAsset,
}) => {
  const [marketTab, setMarketTab] = useState<PrimusMarket>('Singapore');
  const [hoveredId, setHoveredId] = useState<string | null>(selectedAssetId || null);

  const marketAssets = assets.filter((a) => a.market === marketTab);
  const activeAsset =
    marketAssets.find((a) => a.id === hoveredId) ||
    assets.find((a) => a.id === hoveredId) ||
    marketAssets[0] ||
    assets[0];

  return (
    <div className="bg-white border border-[#DDD7CB] overflow-hidden">
      {/* Header Bar */}
      <div className="bg-[#0D1829] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <MapPin className="w-4 h-4 text-[#D6B572]" />
          <span className="font-semibold tracking-wide uppercase">
            Illustrative Market Corridor Map
          </span>
          <span className="text-slate-400 hidden sm:inline">
            · Click any property marker to inspect metrics
          </span>
        </div>

        <div className="flex items-center gap-1 bg-white/10 p-0.5 text-xs">
          {(['Singapore', 'London'] as PrimusMarket[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMarketTab(m);
                const firstInMarket = assets.find((a) => a.market === m);
                if (firstInMarket) setHoveredId(firstInMarket.id);
              }}
              className={`px-3 py-1 font-semibold transition-colors cursor-pointer ${
                marketTab === m ? 'bg-[#9E7C3B] text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {m} ({assets.filter((a) => a.market === m).length})
            </button>
          ))}
        </div>
      </div>

      {/* Split Map Canvas + Inspector Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-8 relative bg-[#EFECE5] h-[360px] sm:h-[420px] overflow-hidden border-b lg:border-b-0 lg:border-r border-[#DDD7CB]">
          {/* Vector Urban Geography Grid */}
          <svg
            viewBox="0 0 800 420"
            className="w-full h-full object-cover"
            aria-label={`${marketTab} illustrative commercial real estate map`}
          >
            {/* Background Grid */}
            <defs>
              <pattern id="pr-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#DDD7CB" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="800" height="420" fill="#F6F4EF" />
            <rect width="800" height="420" fill="url(#pr-grid)" />

            {marketTab === 'Singapore' ? (
              <g>
                {/* Singapore Coastline & Harbor Waterway */}
                <path
                  d="M0 325 C 120 315, 220 345, 360 310 C 480 280, 580 305, 800 265 L 800 420 L 0 420 Z"
                  fill="#DCE7EE"
                />
                <path
                  d="M0 325 C 120 315, 220 345, 360 310 C 480 280, 580 305, 800 265"
                  fill="none"
                  stroke="#9DB5C8"
                  strokeWidth="2"
                />
                {/* Expressway Corridors */}
                <path d="M 60 220 Q 320 185 740 165" fill="none" stroke="#CEC6B7" strokeWidth="4" />
                <path d="M 140 290 Q 420 230 680 220" fill="none" stroke="#CEC6B7" strokeWidth="3" strokeDasharray="6 4" />
                {/* Accurate District Labels */}
                <text x="120" y="365" fill="#475569" fontSize="12" fontWeight="600">
                  Tuas South Mega Port
                </text>
                <text x="275" y="210" fill="#475569" fontSize="11" fontWeight="600">
                  Jurong Port Corridor
                </text>
                <text x="385" y="165" fill="#475569" fontSize="11" fontWeight="600">
                  One-North Precinct
                </text>
                <text x="530" y="260" fill="#0D1829" fontSize="12" fontWeight="700">
                  Raffles Place &amp; Marina Bay
                </text>
                <text x="640" y="130" fill="#475569" fontSize="11" fontWeight="600">
                  Changi Airfreight Zone
                </text>
              </g>
            ) : (
              <g>
                {/* River Thames Winding Path */}
                <path
                  d="M0 245 C 150 250, 230 190, 380 215 C 510 238, 600 180, 800 220 L 800 255 C 600 215, 510 272, 380 250 C 230 225, 150 285, 0 280 Z"
                  fill="#D6E3EC"
                />
                {/* Major Corridors */}
                <path d="M 120 140 L 660 155" fill="none" stroke="#CEC6B7" strokeWidth="3" />
                <path d="M 410 70 L 415 340" fill="none" stroke="#CEC6B7" strokeWidth="2.5" strokeDasharray="5 4" />
                {/* Accurate London District Labels */}
                <text x="115" y="130" fill="#475569" fontSize="11" fontWeight="600">
                  Park Royal NW10
                </text>
                <text x="235" y="175" fill="#475569" fontSize="11" fontWeight="600">
                  West End WC2
                </text>
                <text x="415" y="140" fill="#0D1829" fontSize="12" fontWeight="700">
                  City of London EC2
                </text>
                <text x="345" y="275" fill="#475569" fontSize="11" fontWeight="600">
                  Southwark SE1
                </text>
                <text x="515" y="268" fill="#475569" fontSize="11" fontWeight="600">
                  Canary Wharf E14
                </text>
                <text x="595" y="185" fill="#475569" fontSize="11" fontWeight="600">
                  Thames Gateway / Barking
                </text>
              </g>
            )}
          </svg>

          {/* Interactive Asset Marker Buttons */}
          {marketAssets.map((asset) => {
            const isActive = activeAsset?.id === asset.id;
            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => setHoveredId(asset.id)}
                style={{
                  left: `${asset.mapCoord.xPct}%`,
                  top: `${asset.mapCoord.yPct}%`,
                }}
                className={`-translate-x-1/2 -translate-y-1/2 absolute px-2.5 py-1 text-[11px] font-bold border shadow-md transition-transform cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#9E7C3B] border-[#0D1829] text-white scale-110 z-20'
                    : 'bg-[#0D1829] border-white/80 text-white hover:scale-105 z-10'
                }`}
                aria-label={`Select ${asset.name} on map`}
              >
                {asset.code} · {formatPrimusMoney(asset.askingPrice, asset.currency, true)}
              </button>
            );
          })}

          {/* Map Disclaimer Overlay */}
          <div className="absolute bottom-3 left-3 bg-white/95 border border-[#DDD7CB] px-3 py-1.5 text-[11px] text-[#475569]">
            Illustrative demo locations ({marketTab} submarkets)
          </div>
        </div>

        {/* Selected Asset Inspector */}
        <div className="lg:col-span-4 p-5 flex flex-col justify-between bg-white space-y-4">
          {activeAsset ? (
            <>
              <div className="space-y-3">
                <div className="aspect-[16/10] bg-[#EFECE5] border border-[#DDD7CB] overflow-hidden">
                  <img
                    src={activeAsset.gallery[0].url}
                    alt={activeAsset.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold text-[#9E7C3B]">
                    {activeAsset.code}
                  </span>
                  <PrimusStatusBadge status={activeAsset.stage} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0D1829] pr-sans">{activeAsset.name}</h3>
                  <p className="text-xs text-[#475569]">{activeAsset.district}</p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#EAE5DA] text-xs pr-tabular">
                  <div>
                    <span className="text-[#64748B] block">Asking Price</span>
                    <strong className="text-sm text-[#0D1829]">
                      {formatPrimusMoney(activeAsset.askingPrice, activeAsset.currency, true)} (
                      {activeAsset.currency})
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Entry Cap Rate</span>
                    <strong className="text-sm text-[#9E7C3B]">
                      {((activeAsset.currentAnnualNoi / activeAsset.askingPrice) * 100).toFixed(2)}%
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Occupancy</span>
                    <strong className="text-sm text-[#0D1829]">{activeAsset.occupancyPct}%</strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Floor Area</span>
                    <strong className="text-sm text-[#0D1829]">
                      {activeAsset.floorAreaSqFt.toLocaleString()} sq ft
                    </strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenAsset(activeAsset.slug)}
                className="w-full py-2.5 px-4 bg-[#0D1829] hover:bg-[#192D4D] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Inspect Property Dossier</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D6B572]" />
              </button>
            </>
          ) : (
            <p className="text-xs text-[#64748B]">Select a market marker to inspect details.</p>
          )}
        </div>
      </div>
    </div>
  );
};
