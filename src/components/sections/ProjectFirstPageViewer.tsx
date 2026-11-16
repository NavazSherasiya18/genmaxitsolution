import React from 'react';
import { ShowcaseProject } from '../../data/showcaseProjects';
import { AureliaLandingPage } from '../projects/AureliaLandingPage';
import { AzureLandingPage } from '../projects/AzureLandingPage';
import { HealthLinkLandingPage } from '../projects/HealthLinkLandingPage';
import { PrimusLandingPage } from '../projects/PrimusLandingPage';
import { AetherLandingPage } from '../projects/AetherLandingPage';

interface ProjectFirstPageViewerProps {
  project: ShowcaseProject;
  onClose?: () => void;
  onOpenAudit?: () => void;
  isModal?: boolean;
}

export const ProjectFirstPageViewer: React.FC<ProjectFirstPageViewerProps> = ({
  project,
}) => {
  switch (project.category) {
    case 'ecommerce':
      return <AureliaLandingPage project={project} />;
    case 'travel':
      return <AzureLandingPage project={project} />;
    case 'healthtech':
      return <HealthLinkLandingPage project={project} />;
    case 'fintech':
      return <PrimusLandingPage project={project} />;
    case 'logistics':
    default:
      return <AetherLandingPage project={project} />;
  }
};
