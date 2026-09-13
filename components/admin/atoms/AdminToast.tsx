'use client';

import type React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

export interface AdminToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
}

export const AdminToast: React.FC<AdminToastProps> = ({
  type,
  message,
  onClose,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon sx={{ fontSize: 20, color: '#46d369' }} />;
      case 'error':
        return <ErrorIcon sx={{ fontSize: 20, color: '#E50914' }} />;
      default:
        return <InfoIcon sx={{ fontSize: 20, color: '#0071eb' }} />;
    }
  };

  return (
    <div className={`admin-toast admin-toast--${type}`}>
      {getIcon()}
      <span className="admin-toast__message">{message}</span>
      {onClose && (
        <button
          type="button"
          className="admin-toast__close"
          onClick={onClose}
          aria-label="Tutup notifikasi"
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </button>
      )}
    </div>
  );
};
