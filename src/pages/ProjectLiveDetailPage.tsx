import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SHOWCASE_PROJECTS } from '../data/showcaseProjects';
import { ProjectFirstPageViewer } from '../components/sections/ProjectFirstPageViewer';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';

interface ProjectLiveDetailPageProps {
  onOpenAudit: () => void;
}

export const ProjectLiveDetailPage: React.FC<ProjectLiveDetailPageProps> = ({ onOpenAudit }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const project = SHOWCASE_PROJECTS.find(p => p.slug === slug || p.id === slug) || SHOWCASE_PROJECTS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white py-6 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto mb-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Genmax Homepage</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">Project Showcase:</span>
          <span className="text-xs font-bold text-cyan-400">{project.title}</span>
        </div>
      </div>

      <ProjectFirstPageViewer
        project={project}
        onClose={() => navigate(-1)}
        onOpenAudit={onOpenAudit}
        isModal={false}
      />
    </div>
  );
};
