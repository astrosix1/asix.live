interface BlogHeroProps {
  title: string;
  description: string;
  author: string;
  date: string;
  readingTime: string;
  tags: string[];
  coverImage: string | null;
}

export default function BlogHero({
  title,
  description,
  author,
  date,
  readingTime,
  tags,
  coverImage,
}: BlogHeroProps) {
  return (
    <div className="relative h-80 md:h-96 w-full overflow-hidden">
      {/* Background */}
      {coverImage ? (
        <img
          src={coverImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/50 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 max-w-3xl mx-auto w-full">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-2">
          {title}
        </h1>

        <p className="text-slate-300 text-base mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center gap-3 text-slate-400 text-sm">
          <span className="font-medium text-slate-300">{author}</span>
          <span>·</span>
          <span>{date}</span>
          <span>·</span>
          <span>{readingTime}</span>
        </div>
      </div>
    </div>
  );
}
