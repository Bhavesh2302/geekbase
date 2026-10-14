import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { DifficultyBadge } from '../ui/Badge';
import type { ContinueLearningRecommendation } from '../../types/dashboard';

interface ContinueLearningCardProps {
  recommendation: ContinueLearningRecommendation;
}

export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({
  recommendation,
}) => {
  const { problem, reason } = recommendation;

  // Case 1: All problems completed
  if (!problem) {
    return (
      <Card className="border-emerald-500/30 bg-emerald-950/10 shadow-lg">
        <CardContent className="p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-glow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Curriculum Complete
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                All Available Problems Solved!
              </h3>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">{reason}</p>
            </div>
          </div>

          <Link to="/calendar" className="shrink-0 w-full sm:w-auto">
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              leftIcon={<BookOpen className="w-4 h-4" />}
            >
              Review Calendar
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Case 2: Active recommendation
  return (
    <Card className="border-brand-500/40 bg-gradient-to-r from-brand-950/40 via-slate-900/90 to-slate-900 shadow-xl overflow-hidden relative">
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-500/10 to-transparent pointer-events-none" />

      <CardContent className="p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold tracking-wide uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Recommended Next Step
              </span>
              <span className="text-xs text-slate-400 font-medium">
                • {reason}
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {problem.title}
                </h3>
                <DifficultyBadge difficulty={problem.difficulty} size="md" />
              </div>

              {(problem.chapterTitle || problem.topicTitle) && (
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                  {problem.chapterTitle && (
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-500" />
                      {problem.chapterTitle}
                    </span>
                  )}
                  {problem.topicTitle && (
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      {problem.topicTitle}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to={`/problems`} className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto shadow-glow font-semibold"
                rightIcon={<Play className="w-4 h-4 fill-current" />}
              >
                Continue Learning
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
