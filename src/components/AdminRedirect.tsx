import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminRedirectProps {
  children: React.ReactNode;
}

const AdminRedirect: React.FC<AdminRedirectProps> = ({ children }) => {
  const { currentUser, userRole, isLoading } = useAuth();
  
  // If still loading, show nothing to prevent flicker
  if (isLoading) {
    return null;
  }
  
  // If user is already logged in as admin, redirect to admin dashboard
  if (currentUser && userRole === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  }
  
  // Otherwise, show the login component
  return <>{children}</>;
};

export default AdminRedirect; 