import type React from 'react';

export interface DividerOrnamentProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

export const DividerOrnament: React.FC<DividerOrnamentProps> = ({
  className = '',
  size = 40,
  style = {},
}) => {
  return (
    <svg
      className={`floral-svg ${className}`}
      width={size}
      height={size}
      viewBox="0 0 100 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M50 5 C50 5, 65 15, 65 25 C65 25, 55 35, 50 35 C50 35, 45 35, 35 25 C35 25, 35 15, 50 5 Z" />
        <path d="M50 5 Q50 20, 50 35" />
        <circle cx="50" cy="20" r="4" />
        <path d="M50 35 V45" />
        <path d="M40 45 H60" />
      </g>
    </svg>
  );
};
