import Link from "next/link";
import { getProjectSubdomain } from "@/lib/subdomain";
import { redirect } from "next/navigation";

export default function Home() {
  const projectSubdomain = getProjectSubdomain();

  // If on a project subdomain, redirect to that project's full-screen page
  if (projectSubdomain === "ascend") {
    return <AscendFullScreen />;
  }

  // Otherwise, show the portfolio home
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-32 space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
              Creative
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Projects
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
              A curated collection of digital experiences. Built with modern technology, designed with purpose.
            </p>
          </div>

          <div className="flex gap-4 pt-8">
            <Link
              href="/projects"
              className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
            >
              View Projects
            </Link>
            <Link
              href="#"
              className="px-8 py-3 border border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Projects Preview */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/projects/ascend" className="group">
              <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Ascend</h3>
                    <p className="text-sm text-gray-500">Habit Tracker</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Track habits and build wellness routines with our intuitive mobile app.</p>
                <div className="flex gap-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">React Native</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Supabase</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Full-screen Ascend app embedded via iframe
 * Renders when user visits ascend.asixstud.io
 */
function AscendFullScreen() {
  return (
    <div className="w-full h-screen">
      <iframe
        src="https://ascend.asix.live/"
        className="w-full h-full border-none"
        title="Ascend - Habit Tracker"
        allow="camera; microphone; geolocation"
      />
    </div>
  );
}
