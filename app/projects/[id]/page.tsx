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

  // Ascend-specific showcase
  const isAscend = project.slug === 'ascend';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/projects" className="text-gray-600 hover:text-gray-900 mb-12 inline-block font-medium transition-colors">
          ← Back to Projects
        </Link>

        <div className="space-y-12">
          {/* Project Header */}
          <div>
            {project.icon_url && (
              <img src={project.icon_url} alt={project.name} className="h-16 w-16 mb-6 rounded-lg" />
            )}
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gray-900">{project.name}</h1>
            <p className="text-2xl text-gray-600 max-w-3xl leading-relaxed mb-8">{project.description}</p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-3">
              {project.tech_stack.map((tech: string) => (
                <span
                  key={tech}
                  className="text-sm font-medium bg-gray-100 text-gray-700 px-4 py-2 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div>
            <a
              href={project.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Launch {project.name} →
            </a>
          </div>

          {/* Ascend-specific Features Section */}
          {isAscend && (
            <div className="py-12 border-t border-gray-200">
              <h2 className="text-4xl font-bold mb-12 text-gray-900">Key Features</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Feature 1 */}
                <div className="space-y-4">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center text-xl">📊</div>
                  <h3 className="text-xl font-bold text-gray-900">Habit Tracking</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Track your daily habits with intuitive dashboards. Visualize progress with charts, rings, and streaks.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="space-y-4">
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center text-xl">✍️</div>
                  <h3 className="text-xl font-bold text-gray-900">Journaling</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Capture your wins, goals, and notes. Build a personal record of your progress and achievements.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="space-y-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl">🔄</div>
                  <h3 className="text-xl font-bold text-gray-900">Cloud Sync</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Seamlessly sync across all your devices. Your habits follow you everywhere with real-time updates.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="space-y-4">
                  <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center text-xl">💡</div>
                  <h3 className="text-xl font-bold text-gray-900">Smart Insights</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Discover personalized wellness recommendations based on your habits and health categories.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Ascend App Preview */}
          {isAscend && (
            <div className="py-12 border-t border-gray-200">
              <h2 className="text-4xl font-bold mb-12 text-gray-900">Experience Ascend</h2>
              <p className="text-xl text-gray-600 mb-12 max-w-2xl">
                Ascend is your personal wellness companion. Build better habits, track your progress, and achieve your goals with our intuitive mobile app.
              </p>

              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <p className="text-gray-600 text-center py-12">
                  👆 Click the "Launch Ascend" button above to see the app in action and start your wellness journey.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
