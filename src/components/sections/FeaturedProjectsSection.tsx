import React, { useState } from 'react';
import { 
  ExternalLink, Eye, Sparkles, ArrowRight, CheckCircle2, 
  Layers, Monitor, Smartphone, Tablet, Flame, Code2, Globe
} from 'lucide-react';
import { SHOWCASE_PROJECTS, ShowcaseProject } from '../../data/showcaseProjects';
import { ProjectFirstPageViewer } from './ProjectFirstPageViewer';

interface FeaturedProjectsSectionProps {
  onOpenAudit?: () => void;
  title?: string;
  subtitle?: string;
}

export const FeaturedProjectsSection: React.FC<FeaturedProjectsSectionProps> = ({
  onOpenAudit,
  title = "Interactive Production Deployments",
  subtitle = "Click on any project to explore its interactive, live first-page design crafted with a bespoke visual identity and dedicated tech stack."
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ShowcaseProject | null>(null);

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
    <section id="projects-showcase" className="py-24 relative overflow-hidden bg-white dark:bg-[#0B1020] border-t border-slate-200 dark:border-slate-800 transition-colors">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-500/10 via-cyan-500/10 to-amber-500/5 blur-3xl pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800/80 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Project Portfolio</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-heading text-slate-900 dark:text-white tracking-tight mb-4">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/20 scale-105'
                  : 'bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === cat.id ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              className="rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:border-indigo-400 dark:hover:border-indigo-500/50"
            >
              {/* Card Thumbnail & Live Action Overlay */}
              <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-950 cursor-pointer" onClick={() => setSelectedProject(project)}>
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-90" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase backdrop-blur-md border shadow-xs"
                    style={{
                      backgroundColor: project.themeStyle.badgeBg,
                      color: project.themeStyle.accent,
                      borderColor: project.themeStyle.borderColor,
                    }}
                  >
                    {project.categoryLabel}
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-mono border border-white/10">
                    {project.timeline}
                  </span>
                </div>

                {/* Center Hover Action Cue */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950/40 backdrop-blur-xs">
                  <div className="px-5 py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Eye className="w-4 h-4 text-indigo-600" />
                    <span>Launch Live First-Page Design</span>
                  </div>
                </div>

                {/* Bottom Tagline on Thumbnail */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-0.5">
                    {project.clientName}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-heading text-white line-clamp-1">
                    {project.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                    {project.description}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="mb-6">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Bespoke Engineering Stack</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 3 Outcome Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
                    {project.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="space-y-0.5">
                        <div 
                          className="text-sm sm:text-base font-bold font-heading"
                          style={{ color: project.accentColor }}
                        >
                          {m.value}
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800/80">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex-1 py-3 px-4 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:opacity-95"
                    style={{
                      background: `linear-gradient(135deg, ${project.accentColor}, #4338CA)`,
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    <span>Open Live First-Page Design</span>
                  </button>

                  {onOpenAudit && (
                    <button
                      onClick={onOpenAudit}
                      className="py-3 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer text-center"
                    >
                      Request Quote
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center justify-center lg:justify-start gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Unique Design Guarantee</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading">
              Need a Bespoke Web or SaaS Application for Your Business?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              We never recycle generic templates. Every client project receives an original brand style guide, rapid delivery sprint, and 365 days of included technical maintenance.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {onOpenAudit && (
              <button
                onClick={onOpenAudit}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
              >
                Schedule Free Project Discovery →
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ---------------- INTERACTIVE LIVE FIRST-PAGE DESIGN MODAL ---------------- */}
      {selectedProject && (
        <ProjectFirstPageViewer
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onOpenAudit={() => {
            setSelectedProject(null);
            if (onOpenAudit) onOpenAudit();
          }}
          isModal={true}
        />
      )}
    </section>
  );
};
