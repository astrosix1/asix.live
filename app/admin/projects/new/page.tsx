import { ProjectForm } from '@/components/ProjectForm';

export default function NewProjectPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Create New Project</h1>
      <ProjectForm />
    </div>
  );
}
