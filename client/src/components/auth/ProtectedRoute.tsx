import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LoadingState } from '../ui/LoadingState';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState isFullScreen message="Verifying authentication session..." />;
  }

  if (!isAuthenticated) {
    // Preserve intended destination path in router state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
