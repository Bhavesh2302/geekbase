import React from 'react';
import { Video, Code, BookOpen } from 'lucide-react';
import type { ProblemResources } from '../../types/catalog';

interface ResourceLinksProps {
  resources?: ProblemResources;
  problemTitle: string;
}

export const ResourceLinks: React.FC<ResourceLinksProps> = ({
  resources,
  problemTitle,
}) => {
  if (!resources) return null;

  const { youtubeUrl, practiceUrl, articleUrl } = resources;

  return (
    <div
      className="flex items-center gap-1.5"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Practice / Problem Link */}
      {practiceUrl ? (
        <a
          href={practiceUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Practice "${problemTitle}" on LeetCode/Platform`}
          aria-label={`Practice "${problemTitle}" (opens in new tab)`}
          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-300 hover:bg-brand-500/15 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <Code className="w-4 h-4" />
        </a>
      ) : (
        <span
          className="p-1.5 text-slate-700 cursor-not-allowed"
          title="Practice link not available"
          aria-hidden="true"
        >
          <Code className="w-4 h-4" />
        </span>
      )}

      {/* Video Solution Link */}
      {youtubeUrl ? (
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Watch video tutorial for "${problemTitle}"`}
          aria-label={`Watch video tutorial for "${problemTitle}" (opens in new tab)`}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        >
          <Video className="w-4 h-4" />
        </a>
      ) : (
        <span
          className="p-1.5 text-slate-700 cursor-not-allowed"
          title="Video tutorial not available"
          aria-hidden="true"
        >
          <Video className="w-4 h-4" />
        </span>
      )}

      {/* Editorial / Article Link */}
      {articleUrl ? (
        <a
          href={articleUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Read article editorial for "${problemTitle}"`}
          aria-label={`Read article editorial for "${problemTitle}" (opens in new tab)`}
          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-300 hover:bg-sky-500/15 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <BookOpen className="w-4 h-4" />
        </a>
      ) : (
        <span
          className="p-1.5 text-slate-700 cursor-not-allowed"
          title="Article editorial not available"
          aria-hidden="true"
        >
          <BookOpen className="w-4 h-4" />
        </span>
      )}
    </div>
  );
};
