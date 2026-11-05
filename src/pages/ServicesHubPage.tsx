import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../data/websiteContent';
import { ArrowRight, Search, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ServicesHubPageProps {
  onOpenAudit: () => void;
}

export const ServicesHubPage: React.FC<ServicesHubPageProps> = ({ onOpenAudit }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'seo' | 'design' | 'development' | 'mobile'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = SERVICES.filter((s) => {
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-28 pb-20 bg-[#F8FAFC] dark:bg-[#0B1020] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <section className="relative py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest mb-3">
              Comprehensive Service Catalog
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold font-heading text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
              19 Specialized Disciplines. <br />
              <span className="gradient-text">One Unified Standard of Excellence.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Explore our full suite of digital marketing, search engine optimization, bespoke web development, and mobile app engineering services. Every project includes a free domain worth ₹999 and 1 year of free technical support.
            </p>
          </div>

          {/* Interactive Filter & Search Controls */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            {/* Category Segmented Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Services (19)
              </button>
              <button
                onClick={() => setActiveCategory('seo')}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === 'seo'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                SEO & Marketing (6)
              </button>
              <button
                onClick={() => setActiveCategory('design')}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === 'design'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Website Design (5)
              </button>
              <button
                onClick={() => setActiveCategory('development')}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === 'development'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Web Engineering (6)
              </button>
              <button
                onClick={() => setActiveCategory('mobile')}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === 'mobile'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Mobile Apps (2)
              </button>
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter services (e.g. Laravel, Maps)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((svc) => (
              <div
                key={svc.id}
                className="rounded-2xl p-7 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-400 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-cyan-400">
                      {svc.category}
                    </span>
                    <span className="text-xs text-slate-500">7-14 Days SLA</span>
                  </div>

                  <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                    {svc.title}
                  </h3>

                  <p className="text-xs text-indigo-700 dark:text-indigo-300/80 mb-3 font-semibold">
                    {svc.subtitle}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {svc.shortDescription}
                  </p>

                  <div className="space-y-1.5 mb-6 border-t border-slate-100 dark:border-slate-800/80 pt-4 text-xs text-slate-700 dark:text-slate-300">
                    {svc.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Link
                    to={`/services/${svc.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300 transition-colors"
                  >
                    <span>View Full Deliverables</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button
                    onClick={onOpenAudit}
                    className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Get Quote
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-500 text-sm mb-4">No services match your search query.</p>
              <button
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                className="text-xs text-indigo-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Guaranteed Inclusions Banner */}
      <section className="py-12 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-cyan-400 shrink-0" />
              <div>
                <strong className="text-sm font-semibold text-slate-900 dark:text-white block">1 Year Free Technical Support</strong>
                <span className="text-xs text-slate-500 dark:text-slate-400">Included on all custom websites and applications</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <strong className="text-sm font-semibold text-slate-900 dark:text-white block">Free Domain Registration</strong>
                <span className="text-xs text-slate-500 dark:text-slate-400">Complimentary custom domain (.com, .in) worth ₹999</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <strong className="text-sm font-semibold text-slate-900 dark:text-white block">100% White-Hat Assurance</strong>
                <span className="text-xs text-slate-500 dark:text-slate-400">Guaranteed compliance with Google search algorithms</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
