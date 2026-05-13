'use client';

interface TagFilterProps {
  allTags: string[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
}

export default function TagFilter({ allTags, activeTag, onTagChange }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onTagChange(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          activeTag === null
            ? 'bg-blue-600 text-white'
            : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-blue-500 hover:text-slate-200'
        }`}
      >
        All
      </button>
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(activeTag === tag ? null : tag)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeTag === tag
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-blue-500 hover:text-slate-200'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
