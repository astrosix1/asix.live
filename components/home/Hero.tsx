import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900" />

      {/* Content */}
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">asixstud.io</span>
        </h1>

        <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          A hub for innovative webapps and projects that push the boundaries of what's possible.
        </p>

        <p className="text-lg text-slate-500 dark:text-slate-500 max-w-2xl mx-auto">
          Explore three cutting-edge applications built to solve real-world problems.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/#projects">
            <Button size="lg" className="px-8">
              Explore Projects
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="px-8">
              Get in Touch
            </Button>
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="text-slate-400" size={24} />
        </div>
      </div>
    </div>
  );
}
