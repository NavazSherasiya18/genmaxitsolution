import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ArrowRight, ShieldCheck, Sparkles, AlertCircle, Target } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FreeAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

// Dynamic Mapping: Primary Service Focus -> Contextual Top Goals
export const SERVICE_GOALS_MAP: Record<string, { label: string; goals: string[] }> = {
  'ecommerce-seo': {
    label: 'eCommerce SEO',
    goals: [
      'Rank High-Intent Category & Product Pages',
      'Scale Organic eCommerce Sales & Revenue',
      'Fix Duplicate Content & Faceted URL Indexing',
      'Optimize Product Schema & Rich Snippets',
      'Lower Customer Acquisition Cost (CAC)',
    ],
  },
  'local-seo': {
    label: 'Local SEO & Google Maps',
    goals: [
      'Rank in Google Maps 3-Pack',
      'Increase Inbound Phone Calls & Directions',
      'Optimize Google Business Profile (GBP)',
      'Fix NAP & Sync 60+ Local Citations',
      'Outrank Local Area Competitors',
    ],
  },
  'technical-seo': {
    label: 'Comprehensive SEO & Penalty Recovery',
    goals: [
      'Rank #1 for Competitive Industry Keywords',
      'Recover from Google Algorithm Penalty (Core/Spam)',
      'Fix Core Web Vitals & Crawlability Errors',
      'Audit & Disavow Toxic Backlink Profile',
      'Outrank High-Authority Domain Competitors',
    ],
  },
  'website-redesign': {
    label: 'Custom Website Redesign',
    goals: [
      'Modernize Outdated Brand Design & UX',
      'Achieve Sub-1.5s Load Time & 99+ PageSpeed',
      'Boost Visitor-to-Lead Conversion Rate (CRO)',
      '100% Mobile & Tablet Responsive Architecture',
      'Migrate Platform with Zero Ranking/Traffic Loss',
    ],
  },
  'wordpress-woocommerce': {
    label: 'WordPress / WooCommerce',
    goals: [
      'Build High-Converting Custom WooCommerce Store',
      'Fix Plugin Conflicts, Database Bloat & Core Web Vitals',
      'Custom Theme Development & Gutenberg Blocks',
      'Automate Payment Gateway & Inventory Sync',
      'Harden Enterprise WordPress Security',
    ],
  },
  'custom-web-engineering': {
    label: 'Custom Web / App Engineering',
    goals: [
      'Build Scalable Custom SaaS or Enterprise Web App',
      'Modernize Legacy PHP/CodeIgniter/Matx Codebase',
      'Database Optimization & High-Concurrency Architecture',
      'Integrate Custom 3rd-Party APIs & Payment Gateways',
      'End-to-End Enterprise Code Security & Audit',
    ],
  },
  'mobile-app-development': {
    label: 'iOS & Android Mobile Apps',
    goals: [
      'Build Native iOS & Android Apps from Scratch',
      'Pass App Store & Google Play Review Rapidly',
      'Optimize App Performance, UI & User Retention',
      'Real-Time Push Notifications & Offline Sync',
      'In-App Subscriptions & Monetization Architecture',
    ],
  },
  'ppc-management': {
    label: 'PPC Management & Paid Ads',
    goals: [
      'Reduce Cost-Per-Click (CPC) & Maximize ROAS',
      'Eliminate Ad Spend Waste on Non-Converting Keywords',
      'High-Converting Landing Page Design & A/B Testing',
      'Scale Google Search & Meta Remarketing Campaigns',
      'Accurate Server-Side Pixel & Conversion Tracking',
    ],
  },
  'reputation-management': {
    label: 'Online Reputation Management',
    goals: [
      'Suppress Negative Search Results & Unwanted Links',
      'Acquire 5-Star Reviews on Google & Trustpilot',
      'Protect Brand Equity & Executive Search Results',
      'Proactive Real-Time Sentiment Monitoring',
    ],
  },
};

// Helper to match service string to a service key
const findServiceKey = (serviceName?: string): string => {
  if (!serviceName) return 'ecommerce-seo';
  const lower = serviceName.toLowerCase();
  if (lower.includes('ecom') || lower.includes('store') || lower.includes('woo')) {
    if (lower.includes('word') || lower.includes('development')) return 'wordpress-woocommerce';
    return 'ecommerce-seo';
  }
  if (lower.includes('local') || lower.includes('maps') || lower.includes('gbp')) return 'local-seo';
  if (lower.includes('word')) return 'wordpress-woocommerce';
  if (lower.includes('redesign') || lower.includes('design') || lower.includes('responsive')) return 'website-redesign';
  if (lower.includes('laravel') || lower.includes('codeigniter') || lower.includes('matx') || lower.includes('engineer') || lower.includes('software')) return 'custom-web-engineering';
  if (lower.includes('app') || lower.includes('mobile') || lower.includes('ios') || lower.includes('android')) return 'mobile-app-development';
  if (lower.includes('ppc') || lower.includes('ad') || lower.includes('paid')) return 'ppc-management';
  if (lower.includes('reputation') || lower.includes('orm') || lower.includes('review')) return 'reputation-management';
  if (lower.includes('seo') || lower.includes('audit')) return 'technical-seo';
  return 'ecommerce-seo';
};

export const FreeAuditModal: React.FC<FreeAuditModalProps> = ({
  isOpen,
  onClose,
  defaultService = 'eCommerce SEO',
}) => {
  const initialKey = findServiceKey(defaultService);
  const [selectedServiceKey, setSelectedServiceKey] = useState<string>(initialKey);

  const [formData, setFormData] = useState({
    websiteUrl: '',
    fullName: '',
    email: '',
    phone: '',
    serviceInterest: SERVICE_GOALS_MAP[initialKey]?.label || 'eCommerce SEO',
    targetGoal: SERVICE_GOALS_MAP[initialKey]?.goals[0] || 'Rank High-Intent Category & Product Pages',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Whenever modal opens or defaultService changes, synchronize state
  useEffect(() => {
    if (isOpen) {
      const key = findServiceKey(defaultService);
      setSelectedServiceKey(key);
      const service = SERVICE_GOALS_MAP[key];
      setFormData((prev) => ({
        ...prev,
        serviceInterest: service?.label || defaultService,
        targetGoal: service?.goals[0] || 'Rank High-Intent Category & Product Pages',
      }));
      setErrorMsg('');
    }
  }, [isOpen, defaultService]);

  // Dynamic Service Focus Change Handler
  const handleServiceChange = (newServiceKey: string) => {
    setSelectedServiceKey(newServiceKey);
    const service = SERVICE_GOALS_MAP[newServiceKey];
    const newGoals = service?.goals || [];
    const defaultGoalForNewService = newGoals[0] || 'Rank #1 on Google';

    setFormData((prev) => ({
      ...prev,
      serviceInterest: service?.label || newServiceKey,
      targetGoal: defaultGoalForNewService, // Automatically updates Top Goal properly!
    }));
  };

  if (!isOpen) return null;

  const currentGoals = SERVICE_GOALS_MAP[selectedServiceKey]?.goals || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Form validation
    if (!formData.websiteUrl.trim()) {
      setErrorMsg('Please enter your website URL or business domain.');
      return;
    }
    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid work or personal email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('Please provide a contact phone or WhatsApp number.');
      return;
    }

    setIsSubmitting(true);

    // Simulate real submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366F1', '#22D3EE', '#A78BFA'],
        });
      } catch {
        // Fallback gracefully
      }
    }, 900);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-indigo-500/15 to-transparent blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 dark:bg-cyan-500/10 border border-emerald-200 dark:border-cyan-500/30 flex items-center justify-center text-emerald-600 dark:text-cyan-400">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white mb-2">
              Audit Request Received
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Thank you, <strong className="text-slate-900 dark:text-white">{formData.fullName}</strong>. Our Senior Technical SEO & Engineering team has queued{' '}
              <span className="text-indigo-600 dark:text-cyan-400 font-medium">{formData.websiteUrl}</span> for an in-depth diagnostic audit. We will deliver your bespoke PDF report and recommendations within 2 business hours.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-left mb-6 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Primary Service:</span>
                <span className="text-slate-900 dark:text-slate-200 font-medium">{formData.serviceInterest}</span>
              </div>
              <div className="flex justify-between">
                <span>Top Target Goal:</span>
                <span className="text-indigo-600 dark:text-cyan-400 font-medium">{formData.targetGoal}</span>
              </div>
              <div className="flex justify-between">
                <span>Contact Email:</span>
                <span className="text-slate-900 dark:text-slate-200 font-medium">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Target SLA:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Under 2 Hours</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 px-6 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:opacity-95 transition-opacity cursor-pointer"
            >
              Done & Return to Site
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero Cost · 100% Confidential</span>
              </div>
              <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                Request Your Free SEO & Website Audit
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Receive an actionable 25-point breakdown covering technical crawlability, Core Web Vitals, backlink health, and competitor gaps.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Website URL / Domain *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. yourcompany.com"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 99383 07637"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Work Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* DYNAMIC FIELD PAIR: Primary Service Focus & Top Goal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Primary Service Focus
                  </label>
                  <select
                    value={selectedServiceKey}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 transition-colors cursor-pointer"
                  >
                    {Object.entries(SERVICE_GOALS_MAP).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      Top Goal
                    </label>
                    <span className="text-[10px] text-indigo-600 dark:text-cyan-400 font-medium inline-flex items-center gap-0.5">
                      <Target className="w-2.5 h-2.5" />
                      <span>Dynamic</span>
                    </span>
                  </div>
                  <select
                    value={formData.targetGoal}
                    onChange={(e) => setFormData({ ...formData, targetGoal: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-indigo-200 dark:border-indigo-500/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 transition-colors cursor-pointer shadow-2xs"
                  >
                    {currentGoals.map((goal, idx) => (
                      <option key={idx} value={goal}>
                        {goal}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 text-white font-semibold text-sm hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Generate My Free Audit Report</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                <span>Zero obligation · No credit card required · NDA protected</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
