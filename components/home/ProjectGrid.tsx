import ProjectCard from '@/components/projects/ProjectCard';
import { PROJECTS } from '@/lib/project-config';

export default function ProjectGrid() {
  const projectList = Object.values(PROJECTS);

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover the innovative applications we've built to tackle real-world challenges.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectList.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              slug={project.slug}
              name={project.name}
              tagline={project.tagline}
              description={project.description}
              image={project.image}
              category={project.category}
              color={project.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
