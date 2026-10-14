import React from 'react';
import { LayoutDashboard, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <LayoutDashboard className="w-6 h-6 text-brand-400" />
            Dashboard
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Overview of your DSA preparation trajectory and daily assignments.
          </p>
        </div>
        <div>
          <Badge variant="brand" size="md" hasDot>
            Foundational Layout Active
          </Badge>
        </div>
      </div>

      {/* Overview Card */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Welcome to Geekbase</CardTitle>
            <CardDescription>
              Your frontend infrastructure is connected and ready for feature implementation.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            The authenticated layout, query caching, API client, and reusable component systems are actively configured. Navigate through the primary modules below:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <Link to="/problems" className="block">
              <Card isHoverable className="p-4 bg-slate-900/50">
                <h4 className="font-semibold text-slate-200 text-sm">DSA Sheet</h4>
                <p className="text-xs text-slate-400 mt-1">Curated problem roadmap</p>
              </Card>
            </Link>
            <Link to="/calendar" className="block">
              <Card isHoverable className="p-4 bg-slate-900/50">
                <h4 className="font-semibold text-slate-200 text-sm">Study Calendar</h4>
                <p className="text-xs text-slate-400 mt-1">Revision schedule & planner</p>
              </Card>
            </Link>
            <Link to="/progress" className="block">
              <Card isHoverable className="p-4 bg-slate-900/50">
                <h4 className="font-semibold text-slate-200 text-sm">My Progress</h4>
                <p className="text-xs text-slate-400 mt-1">Completion analytics & stats</p>
              </Card>
            </Link>
          </div>
          <div className="pt-2">
            <Link to="/problems">
              <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore DSA Sheet
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
