import { Box, Button, Select, MenuItem, FormControl, InputLabel, Typography, Drawer, Divider } from '@/shared/components/venturo-ui';
import { IconX, IconCheck } from '@tabler/icons-react';
import React from 'react';

interface RoleFilterDrawerProps {
  open: boolean;
  isActive: boolean | undefined;
  onClose: () => void;
  onStatusChange: (value: boolean | undefined) => void;
  onApply: () => void;
}

export const RoleFilterDrawer: React.FC<RoleFilterDrawerProps> = ({
  open,
  isActive,
  onClose,
  onStatusChange,
  onApply,
}) => {
  const handleApply = () => {
    onApply();
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 320 },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Filter Roles
          </Typography>
          <Button
            onClick={onClose}
            color="inherit"
            size="small"
            sx={{ minWidth: 'auto', p: 0.5 }}
          >
            <IconX size={20} />
          </Button>
        </Box>

        <Divider />

        {/* Filter Content */}
        <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Status Filter */}
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={isActive === undefined ? '' : isActive ? 'true' : 'false'}
              onChange={(e) => {
                const value = e.target.value;
                onStatusChange(value === '' ? undefined : value === 'true');
              }}
              label="Status"
            >
              <MenuItem value="">
                <em>All Status</em>
              </MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider />

        {/* Footer Actions */}
        <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="inherit"
            fullWidth
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<IconCheck size={18} />}
            onClick={handleApply}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
