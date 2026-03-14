import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../auth';
import { ROUTES } from '../constants/router';
import Spinner from '../../shared/components/common/Spinner';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN_1} replace />;
  }

  return <>{children}</>;
};