import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  FormTextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Tabs,
  Tab,
  TabPanel,
  Form,
} from '@/shared/components/venturo-ui';
import { useFormRole } from '../hooks/useFormRole';
import { PermissionSelector } from './PermissionSelector';
import type { RoleWithPermissions } from '@/app/api/role/type';

interface RoleFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  role?: RoleWithPermissions | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const RoleForm: React.FC<RoleFormProps> = ({
  open,
  mode,
  role,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const {
    form,
    onSubmit,
    permissions,
    isLoadingRole,
    isLoadingPermissions,
    isSubmitting,
    handlePermissionToggle,
    handleSelectAllPermissions,
    handleClearAllPermissions,
    resetForm,
  } = useFormRole({
    mode,
    roleId: role?.id,
    onSuccess: () => {
      onSuccess();
      onClose();
    },
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      resetForm();
      setActiveTab(0);
    }
  }, [open, resetForm]);

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: 600,
        },
      }}
    >
      <DialogTitle sx={{
        '&.MuiTypography-root': {
            paddingBottom: 0
        }
      }}>
        <Typography variant="h5" component="div">
          {mode === 'edit' ? 'Edit Role' : 'Create New Role'}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="div">
          {mode === 'edit'
            ? 'Update role information and permissions'
            : 'Create a new role and assign permissions'
          }
        </Typography>
      </DialogTitle>

      <Form form={form} onSubmit={onSubmit}>
        <DialogContent sx={{ pb: 2 }}>
          {isLoadingRole && mode === 'edit' ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Tabs value={activeTab} onChange={handleTabChange} aria-label="role form tabs">
                <Tab label="Basic Information" />
                <Tab label="Permission" />
              </Tabs>

              <TabPanel value={activeTab} index={0}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormTextField
                    name="name"
                    label="Role Name"
                    required
                    disabled={isSubmitting}
                    placeholder="e.g., Administrator, Moderator, User"
                    rules={{
                      required: 'Role name is required',
                      validate: (value) => value.trim().length > 0 || 'Role name cannot be empty'
                    }}
                  />

                  <FormTextField
                    name="description"
                    label="Description"
                    required
                    disabled={isSubmitting}
                    multiline
                    rows={3}
                    placeholder="Describe the role and its purpose"
                    rules={{
                      required: 'Description is required',
                      validate: (value) => value.trim().length > 0 || 'Description cannot be empty'
                    }}
                  />

                  <Controller
                    name="is_active"
                    control={form.control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={isSubmitting}
                          />
                        }
                        label="Active"
                        sx={{ ml: 0 }}
                      />
                    )}
                  />
                </Box>
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <Controller
                  name="permissions"
                  control={form.control}
                  rules={{
                    validate: (value) => value.length > 0 || 'At least one permission is required'
                  }}
                  render={({ field, fieldState }) => (
                    <PermissionSelector
                      permissions={permissions}
                      selectedPermissions={field.value}
                      onPermissionToggle={handlePermissionToggle}
                      onSelectAll={handleSelectAllPermissions}
                      onClearAll={handleClearAllPermissions}
                      error={fieldState.error?.message}
                      disabled={isSubmitting}
                      isLoading={isLoadingPermissions}
                    />
                  )}
                />
              </TabPanel>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleClose}
            disabled={isSubmitting}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
          >
            {isSubmitting
              ? (mode === 'edit' ? 'Updating...' : 'Creating...')
              : (mode === 'edit' ? 'Update Role' : 'Create Role')
            }
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
