'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onLoginClick?: () => void;
}

export function Navbar({ onLoginClick }: NavbarProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  // The homepage is a dark full-screen experience; every other page keeps the light nav.
  const dark = usePathname() === '/';
  const link = dark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900';
  const outline = dark ? 'text-slate-200 border-white/20 hover:bg-white/10' : 'text-slate-600 border-slate-300 hover:bg-slate-50';
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
    <nav className={`sticky top-0 z-50 backdrop-blur-md border-b ${dark ? 'bg-[#070B14]/80 border-white/10' : 'bg-white/95 border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <span className={`text-xl font-bold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>asix</span>
            <span className={`text-xl font-bold ${dark ? 'text-blue-400' : 'text-blue-600'}`}>.live</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/projects" className={`text-sm font-medium transition-colors ${link}`}>
              Projects
            </Link>
            <Link href="/blog" className={`text-sm font-medium transition-colors ${link}`}>
              Blog
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link href="/dashboard" className={`text-sm font-medium transition-colors ${link}`}>
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className={`text-sm font-medium px-4 py-2 border rounded-lg transition-colors duration-200 ${outline}`}
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
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className={`md:hidden p-2 transition-colors ${link}`}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t py-4 space-y-3 ${dark ? 'border-white/10' : 'border-slate-200'}`}>
            <Link
              href="/projects"
              className={`block text-sm font-medium transition-colors px-2 py-2 ${link}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/blog"
              className={`block text-sm font-medium transition-colors px-2 py-2 ${link}`}
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
                      className={`block text-sm font-medium transition-colors px-2 py-2 ${link}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className={`w-full text-sm font-medium px-4 py-2 border rounded-lg transition-colors duration-200 text-left ${outline}`}
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
