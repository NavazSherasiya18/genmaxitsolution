import React, { useEffect, useId } from 'react';

export interface AetherBrandLogoProps {
  variant?: 'full' | 'compact' | 'emblem';
  tone?: 'dark' | 'light' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Official AETHER FLEET brand mark:
 * Folded route ribbon forming a crisp geometric bend anchored by a single electric-cyan tracking point.
 * Engineered for clear silhouette legibility down to 16px favicon scale.
 */
export const AetherBrandLogo: React.FC<AetherBrandLogoProps> = ({
  variant = 'full',
  tone = 'dark',
  size = 'md',
  className = '',
}) => {
  const uid = useId().replace(/:/g, '');
  const ribbonGrad = `af-rib-${uid}`;

  const iconSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const textSize = size === 'sm' ? 'text-xs sm:text-sm' : size === 'lg' ? 'text-xl' : 'text-sm sm:text-base';

  const isLight = tone === 'light';
  const isAuto = tone === 'auto';

  const primaryWordClass = isLight
    ? 'text-white'
    : isAuto
    ? 'text-[#0C131F] dark:text-white'
    : 'text-[#0C131F]';

  const cyanWordClass = isLight
    ? 'text-[#22D3EE]'
    : isAuto
    ? 'text-[#0891B2] dark:text-[#22D3EE]'
    : 'text-[#0891B2]';

  const emblem = (
    <svg
      viewBox="0 0 48 48"
      className={`${iconSize} shrink-0`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={ribbonGrad} x1="8" y1="36" x2="36" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0891B2" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>

      {/* Container frame */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="10"
        fill={isLight ? '#0C131F' : '#0F172A'}
        stroke={isLight ? 'rgba(34,211,238,0.35)' : '#1E293B'}
        strokeWidth="1.25"
      />

      {/* Folded Route Ribbon Segment 1 (Lower Diagonal Fold) */}
      <path
        d="M11 35L23.5 14L29 22.5L19.5 35H11Z"
        fill={`url(#${ribbonGrad})`}
      />

      {/* Folded Route Ribbon Segment 2 (Return Fold) */}
      <path
        d="M23.5 14L37 35H28.5L23.5 26.2V14Z"
        fill="#E2E8F0"
        fillOpacity={isLight ? '0.95' : '0.9'}
      />

      {/* Single Tracking Point (Electric Cyan Apex Node) */}
      <circle cx="23.5" cy="12.5" r="3.6" fill="#22D3EE" stroke="#0C131F" strokeWidth="1.5" />
    </svg>
  );

  if (variant === 'emblem') {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 ${className}`}
        aria-label="Aether Fleet"
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
        className={`${wordSizeClass(textSize)} font-extrabold tracking-[0.12em] uppercase ${primaryWordClass}`}
        style={{ fontFamily: "'Instrument Sans', sans-serif" }}
      >
        AETHER <span className={cyanWordClass}>FLEET</span>
      </span>
    </span>
  );
};

function wordSizeClass(size: string) {
  return size;
}

export const AETHER_EMBLEM_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="10" fill="#0C131F"/><path d="M11 35L23.5 14L29 22.5L19.5 35H11Z" fill="#06B6D4"/><path d="M23.5 14L37 35H28.5L23.5 26.2V14Z" fill="#F8FAFC"/><circle cx="23.5" cy="12.5" r="3.6" fill="#22D3EE" stroke="#0C131F" stroke-width="1.5"/></svg>`;

export const AETHER_HORIZONTAL_DARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 48" fill="none"><rect x="2" y="2" width="44" height="44" rx="10" fill="#0C131F"/><path d="M11 35L23.5 14L29 22.5L19.5 35H11Z" fill="#06B6D4"/><path d="M23.5 14L37 35H28.5L23.5 26.2V14Z" fill="#F8FAFC"/><circle cx="23.5" cy="12.5" r="3.6" fill="#22D3EE" stroke="#0C131F" stroke-width="1.5"/><text x="60" y="31" fill="#0C131F" font-family="Instrument Sans, sans-serif" font-size="20" font-weight="800" letter-spacing="2">AETHER FLEET</text></svg>`;

export const AETHER_HORIZONTAL_LIGHT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 48" fill="none"><rect x="2" y="2" width="44" height="44" rx="10" fill="#131D2E" stroke="#22D3EE" stroke-opacity="0.35"/><path d="M11 35L23.5 14L29 22.5L19.5 35H11Z" fill="#06B6D4"/><path d="M23.5 14L37 35H28.5L23.5 26.2V14Z" fill="#F8FAFC"/><circle cx="23.5" cy="12.5" r="3.6" fill="#22D3EE" stroke="#0C131F" stroke-width="1.5"/><text x="60" y="31" fill="#FFFFFF" font-family="Instrument Sans, sans-serif" font-size="20" font-weight="800" letter-spacing="2">AETHER FLEET</text></svg>`;

export const AETHER_FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="7" fill="#0C131F"/><path d="M7 24L15.5 9.5L19.5 15L12.5 24H7Z" fill="#06B6D4"/><path d="M15.5 9.5L25 24H19L15.5 17.5V9.5Z" fill="#F8FAFC"/><circle cx="15.5" cy="8.5" r="2.6" fill="#22D3EE" stroke="#0C131F" stroke-width="1"/></svg>`;

export function useAetherFavicon(active: boolean) {
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
    iconLink.href = `data:image/svg+xml,${encodeURIComponent(AETHER_FAVICON_SVG)}`;

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
