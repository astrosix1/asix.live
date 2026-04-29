import { getProjectBySlugServer } from '@/lib/projects-server';
import Link from 'next/link';

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let project = null;
  let error = null;

  try {
    project = await getProjectBySlugServer(id);
  } catch (err) {
    console.error('Error loading project:', err);
    error = 'Project not found';
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  if (!project) {
    return <div className="text-center py-12">Project not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/projects" className="text-blue-600 hover:text-blue-700 mb-8 inline-block">
        ← Back to Projects
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-8">
        {project.icon_url && (
          <img src={project.icon_url} alt={project.name} className="h-16 w-16 mb-6" />
        )}

        <h1 className="text-4xl font-bold mb-4 text-gray-900">{project.name}</h1>
        <p className="text-xl text-gray-600 mb-8">{project.description}</p>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech: string) => (
              <span
                key={tech}
                className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <a
          href={project.external_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Open Project →
        </a>
      </div>
    </div>
  );
}
