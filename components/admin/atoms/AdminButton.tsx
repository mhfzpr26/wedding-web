import type React from 'react';

export interface AdminButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'admin-btn-primary';
      case 'secondary':
        return 'admin-btn-secondary';
      case 'danger':
        return 'admin-btn-danger';
      case 'success':
        return 'admin-btn-success';
      case 'ghost':
        return 'admin-btn-ghost';
      case 'icon':
        return 'admin-btn-icon';
      default:
        return 'admin-btn-primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'admin-btn-sm';
      case 'lg':
        return 'admin-btn-lg';
      default:
        return '';
    }
  };

  return (
    <button
      className={`admin-btn ${getVariantClass()} ${getSizeClass()} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
