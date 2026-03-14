import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../auth';

interface GuestGuardProps {
  children: ReactNode;
}

const getRedirectByRole = (roleName?: string): string => {
  switch (roleName?.toLowerCase()) {
    case 'user':
      return '/chat';
    case 'admin':
    case 'superadmin':
      return '/';  // dashboard/sample-page
    default:
      return '/chat'; // default ke chat
  }
};

export const GuestGuard = ({ children }: GuestGuardProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    const redirectTo = getRedirectByRole(user?.role?.name);
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};