import React from 'react';
import { Target, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { DifficultyBadge } from '../ui/Badge';
import type { ContinueLearningRecommendation } from '../../types/dashboard';

export interface ContinueLearningCardProps {
  recommendation: ContinueLearningRecommendation;
}

export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({
  recommendation,
}) => {
  const { problem, reason } = recommendation;

  return (
    <Card className="bg-gradient-to-br from-brand-950/20 via-slate-900/60 to-slate-900/90 border-slate-800 shadow-lg">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                Continue Learning
              </h4>
              <p className="text-[11px] text-slate-400">
                Recommended next step based on your current progress
              </p>
            </div>
          </div>

          <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
        </div>

        {problem ? (
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-start justify-between gap-2.5">
              <div className="min-w-0 flex-1">
                <span className="text-sm font-bold text-slate-100 block truncate">
                  {problem.title}
                </span>
                {(problem.chapterTitle || problem.topicTitle) && (
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {problem.chapterTitle}
                    {problem.chapterTitle && problem.topicTitle && ' • '}
                    {problem.topicTitle}
                  </p>
                )}
              </div>
              <DifficultyBadge difficulty={problem.difficulty} size="sm" />
            </div>

            {reason && (
              <p className="text-xs text-brand-300/90 italic pt-1 border-t border-slate-800/60">
                "{reason}"
              </p>
            )}
          </div>
        ) : (
          <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-400">
            {reason || 'All problems completed! Great job maintaining your momentum.'}
          </div>
        )}

        <div className="pt-1">
          <Link to="/problems" className="block">
            <Button
              variant="primary"
              size="sm"
              className="w-full justify-center"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {problem ? 'Resume Practice' : 'Review DSA Sheet'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
