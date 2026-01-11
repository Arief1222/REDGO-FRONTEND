import { useState } from 'react';
import { Box } from '../../Box';
import { IconButton } from '../../IconButton';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '../../Dialog';
import { Button } from '../../Button';
import { Typography } from '../../Typography';
import type { VenturoTableAction } from '../VenturoTable.types';

interface VenturoTableActionsProps<TData> {
  row: TData;
  actions: VenturoTableAction<TData>[];
}

export function VenturoTableActions<TData>({
  row,
  actions
}: VenturoTableActionsProps<TData>) {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: VenturoTableAction<TData> | null;
  }>({
    open: false,
    action: null
  });

  const handleActionClick = (action: VenturoTableAction<TData>) => {
    if (action.needsConfirmation) {
      setConfirmDialog({ open: true, action });
    } else {
      action.onClick(row);
    }
  };

  const handleConfirm = () => {
    if (confirmDialog.action) {
      confirmDialog.action.onClick(row);
    }
    setConfirmDialog({ open: false, action: null });
  };

  const handleCancel = () => {
    setConfirmDialog({ open: false, action: null });
  };

  const isDisabled = (action: VenturoTableAction<TData>): boolean => {
    if (typeof action.disabled === 'function') {
      return action.disabled(row);
    }
    return action.disabled || false;
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        {actions.map((action, index) => (
          <IconButton
            key={index}
            size="small"
            color={action.color || 'default'}
            onClick={() => handleActionClick(action)}
            disabled={isDisabled(action)}
          >
            {action.icon}
          </IconButton>
        ))}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={handleCancel}>
        <DialogTitle>
          {confirmDialog.action?.confirmationTitle || 'Confirm Action'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmDialog.action?.confirmationMessage
              ? confirmDialog.action.confirmationMessage(row)
              : 'Are you sure you want to perform this action?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            color={confirmDialog.action?.color || 'primary'}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
