'use client';

import { useSnackbar } from 'notistack';
import type React from 'react';
import { useEffect } from 'react';
import { useAdminStore } from '@/stores/useAdminStore';

/**
 * AdminToast — now powered by notistack.
 * This component observes the Zustand toast state and fires notistack snackbars.
 * It renders nothing visually itself.
 */
export const AdminToast: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const toast = useAdminStore((s) => s.toast);
  const setToast = useAdminStore((s) => s.setToast);

  useEffect(() => {
    if (!toast) return;

    const variantMap = {
      success: 'success',
      error: 'error',
      info: 'info',
    } as const;

    enqueueSnackbar(toast.message, {
      variant: variantMap[toast.type] ?? 'default',
      preventDuplicate: false,
    });

    // Clear toast state after showing
    setToast(null);
  }, [toast, enqueueSnackbar, setToast]);

  return null;
};
