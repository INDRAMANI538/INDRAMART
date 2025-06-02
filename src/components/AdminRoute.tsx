// src/components/AdminRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!currentUser || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
