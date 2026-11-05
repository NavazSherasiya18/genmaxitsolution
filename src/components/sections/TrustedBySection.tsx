import React from 'react';

export const TrustedBySection: React.FC = () => {
  const row1Logos = [
    { initials: 'NM', name: 'Novus Medias', sector: 'Media', color: '#4f46e5' },
    { initials: 'SC', name: 'Skyline Capital', sector: 'Finance', color: '#0891b2' },
    { initials: 'GT', name: 'Global TransLog', sector: 'Logistics', color: '#7c3aed' },
    { initials: 'MR', name: 'Matrix Retail', sector: 'Retail', color: '#0d9488' },
  ];

  const row2Logos = [
    { initials: 'AH', name: 'Apex Healthtech', sector: 'Healthcare', color: '#2563eb' },
    { initials: 'VC', name: 'Verma Crafts', sector: 'Handicrafts', color: '#c2410c' },
    { initials: 'ZL', name: 'Zenith Logistics', sector: 'Logistics', color: '#4f46e5' },
    { initials: 'UN', name: 'UrbanNest Realty', sector: 'Real estate', color: '#0e7490' },
  ];

  return (
    <section
      aria-label="Trusted by section"
      className="w-full relative transition-colors duration-300"
      style={{
        backgroundColor: 'var(--surface)',
        borderTop: '1px solid var(--line)',
        padding: '44px 0 56px',
        overflow: 'hidden',
      }}
    >
      {/* Centered Heading (15px, semibold, --muted, max-width 640px, margin-bottom 28px) */}
      <h2
        className="text-center text-[15px] font-semibold max-w-[640px] mx-auto mb-7 px-5"
        style={{ color: 'var(--muted)' }}
      >
        <strong className="font-bold" style={{ color: 'var(--ink)' }}>
          Trusted by clinics, retailers, enterprises and startups
        </strong>
        <span> across India and worldwide</span>
      </h2>

      {/* TWO infinite marquee rows with fade edge masks */}
      <div
        className="relative w-full overflow-hidden group"
        style={{
          maskImage: 'linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
      >
        {/* Row 1: left over 40s */}
        <div
          className="flex w-max gap-4 group-hover:[animation-play-state:paused]"
          style={{
            animation: 'marqueeLeft 40s linear infinite',
          }}
          aria-hidden="true"
        >
          {[...row1Logos, ...row1Logos, ...row1Logos, ...row1Logos].map((client, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-3 py-3 px-5 pr-5 rounded-[14px] shrink-0 border transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--brand)] shadow-2xs"
              style={{
                backgroundColor: 'var(--bg)',
                borderColor: 'var(--line)',
              }}
            >
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white text-[12px] font-semibold shrink-0"
                style={{ backgroundColor: client.color }}
              >
                {client.initials}
              </div>
              <div className="flex flex-col text-left">
                <span
                  className="font-semibold text-[16px] leading-[1.2]"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: 'var(--ink)',
                  }}
                >
                  {client.name}
                </span>
                <span className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>
                  {client.sector}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: right over 48s, reversed, margin-top 14px */}
        <div
          className="flex w-max gap-4 mt-3.5 group-hover:[animation-play-state:paused]"
          style={{
            animation: 'marqueeRight 48s linear infinite',
          }}
          aria-hidden="true"
        >
          {[...row2Logos, ...row2Logos, ...row2Logos, ...row2Logos].map((client, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-3 py-3 px-5 pr-5 rounded-[14px] shrink-0 border transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--brand)] shadow-2xs"
              style={{
                backgroundColor: 'var(--bg)',
                borderColor: 'var(--line)',
              }}
            >
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white text-[12px] font-semibold shrink-0"
                style={{ backgroundColor: client.color }}
              >
                {client.initials}
              </div>
              <div className="flex flex-col text-left">
                <span
                  className="font-semibold text-[16px] leading-[1.2]"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: 'var(--ink)',
                  }}
                >
                  {client.name}
                </span>
                <span className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>
                  {client.sector}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Centered wrapping proof line (margin-top 34px, 14px, --muted, gap 12px 40px) */}
      <div
        className="mt-[34px] flex justify-center items-center flex-wrap gap-x-10 gap-y-3 text-[14px] px-5"
        style={{ color: 'var(--muted)' }}
      >
        <div className="inline-flex items-center gap-1.5">
          <span
            className="font-bold"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: 'var(--ink)',
            }}
          >
            120+
          </span>
          <span>projects delivered</span>
        </div>

        <div className="inline-flex items-center gap-1.5">
          <span
            className="font-bold"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: 'var(--ink)',
            }}
          >
            4.9★
          </span>
          <span>average client rating</span>
        </div>

        <div className="inline-flex items-center gap-1.5">
          <span
            className="font-bold"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: 'var(--ink)',
            }}
          >
            8 yrs
          </span>
          <span>of technical SEO</span>
        </div>

        <div className="inline-flex items-center gap-1.5">
          <span
            className="font-bold"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: 'var(--ink)',
            }}
          >
            1-year
          </span>
          <span>warranty on every build</span>
        </div>
      </div>
    </section>
  );
};
