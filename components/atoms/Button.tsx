import type React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'gold' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'gold',
  className = '',
  children,
  ...props
}) => {
  const variantClass =
    variant === 'outline'
      ? 'btn--outline'
      : variant === 'gold'
        ? 'btn--gold'
        : '';

  return (
    <button className={`btn ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};
