import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { currentUser, userRole, isLoading, isPersistent } = useAuth();
  const location = useLocation();

  // Show loading state only if we're still loading and there's a persistent session
  // This prevents unnecessary loading screen flashes when no user is logged in
  if (isLoading && isPersistent) {
    // Show loading spinner or skeleton for persistent sessions
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    // For admin routes, redirect to admin login page
    if (requiredRole === 'admin') {
      return <Navigate to="/admin" state={{ from: location }} replace />;
    }
    // For regular routes, redirect to regular login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is required and user doesn't have it
  if (requiredRole && userRole !== requiredRole) {
    // If admin role is required but user is not admin, redirect to admin login
    if (requiredRole === 'admin') {
      return <Navigate to="/admin" state={{ from: location }} replace />;
    }
    // For other roles, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and has required role (or no specific role required), render children
  return <Outlet />;
};

export default ProtectedRoute; 