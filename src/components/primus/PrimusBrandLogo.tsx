import React, { useEffect, useId } from 'react';

export interface PrimusBrandLogoProps {
  variant?: 'full' | 'compact' | 'emblem';
  tone?: 'dark' | 'light' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Official PRIMUS CAPITAL brand mark:
 * Three offset architectural planes forming a stepped institutional tower & land-parcel silhouette,
 * crafted to remain legible at 16px favicon scale and full header scale.
 */
export const PrimusBrandLogo: React.FC<PrimusBrandLogoProps> = ({
  variant = 'full',
  tone = 'dark',
  size = 'md',
  className = '',
}) => {
  const uid = useId().replace(/:/g, '');
  const brassId = `pr-brass-${uid}`;
  const planeId = `pr-plane-${uid}`;

  const iconSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const wordSize = size === 'sm' ? 'text-xs sm:text-sm' : size === 'lg' ? 'text-xl' : 'text-sm sm:text-base';

  const isLight = tone === 'light';
  const isAuto = tone === 'auto';

  const primaryWordClass = isLight
    ? 'text-white'
    : isAuto
    ? 'text-[#0D1829] dark:text-white'
    : 'text-[#0D1829]';

  const brassWordClass = isLight
    ? 'text-[#D6B572]'
    : isAuto
    ? 'text-[#9E7C3B] dark:text-[#D6B572]'
    : 'text-[#9E7C3B]';

  const emblem = (
    <svg
      viewBox="0 0 48 48"
      className={`${iconSize} shrink-0`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={brassId} x1="10" y1="6" x2="38" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#DFC285" />
          <stop offset="55%" stopColor="#B8934A" />
          <stop offset="100%" stopColor="#8C6B2F" />
        </linearGradient>
        <linearGradient id={planeId} x1="8" y1="14" x2="30" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isLight ? '#E2E8F0' : '#1E3350'} />
          <stop offset="100%" stopColor={isLight ? '#94A3B8' : '#0D1829'} />
        </linearGradient>
      </defs>

      {/* Architectural Limestone / Midnight Frame */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="8"
        fill={isLight ? '#07101D' : '#F6F4EF'}
        stroke={isLight ? 'rgba(214,181,114,0.45)' : '#CEC6B7'}
        strokeWidth="1.25"
      />

      {/* Plane 1: Offset Left Land-Parcel Monolith */}
      <path
        d="M11 37V19L20 14.5V37H11Z"
        fill={`url(#${planeId})`}
      />

      {/* Plane 2: Tall Central Architectural Tower Plane (Brushed Brass) */}
      <path
        d="M19 37V10.5L29 7.5V37H19Z"
        fill={`url(#${brassId})`}
      />

      {/* Plane 3: Offset Right Foreground Podium Plane */}
      <path
        d="M28 37V17L37 20.5V37H28Z"
        fill={isLight ? 'rgba(255,255,255,0.2)' : 'rgba(13,24,41,0.28)'}
        stroke={isLight ? '#E2E8F0' : '#0D1829'}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Horizon Datum Line */}
      <path
        d="M8.5 37H39.5"
        stroke={`url(#${brassId})`}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === 'emblem') {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 ${className}`}
        aria-label="Primus Capital"
      >
        {emblem}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2.5 select-none whitespace-nowrap shrink-0 ${className}`}
    >
      {emblem}
      <span
        className={`${wordSize} font-bold tracking-[0.14em] uppercase ${primaryWordClass}`}
        style={{ fontFamily: "'Instrument Sans', sans-serif" }}
      >
        PRIMUS <span className={brassWordClass}>CAPITAL</span>
      </span>
    </span>
  );
};

export const PRIMUS_FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="8" fill="#0D1829"/><path d="M11 37V19L20 14.5V37H11Z" fill="#64748B"/><path d="M19 37V10.5L29 7.5V37H19Z" fill="#C9A55A"/><path d="M28 37V17L37 20.5V37H28Z" fill="#F6F4EF" fill-opacity="0.35" stroke="#F6F4EF" stroke-width="1.2"/><path d="M8.5 37H39.5" stroke="#D6B572" stroke-width="2" stroke-linecap="round"/></svg>`;

export function usePrimusFavicon(active: boolean) {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return;
    const head = document.head;
    let iconLink = head.querySelector<HTMLLinkElement>('link[rel="icon"]');
    const hadExisting = Boolean(iconLink);
    const previousHref = iconLink?.getAttribute('href') || '';
    const previousType = iconLink?.getAttribute('type') || '';

    if (!iconLink) {
      iconLink = document.createElement('link');
      iconLink.rel = 'icon';
      head.appendChild(iconLink);
    }

    iconLink.type = 'image/svg+xml';
    iconLink.href = `data:image/svg+xml,${encodeURIComponent(PRIMUS_FAVICON_SVG)}`;

    return () => {
      if (!iconLink) return;
      if (hadExisting && previousHref) {
        iconLink.href = previousHref;
        if (previousType) {
          iconLink.type = previousType;
        } else {
          iconLink.removeAttribute('type');
        }
      } else if (!hadExisting) {
        iconLink.remove();
      }
    };
  }, [active]);
}
