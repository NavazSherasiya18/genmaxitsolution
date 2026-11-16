import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SHOWCASE_PROJECTS } from '../data/showcaseProjects';
import { ProjectFirstPageViewer } from '../components/sections/ProjectFirstPageViewer';
import { ExternalLink } from 'lucide-react';

interface ProjectLiveDetailPageProps {
  onOpenAudit: () => void;
}

export const ProjectLiveDetailPage: React.FC<ProjectLiveDetailPageProps> = ({ onOpenAudit }) => {
  const { slug } = useParams<{ slug: string }>();

  const project = SHOWCASE_PROJECTS.find(p => p.slug === slug || p.id === slug) || SHOWCASE_PROJECTS[0];

  useEffect(() => {
    document.title = `${project.title} — ${project.categoryLabel}`;
    return () => {
      document.title = 'Genmax IT Solution — Web Engineering, SEO & Digital Growth Agency';
    };
  }, [project]);

  return (
    <div className="relative min-h-screen w-full">
      {/* Full Standalone Home Landing Page Design */}
      <ProjectFirstPageViewer
        project={project}
        onOpenAudit={onOpenAudit}
        isModal={false}
      />

      {/* Subtle Bottom-Left Portfolio Attribution Badge (non-intrusive) */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-white text-xs shadow-2xl">
        <span className="text-slate-300 hidden sm:inline">Engineered by Genmax IT Solution</span>
        <span className="text-slate-600 hidden sm:inline">·</span>
        <button
          onClick={onOpenAudit}
          className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <span>Request Similar Build</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
