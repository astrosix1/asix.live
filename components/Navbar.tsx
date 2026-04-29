'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    const { signOut } = await import('@/lib/auth');
    await signOut();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
            asix
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/projects" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Projects
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                      Admin
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-sm font-medium px-4 py-2 text-gray-900 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="text-sm font-medium px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200">
                    Sign In
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
