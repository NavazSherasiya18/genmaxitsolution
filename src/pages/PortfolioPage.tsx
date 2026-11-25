import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CASE_STUDIES, type EngagementCategory } from '../data/websiteContent';
import { SHOWCASE_PROJECTS } from '../data/showcaseProjects';
import { FeaturedProjectsSection, type ProjectCategory } from '../components/sections/FeaturedProjectsSection';

const engagementFilters = [
  { id: 'all', label: 'All Engagements' },
  { id: 'seo', label: 'SEO & Google Maps' },
  { id: 'ecommerce', label: 'eCommerce & Stores' },
  { id: 'development', label: 'Custom Software & APIs' },
] as const satisfies readonly { id: 'all' | EngagementCategory; label: string }[];

interface PortfolioPageProps {
  onOpenAudit: (serviceName?: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onOpenAudit }) => {
  const [filter, setFilter] = useState<'all' | EngagementCategory>('all');
  const [projectCategory, setProjectCategory] = useState<ProjectCategory>('all');

  const matchesFilter = ({ engagementCategories }: { engagementCategories: readonly EngagementCategory[] }) =>
    filter === 'all' || engagementCategories.includes(filter);
  const filteredStudies = CASE_STUDIES.filter(matchesFilter);
  const filteredProjects = SHOWCASE_PROJECTS.filter(matchesFilter);

  return (
    <div className="bg-[var(--bg-primary)] pt-28 pb-20 text-slate-800 dark:text-slate-100 transition-colors duration-300">
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
          <div role="group" aria-label="Engagement filters" className="mt-10 flex flex-wrap gap-2 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            {engagementFilters.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                aria-pressed={filter === id}
                onClick={() => {
                  setFilter(id);
                  setProjectCategory('all');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  filter === id
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 font-semibold border border-slate-200 dark:border-slate-700 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>
 
      {/* Live Interactive Projects with First-Page Design Previews */}
      {filteredProjects.length > 0 && (
        <FeaturedProjectsSection
          projects={filteredProjects}
          categoryFilter={{ selected: projectCategory, onChange: setProjectCategory }}
          onOpenAudit={onOpenAudit}
          title="Interactive Production Deployments"
          subtitle="Explore our flagship client builds. Each application is engineered with an independent design system, bespoke palette, and interactive first-page design."
        />
      )}

      {/* Case Studies Detailed Grid */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {filteredStudies.map((study, idx) => (
            <div
              key={study.id}
              className="genmax-card genmax-card-orbit rounded-3xl overflow-hidden box-zoom-sm p-6 sm:p-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Image */}
                <div className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="genmax-card genmax-card-soft rounded-2xl overflow-hidden relative group h-80 sm:h-96">
                    <img
                      src={study.image}
                      alt={study.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-indigo-400/25 text-xs font-semibold text-cyan-300 shadow-xs">
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
                      onClick={() => onOpenAudit()}
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
            onClick={() => onOpenAudit()}
            className="px-8 py-4 rounded-xl genmax-action text-white font-bold text-sm tracking-wide uppercase hover:opacity-95 shadow-md transition-all cursor-pointer"
          >
            Claim Your Free Technical SEO & Web Audit
          </button>
        </div>
      </section>
    </div>
  );
};
