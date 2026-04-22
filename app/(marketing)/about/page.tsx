import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About | asixstud.io',
  description: 'Learn more about asixstud and the projects we build',
};

export default function About() {
  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">About asixstud.io</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
            A hub for innovative webapps and projects that solve real-world problems.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Mission Section */}
          <section>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Mission</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              We believe in building tools that make a real difference in people's lives. Our projects
              focus on solving specific problems with thoughtful design and robust engineering.
            </p>
          </section>

          {/* Vision Section */}
          <section>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Vision</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              To create a collection of webapps that are not just functional, but delightful to use.
              Each project is crafted with attention to detail and a commitment to excellence.
            </p>
          </section>

          {/* Projects Overview */}
          <section>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Our Projects</h2>
            <div className="space-y-6">
              {/* Ascend */}
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">🚀 Ascend</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  A competitive app that helps you replace addictions with hobbies and track progress
                  with friends. Built to motivate and support behavioral change.
                </p>
              </div>

              {/* GeoIntel */}
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">🌍 GeoIntel</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  An interactive globe displaying real-world events as they happen. Visualize global
                  patterns and explore events through an innovative 3D interface.
                </p>
              </div>

              {/* Heavy Pocket */}
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">💼 Heavy Pocket</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Your personal CFO. Financial management and analysis with enterprise-grade insights
                  for your personal and business finances.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="pt-12 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Let's Connect</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Interested in learning more about our projects or collaborating? We'd love to hear from you!
            </p>
            <Link href="/contact">
              <Button size="lg" className="gap-2">
                Get in Touch <ArrowRight size={18} />
              </Button>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
