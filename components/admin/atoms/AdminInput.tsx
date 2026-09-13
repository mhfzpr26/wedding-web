import type React from 'react';

export interface AdminInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

export const AdminInput: React.FC<AdminInputProps> = ({
  label,
  helperText,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="admin-form-group">
      {label && (
        <label htmlFor={id} className="admin-label">
          {label}
        </label>
      )}
      <input id={id} className={`admin-input ${className}`} {...props} />
      {helperText && <p className="admin-helper-text">{helperText}</p>}
    </div>
  );
};
