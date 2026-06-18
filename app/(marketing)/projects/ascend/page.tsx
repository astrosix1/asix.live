import { getProject } from '@/lib/get-project';
import { LaunchAscendButton } from '@/components/projects/LaunchAscendButton';
import { ProjectTemplateWrapper } from '@/components/projects/ProjectTemplateWrapper';

export const metadata = {
  title: 'Ascend | asix.live',
  description: 'Replace addictions with hobbies - Build sustainable habits with our intuitive mobile app',
  openGraph: {
    title: 'Ascend - Replace Addictions with Hobbies',
    description: 'Build sustainable habits with an intuitive mobile app. Track, analyze, and transform your behavior.',
    url: 'https://asix.live/projects/ascend',
    siteName: 'asix.live',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ascend - Replace Addictions with Hobbies',
    description: 'Build sustainable habits with an intuitive mobile app.',
  },
};

export default function AscendProject() {
  const project = getProject('ascend');

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Project not found</h1>
          <p className="text-slate-600">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <ProjectTemplateWrapper
      project={project}
      projectSlug="ascend"
      launchButtonComponent={<LaunchAscendButton />}
    />
  );
}
