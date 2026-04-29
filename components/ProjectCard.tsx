import Link from 'next/link';
import { Project } from '@/lib/projects';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <div className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-gray-300">
        <div className="space-y-4">
          {project.icon_url && (
            <div className="h-10 w-10">
              <img src={project.icon_url} alt={project.name} className="h-full w-full object-contain" />
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {project.name}
            </h3>
            <p className="mt-2 text-gray-600 text-sm leading-relaxed line-clamp-3">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {project.tech_stack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="pt-2">
            <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors inline-flex items-center gap-2">
              View Project →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
