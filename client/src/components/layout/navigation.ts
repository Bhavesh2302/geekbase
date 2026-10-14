import React from 'react';
import {
  LayoutDashboard,
  Code2,
  Calendar,
  BarChart3,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const navigationItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'DSA Sheet', path: '/problems', icon: Code2 },
  { label: 'Study Calendar', path: '/calendar', icon: Calendar },
  { label: 'My Progress', path: '/progress', icon: BarChart3 },
];
