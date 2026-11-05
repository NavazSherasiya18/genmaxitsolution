import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface EngineeredHeroSectionProps {
  onOpenAudit: () => void;
}

export const EngineeredHeroSection: React.FC<EngineeredHeroSectionProps> = ({ onOpenAudit }) => {
  const heroRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const chipTopRef = useRef<HTMLDivElement>(null);
  const chipBottomRef = useRef<HTMLDivElement>(null);

  // Stats count up values
  const [pageSpeedVal, setPageSpeedVal] = useState('0/100');
  const [rankVal, setRankVal] = useState('#0');
  const [paintVal, setPaintVal] = useState('0.0s');
  const [ringVal, setRingVal] = useState(0);
  const [isAuditing, setIsAuditing] = useState(false);

  // Live Toast state
  const toastMessages = [
    { icon: '📞', text: 'New call from Noida · 2 min ago' },
    { icon: '📍', text: 'Direction request · Sector 62' },
    { icon: '⭐', text: 'New 5-star review received' },
    { icon: '🛒', text: 'WooCommerce order · ₹4,200' },
  ];
  const [toastIdx, setToastIdx] = useState(0);
  const [toastActive, setToastActive] = useState(false);

  // Mouse spotlight & 3D tilt
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      hero.style.setProperty('--mouse-x', `${x}px`);
      hero.style.setProperty('--mouse-y', `${y}px`);

      if (!prefersReducedMotion && cardRef.current) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const normX = (x - centerX) / centerX;
        const normY = (y - centerY) / centerY;

        const rotateX = -normY * 9;
        const rotateY = normX * 9;

        cardRef.current.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

        if (chipTopRef.current) {
          chipTopRef.current.style.transform = `translate(${(normX * 18).toFixed(1)}px, ${(normY * 14).toFixed(1)}px)`;
        }
        if (chipBottomRef.current) {
          chipBottomRef.current.style.transform = `translate(${(-normX * 16).toFixed(1)}px, ${(-normY * 12).toFixed(1)}px)`;
        }
      }
    };

    const handleMouseLeave = () => {
      if (!prefersReducedMotion && cardRef.current) {
        cardRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
        if (chipTopRef.current) chipTopRef.current.style.transform = 'translate(0, 0)';
        if (chipBottomRef.current) chipBottomRef.current.style.transform = 'translate(0, 0)';
      }
    };

    hero.addEventListener('mousemove', handleMouseMove);
    hero.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Stats Count-Up helper
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setPageSpeedVal('99/100');
      setRankVal('#1');
      setPaintVal('0.9s');
      setRingVal(99);
      return;
    }

    const timer = setTimeout(() => {
      const startTime = performance.now();
      const duration = 1600;

      const animate = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        const currentSpeed = Math.round(99 * easeOut);
        const currentRank = Math.round(1 * easeOut);
        const currentPaint = (0.9 * easeOut).toFixed(1);

        setPageSpeedVal(`${currentSpeed}/100`);
        setRankVal(`#${currentRank}`);
        setPaintVal(`${currentPaint}s`);
        setRingVal(Math.round(99 * easeOut));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setPageSpeedVal('99/100');
          setRankVal('#1');
          setPaintVal('0.9s');
          setRingVal(99);
        }
      };

      requestAnimationFrame(animate);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  // Cycling Live Notification Toast
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let hideTimer: ReturnType<typeof setTimeout>;
    let intervalTimer: ReturnType<typeof setInterval>;

    const showToast = () => {
      setToastActive(true);
      hideTimer = setTimeout(() => {
        setToastActive(false);
        setToastIdx((prev) => (prev + 1) % toastMessages.length);
      }, 2800);
    };

    const startTimer = setTimeout(() => {
      showToast();
      intervalTimer = setInterval(showToast, 4000);
    }, 2400);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(hideTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  // Live test button interaction
  const handleLiveTest = () => {
    setIsAuditing(true);
    setRingVal(0);

    setTimeout(() => {
      const startTime = performance.now();
      const duration = 1200;

      const animate = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setRingVal(Math.round(99 * easeOut));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setRingVal(99);
          setIsAuditing(false);
        }
      };

      requestAnimationFrame(animate);
    }, 300);
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-label="Hero section"
      className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24 transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg)',
        backgroundImage: `
          radial-gradient(circle at 85% 15%, var(--glow) 0%, transparent 45%),
          radial-gradient(circle at 10% 85%, rgba(8, 145, 178, 0.1) 0%, transparent 40%),
          linear-gradient(var(--grid) 1px, transparent 1px),
          linear-gradient(90deg, var(--grid) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px',
        minHeight: '820px',
      }}
    >
      {/* Blurred drifting background blobs */}
      <div
        className="absolute rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          width: '360px',
          height: '360px',
          background: 'var(--brand)',
          top: '-40px',
          right: '-40px',
          filter: 'blur(70px)',
          opacity: 0.45,
          animation: 'blobDrift1 12s ease-in-out infinite alternate',
          zIndex: 1,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          width: '300px',
          height: '300px',
          background: 'var(--brand2)',
          bottom: '-30px',
          left: '-30px',
          filter: 'blur(70px)',
          opacity: 0.45,
          animation: 'blobDrift2 16s ease-in-out infinite alternate',
          zIndex: 1,
        }}
      />

      {/* Soft cursor-following spotlight overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(380px circle at var(--mouse-x) var(--mouse-y), var(--glow), transparent 70%)',
          zIndex: 2,
          transition: 'background 0.05s ease-out',
        }}
      />

      {/* Inner Hero Container (max-width 1180px, 2 columns 1.05fr / 0.95fr, gap 56px) */}
      <div
        className="relative mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center"
        style={{ maxWidth: '1180px', zIndex: 3 }}
      >
        {/* LEFT COLUMN */}
        <div className="flex flex-col">
          {/* 1. Pill Badge */}
          <div
            style={{
              animation: 'heroRise 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards 0s',
              opacity: 0,
            }}
          >
            <div
              role="status"
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold shadow-xs"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--line)',
                color: 'var(--ink)',
              }}
            >
              <span className="relative flex items-center justify-center w-2 h-2 shrink-0">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--ok)' }} />
                <span
                  className="absolute inset-[-3px] rounded-full"
                  style={{
                    border: '1.5px solid var(--ok)',
                    animation: 'pulseRing 1.8s cubic-bezier(0.24, 0, 0.38, 1) infinite',
                  }}
                />
              </span>
              <span className="font-bold" style={{ color: 'var(--brand)' }}>
                100% White-Hat
              </span>
              <span>Digital & IT Engineering Firm</span>
            </div>
          </div>

          {/* 2. H1 Headline with 3-stop shine text */}
          <h1
            className="text-[clamp(36px,5.2vw,62px)] font-extrabold tracking-[-0.03em] leading-[1.06] my-[22px]"
            style={{
              color: 'var(--ink)',
              animation: 'heroRise 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.12s',
              opacity: 0,
            }}
          >
            Accelerate your digital presence with{' '}
            <span
              style={{
                background: 'linear-gradient(100deg, var(--brand) 0%, var(--brand2) 50%, var(--brand) 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shineGradient 5s linear infinite',
              }}
            >
              precision engineering
            </span>{' '}
            and search dominance
          </h1>

          {/* 3. Paragraph */}
          <p
            className="text-[18px] leading-[1.6] max-w-[540px]"
            style={{
              color: 'var(--muted)',
              animation: 'heroRise 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.24s',
              opacity: 0,
            }}
          >
            Genmax IT Solution builds fast websites and custom software, ranks businesses on Google Maps, and runs marketing campaigns that pay back.
          </p>

          {/* 4. Two Buttons (gap 12px, margin 30px 0 34px) */}
          <div
            className="flex items-center gap-3 my-[30px] flex-wrap"
            style={{
              animation: 'heroRise 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.36s',
              opacity: 0,
            }}
          >
            <button
              onClick={onOpenAudit}
              type="button"
              className="relative overflow-hidden inline-flex items-center justify-center text-[15px] font-semibold px-6 py-[15px] rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              style={{
                background: 'linear-gradient(100deg, var(--brand), var(--brand2))',
                color: '#ffffff',
                boxShadow: '0 10px 24px -8px var(--brand)',
              }}
            >
              <span>Claim free SEO & web audit</span>
              {/* White diagonal light-sweep animation */}
              <span
                className="absolute top-[-50%] w-1/2 h-[200%] pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent)',
                  transform: 'rotate(25deg)',
                  animation: 'sweepLight 3.2s infinite',
                  animationDelay: '1.6s',
                }}
              />
            </button>

            <Link
              to="/services"
              className="inline-flex items-center justify-center text-[15px] font-semibold px-6 py-[15px] rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--brand)] shadow-xs"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--line)',
                color: 'var(--ink)',
              }}
            >
              Explore 19 services
            </Link>
          </div>

          {/* 5. Stats Row with Count-Up */}
          <div
            className="grid grid-cols-3 pt-[22px] max-w-[520px]"
            style={{
              borderTop: '1px solid var(--line)',
              animation: 'heroRise 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.48s',
              opacity: 0,
            }}
          >
            <div className="pr-4 relative border-r border-[var(--line)]">
              <div
                className="font-semibold text-[28px] leading-[1.1]"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--ink)' }}
              >
                {pageSpeedVal}
              </div>
              <div className="text-[13px] mt-1" style={{ color: 'var(--muted)' }}>
                PageSpeed score
              </div>
            </div>

            <div className="px-4 relative border-r border-[var(--line)]">
              <div
                className="font-semibold text-[28px] leading-[1.1]"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--ink)' }}
              >
                {rankVal}
              </div>
              <div className="text-[13px] mt-1" style={{ color: 'var(--muted)' }}>
                Google 3-pack ranks
              </div>
            </div>

            <div className="pl-4 relative">
              <div
                className="font-semibold text-[28px] leading-[1.1]"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--ink)' }}
              >
                {paintVal}
              </div>
              <div className="text-[13px] mt-1" style={{ color: 'var(--muted)' }}>
                First paint
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (VISUAL STACK, PERSPECTIVE 900PX) */}
        <div className="relative" style={{ perspective: '900px' }}>
          
          {/* Live Notification Toast cycling messages */}
          <div
            className={`absolute z-30 flex items-center gap-2 rounded-xl text-[13px] font-semibold px-4 py-2.5 shadow-xl transition-all duration-400 pointer-events-none whitespace-nowrap ${
              toastActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
            }`}
            style={{
              top: '-24px',
              right: '-12px',
              backgroundColor: 'var(--ink)',
              color: 'var(--bg)',
              boxShadow: '0 16px 36px -8px rgba(0, 0, 0, 0.32)',
            }}
          >
            <span>{toastMessages[toastIdx].icon}</span>
            <span>{toastMessages[toastIdx].text}</span>
          </div>

          {/* Floating Chip Top-Left */}
          <div
            ref={chipTopRef}
            className="absolute z-20 flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold shadow-lg pointer-events-none whitespace-nowrap"
            style={{
              top: '-16px',
              left: '-22px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--line)',
              color: 'var(--ink)',
              animation: 'bob1 5s ease-in-out infinite',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span className="relative flex items-center justify-center w-2 h-2 shrink-0">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--ok)' }} />
              <span
                className="absolute inset-[-3px] rounded-full"
                style={{
                  border: '1.5px solid var(--ok)',
                  animation: 'pulseRing 1.8s cubic-bezier(0.24, 0, 0.38, 1) infinite',
                }}
              />
            </span>
            <span>Genmax engine active</span>
          </div>

          {/* Main Card 3D Wrap */}
          <div
            ref={cardRef}
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              animation: 'cardEntrance 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards 0.3s',
              opacity: 0,
            }}
          >
            <div
              className="rounded-[22px] overflow-hidden"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--line)',
                boxShadow: '0 30px 60px -28px rgba(30, 27, 120, 0.35)',
              }}
            >
              {/* a) Rank area (padding 22px) */}
              <div className="p-[22px]">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-[12px] font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--muted)' }}
                  >
                    Live Google rankings
                  </span>
                  <span
                    className="inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-full"
                    style={{
                      color: 'var(--ok)',
                      backgroundColor: 'rgba(5, 150, 105, 0.12)',
                      animation: 'pulseGlow 2.5s infinite ease-in-out',
                    }}
                  >
                    #1 position
                  </span>
                </div>

                {/* Keyword rows */}
                <div className="flex flex-col gap-2">
                  <div
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[14px] font-semibold border transition-all duration-200 hover:border-[var(--brand)] hover:translate-x-0.5"
                    style={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--line)',
                      color: 'var(--ink)',
                      animation: 'rowSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.7s',
                      opacity: 0,
                    }}
                  >
                    <span className="flex-1 truncate">local seo services</span>
                    <span className="text-[12px] font-bold" style={{ color: 'var(--ok)' }}>▲ 14</span>
                    <span
                      className="text-[11px] font-bold text-white px-2.5 py-0.5 rounded-full"
                      style={{ background: 'linear-gradient(100deg, var(--brand), var(--brand2))' }}
                    >
                      #1
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[14px] font-semibold border transition-all duration-200 hover:border-[var(--brand)] hover:translate-x-0.5"
                    style={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--line)',
                      color: 'var(--ink)',
                      animation: 'rowSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.85s',
                      opacity: 0,
                    }}
                  >
                    <span className="flex-1 truncate">website development company</span>
                    <span className="text-[12px] font-bold" style={{ color: 'var(--ok)' }}>▲ 9</span>
                    <span
                      className="text-[11px] font-bold text-white px-2.5 py-0.5 rounded-full"
                      style={{ background: 'linear-gradient(100deg, var(--brand), var(--brand2))' }}
                    >
                      #1
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[14px] font-semibold border transition-all duration-200 hover:border-[var(--brand)] hover:translate-x-0.5"
                    style={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--line)',
                      color: 'var(--ink)',
                      animation: 'rowSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 1.0s',
                      opacity: 0,
                    }}
                  >
                    <span className="flex-1 truncate">digital marketing agency</span>
                    <span className="text-[12px] font-bold" style={{ color: 'var(--ok)' }}>▲ 6</span>
                    <span
                      className="text-[11px] font-bold text-white px-2.5 py-0.5 rounded-full"
                      style={{ background: 'linear-gradient(100deg, var(--brand), var(--brand2))' }}
                    >
                      #2
                    </span>
                  </div>
                </div>

                {/* 9-bar animated chart */}
                <div
                  className="h-[76px] flex items-end gap-1.5 my-5 mb-1.5 px-1"
                  aria-label="9-month growth chart"
                >
                  {[
                    { h: '22%', delay: '0.70s' },
                    { h: '30%', delay: '0.79s' },
                    { h: '28%', delay: '0.88s' },
                    { h: '45%', delay: '0.97s' },
                    { h: '52%', delay: '1.06s' },
                    { h: '60%', delay: '1.15s' },
                    { h: '74%', delay: '1.24s' },
                    { h: '88%', delay: '1.33s' },
                    { h: '100%', delay: '1.42s' },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 h-full flex items-end">
                      <div
                        className="w-full rounded-t-[5px] rounded-b-[2px] opacity-85"
                        style={{
                          height: bar.h,
                          background: 'linear-gradient(180deg, var(--brand2), var(--brand))',
                          transformOrigin: 'bottom',
                          transform: 'scaleY(0.1)',
                          animation: 'barGrow 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                          animationDelay: bar.delay,
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-[12px] mb-4 px-0.5" style={{ color: 'var(--muted)' }}>
                  <span>Month 1</span>
                  <span>Calls and direction requests, month 9</span>
                </div>

                {/* Tag chips */}
                <div className="flex gap-2 flex-wrap">
                  <span
                    className="text-[12px] font-semibold px-2.5 py-1.5 rounded-lg text-white"
                    style={{ backgroundColor: 'var(--brand)', border: '1px solid var(--brand)' }}
                  >
                    Local SEO
                  </span>
                  <span
                    className="text-[12px] font-semibold px-2.5 py-1.5 rounded-lg"
                    style={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--line)',
                      color: 'var(--muted)',
                    }}
                  >
                    WooCommerce
                  </span>
                  <span
                    className="text-[12px] font-semibold px-2.5 py-1.5 rounded-lg"
                    style={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--line)',
                      color: 'var(--muted)',
                    }}
                  >
                    Web engineering
                  </span>
                </div>
              </div>

              {/* b) Footer row with circular progress ring */}
              <div
                className="flex items-center gap-4 px-[22px] py-[18px]"
                style={{
                  borderTop: '1px solid var(--line)',
                  backgroundColor: 'var(--surface)',
                }}
              >
                <div
                  className="w-[60px] h-[60px] rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: `conic-gradient(var(--ok) ${ringVal}%, var(--line) 0)`,
                    transition: 'background 0.05s linear',
                  }}
                  aria-label={`PageSpeed ${ringVal}%`}
                >
                  <div
                    className="w-[48px] h-[48px] rounded-full flex items-center justify-center text-[16px] font-semibold"
                    style={{
                      backgroundColor: 'var(--surface)',
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: 'var(--ok)',
                    }}
                  >
                    {ringVal}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="font-bold text-[14px]" style={{ color: 'var(--ink)' }}>
                    Google PageSpeed
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ color: 'var(--muted)' }}>
                    Zero cumulative layout shift
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLiveTest}
                  disabled={isAuditing}
                  className="text-[12px] font-semibold px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer hover:border-[var(--brand)] hover:text-[var(--brand)] shrink-0"
                  style={{
                    borderColor: 'var(--line)',
                    backgroundColor: 'transparent',
                    color: 'var(--ink)',
                    opacity: isAuditing ? 0.6 : 1,
                  }}
                >
                  {isAuditing ? 'Testing...' : 'Live test'}
                </button>
              </div>

            </div>
          </div>

          {/* Floating Chip Bottom-Right */}
          <div
            ref={chipBottomRef}
            className="absolute z-20 flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold shadow-lg pointer-events-none whitespace-nowrap"
            style={{
              bottom: '0px',
              right: '-14px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--line)',
              color: 'var(--ok)',
              animation: 'bob2 5s ease-in-out infinite -2.5s',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span>✓ Free domain (₹999) + 1-year warranty</span>
          </div>

        </div>
      </div>
    </section>
  );
};
