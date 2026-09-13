'use client';

import MuiTextField, { type TextFieldProps } from '@mui/material/TextField';
import type React from 'react';

// Thin wrapper for multiline textarea using MUI TextField
export const AdminTextarea: React.FC<TextFieldProps & { rows?: number }> = ({
  rows = 3,
  ...props
}) => {
  return <MuiTextField fullWidth multiline rows={rows} {...props} />;
};
