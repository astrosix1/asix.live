import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';

interface ProjectHeroProps {
  name: string;
  tagline: string;
  description: string;
  image: string;
  category: string;
  color: string;
}

export default function ProjectHero({
  name,
  tagline,
  description,
  image,
  category,
  color,
}: ProjectHeroProps) {
  return (
    <div className="relative h-96 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden mb-8">
      {/* Background */}
      {image && image !== '/images/projects/ascend.jpg' ? (
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center text-center"
          style={{ backgroundColor: color + '40' }}
        >
          <div className="space-y-4">
            <div className="text-8xl">📦</div>
            <p className="text-white text-lg font-semibold">Project Image Coming Soon</p>
          </div>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <div className="max-w-3xl">
          <Badge className="mb-4" variant="secondary">
            {category}
          </Badge>
          <h1 className="text-5xl font-bold text-white mb-2">{name}</h1>
          <p className="text-xl text-slate-100 mb-4">{tagline}</p>
          <p className="text-lg text-slate-200 max-w-2xl">{description}</p>
        </div>
      </div>
    </div>
  );
}
