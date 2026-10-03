import Link from 'next/link';
import { ArrowRight, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Error Code */}
        <div>
          <div className="text-9xl font-bold text-blue-500/20 mb-4">404</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Page Not Found</h1>
          <p className="text-lg text-slate-400">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Illustration / Decoration */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Navigation Options */}
        <div className="space-y-4">
          <p className="text-slate-400">Here are some helpful links instead:</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors w-full sm:w-auto">
                <Home size={18} />
                Back to Home
              </button>
            </Link>
            <Link href="/projects">
              <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-600 text-slate-300 hover:bg-slate-800 rounded-lg font-semibold transition-colors w-full sm:w-auto">
                Browse Products
                <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="pt-8 border-t border-slate-800">
          <p className="text-slate-500 text-sm mb-4">Quick Navigation</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
              Home
            </Link>
            <Link href="/projects" className="text-slate-400 hover:text-white text-sm transition-colors">
              Projects
            </Link>
            <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">
              Dashboard
            </Link>
            <Link href="/projects/ascend" className="text-slate-400 hover:text-white text-sm transition-colors">
              Ascend
            </Link>
            <Link href="/projects/geointel" className="text-slate-400 hover:text-white text-sm transition-colors">
              GeoIntel
            </Link>
            <Link href="/login" className="text-slate-400 hover:text-white text-sm transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
