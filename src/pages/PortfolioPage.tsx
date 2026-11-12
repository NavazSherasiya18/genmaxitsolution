import React, { useState } from 'react';
import { CASE_STUDIES } from '../data/websiteContent';
import { ArrowRight, CheckCircle2, TrendingUp, Sparkles, ExternalLink } from 'lucide-react';
import { FeaturedProjectsSection } from '../components/sections/FeaturedProjectsSection';

interface PortfolioPageProps {
  onOpenAudit: () => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onOpenAudit }) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredStudies = CASE_STUDIES.filter((c) => {
    if (filter === 'all') return true;
    if (filter === 'ecommerce') return c.category.toLowerCase().includes('ecommerce');
    if (filter === 'seo') return c.category.toLowerCase().includes('seo');
    if (filter === 'development') return c.category.toLowerCase().includes('development');
    return true;
  });

  return (
    <div className="pt-28 pb-20 bg-[#F8FAFC] dark:bg-[#0B1020] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <section className="relative py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest mb-3">
              Case Studies & Proven Impact
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold font-heading text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
              Engineering Commercial Triumph. <br />
              <span className="gradient-text">Delivering Measurable Revenue.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Explore real-world client engagements where our custom web development, high-intent local SEO, and conversion optimization generated market-leading commercial results.
            </p>
          </div>

          {/* Segmented Filter Controls */}
          <div className="mt-10 flex flex-wrap gap-2 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 font-semibold border border-indigo-200 dark:border-cyan-500/30 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
              }`}
            >
              All Engagements
            </button>
            <button
              onClick={() => setFilter('seo')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                filter === 'seo'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 font-semibold border border-indigo-200 dark:border-cyan-500/30 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
              }`}
            >
              SEO & Google Maps
            </button>
            <button
              onClick={() => setFilter('ecommerce')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                filter === 'ecommerce'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 font-semibold border border-indigo-200 dark:border-cyan-500/30 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
              }`}
            >
              eCommerce & Stores
            </button>
            <button
              onClick={() => setFilter('development')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                filter === 'development'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 font-semibold border border-indigo-200 dark:border-cyan-500/30 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
              }`}
            >
              Custom Software & APIs
            </button>
          </div>
        </div>
      </section>
 
      {/* 5 Distinct Live Interactive Projects with First-Page Design Previews */}
      <FeaturedProjectsSection 
        onOpenAudit={onOpenAudit}
        title="Interactive Production Deployments"
        subtitle="Explore our flagship client builds. Each application is engineered with an independent design system, bespoke palette, and interactive first-page design."
      />

      {/* Case Studies Detailed Grid */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {filteredStudies.map((study, idx) => (
            <div
              key={study.id}
              className="rounded-3xl overflow-hidden bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all p-6 sm:p-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Image */}
                <div className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md relative group h-80 sm:h-96">
                    <img
                      src={study.image}
                      alt={study.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-white/90 dark:bg-black/70 backdrop-blur-md border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-cyan-300 shadow-xs">
                      {study.client}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className={`lg:col-span-6 space-y-6 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest">
                    {study.category}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white">
                    {study.title}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {study.summary}
                  </p>

                  {/* Quantitative KPI Triad */}
                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-100 dark:border-slate-800">
                    {study.metrics.map((m, mIdx) => (
                      <div key={mIdx}>
                        <div className="text-2xl sm:text-3xl font-bold font-heading text-indigo-600 dark:text-cyan-400">
                          {m.value}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Stack Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    {study.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={onOpenAudit}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold text-xs tracking-wider uppercase hover:opacity-95 shadow-md transition-all cursor-pointer"
                    >
                      <span>Inquire About Similar Outcomes</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Conversion Banner */}
      <section className="py-16 text-center border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white mb-4">
            Want Similar Results for Your Business?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-8">
            Request an in-depth audit of your current digital footprint and discover where your competitors are leaving market share on the table.
          </p>
          <button
            onClick={onOpenAudit}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 text-white font-bold text-sm tracking-wide uppercase hover:opacity-95 shadow-md transition-all cursor-pointer"
          >
            Claim Your Free Technical SEO & Web Audit
          </button>
        </div>
      </section>
    </div>
  );
};
