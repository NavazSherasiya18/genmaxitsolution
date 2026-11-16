import React from 'react';

interface AureliaBrandLogoProps {
  variant?: 'masthead' | 'footer' | 'compact';
  tone?: 'dark-ink' | 'light-ivory';
}

export const AureliaBrandLogo: React.FC<AureliaBrandLogoProps> = ({
  variant = 'masthead',
  tone = 'dark-ink',
}) => {
  const gradId = React.useId().replace(/:/g, '');
  const isLight = tone === 'light-ivory';
  const primaryColor = isLight ? '#FAF7F2' : '#141312';
  const accentColor = isLight ? '#D2B47D' : '#8F6D39';
  const lineColor = isLight ? '#3A3530' : '#D8CBB8';

  const emblemSize =
    variant === 'compact' ? 'w-7 h-7' : variant === 'footer' ? 'w-10 h-10' : 'w-9 h-9 sm:w-10 sm:h-10';

  return (
    <div className="inline-flex items-center gap-3 select-none whitespace-nowrap shrink-0">
      {/* Haute Joaillerie Octagon Diamond Crest with Monogram 'A' Lattice */}
      <svg
        viewBox="0 0 64 64"
        className={emblemSize}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isLight ? '#FBF0CC' : '#B4925A'} />
            <stop offset="50%" stopColor={isLight ? '#D4AF37' : '#8F6D39'} />
            <stop offset="100%" stopColor={isLight ? '#9A7624' : '#6A4E22'} />
          </linearGradient>
        </defs>

        {/* Outer Emerald-Cut Octagonal Seal */}
        <polygon
          points="32,4 50,14.5 50,49.5 32,60 14,49.5 14,14.5"
          stroke={`url(#${gradId})`}
          strokeWidth="1.75"
          fill={isLight ? 'rgba(212, 175, 55, 0.08)' : 'rgba(143, 109, 57, 0.07)'}
        />

        {/* Inner Fine Fillet Frame */}
        <polygon
          points="32,10 45,17.8 45,46.2 32,54 19,46.2 19,17.8"
          stroke={`url(#${gradId})`}
          strokeWidth="1"
          strokeOpacity="0.65"
        />

        {/* Pavilion Corner Facets */}
        <path
          d="M32 4V10M32 54V60M14 14.5L19 17.8M50 14.5L45 17.8M14 49.5L19 46.2M50 49.5L45 46.2"
          stroke={`url(#${gradId})`}
          strokeWidth="1.1"
          strokeLinecap="round"
        />

        {/* Architectural Serif 'A' Monogram Inside Seal */}
        <path
          d="M23.5 43L32 20L40.5 43"
          stroke={primaryColor}
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26.5 35.5H37.5"
          stroke={primaryColor}
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Top Crown Star Diamond */}
        <polygon points="32,12.5 34.2,15.5 32,18.5 29.8,15.5" fill={`url(#${gradId})`} />
      </svg>

      {/* Stacked Maison Typography Lockup */}
      <div className="flex flex-col items-start text-left leading-none">
        <span
          className={`aur-serif font-semibold tracking-[0.22em] uppercase ${
            variant === 'compact'
              ? 'text-base sm:text-lg'
              : variant === 'footer'
                ? 'text-xl sm:text-2xl'
                : 'text-lg sm:text-[22px]'
          }`}
          style={{ color: primaryColor }}
        >
          Aurélia <span className="font-normal opacity-80">&amp;</span> Co.
        </span>

        <span className="flex items-center gap-2 mt-1.5 w-full">
          <span className="h-[1px] flex-1 min-w-[14px]" style={{ backgroundColor: lineColor }} />
          <span
            className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-medium"
            style={{ color: accentColor }}
          >
            Paris · Milan
          </span>
          <span className="h-[1px] flex-1 min-w-[14px]" style={{ backgroundColor: lineColor }} />
        </span>
      </div>
    </div>
  );
};
