import type React from 'react';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  id?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className="rsvp__field">
      {label && <label htmlFor={id}>{label}</label>}
      <textarea id={id} className={`rsvp__textarea ${className}`} {...props} />
    </div>
  );
};
