'use client';

import { useEffect, useState } from 'react';
import { getProjectBySlug } from '@/lib/projects';
import { ProjectForm } from '@/components/ProjectForm';

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      try {
        const data = await getProjectBySlug(params.id);
        setProject(data);
      } catch (err) {
        console.error('Failed to load project');
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [params.id]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!project) return <div className="text-center py-12">Project not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Edit Project</h1>
      <ProjectForm initialData={project} />
    </div>
  );
}
