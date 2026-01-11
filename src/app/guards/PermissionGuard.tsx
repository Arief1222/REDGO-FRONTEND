import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../auth';
import { ROUTES } from '../constants/router';

/**
 * Permission Guard Component
 * Checks if user has required permission(s)
 */

interface PermissionGuardProps {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean; // If true, user must have ALL permissions. If false, user must have AT LEAST ONE
  fallbackPath?: string; // Where to redirect if permission check fails (default: "/")
}

export const PermissionGuard = ({
  children,
  permission,
  permissions = [],
  requireAll = true,
  fallbackPath = ROUTES.ERROR.FORBIDDEN,
}: PermissionGuardProps) => {
  const { user, isLoading } = useAuth();

  // Build permissions array
  const permissionsToCheck = permission ? [permission] : permissions;

  // No permissions specified, allow access
  if (permissionsToCheck.length === 0) {
    return <>{children}</>;
  }

  // Wait for user data to load before checking permissions
  if (isLoading) {
    return null;
  }

  // Check permissions
  const hasPermission = checkUserPermissions(user, permissionsToCheck, requireAll);

  // Redirect if permission check fails
  if (!hasPermission) {
    return <Navigate to={fallbackPath} replace />;
  }

  // User has required permissions
  return <>{children}</>;
};

/**
 * Helper function to check user permissions
 * Checks if user has required permission(s) based on their role
 */
function checkUserPermissions(
  user: any,
  permissions: string[],
  requireAll: boolean
): boolean {
  if (!user || !user.role || !user.role.permissions) return false;

  // Get user's permissions from role (already an array of strings)
  const userPermissions = user.role.permissions;

  if (requireAll) {
    // User must have ALL required permissions
    return permissions.every((permission) =>
      userPermissions.includes(permission)
    );
  } else {
    // User must have AT LEAST ONE required permission
    return permissions.some((permission) =>
      userPermissions.includes(permission)
    );
  }
}
