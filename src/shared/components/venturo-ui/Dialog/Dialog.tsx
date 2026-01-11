import MuiDialog, { DialogProps as MuiDialogProps } from '@mui/material/Dialog';
import MuiDialogTitle, { DialogTitleProps as MuiDialogTitleProps } from '@mui/material/DialogTitle';
import MuiDialogContent, { DialogContentProps as MuiDialogContentProps } from '@mui/material/DialogContent';
import MuiDialogActions, { DialogActionsProps as MuiDialogActionsProps } from '@mui/material/DialogActions';
import React from 'react';

export type DialogProps = MuiDialogProps;
export type DialogTitleProps = MuiDialogTitleProps;
export type DialogContentProps = MuiDialogContentProps;
export type DialogActionsProps = MuiDialogActionsProps;

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  (props, ref) => {
    return <MuiDialog ref={ref} {...props} />;
  }
);

export const DialogTitle = React.forwardRef<HTMLDivElement, DialogTitleProps>(
  (props, ref) => {
    return <MuiDialogTitle ref={ref} {...props} />;
  }
);

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  (props, ref) => {
    return <MuiDialogContent ref={ref} {...props} />;
  }
);

export const DialogActions = React.forwardRef<HTMLDivElement, DialogActionsProps>(
  (props, ref) => {
    return <MuiDialogActions ref={ref} {...props} />;
  }
);

Dialog.displayName = 'Dialog';
DialogTitle.displayName = 'DialogTitle';
DialogContent.displayName = 'DialogContent';
DialogActions.displayName = 'DialogActions';
