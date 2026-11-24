import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Globe, ShoppingBag, Terminal } from 'lucide-react';

interface EngineeredHeroSectionProps {
  onOpenAudit: (serviceName?: string) => void;
}

type HeroServiceTabId = 'local-seo' | 'woocommerce' | 'web-engineering';

interface HeroServiceTabConfig {
  id: HeroServiceTabId;
  label: string;
  headerTitle: string;
  headerBadge: string;
  rows: { title: string; sub: string; delta: string; pill: string }[];
  bars: number[];
  axisLeft: string;
  axisRight: string;
  summary: string;
  deliverables: string[];
  serviceSlug: string;
  serviceCta: string;
  auditPrefill: string;
  footerScore: number;
  footerTitle: string;
  footerSub: string;
}

const HERO_SERVICE_TABS: Record<HeroServiceTabId, HeroServiceTabConfig> = {
  'local-seo': {
    id: 'local-seo',
    label: 'Local SEO',
    headerTitle: 'Live Google rankings',
    headerBadge: '#1 position',
    rows: [
      {
        title: 'local seo services',
        sub: 'Google Map 3-Pack · 420+ monthly calls',
        delta: '▲ 14',
        pill: '#1',
      },
      {
        title: 'website development company',
        sub: 'High-intent city landing pages · Local Schema',
        delta: '▲ 9',
        pill: '#1',
      },
      {
        title: 'digital marketing agency',
        sub: '60+ verified NAP citations & review velocity',
        delta: '▲ 6',
        pill: '#2',
      },
    ],
    bars: [22, 30, 28, 45, 52, 60, 74, 88, 100],
    axisLeft: 'Month 1',
    axisRight: 'Calls and direction requests, month 9',
    summary:
      'Capture high-intent local buyers on Google Maps 3-Pack with GBP verification, city schema, and automated review velocity.',
    deliverables: [
      'Google Business Profile full category & Geo-grid ranking setup',
      '60+ clean local directory NAP citations & duplicate suppression',
      'Automated WhatsApp/SMS 5-star review pipeline for local trust',
    ],
    serviceSlug: '/services/local-seo',
    serviceCta: 'Explore Local SEO details',
    auditPrefill: 'Local SEO & Google Maps',
    footerScore: 99,
    footerTitle: 'Google PageSpeed',
    footerSub: 'Zero cumulative layout shift',
  },
  woocommerce: {
    id: 'woocommerce',
    label: 'WooCommerce',
    headerTitle: 'WooCommerce store telemetry',
    headerBadge: '3.8% CVR · Live',
    rows: [
      {
        title: 'Custom Headless Product Catalog',
        sub: '2,400+ SKUs indexed · Zero bloated builders',
        delta: '▲ +42% CVR',
        pill: '0.8s',
      },
      {
        title: 'Razorpay / Stripe 1-Click Checkout',
        sub: 'UPI, cards & instant GST invoice sync',
        delta: '▼ -38% Drop',
        pill: 'Active',
      },
      {
        title: 'Redis Object Cache & ERP Inventory',
        sub: 'Live stock sync (Tally / Zoho / Shiprocket)',
        delta: '▲ 99.4%',
        pill: 'Cached',
      },
    ],
    bars: [18, 29, 36, 48, 63, 71, 82, 91, 100],
    axisLeft: 'Week 1',
    axisRight: 'Paid checkout volume & store speed, week 9',
    summary:
      'High-converting custom WooCommerce stores engineered for fast SKU search, frictionless UPI/card checkout, and ERP sync.',
    deliverables: [
      'Custom lightweight PHP & React storefront (zero slow page builders)',
      'Native Razorpay / Stripe / Shiprocket shipping & webhook integration',
      'Sub-1.2s product filtering backed by Redis & Elasticsearch indexing',
    ],
    serviceSlug: '/services/woocommerce-development',
    serviceCta: 'Explore WooCommerce specs',
    auditPrefill: 'WordPress / WooCommerce',
    footerScore: 97,
    footerTitle: 'Storefront Core Vitals',
    footerSub: '0.8s TTFB · Redis object cached',
  },
  'web-engineering': {
    id: 'web-engineering',
    label: 'Web engineering',
    headerTitle: 'Production stack & API latency',
    headerBadge: '99.98% Uptime',
    rows: [
      {
        title: 'React 19 + TypeScript & Next.js SSR',
        sub: 'Modular edge-rendered UI with strict type safety',
        delta: '18ms Edge',
        pill: 'v19',
      },
      {
        title: 'Laravel / Node.js High-Load APIs',
        sub: 'PostgreSQL query tuning & queued background jobs',
        delta: '12k req/s',
        pill: '0 Errors',
      },
      {
        title: 'OWASP Auth, RBAC & CI/CD Security',
        sub: 'Automated regression tests & TLS 1.3 hardening',
        delta: 'Verified',
        pill: 'SOC-Ready',
      },
    ],
    bars: [34, 42, 50, 58, 68, 77, 86, 94, 100],
    axisLeft: 'Sprint 1',
    axisRight: 'System throughput & release stability, sprint 9',
    summary:
      'Mission-critical custom web apps, SaaS portals, and enterprise software architected for zero-downtime scale and maintainability.',
    deliverables: [
      'Strict TypeScript frontend paired with clean REST/GraphQL backends',
      'Automated database indexing, connection pooling & edge CDN caching',
      'Complete source handoff, technical docs & 1-year engineering support',
    ],
    serviceSlug: '/services/website-development',
    serviceCta: 'Explore Engineering stack',
    auditPrefill: 'Custom Web / App Engineering',
    footerScore: 100,
    footerTitle: 'Architecture Lighthouse',
    footerSub: 'Zero blocking scripts · Edge SSR',
  },
};

const TAB_ORDER: HeroServiceTabId[] = ['local-seo', 'woocommerce', 'web-engineering'];

export const EngineeredHeroSection: React.FC<EngineeredHeroSectionProps> = ({ onOpenAudit }) => {
  const heroRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const chipTopRef = useRef<HTMLDivElement>(null);
  const chipBottomRef = useRef<HTMLDivElement>(null);

  // Active Interactive Console Tab
  const [activeTab, setActiveTab] = useState<HeroServiceTabId>('local-seo');
  const activeData = HERO_SERVICE_TABS[activeTab];

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

  // Animate circular ring smoothly whenever active tab changes
  useEffect(() => {
    setRingVal(activeData.footerScore);
  }, [activeData.footerScore]);

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

  // Live test button interaction tailored to selected tab
  const handleLiveTest = () => {
    const targetScore = activeData.footerScore;
    setIsAuditing(true);
    setRingVal(0);

    setTimeout(() => {
      const startTime = performance.now();
      const duration = 1000;

      const animate = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setRingVal(Math.round(targetScore * easeOut));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setRingVal(targetScore);
          setIsAuditing(false);
        }
      };

      requestAnimationFrame(animate);
    }, 220);
  };

  const renderTabIcon = (tabId: HeroServiceTabId) => {
    if (tabId === 'local-seo') return <Globe className="w-3.5 h-3.5 shrink-0" />;
    if (tabId === 'woocommerce') return <ShoppingBag className="w-3.5 h-3.5 shrink-0" />;
    return <Terminal className="w-3.5 h-3.5 shrink-0" />;
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-label="Hero section"
      className="genmax-hero relative min-h-[820px] overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24"
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
          opacity: 0.16,
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
          opacity: 0.14,
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
        className="relative mx-auto w-full grid grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
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
                background: 'var(--genmax-spectrum)',
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
              onClick={() => onOpenAudit(activeData.auditPrefill)}
              type="button"
              className="genmax-action relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl px-6 py-[15px] text-[15px] font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 sm:w-auto"
              style={{
                color: '#ffffff',
                boxShadow: '0 10px 24px -8px var(--color-indigo-500)',
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
              className="inline-flex w-full items-center justify-center rounded-xl px-6 py-[15px] text-[15px] font-semibold shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--brand)] sm:w-auto"
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
            className="grid grid-cols-3 pt-[22px] pr-12 sm:max-w-[520px] sm:pr-0"
            style={{
              borderTop: '1px solid var(--line)',
              animation: 'heroRise 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.48s',
              opacity: 0,
            }}
          >
            <div className="pr-4 relative border-r border-[var(--line)]">
              <div
                className="font-semibold text-[clamp(20px,5.6vw,28px)] leading-[1.1]"
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
                className="font-semibold text-[clamp(20px,5.6vw,28px)] leading-[1.1]"
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
                className="font-semibold text-[clamp(20px,5.6vw,28px)] leading-[1.1]"
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
            className="absolute left-0 z-20 flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap shadow-lg pointer-events-none sm:-left-[22px]"
            style={{
              top: '-16px',
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
            <div className="genmax-card rounded-[22px] overflow-hidden">
              {/* a) Dynamic Console Area */}
              <div className="p-[22px]">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-[12px] font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--muted)' }}
                  >
                    {activeData.headerTitle}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-full"
                    style={{
                      color: 'var(--ok)',
                      backgroundColor: 'rgba(5, 150, 105, 0.12)',
                      animation: 'pulseGlow 2.5s infinite ease-in-out',
                    }}
                  >
                    {activeData.headerBadge}
                  </span>
                </div>

                {/* Dynamic Feature / Metric Rows */}
                <div key={activeData.id} className="flex flex-col gap-2">
                  {activeData.rows.map((row) => (
                    <div
                      key={row.title}
                      className="genmax-card genmax-card-soft flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[var(--ink)] transition-colors duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-[13.5px] font-semibold truncate">{row.title}</div>
                        <div className="text-[11px] truncate" style={{ color: 'var(--muted)' }}>
                          {row.sub}
                        </div>
                      </div>
                      <span className="text-[11.5px] font-bold whitespace-nowrap" style={{ color: 'var(--ok)' }}>
                        {row.delta}
                      </span>
                      <span
                        className="text-[11px] font-bold text-white px-2.5 py-0.5 rounded-full whitespace-nowrap"
                        style={{ background: 'var(--genmax-action)' }}
                      >
                        {row.pill}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 9-bar dynamic growth chart */}
                <div
                  className="h-[72px] flex items-end gap-1.5 mt-4 mb-1.5 px-1"
                  aria-label={`${activeData.label} 9-step growth chart`}
                >
                  {activeData.bars.map((heightPct, idx) => (
                    <div key={`${activeData.id}-bar-${idx}`} className="flex-1 h-full flex items-end">
                      <div
                        className="w-full rounded-t-[5px] rounded-b-[2px] opacity-85 transition-all duration-500 ease-out"
                        style={{
                          height: `${heightPct}%`,
                          background: 'linear-gradient(180deg, var(--brand2), var(--brand))',
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-[11.5px] mb-4 px-0.5" style={{ color: 'var(--muted)' }}>
                  <span>{activeData.axisLeft}</span>
                  <span>{activeData.axisRight}</span>
                </div>

                {/* Interactive Service Mode Switcher Buttons */}
                <div className="flex gap-2 flex-wrap mb-3.5" role="tablist" aria-label="Service focus capabilities">
                  {TAB_ORDER.map((tabId) => {
                    const tabCfg = HERO_SERVICE_TABS[tabId];
                    const isSelected = activeTab === tabId;
                    return (
                      <button
                        key={tabId}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => setActiveTab(tabId)}
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                        style={
                          isSelected
                            ? {
                                background: 'var(--genmax-action)',
                                border: '1px solid var(--line)',
                                color: '#ffffff',
                                boxShadow: '0 6px 14px -4px var(--glow)',
                              }
                            : {
                                backgroundColor: 'var(--surface)',
                                border: '1px solid var(--line)',
                                color: 'var(--ink)',
                              }
                        }
                      >
                        {renderTabIcon(tabId)}
                        <span>{tabCfg.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Detailed Breakdown Card for Active Button */}
                <div
                  className="genmax-card genmax-card-soft p-3.5 rounded-xl space-y-2"
                >
                  <p className="text-[12px] leading-relaxed" style={{ color: 'var(--ink)' }}>
                    {activeData.summary}
                  </p>
                  <ul className="space-y-1">
                    {activeData.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-1.5 text-[11.5px]"
                        style={{ color: 'var(--muted)' }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--ok)' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-1.5 flex items-center justify-between gap-2 border-t" style={{ borderColor: 'var(--line)' }}>
                    <Link
                      to={activeData.serviceSlug}
                      className="inline-flex items-center gap-1 text-[11.5px] font-bold hover:underline"
                      style={{ color: 'var(--brand)' }}
                    >
                      <span>{activeData.serviceCta}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onOpenAudit(activeData.auditPrefill)}
                      className="text-[11px] font-semibold hover:underline cursor-pointer"
                      style={{ color: 'var(--muted)' }}
                    >
                      Request {activeData.label} Audit
                    </button>
                  </div>
                </div>
              </div>

              {/* b) Footer row with dynamic circular progress ring */}
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
                  aria-label={`${activeData.footerTitle} ${ringVal}%`}
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
                    {activeData.footerTitle}
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ color: 'var(--muted)' }}>
                    {activeData.footerSub}
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
            className="absolute -bottom-6 right-0 z-20 flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap shadow-lg pointer-events-none sm:-right-3.5"
            style={{
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
