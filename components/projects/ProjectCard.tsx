import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  category: string;
  color: string;
}

export default function ProjectCard({
  id,
  slug,
  name,
  tagline,
  description,
  image,
  category,
  color,
}: ProjectCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      {/* Image Container */}
      <div className="relative h-48 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        {image && image !== '/images/projects/ascend.jpg' ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl"
            style={{ backgroundColor: color + '20' }}
          >
            <span className="text-6xl">📦</span>
          </div>
        )}
      </div>

      {/* Content */}
      <CardHeader className="flex-grow">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-xl">{name}</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
        </div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">{tagline}</p>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>

      {/* Footer */}
      <CardContent className="pt-0">
        <Link href={`/projects/${slug}`}>
          <Button className="w-full" variant="default">
            Explore <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
