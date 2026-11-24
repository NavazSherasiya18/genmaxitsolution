import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICE_CATALOG, SERVICE_CATEGORIES, servicePath, type ServiceCategoryId } from '../data/servicesData';
import { useServiceMetadata } from '../utils/useServiceMetadata';
import { ArrowRight, Braces, CheckCircle2, Clock, Cpu, Megaphone, Monitor, Palette, Search, ShieldCheck, Smartphone, Sparkles, Wrench } from 'lucide-react';

const categoryIcons = {
  seo: Search,
  paid: Megaphone,
  design: Monitor,
  development: Braces,
  mobile: Smartphone,
  software: Cpu,
  branding: Palette,
  support: Wrench,
} satisfies Record<ServiceCategoryId, typeof Search>;

interface ServicesHubPageProps {
  onOpenAudit: (serviceName?: string) => void;
}

export const ServicesHubPage: React.FC<ServicesHubPageProps> = ({ onOpenAudit }) => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  useServiceMetadata('/services');

  const query = searchQuery.trim().toLowerCase();
  const visibleCategories = SERVICE_CATEGORIES
    .filter((category) => activeCategory === 'all' || category.id === activeCategory)
    .map((category) => ({
      ...category,
      Icon: categoryIcons[category.id],
      services: category.services.filter((service) =>
        [service.title, service.searchTitle, service.shortDescription, service.subtitle, category.title]
          .some((text) => text?.toLowerCase().includes(query)),
      ),
    }))
    .filter((category) => category.services.length > 0);

  return (
    <div className="bg-[var(--bg-primary)] pt-28 pb-20 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <section className="relative py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest mb-3">
              Comprehensive Service Catalog
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold font-heading text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
              {SERVICE_CATALOG.length} Specialized Disciplines. <br />
              <span className="gradient-text">One Unified Standard of Excellence.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Explore our services in SEO, paid marketing, website design, web and mobile development, software and AI, branding, and ongoing support.
            </p>
          </div>

          {/* Interactive Filter & Search Controls */}
          <div className="mt-12 flex flex-col xl:flex-row xl:items-start justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            {/* Category Segmented Tabs */}
            <div role="group" aria-label="Service category filters" className="genmax-card genmax-card-soft flex flex-wrap items-center gap-1.5 p-1 rounded-xl">
              {[{ id: 'all' as const, title: 'All Services', services: SERVICE_CATALOG }, ...SERVICE_CATEGORIES].map((category) => (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={activeCategory === category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`min-h-11 px-3.5 py-2 rounded-lg text-left text-xs font-medium transition-all cursor-pointer xl:min-h-8 ${
                    activeCategory === category.id
                      ? 'genmax-action text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {category.title} ({category.services.length})
                </button>
              ))}
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full sm:w-72 xl:shrink-0">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                aria-label="Filter services"
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
          <div className="space-y-12">
            {visibleCategories.map(({ Icon, ...category }) => (
              <section key={category.id} aria-labelledby={`service-category-${category.id}`}>
                <h2 id={`service-category-${category.id}`} className="mb-5 text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  {category.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.services.map((svc) => (
                    <div
                      key={svc.id}
                      className="genmax-card genmax-card-orbit genmax-card-lift group flex flex-col justify-between rounded-2xl p-5 sm:p-7"
                    >
                      <div>
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                          <span className="genmax-card-icon" aria-hidden="true">
                            <Icon className="size-5" />
                          </span>
                          {svc.legacy && (
                            <span className="flex items-center gap-1.5 rounded-full bg-indigo-950/55 border border-indigo-400/25 px-2.5 py-1 text-xs font-medium text-indigo-100">
                              <Clock aria-hidden="true" className="size-3" /> 7-14 Days SLA
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                          {svc.title}
                        </h3>

                        <p className="mb-3 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                          {svc.subtitle}
                        </p>

                        <p className="mb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {svc.shortDescription}
                        </p>

                        <ul className="mb-5 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                          {svc.features.map((feat) => (
                            <li key={feat} className="flex items-start gap-2">
                              <CheckCircle2 aria-hidden="true" className="mt-px size-3.5 shrink-0 text-indigo-600 dark:text-cyan-400" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="genmax-card-divider flex flex-wrap items-center justify-between gap-x-2 border-t pt-2">
                        <Link
                          to={servicePath(svc.slug)}
                          aria-label={`View full deliverables for ${svc.title}`}
                          className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                        >
                          <span>View Full Deliverables</span>
                          <ArrowRight aria-hidden="true" className="size-3.5 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => onOpenAudit(svc.title)}
                          className="min-h-11 cursor-pointer text-xs font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white"
                        >
                          Get Quote
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {visibleCategories.length === 0 && (
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
