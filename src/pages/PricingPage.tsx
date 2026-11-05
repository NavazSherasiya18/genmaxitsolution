import React from 'react';
import { PRICING_PLANS, GENERAL_FAQS } from '../data/websiteContent';
import { CheckCircle2, ShieldCheck, Zap, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

interface PricingPageProps {
  onOpenAudit: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onOpenAudit }) => {
  const comparisonFeatures = [
    { name: 'Target Keywords', starter: '10 Local Keywords', growth: '25 Competitive Keywords', enterprise: '50+ High-Volume Keywords' },
    { name: 'Google Business Profile (GBP) Optimization', starter: 'Included', growth: 'Advanced Multi-Category', enterprise: 'Multi-Location / Pan-India' },
    { name: 'Technical SEO & Core Web Vitals Audit', starter: 'Basic Diagnostic', growth: 'Comprehensive Code Fixes', enterprise: 'Full Continuous SLA' },
    { name: 'Local Citations & Directory Submissions', starter: '30+ Directories', growth: '60+ High DA Citations', enterprise: '120+ Authority Citations' },
    { name: 'Contextual Guest Articles & Backlinks', starter: '—', growth: '2 Articles / Month', enterprise: '5 Authority Outreaches / Mo' },
    { name: 'Free Domain Registration (₹999 Value)', starter: 'Included', growth: 'Included', enterprise: 'Included' },
    { name: '1 Year Free Technical Support Guarantee', starter: 'Included', growth: 'Included', enterprise: 'Priority 24/7 SLA' },
    { name: 'Agile Delivery Timeframe', starter: '7-14 Business Days', growth: '7-14 Business Days', enterprise: 'Custom Sprint Schedule' },
    { name: 'Dedicated Account Manager', starter: 'Email & WhatsApp', growth: 'Senior SEO Strategist', enterprise: 'Dedicated Full-Stack Lead' },
    { name: 'Reporting Cadence', starter: 'Monthly PDF', growth: 'Bi-Weekly Live Dashboard', enterprise: 'Weekly Live Video Review' },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#F8FAFC] dark:bg-[#0B1020] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <section className="relative py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest mb-3">
            Transparent Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-heading text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
            Predictable Investment. <br />
            <span className="gradient-text">Exceptional Return on Investment.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            No ambiguous retainers or hidden surprise fees. Every plan includes a free custom domain worth ₹999, 1 full year of complimentary technical support, and transparent bi-weekly progress updates.
          </p>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20">
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
                    <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                      {plan.name}
                    </h2>
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

          {/* Detailed Comparison Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs mb-16">
            <div className="p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
                Side-by-Side Feature Comparison
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Verify exactly what is included in each service tier before making a decision.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4 pl-6">Feature / Inclusions</th>
                    <th className="p-4">Starter (₹4,999)</th>
                    <th className="p-4 text-indigo-600 dark:text-cyan-400 font-bold">Growth (₹9,999)</th>
                    <th className="p-4 pr-6">Enterprise (₹19,999)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {comparisonFeatures.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 pl-6 font-medium text-slate-900 dark:text-slate-200">{row.name}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{row.starter}</td>
                      <td className="p-4 font-semibold text-indigo-600 dark:text-cyan-300">{row.growth}</td>
                      <td className="p-4 pr-6 text-indigo-700 dark:text-indigo-300 font-medium">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Three Universal Guarantees */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-cyan-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">365-Day Free Technical Support</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Every build includes 1 full year of technical bug fixes, server maintenance advisory, and security updates at zero extra charge.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Free Custom Domain Registration</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Complimentary domain registration worth ₹999 included in all standard website packages for the first full year.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Zap className="w-6 h-6 text-violet-600 dark:text-violet-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Agile 7-14 Business Days Delivery</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Structured sprint schedules with milestone sign-offs. We deliver responsive websites in as little as 7 to 14 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-12 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white mb-3">
            Have Questions About Custom Project Scopes?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-6">
            Our technology directors are happy to review your custom requirements and prepare a detailed, itemized statement of work.
          </p>
          <button
            onClick={onOpenAudit}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold text-xs tracking-wider uppercase hover:opacity-95 shadow-md transition-all cursor-pointer"
          >
            Schedule Free Strategy Discussion
          </button>
        </div>
      </section>
    </div>
  );
};
