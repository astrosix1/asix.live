import { getProject } from '@/lib/get-project';
import { ProjectTemplateWrapper } from '@/components/projects/ProjectTemplateWrapper';
import { LaunchGeoIntelButton } from '@/components/projects/LaunchGeoIntelButton';

export const metadata = {
  title: 'GeoIntel | asix.live',
  description: 'Real-time geopolitical intelligence and global event tracking on an interactive 3D globe',
  openGraph: {
    title: 'GeoIntel - Global Crisis Intelligence',
    description: 'Real-time geopolitical intelligence and event tracking with AI-powered crisis analysis.',
    url: 'https://asix.live/projects/geointel',
    siteName: 'asix.live',
    images: [
      {
        url: 'https://asix.live/og-geointel.png',
        width: 1200,
        height: 630,
        alt: 'GeoIntel - Geopolitical Intelligence Platform',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GeoIntel - Global Crisis Intelligence',
    description: 'Real-time geopolitical intelligence and event tracking.',
    images: ['https://asix.live/og-geointel.png'],
  },
};

export default function GeoIntelProject() {
  const project = getProject('geointel');

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
      projectSlug="geointel"
      launchButtonComponent={<LaunchGeoIntelButton />}
    />
  );
}
