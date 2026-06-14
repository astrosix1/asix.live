'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onLoginClick?: () => void;
}

export function Navbar({ onLoginClick }: NavbarProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const { signOut } = await import('@/lib/auth');
    await signOut();
    router.push('/');
    setMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    onLoginClick?.();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <span className="text-xl font-bold tracking-tight text-slate-900">asix</span>
            <span className="text-xl font-bold text-blue-600">.live</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/projects" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </Link>
            <Link href="/projects" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Projects
            </Link>
            <Link href="/blog" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Blog
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-sm font-medium px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLoginClick}
                    className="text-sm font-medium px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                  >
                    Sign In
                  </button>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 space-y-3">
            <Link
              href="/projects"
              className="block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/projects"
              className="block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/blog"
              className="block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-sm font-medium px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200 text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLoginClick}
                    className="w-full text-sm font-medium px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                  >
                    Sign In
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
