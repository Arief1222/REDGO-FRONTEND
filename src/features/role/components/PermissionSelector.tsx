import React, { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Card,
  Chip,
  CircularProgress,
  TextField,
} from '@/shared/components/venturo-ui';
import { IconSearch, IconX } from '@tabler/icons-react';
import type { Permission } from '@/app/api/permission/type';

interface PermissionSelectorProps {
  permissions: Permission[];
  selectedPermissions: string[];
  onPermissionToggle: (permissionId: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  error?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

interface PermissionGroup {
  resource: string;
  permissions: Permission[];
}

export const PermissionSelector: React.FC<PermissionSelectorProps> = ({
  permissions,
  selectedPermissions,
  onPermissionToggle,
  onSelectAll,
  onClearAll,
  error,
  disabled = false,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Group permissions by resource
  const getPermissionGroups = (perms: Permission[]): PermissionGroup[] => {
    const groups: Record<string, Permission[]> = {};
    
    perms.forEach(permission => {
      const [resource] = permission.name.split('.');
      if (!groups[resource]) {
        groups[resource] = [];
      }
      groups[resource].push(permission);
    });

    return Object.entries(groups).map(([resource, perms]) => ({
      resource,
      permissions: perms,
    }));
  };

  // Filter permissions based on search
  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const permissionGroups = getPermissionGroups(filteredPermissions);

  // Toggle group expansion
  const toggleGroupExpansion = (resource: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resource)) {
        newSet.delete(resource);
      } else {
        newSet.add(resource);
      }
      return newSet;
    });
  };

  // Check if all permissions in a group are selected
  const isGroupFullySelected = (groupPermissions: Permission[]): boolean => {
    return groupPermissions.length > 0 && 
           groupPermissions.every(permission => selectedPermissions.includes(permission.id));
  };

  // Check if some permissions in a group are selected
  const isGroupPartiallySelected = (groupPermissions: Permission[]): boolean => {
    return groupPermissions.some(permission => selectedPermissions.includes(permission.id)) &&
           !isGroupFullySelected(groupPermissions);
  };

  // Toggle all permissions in a group
  const toggleGroupPermissions = (groupPermissions: Permission[]) => {
    const allSelected = isGroupFullySelected(groupPermissions);
    if (allSelected) {
      // Deselect all
      groupPermissions.forEach(permission => {
        if (selectedPermissions.includes(permission.id)) {
          onPermissionToggle(permission.id);
        }
      });
    } else {
      // Select all
      groupPermissions.forEach(permission => {
        if (!selectedPermissions.includes(permission.id)) {
          onPermissionToggle(permission.id);
        }
      });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Permissions
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Select permissions for this role ({selectedPermissions.length} selected)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={onSelectAll}
            disabled={disabled || selectedPermissions.length === permissions.length}
          >
            Select All
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={onClearAll}
            disabled={disabled || selectedPermissions.length === 0}
          >
            Clear All
          </Button>
        </Box>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          placeholder="Search permissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          disabled={disabled}
          InputProps={{
                startAdornment: <IconSearch size={18} style={{ marginRight: 8, opacity: 0.5 }} />,
            }}
        />
      </Box>

      {/* Error */}
      {error && (
        <Card sx={{ mb: 2, p: 2, bgcolor: 'error.light' }}>
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        </Card>
      )}

      {/* Permission Groups */}
      <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
        {permissionGroups.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="textSecondary">
              {searchTerm ? 'No permissions found matching your search.' : 'No permissions available.'}
            </Typography>
          </Box>
        ) : (
          permissionGroups.map((group) => {
            const isExpanded = expandedGroups.has(group.resource);
            const isFullySelected = isGroupFullySelected(group.permissions);
            const isPartiallySelected = isGroupPartiallySelected(group.permissions);

            return (
              <Card key={group.resource} sx={{ mb: 2 }}>
                {/* Group Header */}
                <Box
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => toggleGroupExpansion(group.resource)}
                >
                  <Checkbox
                    checked={isFullySelected}
                    indeterminate={isPartiallySelected}
                    onChange={() => toggleGroupPermissions(group.permissions)}
                    onClick={(e) => e.stopPropagation()}
                    disabled={disabled}
                  />
                  <Box sx={{ flex: 1, ml: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {group.resource.charAt(0).toUpperCase() + group.resource.slice(1)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {group.permissions.length} permissions
                    </Typography>
                  </Box>
                  <Chip
                    label={`${group.permissions.filter(p => selectedPermissions.includes(p.id)).length}/${group.permissions.length}`}
                    size="small"
                    color={isFullySelected ? 'primary' : 'default'}
                  />
                </Box>

                {/* Group Permissions */}
                {isExpanded && (
                  <Box sx={{ px: 2, pb: 2 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {group.permissions.map((permission) => (
                        <Box key={permission.id} sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedPermissions.includes(permission.id)}
                                onChange={() => onPermissionToggle(permission.id)}
                                disabled={disabled}
                                size="small"
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  {permission.name.split('.')[1]?.replace(/_/g, ' ') || permission.name}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {permission.description}
                                </Typography>
                              </Box>
                            }
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Card>
            );
          })
        )}
      </Box>

      {/* Selected Permissions Summary */}
      {selectedPermissions.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Selected Permissions ({selectedPermissions.length}):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {permissions
              .filter(p => selectedPermissions.includes(p.id))
              .map((permission) => (
                <Chip
                  key={permission.id}
                  label={permission.name}
                  size="small"
                  onDelete={() => onPermissionToggle(permission.id)}
                  deleteIcon={<IconX size={14} />}
                  disabled={disabled}
                />
              ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};
