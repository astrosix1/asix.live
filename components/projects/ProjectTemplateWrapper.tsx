'use client';

import { ProjectTemplate } from './ProjectTemplate';
import { useAuth } from '@/components/AuthProvider';
import { useSubscription } from '@/hooks/useSubscription';

interface ProjectTemplateWrapperProps {
  project: any;
  projectSlug: 'ascend' | 'geointel' | 'wikihole';
  launchButtonComponent?: React.ReactNode;
}

/**
 * Wrapper around ProjectTemplate that handles authentication and subscription checks
 * Automatically passes userHasAccess prop based on current user's subscription status
 */
export function ProjectTemplateWrapper({
  project,
  projectSlug,
  launchButtonComponent,
}: ProjectTemplateWrapperProps) {
  const { user } = useAuth();
  const { hasAccess } = useSubscription(projectSlug);

  // User has access if:
  // 1. They are authenticated AND
  // 2. They have an active subscription to this project
  const userHasAccess = !!user && hasAccess;

  return (
    <ProjectTemplate
      project={project}
      projectSlug={projectSlug}
      launchButtonComponent={launchButtonComponent}
      userHasAccess={userHasAccess}
      isLoggedIn={!!user}
    />
  );
}
