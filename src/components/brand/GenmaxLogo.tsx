import React from 'react';

interface GenmaxLogoProps {
  variant?: 'full' | 'icon' | 'compact';
  theme?: 'gradient' | 'white' | 'dark';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GenmaxLogo: React.FC<GenmaxLogoProps> = ({
  variant = 'full',
  theme = 'gradient',
  className = '',
  size = 'md',
}) => {
  // Size metrics
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const subTextSizes = {
    sm: 'text-[9px] tracking-[0.25em]',
    md: 'text-[10px] tracking-[0.3em]',
    lg: 'text-xs tracking-[0.32em]',
    xl: 'text-sm tracking-[0.35em]',
  };

  const gradientId = React.useId();

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Custom Geometric G+M Vector Glyph */}
      <div className={`relative ${iconSizes[size]} shrink-0 transition-transform duration-300 hover:scale-105`}>
        <svg
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(99,102,241,0.35)]"
        >
          <defs>
            <linearGradient id={`${gradientId}-grad-primary`} x1="0" y1="0" x2="54" y2="54" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
            <linearGradient id={`${gradientId}-grad-secondary`} x1="12" y1="6" x2="48" y2="46" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id={`${gradientId}-glow`} x1="0" y1="0" x2="54" y2="54" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Hexagonal Tech Frame with Negative Space Precision */}
          <polygon
            points="27,3 49,15.5 49,38.5 27,51 5,38.5 5,15.5"
            fill={`url(#${gradientId}-glow)`}
            stroke={theme === 'white' ? '#FFFFFF' : `url(#${gradientId}-grad-primary)`}
            strokeWidth="1.75"
            strokeLinejoin="round"
            className="opacity-70"
          />

          {/* The Outer Interlocking 'G' Curve */}
          <path
            d="M 37 18 
               C 33 13, 21 12, 16 17 
               C 10 23, 10 33, 16 39 
               C 22 45, 34 43, 39 37 
               L 39 28 
               L 26 28"
            fill="none"
            stroke={theme === 'white' ? '#FFFFFF' : `url(#${gradientId}-grad-primary)`}
            strokeWidth="3.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* The Inner Kinetic 'M' Chevron with Forward-Vector Angle */}
          <path
            d="M 21 34 
               L 27 23 
               L 33 34"
            fill="none"
            stroke={theme === 'white' ? '#FFFFFF' : `url(#${gradientId}-grad-secondary)`}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dynamic Forward Catalyst Node */}
          <circle
            cx="27"
            cy="23"
            r="2.25"
            fill={theme === 'white' ? '#FFFFFF' : '#22D3EE'}
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Typography Wordmark */}
      {variant !== 'icon' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center tracking-tight font-extrabold font-heading">
            <span
              className={`${textSizes[size]} ${
                theme === 'white'
                  ? 'text-white'
                  : theme === 'dark'
                  ? 'text-slate-900 tracking-[-0.03em]'
                  : 'text-slate-900 dark:text-white tracking-[-0.03em]'
              }`}
            >
              GENMAX
            </span>
            <span
              className={`${textSizes[size]} ml-1 font-semibold ${
                theme === 'white'
                  ? 'text-slate-300'
                  : theme === 'dark'
                  ? 'text-indigo-600 font-heading'
                  : 'text-indigo-600 dark:text-cyan-400 font-heading'
              }`}
            >
              IT
            </span>
          </div>
          <span
            className={`${subTextSizes[size]} font-semibold font-sans uppercase ${
              theme === 'white'
                ? 'text-slate-400'
                : theme === 'dark'
                ? 'text-slate-500'
                : 'text-slate-500 dark:text-indigo-300/80'
            }`}
          >
            SOLUTION
          </span>
        </div>
      )}
    </div>
  );
};
