import ProjectHero from '@/components/projects/ProjectHero';
import { Card, CardContent } from '@/components/ui/Card';
import { getProject } from '@/lib/get-project';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { LaunchGeoIntelButton } from '@/components/projects/LaunchGeoIntelButton';

export const metadata = {
  title: 'GeoIntel | asixstud.io',
  description: 'Real-time geopolitical intelligence and crisis tracking on an interactive 3D globe',
};

export default function GeoIntelProject() {
  const project = getProject('geointel');

  if (!project) {
    return <div className="text-center py-20">Project not found</div>;
  }

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <ProjectHero
          name={project.name}
          tagline={project.tagline}
          description={project.longDescription}
          image={project.image}
          category={project.category}
          color={project.color}
        />

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {project.features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <p className="text-slate-700 dark:text-slate-300">{feature}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Subscribe CTA — shown to users redirected from geointel.asix.live */}
        <section className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-lg p-12 text-center border border-amber-200 dark:border-amber-800">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Get Access to GeoIntel</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Subscribe to unlock the full GeoIntel platform — real-time crisis tracking, actor intelligence, relationship mapping, and AI-powered briefings.
          </p>
          <Link href="/checkout">
            <Button size="lg" className="gap-2 px-8">
              Subscribe Now
              <ArrowRight size={18} />
            </Button>
          </Link>
        </section>

        {/* Live App CTA — for returning subscribers */}
        <section className="mb-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-12 text-center border border-blue-200 dark:border-blue-800">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Already Subscribed?</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Launch GeoIntel and monitor global events on the interactive 3D globe.
          </p>
          <LaunchGeoIntelButton />
        </section>

        {/* Description */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">About {project.name}</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            {project.longDescription}
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            GeoIntel transforms global event data into a beautiful, interactive 3D visualization.
            See what's happening around the world in real-time, explore event details, and understand
            global patterns at a glance.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-slate-50 dark:bg-slate-900 rounded-lg p-8 border border-slate-200 dark:border-slate-800 text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Explore the Globe</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Discover what's happening around the world with GeoIntel's interactive globe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LaunchGeoIntelButton />
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Get in Touch
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
