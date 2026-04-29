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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to asixstud</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            A collection of projects showcasing web development, design, and innovative solutions.
          </p>
          <Link
            href="/projects"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Explore Projects
          </Link>
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
