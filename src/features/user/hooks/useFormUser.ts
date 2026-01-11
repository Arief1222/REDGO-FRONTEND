import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { usePostUsers, usePutUsers, useGetUsers } from '@/app/api/user/useUserApi';
import { useGetListRoles } from '@/app/api/role/useRoleApi';
import { useToast } from '@/shared/hooks/useToast';
import type { CreateUserData, UpdateUserData } from '@/app/api/user/type';

/**
 * Form data interface for user creation/update
 */
interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role_id: string;
  is_active: string; // '1' for active, '0' for inactive
}

/**
 * Hook options interface
 */
interface UseFormUserOptions {
  mode: 'create' | 'edit';
  userId?: string;
  onSuccess?: () => void;
}

/**
 * Custom hook for managing user form operations
 * Handles form validation, submission, and user/role fetching
 */
export const useFormUser = ({ mode, userId, onSuccess }: UseFormUserOptions) => {
  const toast = useToast();

  // Fetch user detail for edit mode
  const { data: userData, isLoading: isLoadingUser } = useGetUsers(
    userId!,
    { enabled: mode === 'edit' && !!userId }
  );

  // Fetch roles for dropdown
  const { data: rolesData, isLoading: isLoadingRoles } = useGetListRoles({
    page: 1,
    limit: 100,
  });

  // Form setup with React Hook Form
  const form = useForm<UserFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role_id: '',
      is_active: '1',
    },
  });

  // Create mutation
  const createMutation = usePostUsers({
    onSuccess: () => {
      form.reset();
      onSuccess?.();
    },
  });

  // Update mutation
  const updateMutation = usePutUsers({
    onSuccess: () => {
      onSuccess?.();
    },
  });

  // Extract data
  const user = userData?.data?.data;
  const roles = rolesData?.data?.data || [];

  // Initialize form data based on mode
  useEffect(() => {
    if (mode === 'edit' && user) {
      form.reset({
        name: user.name,
        email: user.email,
        role_id: user.role?.id || '',
        is_active: user.is_active ? '1' : '0',
        password: '', // Clear password field in edit mode
      });
    } else {
      form.reset({
        name: '',
        email: '',
        password: '',
        role_id: '',
        is_active: '1',
      });
    }
  }, [user, mode, form]);

  // Form submission handler
  const onSubmit = useCallback(async (data: UserFormData) => {
    try {
      if (mode === 'create') {
        const createData: CreateUserData = {
          name: data.name,
          email: data.email,
          password: data.password!,
          role_id: data.role_id,
        };
        await createMutation.mutateAsync(createData);
        toast.success('User created successfully!');
      } else if (mode === 'edit' && userId) {
        const updateData: UpdateUserData = {
          name: data.name,
          email: data.email,
          role_id: data.role_id,
          is_active: data.is_active === '1',
        };
        await updateMutation.mutateAsync({ id: userId, data: updateData });
        toast.success('User updated successfully!');
      }
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
      console.error('Form submission error:', error);
    }
  }, [mode, userId, createMutation, updateMutation, onSuccess, toast]);

  return {
    // Form instance for Form component
    form,
    onSubmit,

    // Data
    roles,

    // Loading states
    isLoadingUser,
    isLoadingRoles,
    isSubmitting: form.formState.isSubmitting || createMutation.isPending || updateMutation.isPending,

    // Error states
    submitError: createMutation.error || updateMutation.error,
  };
};
