import React, { useEffect, useId } from 'react';

export interface HealthLinkBrandLogoProps {
  variant?: 'full' | 'compact' | 'emblem';
  tone?: 'dark' | 'light' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  subtitle?: string;
  className?: string;
}

/**
 * Official HealthLink brand mark:
 * Two interlocking rounded forms whose negative space creates an open care-pathway bridge
 * linking patients and hospital departments. Legible at 16px favicon scale and above.
 */
export const HealthLinkBrandLogo: React.FC<HealthLinkBrandLogoProps> = ({
  variant = 'full',
  tone = 'dark',
  size = 'md',
  subtitle,
  className = '',
}) => {
  const uid = useId().replace(/:/g, '');
  const tealGradId = `hl-teal-${uid}`;
  const navyGradId = `hl-navy-${uid}`;

  const iconSize =
    size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const wordmarkSize =
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-[1.25rem]';

  const isLight = tone === 'light';
  const isAuto = tone === 'auto';

  const primaryWordClass = isLight
    ? 'text-white'
    : isAuto
    ? 'text-[#0A2540] dark:text-white'
    : 'text-[#0A2540]';

  const accentWordClass = isLight
    ? 'text-[#5EEAD4]'
    : isAuto
    ? 'text-[#0D9488] dark:text-[#5EEAD4]'
    : 'text-[#0D9488]';

  const emblem = (
    <svg
      viewBox="0 0 48 48"
      className={`${iconSize} shrink-0`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={tealGradId} x1="6" y1="8" x2="32" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>
        <linearGradient id={navyGradId} x1="18" y1="16" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isLight ? '#E2E8F0' : '#1E3A5F'} />
          <stop offset="100%" stopColor={isLight ? '#94A3B8' : '#0A2540'} />
        </linearGradient>
      </defs>

      {/* Soft Rounded Clinical Foundation */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="12"
        fill={isLight ? 'rgba(255,255,255,0.12)' : '#EDF7F5'}
        stroke={isLight ? 'rgba(94,234,212,0.45)' : '#CBE8E2'}
        strokeWidth="1.2"
      />

      {/* Left-Top Interlocking Rounded Loop (Teal) */}
      <path
        d="M11 21C11 14.9249 15.9249 10 22 10H26.5C29.5376 10 32 12.4624 32 15.5C32 18.5376 29.5376 21 26.5 21H22C20.3431 21 19 22.3431 19 24V27C19 29.2091 17.2091 31 15 31C12.7909 31 11 29.2091 11 27V21Z"
        fill={`url(#${tealGradId})`}
      />

      {/* Right-Bottom Interlocking Rounded Loop (Deep Navy / Light Frost) leaving negative-space care bridge */}
      <path
        d="M37 27C37 33.0751 32.0751 38 26 38H21.5C18.4624 38 16 35.5376 16 32.5C16 29.4624 18.4624 27 21.5 27H26C27.6569 27 29 25.6569 29 24V21C29 18.7909 30.7909 17 33 17C35.2091 17 37 18.7909 37 21V27Z"
        fill={`url(#${navyGradId})`}
      />

      {/* Center Negative-Space Connection Node */}
      <circle cx="24" cy="24" r="2.2" fill={isLight ? '#5EEAD4' : '#0D9488'} />
    </svg>
  );

  if (variant === 'emblem') {
    return (
      <span className={`inline-flex items-center justify-center ${className}`} aria-label="HealthLink">
        {emblem}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 select-none whitespace-nowrap shrink-0 ${className}`}>
      {emblem}
      <span className="flex flex-col leading-none">
        <span
          className={`${wordmarkSize} font-bold tracking-tight ${primaryWordClass}`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Health<span className={accentWordClass}>Link</span>
        </span>
        {variant === 'full' && subtitle && (
          <span
            className={`text-[10px] font-medium tracking-wider uppercase mt-0.5 ${
              isLight ? 'text-teal-200/90' : 'text-[#475569]'
            }`}
          >
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
};

export const HEALTHLINK_FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#0A2540"/><path d="M11 21C11 14.92 15.92 10 22 10H26.5C29.54 10 32 12.46 32 15.5C32 18.54 29.54 21 26.5 21H22C20.34 21 19 22.34 19 24V27C19 29.21 17.21 31 15 31C12.79 31 11 29.21 11 27V21Z" fill="#14B8A6"/><path d="M37 27C37 33.08 32.08 38 26 38H21.5C18.46 38 16 35.54 16 32.5C16 29.46 18.46 27 21.5 27H26C27.66 27 29 25.66 29 24V21C29 18.79 30.79 17 33 17C35.21 17 37 18.79 37 21V27Z" fill="#E2E8F0"/><circle cx="24" cy="24" r="2.2" fill="#5EEAD4"/></svg>`;

/**
 * Sets matching HealthLink SVG favicon while browsing /showcase/healthlink* and restores on leave.
 */
export function useHealthLinkFavicon(active: boolean) {
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
    iconLink.href = `data:image/svg+xml,${encodeURIComponent(HEALTHLINK_FAVICON_SVG)}`;

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
