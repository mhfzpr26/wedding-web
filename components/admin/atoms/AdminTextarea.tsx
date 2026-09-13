import type React from 'react';

export interface AdminTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
}

export const AdminTextarea: React.FC<AdminTextareaProps> = ({
  label,
  helperText,
  className = '',
  id,
  rows = 3,
  ...props
}) => {
  return (
    <div className="admin-form-group">
      {label && (
        <label htmlFor={id} className="admin-label">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`admin-textarea ${className}`}
        {...props}
      />
      {helperText && <p className="admin-helper-text">{helperText}</p>}
    </div>
  );
};
