import React, { useEffect, useId } from 'react';

export interface AzureBrandLogoProps {
  variant?: 'full' | 'compact' | 'emblem';
  tone?: 'dark' | 'light' | 'auto';
  showDescriptor?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Official Azure Escapes brand mark:
 * Coastal architectural arch enclosing a calm ocean horizon and restrained brushed-brass sun crest.
 */
export const AzureBrandLogo: React.FC<AzureBrandLogoProps> = ({
  variant = 'full',
  tone = 'dark',
  showDescriptor = true,
  size = 'md',
  className = '',
}) => {
  const uid = useId().replace(/:/g, '');
  const seaGradId = `az-sea-${uid}`;
  const brassGradId = `az-brass-${uid}`;

  const iconSize =
    size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const wordmarkSize =
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-[1.25rem]';

  const isLight = tone === 'light';
  const isAuto = tone === 'auto';
  const inkClass = isLight
    ? 'text-[#F6F2EB]'
    : isAuto
    ? 'text-[#09263B] dark:text-[#F6F2EB]'
    : 'text-[#09263B]';
  const archStroke = isLight ? '#F6F2EB' : '#09263B';
  const seaTone = isLight ? '#6BB8C5' : '#2E7D8C';
  const brassPrimary = isLight ? '#D4B06A' : '#A88443';
  const badgeBg = isLight ? 'rgba(9, 38, 59, 0.35)' : '#F6F2EB';

  const emblem = (
    <svg
      viewBox="0 0 48 48"
      className={`${iconSize} shrink-0`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={seaGradId} x1="8" y1="24" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isLight ? '#7CC7D4' : '#2E7D8C'} />
          <stop offset="100%" stopColor={isLight ? '#2E7D8C' : '#09263B'} />
        </linearGradient>
        <linearGradient id={brassGradId} x1="18" y1="11" x2="30" y2="23" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#DFC07D" />
          <stop offset="100%" stopColor={brassPrimary} />
        </linearGradient>
      </defs>

      {/* Outer Architectural Crest Circle */}
      <circle
        cx="24"
        cy="24"
        r="21.5"
        fill={badgeBg}
        stroke={brassPrimary}
        strokeWidth="1.25"
      />

      {/* Coastal Arch Portal */}
      <path
        d="M14.5 29.5V19.5C14.5 14.2533 18.7533 10 24 10C29.2467 10 33.5 14.2533 33.5 19.5V29.5"
        stroke={archStroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Restrained Sun Crest Inside Arch */}
      <circle cx="24" cy="18.2" r="3.6" fill={`url(#${brassGradId})`} />

      {/* Ocean Horizon Lines */}
      <path
        d="M9.5 29.5H38.5"
        stroke={archStroke}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M11 33.6C15.5 31.8 19.8 31.8 24 33.6C28.2 35.4 32.5 35.4 37 33.6"
        stroke={`url(#${seaGradId})`}
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M15.5 37.8C18.5 36.7 21.2 36.7 24 37.8C26.8 38.9 29.5 38.9 32.5 37.8"
        stroke={seaTone}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
    </svg>
  );

  if (variant === 'emblem') {
    return (
      <span className={`inline-flex items-center justify-center ${className}`} aria-label="Azure Escapes">
        {emblem}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-3 select-none whitespace-nowrap shrink-0 ${className}`}>
      {emblem}
      <span className="flex flex-col leading-none">
        <span
          className={`${wordmarkSize} font-semibold tracking-[0.16em] uppercase ${inkClass}`}
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Azure <span className="font-normal opacity-90">Escapes</span>
        </span>
        {variant === 'full' && showDescriptor && (
          <span
            className="text-[9.5px] tracking-[0.26em] uppercase mt-1 font-medium"
            style={{ color: isLight ? '#D4B06A' : '#85652E' }}
          >
            Luxury Coastal Villas
          </span>
        )}
      </span>
    </span>
  );
};

const AZURE_FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="#09263B" stroke="#C4A05C" stroke-width="2"/><path d="M14.5 29.5V19.5C14.5 14.25 18.75 10 24 10C29.25 10 33.5 14.25 33.5 19.5V29.5" stroke="#F6F2EB" stroke-width="2.2" stroke-linecap="round"/><circle cx="24" cy="18.2" r="3.8" fill="#D4B06A"/><path d="M9.5 29.5H38.5" stroke="#F6F2EB" stroke-width="1.6" stroke-linecap="round"/><path d="M11 34C15.5 32 19.8 32 24 34C28.2 36 32.5 36 37 34" stroke="#6BB8C5" stroke-width="2.3" stroke-linecap="round"/></svg>`;

/**
 * Sets a matching SVG favicon while browsing Azure Escapes showcase routes and restores cleanly.
 */
export function useAzureFavicon(active: boolean) {
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
    iconLink.href = `data:image/svg+xml,${encodeURIComponent(AZURE_FAVICON_SVG)}`;

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
