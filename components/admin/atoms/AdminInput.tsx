'use client';

import MuiTextField, { type TextFieldProps } from '@mui/material/TextField';
import type React from 'react';

// Thin wrapper preserving AdminInput usage in the codebase
export const AdminInput: React.FC<TextFieldProps> = (props) => {
  return <MuiTextField fullWidth {...props} />;
};
