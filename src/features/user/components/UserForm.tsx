import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Form,
  FormTextField,
  FormSelect,
  CircularProgress,
} from '@/shared/components/venturo-ui';
import { useFormUser } from '../hooks/useFormUser';
import type { User } from '@/app/api/user/type';

interface UserFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  user?: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  open,
  mode,
  user,
  onClose,
  onSuccess,
}) => {
  const {
    form,
    onSubmit,
    roles,
    isLoadingUser,
    isLoadingRoles,
    isSubmitting,
  } = useFormUser({
    mode,
    userId: user?.id,
    onSuccess: () => {
      onSuccess();
      onClose();
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Create New User' : 'Edit User'}
      </DialogTitle>

      <Form form={form} onSubmit={onSubmit}>
        <DialogContent>
          {isLoadingUser && mode === 'edit' ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormTextField
              name="name"
              label="Full Name"
              placeholder="Enter full name"
              fullWidth
              required
              disabled={isSubmitting}
              rules={{
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              }}
            />

            <FormTextField
              name="email"
              type="email"
              label="Email Address"
              placeholder="Enter email address"
              fullWidth
              required
              disabled={isSubmitting}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              }}
            />

            {mode === 'create' && (
              <FormTextField
                name="password"
                type="password"
                label="Password"
                placeholder="Enter password"
                fullWidth
                required
                disabled={isSubmitting}
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                }}
              />
            )}

            <FormSelect
              name="role_id"
              label="Role"
              fullWidth
              required
              disabled={isSubmitting || isLoadingRoles}
              rules={{ required: 'Role is required' }}
              emptyOption={{ value: '', label: 'Select a role' }}
              options={roles.map((role) => ({
                value: role.id,
                label: role.name,
              }))}
            />

            {mode === 'edit' && (
              <FormSelect
                name="is_active"
                label="Status"
                fullWidth
                disabled={isSubmitting}
                options={[
                  { value: '1', label: 'Active' },
                  { value: '0', label: 'Inactive' },
                ]}
              />
            )}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            color="inherit"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? mode === 'create'
                ? 'Creating...'
                : 'Updating...'
              : mode === 'create'
              ? 'Create User'
              : 'Update User'}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
