import type React from 'react';

export interface CountdownUnitProps {
  value: number;
  label: string;
  isMounted?: boolean;
}

export const CountdownUnit: React.FC<CountdownUnitProps> = ({
  value,
  label,
  isMounted = true,
}) => {
  const formatted = isMounted ? String(value).padStart(2, '0') : '00';

  return (
    <div className="countdown__unit">
      <span className="countdown__value" title={`${value} ${label}`}>
        {formatted}
      </span>
      <span className="countdown__label-unit">{label}</span>
    </div>
  );
};
