import React, { useState } from 'react';
import { 
  ExternalLink, CheckCircle2, Code2, ArrowUpRight
} from 'lucide-react';
import { SHOWCASE_PROJECTS } from '../../data/showcaseProjects';
import { ProjectBrandLogo } from '../brand/ProjectLogos';

interface FeaturedProjectsSectionProps {
  onOpenAudit?: (serviceName?: string) => void;
  title?: string;
  subtitle?: string;
}

export const FeaturedProjectsSection: React.FC<FeaturedProjectsSectionProps> = ({
  onOpenAudit,
  title = "Live Production Client Projects",
  subtitle = "Click any project below to open its full standalone experience in a new tab—complete with bespoke visual identity, logo mark, and interactive capabilities."
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Projects', count: SHOWCASE_PROJECTS.length },
    { id: 'ecommerce', label: 'E-Commerce', count: 1 },
    { id: 'travel', label: 'Travel & Resorts', count: 1 },
    { id: 'healthtech', label: 'HealthTech SaaS', count: 1 },
    { id: 'fintech', label: 'FinTech & Real Estate', count: 1 },
    { id: 'logistics', label: 'IoT Logistics', count: 1 },
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? SHOWCASE_PROJECTS 
    : SHOWCASE_PROJECTS.filter(p => p.category === selectedCategory);

  return (
    <section id="projects-showcase" className="py-24 relative overflow-hidden bg-white dark:bg-[var(--bg-primary)] border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-cyan-400 mb-3">
            Interactive Project Showcase
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-heading text-slate-900 dark:text-white tracking-tight mb-4" style={{ textWrap: 'balance' }}>
            {title}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Interactive Category Segmented Filter Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{cat.label}</span>
              <span className="tabular-nums opacity-75 text-[11px]">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {filteredProjects.map((project) => {
            const targetUrl = project.demoUrl || `/project/${project.slug}`;
            const primaryCta = project.primaryCtaLabel || 'Open Full Landing Page';
            const secondaryCta = project.secondaryCtaLabel || 'Request Quote';
            const readableAccent = `color-mix(in srgb, ${project.accentColor} 30%, #e9f1ff)`;

            return (
              <div
                key={project.id}
                className="genmax-card box-zoom rounded-2xl overflow-hidden flex flex-col justify-between group"
              >
                {/* Card Thumbnail & New-Tab Launch Link */}
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative h-64 sm:h-72 overflow-hidden bg-slate-950 block cursor-pointer"
                  aria-label={`${primaryCta}: ${project.title} in new tab`}
                >
                  <img
                    src={project.thumbnail}
                    alt={`${project.title} storefront preview`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  
                  {/* Contrast Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/20" />

                  {/* Top Brand Logo Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/15 shadow-lg">
                      <ProjectBrandLogo projectId={project.id} size="sm" tone="light" />
                    </div>

                    <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-xs font-medium inline-flex items-center gap-1.5 border border-white/15">
                      <span>{project.conceptLabel || 'Live Site'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                    </span>
                  </div>

                  {/* Hover Overlay CTA */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950/45 backdrop-blur-xs">
                    <span className="px-5 py-2.5 rounded-xl genmax-action text-white font-bold text-xs tracking-wide shadow-2xl border border-white/20 inline-flex items-center gap-2">
                      <span>{primaryCta}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-200" />
                    </span>
                  </div>

                  {/* Bottom Clean Metadata & Title */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <div className="text-xs font-medium text-slate-200 flex items-center gap-2 mb-1">
                      <span style={{ color: readableAccent }}>
                        {project.categoryLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{project.timeline}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold font-heading text-white line-clamp-1">
                      {project.title}
                    </h3>
                  </div>
                </a>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <ProjectBrandLogo projectId={project.id} size="sm" tone="light" />
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {project.year}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                      {project.description}
                    </p>

                    {/* Tech Stack Clean Inline Typography */}
                    <div className="mb-6">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Engineering Stack</span>
                      </div>
                      <p className="text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed">
                        {project.techStack.join(' · ')}
                      </p>
                    </div>

                    {/* 3 Capability / Outcome Metrics Grid */}
                    <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-200 dark:border-slate-800 text-center">
                      {project.metrics.map((m, mIdx) => (
                        <div key={mIdx} className="space-y-0.5">
                          <div 
                            className="text-sm sm:text-base font-bold font-heading tabular-nums"
                            style={{ color: readableAccent }}
                          >
                            {m.value}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-4 rounded-xl text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:opacity-95 whitespace-nowrap shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${project.accentColor}, #312E81)`,
                      }}
                    >
                      <span>{primaryCta}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {onOpenAudit && (
                      <button
                        type="button"
                        onClick={() => onOpenAudit(project.inquiryContext)}
                        className="py-3 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs tracking-wide transition-colors cursor-pointer text-center whitespace-nowrap shrink-0"
                      >
                        {secondaryCta}
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="genmax-card genmax-card-orbit mt-16 p-8 rounded-2xl text-white flex flex-col lg:flex-row items-center justify-between gap-6 box-zoom-sm">
          <div className="space-y-1.5 text-center lg:text-left">
            <div className="text-xs font-semibold text-cyan-400 flex items-center justify-center lg:justify-start gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Bespoke Engineering Guarantee</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading">
              Need a Custom High-Converting Website or SaaS Platform?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Every client receives an original brand architecture, distinct visual design system, rapid 7–14 day delivery, and 365 days of included maintenance.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {onOpenAudit && (
              <button
                type="button"
                onClick={() => onOpenAudit()}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 text-white font-bold text-xs tracking-wide hover:opacity-95 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                Schedule Project Discovery
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
