import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowRight, Sparkles, TrendingUp, ShieldCheck, CheckCircle2, 
  ChevronRight, Search, BarChart3, Globe, Smartphone, 
  Code2, Palette, Zap, Star, MessageSquare, Plus, Minus,
  Layers, Trophy, Clock, Cpu
} from 'lucide-react';
import { 
  COMPANY_DETAILS, SERVICES, PRICING_PLANS, WHY_CHOOSE_US, 
  CASE_STUDIES, TESTIMONIALS, GENERAL_FAQS, CLIENT_LOGOS 
} from '../data/websiteContent';
import { HeroVisualHub } from '../components/sections/HeroVisualHub';
import { EngineeredHeroSection } from '../components/sections/EngineeredHeroSection';
import { TrustedBySection } from '../components/sections/TrustedBySection';
import { ServiceFocusShowcase } from '../components/sections/ServiceFocusShowcase';
import { FeaturedProjectsSection } from '../components/sections/FeaturedProjectsSection';
import { SpotlightCard } from '../components/animations/SpotlightCard';
import { AnimatedCounter } from '../components/animations/AnimatedCounter';
import { RoiCalculator } from '../components/sections/RoiCalculator';
import { TechStackTabs } from '../components/sections/TechStackTabs';
import { ScrollReveal } from '../components/animations/ScrollReveal';
import { GoogleMapsSection } from '../components/maps/GoogleMapsSection';

interface HomePageProps {
  onOpenAudit: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenAudit }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  // Quick audit form on the page
  const [quickAuditUrl, setQuickAuditUrl] = useState('');
  const [quickAuditEmail, setQuickAuditEmail] = useState('');
  const [quickAuditSuccess, setQuickAuditSuccess] = useState(false);

  const handleQuickAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickAuditUrl && quickAuditEmail) {
      setQuickAuditSuccess(true);
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#F8FAFC] dark:bg-[#0B1020] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* ---------------- 1. SPECIFICATION HERO SECTION ---------------- */}
      <EngineeredHeroSection onOpenAudit={onOpenAudit} />

      {/* ---------------- 2. SPECIFICATION TRUSTED BY SECTION ---------------- */}
      <TrustedBySection />

      {/* ---------------- 3. DYNAMIC STATE-DRIVEN SERVICE FOCUS SHOWCASE ---------------- */}
      <ScrollReveal yOffset={32} duration={850} threshold={0.08}>
        <ServiceFocusShowcase onOpenAudit={onOpenAudit} />
      </ScrollReveal>

      {/* ---------------- 4. INTERACTIVE ROI & GROWTH CALCULATOR ---------------- */}
      <ScrollReveal yOffset={28} duration={800} threshold={0.1}>
        <section className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RoiCalculator onOpenAudit={onOpenAudit} />
          </div>
        </section>
      </ScrollReveal>

      {/* ---------------- 5. ABOUT COMPANY & STORY (SPLIT SCREEN) ---------------- */}
      <ScrollReveal yOffset={30} duration={800} threshold={0.1}>
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Image Asset */}
              <div className="lg:col-span-5 relative">
                <div className="rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-xl relative group">
                  <img
                    src="/src/assets/images/agency_workspace_1793853537773.jpg"
                    alt="Genmax IT Solution engineering team collaborating"
                    className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-md">
                    <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
                      Headquartered in Noida, Delhi NCR
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      Serving Ambitious Enterprises Across India & Worldwide
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Original Story & Values */}
              <div className="lg:col-span-7 space-y-6">
                <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest">
                  About Genmax IT Solution
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 dark:text-white">
                  We Combine Technical Rigor with Sustainable Growth Strategies
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    Genmax IT Solution is a full-service digital marketing agency, custom web design studio, and software development company based in Noida, Delhi NCR.
                  </p>
                  <p>
                    We founded Genmax with a straightforward mission: eliminate the empty promises, bloated page builders, and black-hat tactics that plague the digital agency industry. Instead, we provide transparent, data-driven engineering that directly increases your qualified inquiries, sales volume, and search authority.
                  </p>
                  <p>
                    From fast 7-14 business day turnarounds to 365 days of free post-launch support and 100% white-hat SEO compliance, we act as a true long-term technical partner for your enterprise.
                  </p>
                </div>

                {/* Four Value Anchors */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">Data-Driven Execution</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Concrete analytics, keyword telemetry, and measurable ROI.</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">Ethical White-Hat</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Strict adherence to Google search quality standards.</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">Agile Engineering</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Rapid bi-weekly sprints with interactive preview milestones.</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">365-Day Commitment</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">1 year of complimentary technical support with every project.</div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300"
                  >
                    <span>Read Our Full Story & Meet the Leadership</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ---------------- 6. INTERACTIVE TECH STACK EXPLORER ---------------- */}
      <ScrollReveal yOffset={28} duration={800} threshold={0.1}>
        <section className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest mb-2">
                Technology Standards
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                Modern Full-Stack Engineering Hub
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Explore the battle-tested frameworks and architectures powering every solution we deploy.
              </p>
            </div>

            <TechStackTabs />
          </div>
        </section>
      </ScrollReveal>

      {/* ---------------- 7. WHY CHOOSE US (6 INTERACTIVE CARDS) ---------------- */}
      <ScrollReveal yOffset={28} duration={800} threshold={0.1}>
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest mb-2">
                The Genmax Advantage
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-4">
                Why Forward-Thinking Businesses Choose Us
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Six uncompromising operational commitments that distinguish our agency from traditional marketing vendors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {WHY_CHOOSE_US.map((item) => (
                <SpotlightCard
                  key={item.id}
                  className="p-8 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-indigo-400 dark:hover:border-slate-700 transition-all group"
                >
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-cyan-400 block mb-4">
                    {item.id} // COMMITMENT
                  </span>
                  <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ---------------- 8. PRODUCTION PROJECT SHOWCASE (LIVE FIRST-PAGE DESIGN) ---------------- */}
      <ScrollReveal yOffset={28} duration={800} threshold={0.1}>
        <FeaturedProjectsSection onOpenAudit={onOpenAudit} />
      </ScrollReveal>

      {/* ---------------- 9. PRICING PLANS ---------------- */}
      <ScrollReveal yOffset={28} duration={800} threshold={0.1}>
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest mb-2">
                Transparent Investment
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-4">
                Simple, Transparent Pricing Packages
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Clear tiers with no hidden retainers. All standard web and SEO packages include free domain registration worth ₹999 and 1 year of free technical support.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {PRICING_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-8 flex flex-col justify-between transition-all ${
                    plan.popular
                      ? 'bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-[#10182E] border-2 border-indigo-600 dark:border-cyan-400 shadow-xl relative scale-105 z-10'
                      : 'bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                      Recommended Choice
                    </div>
                  )}

                  <div>
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider block mb-1">
                        {plan.badge || 'Plan'}
                      </span>
                      <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                        {plan.name}
                      </h3>
                    </div>

                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-4xl font-bold font-heading text-slate-900 dark:text-white">{plan.price}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{plan.period}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                      {plan.description}
                    </p>

                    <ul className="space-y-3 mb-8 text-xs text-slate-700 dark:text-slate-300">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={onOpenAudit}
                    className={`w-full py-3.5 px-6 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer ${
                      plan.popular
                        ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 text-white hover:opacity-95 shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center text-xs text-slate-500 dark:text-slate-400">
              <span>Need a custom enterprise scope? </span>
              <Link to="/contact" className="text-indigo-600 dark:text-cyan-400 hover:underline font-medium">
                Contact our solutions desk for a bespoke quotation.
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ---------------- 10. FREE SEO ANALYSIS FORM SECTION ---------------- */}
      <ScrollReveal yOffset={28} duration={800} threshold={0.1}>
        <section className="py-20 bg-gradient-to-b from-slate-100 to-[#F8FAFC] dark:from-[#0F172A] dark:to-[#0B1020] border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl p-8 sm:p-12 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="text-center max-w-xl mx-auto mb-8">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Instant Diagnostic</span>
                </div>
                <h2 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">
                  Get Your Free 25-Point Website & SEO Analysis
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Discover why your competitors are outranking you. Receive actionable technical, backlink, and Core Web Vitals recommendations within 2 business hours.
                </p>
              </div>

              {quickAuditSuccess ? (
                <div className="p-6 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-cyan-600 dark:text-cyan-400 mx-auto" />
                  <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Diagnostic Queued Successfully</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    We are analyzing <strong className="text-indigo-600 dark:text-cyan-400">{quickAuditUrl}</strong>. Your comprehensive audit report will be dispatched to <strong className="text-slate-900 dark:text-white">{quickAuditEmail}</strong> shortly.
                  </p>
                  <button
                    onClick={() => setQuickAuditSuccess(false)}
                    className="mt-2 text-xs text-indigo-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    Analyze another domain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickAudit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Website URL / Domain *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. yourbusiness.com"
                        value={quickAuditUrl}
                        onChange={(e) => setQuickAuditUrl(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Business Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={quickAuditEmail}
                        onChange={(e) => setQuickAuditEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 text-white font-bold text-sm tracking-wide uppercase hover:opacity-95 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Run Free Audit & Send Recommendations</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-2">
                    <span>✓ 100% Confidential</span>
                    <span>✓ No Credit Card Required</span>
                    <span>✓ Delivered in &lt;2 Hours</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ---------------- 11. TESTIMONIALS CAROUSEL ---------------- */}
      <ScrollReveal yOffset={28} duration={800} threshold={0.1}>
        <section className="py-24 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest mb-2">
                Client Testimonials
              </div>
              <h2 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">
                Trusted by Business Leaders Across India & Beyond
              </h2>
            </div>

            <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md relative">
              <div className="flex items-center gap-1 text-amber-500 mb-6">
                {[...Array(TESTIMONIALS[testimonialIdx].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 italic leading-relaxed mb-8">
                "{TESTIMONIALS[testimonialIdx].review}"
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                    {TESTIMONIALS[testimonialIdx].clientName}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {TESTIMONIALS[testimonialIdx].role} · <strong className="text-slate-700 dark:text-slate-300">{TESTIMONIALS[testimonialIdx].company}</strong>
                  </div>
                  <div className="text-[11px] text-indigo-600 dark:text-cyan-400 font-medium mt-1">
                    Service: {TESTIMONIALS[testimonialIdx].projectType}
                  </div>
                </div>

                {/* Navigation controls */}
                <div className="flex items-center gap-2">
                  {TESTIMONIALS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setTestimonialIdx(idx)}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        testimonialIdx === idx ? 'w-8 bg-indigo-600 dark:bg-cyan-400' : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ---------------- 12. FAQS ACCORDION ---------------- */}
      <ScrollReveal yOffset={28} duration={800} threshold={0.1}>
        <section className="py-24 bg-slate-100/60 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest mb-2">
                Got Questions?
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Everything you need to know about our process, timelines, guarantees, and pricing.
              </p>
            </div>

            <div className="space-y-4">
              {GENERAL_FAQS.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left text-sm sm:text-base font-semibold font-heading text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <span className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0 ml-4">
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-4 animate-in fade-in duration-200">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ---------------- 12B. NOIDA HEADQUARTERS & GOOGLE MAPS ---------------- */}
      <ScrollReveal yOffset={28} duration={800} threshold={0.1}>
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest mb-2">
                Physical Presence & Local Authority
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                Our Noida Global Engineering Headquarters
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Explore our location on Google Maps, plan your route, or meet our senior engineers for an in-person digital strategy consultation.
              </p>
            </div>

            <GoogleMapsSection />
          </div>
        </section>
      </ScrollReveal>

      {/* ---------------- 13. FINAL HIGH-IMPACT CTA ---------------- */}
      <ScrollReveal yOffset={28} duration={800} threshold={0.1}>
        <section className="py-24 relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-t border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-8 h-8" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight mb-6">
              Ready to Dominate Search Rankings & Accelerate Conversions?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Partner with Genmax IT Solution today. Receive 1 year of free technical support, complimentary domain registration, and an agile 7-14 business day delivery.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenAudit}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 text-slate-950 font-bold text-sm tracking-wide uppercase hover:shadow-xl hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Claim Free Audit & Strategy Call</span>
              </button>

              <a
                href={COMPANY_DETAILS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Us: {COMPANY_DETAILS.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </section>
      </ScrollReveal>

    </div>
  );
};
