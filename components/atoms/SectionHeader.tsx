import type React from 'react';

export interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  id?: string;
  className?: string;
  titleClassName?: string;
  labelClassName?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  title,
  subtitle,
  id,
  className = '',
  titleClassName = '',
  labelClassName = '',
}) => {
  return (
    <header className={className}>
      <span className={labelClassName} id={id}>
        {label}
      </span>
      <h2 className={titleClassName}>{title}</h2>
      {subtitle && (
        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--color-muted-blue)',
            marginTop: '0.5rem',
          }}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
};
