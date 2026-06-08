import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSupabaseAuth as useAuth } from '@/lib/SupabaseAuthContext';

export default function ProtectedRoute({ unauthenticatedElement }) {
  const { isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="font-display text-primary text-sm tracking-wider neon-text-sm">NsRacing</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return unauthenticatedElement || <Navigate to="/login" replace />;
  }

  return <Outlet />;
}