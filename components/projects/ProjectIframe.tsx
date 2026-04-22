'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ExternalLink } from 'lucide-react';

interface ProjectIframeProps {
  iframeUrl: string | null;
  externalUrl: string | null;
  projectName: string;
  projectColor: string;
}

export default function ProjectIframe({
  iframeUrl,
  externalUrl,
  projectName,
  projectColor,
}: ProjectIframeProps) {
  const [isLoading, setIsLoading] = useState(true);

  // If no iframe URL available
  if (!iframeUrl) {
    return (
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Live Demo</h2>
        <div
          className="w-full h-96 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center"
          style={{ backgroundColor: projectColor + '10' }}
        >
          <div className="text-center space-y-4">
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
              Live demo coming soon
            </p>
            {externalUrl && (
              <Link href={externalUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="default" className="gap-2">
                  Visit Live Project
                  <ExternalLink size={16} />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If iframe URL available
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-6">Live Demo</h2>
      <div className="relative w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
        {/* Loading skeleton */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse z-10" />
        )}

        {/* Iframe */}
        <iframe
          src={iframeUrl}
          title={`${projectName} Live Demo`}
          className="w-full h-screen max-h-96"
          onLoad={() => setIsLoading(false)}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>

      {externalUrl && (
        <div className="mt-4 flex justify-center">
          <Link href={externalUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2">
              Open in New Tab
              <ExternalLink size={16} />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
