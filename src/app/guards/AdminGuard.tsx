import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../auth';

interface AdminGuardProps {
  children: ReactNode;
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
  const { user } = useAuth();
  const role = user?.role?.name?.toLowerCase();

  if (role === 'user' && !window.location.pathname.startsWith('/chat')) {
    return <Navigate to="/chat" replace />;
  }

  return <>{children}</>;
};