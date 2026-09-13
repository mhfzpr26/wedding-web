'use client';

import MuiButton, { type ButtonProps } from '@mui/material/Button';
import type React from 'react';

// Thin wrapper — AdminButton now delegates to MUI Button
export const AdminButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <MuiButton variant="contained" {...props}>
      {children}
    </MuiButton>
  );
};
