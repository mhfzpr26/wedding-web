import type React from 'react';

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  id?: string;
  options: Array<{ value: string | number; label: string }>;
}

export const Select: React.FC<SelectProps> = ({
  label,
  id,
  options,
  className = '',
  ...props
}) => {
  return (
    <div className="rsvp__field">
      {label && <label htmlFor={id}>{label}</label>}
      <select id={id} className={`rsvp__select ${className}`} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
