import React from 'react';
import { AzureBrandLogo } from '../azure/AzureBrandLogo';
import { HealthLinkBrandLogo } from '../healthlink/HealthLinkBrandLogo';
import { PrimusBrandLogo } from '../primus/PrimusBrandLogo';
import { AetherBrandLogo } from '../aether/AetherBrandLogo';

export interface ProjectBrandLogoProps {
  projectId: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'auto' | 'light' | 'dark';
}

export const ProjectBrandLogo: React.FC<ProjectBrandLogoProps> = ({
  projectId,
  size = 'md',
  tone = 'auto',
}) => {
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const textSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';

  switch (projectId) {
    // 1. AURÉLIA & CO. — Haute Joaillerie Octagonal Diamond Monogram Seal
    case 'aurelia-luxury':
      return (
        <div className="inline-flex items-center gap-2.5 select-none whitespace-nowrap shrink-0">
          <svg viewBox="0 0 64 64" className={iconSize} fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="aureliaGold" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FBF2C8" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#9A761D" />
              </linearGradient>
            </defs>
            <rect
              x="2"
              y="2"
              width="60"
              height="60"
              rx="14"
              fill={tone === 'dark' ? '#FAF7F2' : '#141312'}
              stroke="url(#aureliaGold)"
              strokeWidth="1.75"
            />
            <polygon
              points="32,8 48,17.5 48,46.5 32,56 16,46.5 16,17.5"
              stroke="url(#aureliaGold)"
              strokeWidth="1.5"
              fill="rgba(212,175,55,0.08)"
            />
            <polygon
              points="32,13 43.5,19.8 43.5,44.2 32,51 20.5,44.2 20.5,19.8"
              stroke="url(#aureliaGold)"
              strokeWidth="0.9"
              strokeOpacity="0.7"
            />
            <path
              d="M24 41L32 21L40 41M27 34.5H37"
              stroke={tone === 'dark' ? '#141312' : '#FAF7F2'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polygon points="32,14.5 34,17 32,19.5 30,17" fill="url(#aureliaGold)" />
          </svg>
          <div className="flex flex-col leading-none">
            <span
              className={`${textSize} font-semibold tracking-[0.2em] ${
                tone === 'dark' ? 'text-[#141312]' : 'text-[#F6E6B0]'
              }`}
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
            >
              AURÉLIA <span className="font-normal opacity-80">&amp;</span> CO.
            </span>
            <span
              className={`text-[9px] tracking-[0.28em] uppercase mt-1 ${
                tone === 'dark' ? 'text-[#8F6D39]' : 'text-[#D2B47D]'
              }`}
            >
              Paris · Milan
            </span>
          </div>
        </div>
      );

    // 2. AZURE ESCAPES — Official Coastal Arch & Ocean Horizon Crest
    case 'azure-escapes':
      return (
        <AzureBrandLogo
          variant="full"
          tone={tone}
          size={size}
          showDescriptor={size !== 'sm'}
        />
      );

    // 3. HEALTHLINK — Official Interlocking Care-Pathway Brand Emblem
    case 'healthlink-clinical':
      return <HealthLinkBrandLogo variant="compact" tone={tone} size={size} />;

    // 4. PRIMUS CAPITAL — Three Offset Architectural Planes Emblem
    case 'primus-capital':
      return <PrimusBrandLogo variant="full" tone={tone} size={size} />;

    // 5. AETHER FLEET — Folded Route Ribbon + Single Tracking Point Emblem
    case 'aether-fleet':
    default:
      return <AetherBrandLogo variant="full" tone={tone} size={size} />;
  }
};
