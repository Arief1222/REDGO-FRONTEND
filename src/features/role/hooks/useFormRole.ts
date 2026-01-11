import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { usePostRoles, usePutRoles, useGetRoles } from '@/app/api/role/useRoleApi';
import { useGetListPermissions } from '@/app/api/permission/usePermissionApi';
import { useToast } from '@/shared/hooks/useToast';
import type { CreateRoleData, UpdateRoleData } from '@/app/api/role/type';

/**
 * Options for useFormRole hook
 */
interface UseFormRoleOptions {
  mode: 'create' | 'edit';
  roleId?: string;
  onSuccess?: () => void;
}

/**
 * Form data interface for role creation/update
 */
interface RoleFormData {
  name: string;
  description: string;
  is_active: boolean;
  permissions: string[];
}

/**
 * Custom hook for managing role form operations
 * Handles form validation, submission, and role/permission fetching
 */
export const useFormRole = ({ mode, roleId, onSuccess }: UseFormRoleOptions) => {
  const toast = useToast();

  // Form setup with React Hook Form
  const form = useForm<RoleFormData>({
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
      permissions: [],
    },
    mode: 'onChange',
  });

  // Fetch role detail for edit mode
  const { data: roleData, isLoading: isLoadingRole } = useGetRoles(
    roleId!,
    { enabled: mode === 'edit' && !!roleId }
  );

  // Fetch permissions for dropdown
  const {
    data: permissionsData,
    isLoading: isLoadingPermissions,
  } = useGetListPermissions(
    { limit: 100 },
    {
      enabled: true,
    }
  );

  // Create mutation
  const createRoleMutation = usePostRoles({
    onSuccess: () => {
      form.reset();
      onSuccess?.();
    },
  });

  // Update mutation
  const updateRoleMutation = usePutRoles({
    onSuccess: () => {
      onSuccess?.();
    },
  });

  // Extract data
  const role = roleData?.data?.data;
  const permissions = permissionsData?.data?.data || [];

  // Initialize form data based on mode
  useEffect(() => {
    if (mode === 'edit' && role) {
      form.reset({
        name: role.name || '',
        description: role.description || '',
        is_active: role.is_active ?? true,
        permissions: role.permissions?.map(p => p.id) || [],
      });
    } else {
      form.reset({
        name: '',
        description: '',
        is_active: true,
        permissions: [],
      });
    }
  }, [role, mode, form]);

  // Form handlers
  const handlePermissionToggle = useCallback((permissionId: string) => {
    const currentPermissions = form.getValues('permissions');
    const newPermissions = currentPermissions.includes(permissionId)
      ? currentPermissions.filter(id => id !== permissionId)
      : [...currentPermissions, permissionId];

    form.setValue('permissions', newPermissions, {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [form]);

  const handleSelectAllPermissions = useCallback(() => {
    const allPermissionIds = permissions.map(p => p.id);
    form.setValue('permissions', allPermissionIds, {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [permissions, form]);

  const handleClearAllPermissions = useCallback(() => {
    form.setValue('permissions', [], {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [form]);

  const resetForm = useCallback(() => {
    form.reset({
      name: '',
      description: '',
      is_active: true,
      permissions: [],
    });
  }, [form]);

  // Form submission handler
  const onSubmit = useCallback(async (data: RoleFormData) => {
    try {
      const submitData: CreateRoleData | UpdateRoleData = {
        name: data.name.trim(),
        description: data.description.trim(),
        is_active: data.is_active,
        permissions: data.permissions,
      };

      if (mode === 'create') {
        await createRoleMutation.mutateAsync(submitData as CreateRoleData);
        toast.success('Role created successfully!');
      } else if (mode === 'edit' && roleId) {
        await updateRoleMutation.mutateAsync({ id: roleId, data: submitData });
        toast.success('Role updated successfully!');
      }
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
      console.error('Form submission error:', error);
    }
  }, [mode, roleId, createRoleMutation, updateRoleMutation, onSuccess, toast]);

  return {
    // Form instance
    form,
    onSubmit,

    // Data
    permissions,

    // Loading states
    isLoadingRole,
    isLoadingPermissions,
    isSubmitting: form.formState.isSubmitting || createRoleMutation.isPending || updateRoleMutation.isPending,

    // Role-specific handlers
    handlePermissionToggle,
    handleSelectAllPermissions,
    handleClearAllPermissions,
    resetForm,
  };
};
