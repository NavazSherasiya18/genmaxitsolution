import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, Search, Smartphone, ShoppingBag, Sparkles, 
  ArrowRight, Play, Pause, ChevronLeft, ChevronRight, 
  CheckCircle2, TrendingUp, ShieldCheck, Zap, 
  Layers, Code2, Globe, Database, Server, Terminal,
  ExternalLink, BarChart3, Star
} from 'lucide-react';

interface ServiceFocusShowcaseProps {
  onOpenAudit: (serviceName?: string) => void;
}

interface CompetencyItem {
  id: string;
  badge: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  accentColor: string;
  auditService: string;
  serviceLink: string;
  stats: { label: string; value: string; change?: string }[];
  highlights: string[];
  techStack: string[];
  visualType: 'saas' | 'seo' | 'mobile' | 'ecommerce' | 'design';
}

const COMPETENCIES: CompetencyItem[] = [
  {
    id: 'saas',
    badge: 'Enterprise Architecture',
    title: 'Enterprise SaaS',
    category: 'Custom Web Engineering',
    tagline: 'High-Concurrency Cloud Platforms & Custom Web Engineering',
    description: 'We architect and build mission-critical multi-tenant SaaS platforms, modern Matx enterprise admin portals, and resilient microservices designed to scale seamlessly across millions of transactions with zero downtime.',
    icon: Cpu,
    gradient: 'from-indigo-600 via-indigo-500 to-cyan-500',
    accentColor: '#4F46E5',
    auditService: 'Custom Web / App Engineering',
    serviceLink: '/services/laravel-development',
    stats: [
      { label: 'Uptime SLA', value: '99.99%', change: 'Enterprise Grade' },
      { label: 'API Latency', value: '< 24ms', change: 'Edge Optimized' },
      { label: 'IP Ownership', value: '100%', change: 'Full Source Code' },
    ],
    highlights: [
      'Multi-tenant database schema & redis caching layer',
      'High-throughput RESTful & GraphQL API gateways',
      'Automated CI/CD pipelines & Docker containerization',
      'Role-based access control (RBAC) & OAuth security',
    ],
    techStack: ['Laravel 11', 'React 19', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    visualType: 'saas',
  },
  {
    id: 'seo',
    badge: 'Organic Dominance',
    title: 'SEO Strategy',
    category: 'Search Engine Dominance',
    tagline: 'Google 3-Pack Domination, E-E-A-T Authority & 0-Penalty Compliance',
    description: 'Transform high-intent search queries into loyal paying customers. From Google Maps local conquest and enterprise technical crawls to algorithmic penalty recovery and semantic entity optimization.',
    icon: Search,
    gradient: 'from-cyan-600 via-teal-500 to-emerald-500',
    accentColor: '#0891B2',
    auditService: 'Local SEO & Google Maps',
    serviceLink: '/services/local-seo',
    stats: [
      { label: 'Maps 3-Pack', value: '#1 Rank', change: 'Top Visibility' },
      { label: 'Call Volume', value: '+240%', change: 'Avg 90-Day Uplift' },
      { label: 'Methodology', value: '100%', change: 'Strictly White-Hat' },
    ],
    highlights: [
      'Hyper-local Google Business Profile (GBP) ranking conquest',
      'Automated sync across 60+ verified directory citations',
      'LocalBusiness & Product JSON-LD structured schema',
      'Algorithmic penalty recovery & toxic backlink disavowal',
    ],
    techStack: ['Google Search Console', 'Schema.org', 'PageSpeed Insights', 'Ahrefs', 'Semrush'],
    visualType: 'seo',
  },
  {
    id: 'mobile',
    badge: 'Mobile Engineering',
    title: 'Custom Mobile Apps',
    category: 'Native & Hybrid Mobile',
    tagline: 'High-Performance iOS & Android Applications Built for Scale',
    description: 'Crafting fluid, responsive mobile experiences for iPhone, iPad, and Android. Engineered with native Swift, Kotlin, and React Native with 100% guaranteed App Store approval and 1-year free warranty.',
    icon: Smartphone,
    gradient: 'from-violet-600 via-indigo-500 to-purple-500',
    accentColor: '#7C3AED',
    auditService: 'iOS & Android Mobile Apps',
    serviceLink: '/services/ios-app-development',
    stats: [
      { label: 'Store Approval', value: '100%', change: 'Guaranteed Pass' },
      { label: 'Render Rate', value: '60 FPS', change: 'Fluid UI Speed' },
      { label: 'Free Warranty', value: '1 Year', change: 'Bug Support' },
    ],
    highlights: [
      'Native Swift (iOS) and Kotlin (Android) architecture',
      'Biometric authentication (FaceID / Fingerprint) & Apple Pay',
      'Real-time WebSocket sync & offline-first data caching',
      'Cross-platform React Native code-sharing efficiency',
    ],
    techStack: ['React Native', 'Swift', 'Kotlin', 'Firebase', 'WebSockets', 'GraphQL'],
    visualType: 'mobile',
  },
  {
    id: 'ecommerce',
    badge: 'Revenue Scaling',
    title: 'eCommerce Stores',
    category: 'WooCommerce & Digital Commerce',
    tagline: 'Ultra-Fast, Scalable Online Stores Engineered for Transactions',
    description: 'We build fast, frictionless eCommerce storefronts that convert visitors into revenue. Complete with customized one-page checkouts, Razorpay/UPI/Stripe integration, and real-time inventory management.',
    icon: ShoppingBag,
    gradient: 'from-emerald-600 via-teal-500 to-cyan-500',
    accentColor: '#059669',
    auditService: 'eCommerce SEO',
    serviceLink: '/services/woocommerce-web-design',
    stats: [
      { label: 'Checkout Load', value: '0.9s', change: 'Sub-second' },
      { label: 'Conversion Lift', value: '+42%', change: 'Optimized Funnel' },
      { label: 'Cart Retention', value: '88%', change: 'Smart Recovery' },
    ],
    highlights: [
      'Custom lightweight WooCommerce theme (zero bloated builders)',
      'Direct Razorpay, Cashfree, UPI, and international Stripe flows',
      'Automated abandoned-cart recovery & transactional WhatsApp',
      'Enterprise inventory sync & warehouse ERP integration',
    ],
    techStack: ['WooCommerce', 'WordPress', 'Next.js', 'Razorpay', 'Stripe', 'Redis'],
    visualType: 'ecommerce',
  },
  {
    id: 'design',
    badge: 'Design Innovation',
    title: 'Website Redesign',
    category: 'Creative UI/UX & Web Performance',
    tagline: 'Award-Worthy Aesthetics with Sub-1.5s Speed Guarantee',
    description: 'Breathe new life into an outdated website. We modernize your brand identity with cutting-edge visual hierarchy, fluid micro-interactions, responsive ergonomics, and free custom domain registration worth ₹999.',
    icon: Sparkles,
    gradient: 'from-amber-500 via-indigo-500 to-cyan-500',
    accentColor: '#F59E0B',
    auditService: 'Custom Website Redesign',
    serviceLink: '/services/website-redesign',
    stats: [
      { label: 'PageSpeed', value: '99/100', change: 'Core Web Vitals' },
      { label: 'Turnaround', value: '7-14 Days', change: 'Agile Delivery' },
      { label: 'Free Domain', value: '₹999', change: 'Included 1 Year' },
    ],
    highlights: [
      'Figma-to-production pixel perfection with custom design tokens',
      'Zero Cumulative Layout Shift (CLS) for optimal Google ranking',
      'Conversion-rate-optimized (CRO) hero & call-to-action funnels',
      'Seamless CMS migration without losing existing SEO rankings',
    ],
    techStack: ['Tailwind CSS', 'Motion/React', 'TypeScript', 'Figma', 'Next.js', 'Vite'],
    visualType: 'design',
  },
];

export const ServiceFocusShowcase: React.FC<ServiceFocusShowcaseProps> = ({ onOpenAudit }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const CYCLE_DURATION = 6000; // 6 seconds per competency
  const activeCompetency = COMPETENCIES[activeIdx];

  // Auto-cycling timer with smooth progress bar
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 50; // update progress every 50ms
    const step = (intervalTime / CYCLE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIdx((current) => (current + 1) % COMPETENCIES.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, activeIdx]);

  const handleSelect = (idx: number) => {
    setActiveIdx(idx);
    setProgress(0);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % COMPETENCIES.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + COMPETENCIES.length) % COMPETENCIES.length);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <section 
      ref={containerRef}
      className="py-24 relative overflow-hidden bg-slate-50/70 dark:bg-[#070b16] transition-colors duration-300"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      aria-label="Core Service Focus Showcase"
    >
      {/* Background ambient lighting */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-30 dark:opacity-20 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${activeCompetency.accentColor} 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-xs font-semibold text-indigo-600 dark:text-cyan-400 mb-3 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Dynamic Competency Engine</span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span>Autonomous Rotation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-slate-900 dark:text-white tracking-tight">
              State-Driven <span className="gradient-text">Service Focus</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mt-2 leading-relaxed">
              Explore how Genmax IT Solution delivers architectural rigor, technical SEO supremacy, and bespoke engineering across every domain.
            </p>
          </div>

          {/* Player controls (Prev, Pause/Play, Next, Indicators) */}
          <div className="flex items-center gap-3 self-start md:self-end bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xs">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Previous competency"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlayPause}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label={isPlaying ? 'Pause auto-cycle' : 'Resume auto-cycle'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Next competency"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Category Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {COMPETENCIES.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = activeIdx === idx;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(idx)}
                className={`group relative text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-indigo-500/80 dark:border-cyan-400/80 shadow-lg shadow-indigo-500/10'
                    : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Active progress indicator bar on the active tab */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-75 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0 ${
                      isSelected
                        ? 'bg-gradient-to-br from-indigo-600 to-cyan-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                      {item.badge}
                    </div>
                    <div className={`text-sm font-bold font-heading truncate ${
                      isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {item.title}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Stage: Animated Focus Transition Canvas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCompetency.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-10 lg:p-12 relative"
          >
            {/* Top Accent Line */}
            <div 
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{
                background: `linear-gradient(90deg, ${activeCompetency.accentColor}, #22D3EE, ${activeCompetency.accentColor})`,
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Deep Information & Highlights */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-cyan-300">
                    {activeCompetency.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    INDEX // 0{activeIdx + 1}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-slate-900 dark:text-white leading-tight">
                    {activeCompetency.tagline}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                    {activeCompetency.description}
                  </p>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  {activeCompetency.stats.map((stat, i) => (
                    <div key={i} className="text-left">
                      <div className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white" style={{ color: activeCompetency.accentColor }}>
                        {stat.value}
                      </div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                        {stat.label}
                      </div>
                      {stat.change && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {stat.change}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bullet Highlights */}
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Key Deliverables & Advantages
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeCompetency.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technology Badges */}
                <div className="pt-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Engineered With
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeCompetency.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-300 shadow-2xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={() => onOpenAudit(activeCompetency.auditService)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-200" />
                    <span>Request Free Audit for {activeCompetency.title}</span>
                  </button>

                  <Link
                    to={activeCompetency.serviceLink}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700"
                  >
                    <span>Deep Dive Service Scope</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>

              {/* Right Column: Interactive Domain Canvas Simulation */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 text-white shadow-2xl relative overflow-hidden">
                  
                  {/* Decorative glowing gradient orb */}
                  <div 
                    className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
                    style={{ backgroundColor: activeCompetency.accentColor }}
                  />

                  {/* Window Bar Header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 font-mono text-slate-300 text-[11px]">genmax-engine://{activeCompetency.id}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE
                    </span>
                  </div>

                  {/* Contextual Visualizer Per Competency */}
                  {activeCompetency.visualType === 'saas' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Microservice Cluster</span>
                        <span className="text-cyan-400 font-mono">cluster-delhi-01 // Active</span>
                      </div>

                      {/* Live Nodes status */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                          <div className="text-[10px] text-slate-400 uppercase">Throughput</div>
                          <div className="text-lg font-mono font-bold text-white mt-1">14,280 req/s</div>
                          <div className="text-[10px] text-emerald-400 mt-1">▲ 99.98% Success</div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                          <div className="text-[10px] text-slate-400 uppercase">Redis Cache Hit</div>
                          <div className="text-lg font-mono font-bold text-cyan-400 mt-1">98.4% Hit Rate</div>
                          <div className="text-[10px] text-slate-400 mt-1">1.2ms Avg Retrieval</div>
                        </div>
                      </div>

                      {/* Terminal Code Snippet */}
                      <div className="p-3 rounded-xl bg-black/60 font-mono text-[11px] text-slate-300 space-y-1 border border-slate-800">
                        <div className="text-slate-500">// Scalable Multi-Tenant Architecture</div>
                        <div><span className="text-purple-400">Route</span>::<span className="text-cyan-400">middleware</span>([<span className="text-amber-300">'tenant.enforce'</span>, <span className="text-amber-300">'rate.limit:500'</span>]);</div>
                        <div><span className="text-indigo-400">const</span> cluster = <span className="text-cyan-400">await</span> genmax.spawnNode(<span className="text-amber-300">'india-primary'</span>);</div>
                        <div className="text-emerald-400">✓ All 12 Microservices Healthy & Synced</div>
                      </div>
                    </div>
                  )}

                  {activeCompetency.visualType === 'seo' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Google SERP Dominance</span>
                        <span className="text-emerald-400 font-mono">Geo: Sector 62, Noida</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white">Google 3-Pack Target</span>
                          <span className="text-emerald-400 font-bold">Position #1</span>
                        </div>
                        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full w-[94%]" />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Visibility: 94.2%</span>
                          <span>CTR: 38.6% (Industry avg: 12%)</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700">
                          <div className="text-slate-400 text-[10px]">Indexed Pages</div>
                          <div className="font-mono font-bold text-white mt-0.5">1,480 / 1,480</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700">
                          <div className="text-slate-400 text-[10px]">Avg Domain Rating</div>
                          <div className="font-mono font-bold text-cyan-400 mt-0.5">DR 58 (+22)</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeCompetency.visualType === 'mobile' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Mobile Build Pipeline</span>
                        <span className="text-violet-400 font-mono">iOS & Android Ready</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-white">App Store Connect</div>
                          <div className="text-[10px] text-emerald-400 mt-0.5">● Ready for Sale (v2.4.0)</div>
                        </div>
                        <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                          Approved
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-white">Google Play Console</div>
                          <div className="text-[10px] text-emerald-400 mt-0.5">● Production Release Active</div>
                        </div>
                        <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                          Live 100%
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-black/60 font-mono text-[11px] text-slate-300 space-y-0.5 border border-slate-800">
                        <div><span className="text-violet-400">Device</span>: iPhone 16 Pro & Galaxy S24</div>
                        <div><span className="text-cyan-400">Frame Budget</span>: 16.6ms @ 60 FPS ✓</div>
                        <div><span className="text-emerald-400">Crash-Free Rate</span>: 99.94%</div>
                      </div>
                    </div>
                  )}

                  {activeCompetency.visualType === 'ecommerce' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Checkout Conversion Engine</span>
                        <span className="text-emerald-400 font-mono">₹48,200/hr Velocity</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                          <div className="text-[10px] text-slate-400 uppercase">Conversion Rate</div>
                          <div className="text-lg font-mono font-bold text-emerald-400 mt-1">4.82%</div>
                          <div className="text-[10px] text-slate-300 mt-1">+1.4% vs Industry</div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                          <div className="text-[10px] text-slate-400 uppercase">Payment Success</div>
                          <div className="text-lg font-mono font-bold text-white mt-1">99.4%</div>
                          <div className="text-[10px] text-cyan-400 mt-1">Razorpay & UPI</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-black/60 font-mono text-[11px] text-slate-300 space-y-1 border border-slate-800">
                        <div className="text-slate-400 flex justify-between">
                          <span>Order #49201</span>
                          <span className="text-emerald-400">Paid · ₹3,499</span>
                        </div>
                        <div className="text-slate-400 flex justify-between">
                          <span>Order #49202</span>
                          <span className="text-emerald-400">Paid · ₹8,150</span>
                        </div>
                        <div className="text-cyan-400 text-[10px] pt-1">
                          ⚡ 1-Click Checkout with Automated WhatsApp Confirmation
                        </div>
                      </div>
                    </div>
                  )}

                  {activeCompetency.visualType === 'design' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Lighthouse Performance Audit</span>
                        <span className="text-amber-400 font-mono">Score: 99 / 100</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                          <div className="text-lg font-bold font-mono text-emerald-400">99</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Performance</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                          <div className="text-lg font-bold font-mono text-emerald-400">100</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Accessibility</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                          <div className="text-lg font-bold font-mono text-emerald-400">100</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">SEO Score</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-black/60 font-mono text-[11px] text-slate-300 space-y-1 border border-slate-800">
                        <div className="text-emerald-400">✓ First Contentful Paint: 0.6s</div>
                        <div className="text-emerald-400">✓ Cumulative Layout Shift: 0.00</div>
                        <div className="text-cyan-400">✓ Includes Free Domain (₹999) + 1-Year Warranty</div>
                      </div>
                    </div>
                  )}

                  {/* Footer status link */}
                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>Verified Production Pipeline</span>
                    <button
                      onClick={() => onOpenAudit(activeCompetency.auditService)}
                      className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Queue Diagnostic Audit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>

            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
