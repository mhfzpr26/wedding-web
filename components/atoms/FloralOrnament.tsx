import type React from 'react';

export interface FloralOrnamentProps {
  className?: string;
  size?: number;
  opacity?: number;
  color?: string;
}

export const FloralOrnament: React.FC<FloralOrnamentProps> = ({
  className = '',
  size = 180,
  opacity = 0.15,
  color = 'currentColor',
}) => {
  return (
    <svg
      className={`floral-svg ${className}`}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity, color }}
      aria-hidden="true"
    >
      <g
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M100 20 C100 20, 130 40, 130 70 C130 70, 150 80, 150 100 C150 100, 140 120, 110 120 C110 120, 80 120, 80 100 C80 100, 70 80, 100 70 C100 70, 130 60, 130 40 C130 40, 100 20, 100 20 Z" />
        <path d="M100 20 C100 20, 70 40, 70 70 C70 70, 50 80, 50 100 C50 100, 60 120, 90 120 C90 120, 120 120, 120 100 C120 100, 130 80, 100 70 C100 70, 70 60, 70 40 C70 40, 100 20, 100 20 Z" />
        <path d="M60 100 C60 100, 50 130, 70 145 C70 145, 100 160, 100 160 C100 160, 130 145, 130 130 C130 130, 140 100, 100 100" />
        <path d="M100 160 C100 160, 70 175, 70 190 C70 190, 100 180, 100 180 C100 180, 130 190, 130 175 C130 175, 100 160, 100 160" />
        <circle cx="100" cy="100" r="18" />
        <path d="M100 82 V65" />
        <path d="M100 118 V135" />
        <path d="M82 100 H65" />
        <path d="M118 100 H135" />
        <path d="M65 65 L55 55" />
        <path d="M135 65 L145 55" />
        <path d="M65 135 L55 145" />
        <path d="M135 135 L145 145" />
      </g>
      <g
        stroke={color}
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      >
        <path d="M100 20 Q115 45 120 75" />
        <path d="M100 20 Q85 45 80 75" />
        <path d="M120 75 Q140 90 140 110" />
        <path d="M80 75 Q60 90 60 110" />
        <path d="M60 110 Q55 130 75 140" />
        <path d="M140 110 Q145 130 125 140" />
      </g>
    </svg>
  );
};
