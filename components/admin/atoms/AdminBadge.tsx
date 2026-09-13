import type React from 'react';

export interface AdminBadgeProps {
  status: 'published' | 'draft' | 'inactive' | 'active' | string;
  className?: string;
}

export const AdminBadge: React.FC<AdminBadgeProps> = ({
  status,
  className = '',
}) => {
  const getBadgeClass = () => {
    switch (status) {
      case 'published':
      case 'active':
        return 'admin-badge-success';
      case 'draft':
        return 'admin-badge-warning';
      case 'inactive':
        return 'admin-badge-danger';
      default:
        return 'admin-badge-neutral';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'published':
        return 'PUBLISHED';
      case 'active':
        return 'AKTIF';
      case 'draft':
        return 'DRAFT';
      case 'inactive':
        return 'NONAKTIF';
      default:
        return status.toUpperCase();
    }
  };

  return (
    <span className={`admin-badge ${getBadgeClass()} ${className}`}>
      {getLabel()}
    </span>
  );
};
