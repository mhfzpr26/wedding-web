import type React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className="rsvp__field">
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} className={`rsvp__input ${className}`} {...props} />
    </div>
  );
};
