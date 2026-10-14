import React from 'react';
import { Layers, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { Link } from 'react-router-dom';
import type { ChapterProgressStat } from '../../types/progress';

interface ChapterProgressGridProps {
  chapterStats: ChapterProgressStat[];
}

export const ChapterProgressGrid: React.FC<ChapterProgressGridProps> = ({
  chapterStats,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-400" />
            Chapter Breakdown
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Progress across structured data structures and algorithm categories.
          </p>
        </div>

        <Link
          to="/problems"
          className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1 transition-colors"
        >
          <span>View All in Sheet</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapterStats.map((chapter) => {
          const isComplete =
            chapter.totalProblems > 0 &&
            chapter.completedProblems >= chapter.totalProblems;
          const isInProgress =
            chapter.completedProblems > 0 && !isComplete;

          return (
            <Card
              key={chapter.chapterId}
              isHoverable
              className="bg-slate-900/80 border-slate-800/90 flex flex-col justify-between"
            >
              <CardHeader className="pb-3 border-b-0">
                <div className="flex items-start justify-between gap-3 w-full">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                      Chapter #{chapter.order}
                    </span>
                    <CardTitle className="text-base text-slate-100 line-clamp-1">
                      {chapter.title}
                    </CardTitle>
                  </div>

                  {isComplete ? (
                    <Badge variant="success" size="sm" hasDot>
                      Complete
                    </Badge>
                  ) : isInProgress ? (
                    <Badge variant="brand" size="sm" hasDot>
                      In Progress
                    </Badge>
                  ) : (
                    <Badge variant="neutral" size="sm">
                      Not Started
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      {chapter.completedProblems} of {chapter.totalProblems} solved
                    </span>
                    <span className="font-mono font-semibold text-slate-300">
                      {chapter.completionPercentage}%
                    </span>
                  </div>

                  <ProgressBar
                    value={chapter.completionPercentage}
                    size="sm"
                    variant={isComplete ? 'success' : 'brand'}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
