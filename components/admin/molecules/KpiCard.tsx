import type React from 'react';

export interface KpiCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  hint?: string;
  variant?: 'red' | 'green' | 'blue' | 'yellow' | 'default';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  icon,
  hint,
  variant = 'default',
}) => {
  return (
    <div className={`admin-stat-card admin-stat-card--${variant}`}>
      <div className="admin-stat-card__icon">{icon}</div>
      <div className="admin-stat-card__content">
        <span className="admin-stat-card__label">{label}</span>
        <h3 className="admin-stat-card__value">{value}</h3>
        {hint && <span className="admin-stat-card__hint">{hint}</span>}
      </div>
    </div>
  );
};
