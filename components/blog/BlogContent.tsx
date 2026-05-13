'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';

interface BlogContentProps {
  content: string;
}

const components: Components = {
  pre({ children }) {
    return <>{children}</>;
  },
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    if (match) {
      return (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          className="rounded-lg my-4 text-sm"
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      );
    }
    return (
      <code
        className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    );
  },
  h1({ children }) {
    return <h1 className="text-white text-3xl font-bold mt-10 mb-4">{children}</h1>;
  },
  h2({ children }) {
    return <h2 className="text-white text-2xl font-bold mt-8 mb-4">{children}</h2>;
  },
  h3({ children }) {
    return <h3 className="text-white text-xl font-semibold mt-6 mb-3">{children}</h3>;
  },
  p({ children }) {
    return <p className="text-slate-300 leading-relaxed mb-4">{children}</p>;
  },
  a({ href, children }) {
    return (
      <a
        href={href}
        className="text-blue-400 underline hover:text-blue-300 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  },
  blockquote({ children }) {
    return (
      <blockquote className="border-l-4 border-blue-500 pl-4 text-slate-400 italic my-4">
        {children}
      </blockquote>
    );
  },
  ul({ children }) {
    return <ul className="text-slate-300 mb-4 space-y-1 pl-5 list-disc">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="text-slate-300 mb-4 space-y-1 pl-5 list-decimal">{children}</ol>;
  },
  li({ children }) {
    return <li className="leading-relaxed">{children}</li>;
  },
  hr() {
    return <hr className="border-slate-700 my-8" />;
  },
  strong({ children }) {
    return <strong className="text-white font-semibold">{children}</strong>;
  },
  em({ children }) {
    return <em className="text-slate-300 italic">{children}</em>;
  },
  img({ src, alt }) {
    return (
      <img
        src={src}
        alt={alt}
        className="rounded-lg my-6 w-full object-cover"
      />
    );
  },
};

export default function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="text-slate-300">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
