import type React from 'react';

export type NetflixAvatarVariant =
  | 'red'
  | 'blue'
  | 'yellow'
  | 'purple'
  | 'green';

type NetflixAvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface NetflixAvatarProps {
  variant?: NetflixAvatarVariant;
  size?: NetflixAvatarSize;
  active?: boolean;
  className?: string;
  alt?: string;
}

const SIZE_MAP: Record<NetflixAvatarSize, number> = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

const COLOR_MAP: Record<
  NetflixAvatarVariant,
  {
    gradStart: string;
    gradEnd: string;
    faceColor: string;
    mouthColor: string;
  }
> = {
  red: {
    gradStart: '#e50914',
    gradEnd: '#96050d',
    faceColor: '#ffffff',
    mouthColor: '#ffffff',
  },
  blue: {
    gradStart: '#0071eb',
    gradEnd: '#003e85',
    faceColor: '#ffffff',
    mouthColor: '#ffffff',
  },
  yellow: {
    gradStart: '#e5a00d',
    gradEnd: '#996300',
    faceColor: '#ffffff',
    mouthColor: '#ffffff',
  },
  purple: {
    gradStart: '#8b5cf6',
    gradEnd: '#5521b5',
    faceColor: '#ffffff',
    mouthColor: '#ffffff',
  },
  green: {
    gradStart: '#10b981',
    gradEnd: '#065f46',
    faceColor: '#ffffff',
    mouthColor: '#ffffff',
  },
};

export const NetflixAvatar: React.FC<NetflixAvatarProps> = ({
  variant = 'red',
  size = 'md',
  active = false,
  className = '',
  alt = 'Netflix Profile Avatar',
}) => {
  const pixelSize = SIZE_MAP[size];
  const { gradStart, gradEnd, faceColor, mouthColor } = COLOR_MAP[variant];
  const gradId = `netflix-avatar-grad-${variant}-${size}`;

  return (
    <div
      role="img"
      aria-label={alt}
      className={`netflix-avatar ${active ? 'netflix-avatar--active' : ''} ${className}`}
      style={{
        width: pixelSize,
        height: pixelSize,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        position: 'relative',
        boxSizing: 'border-box',
        outline: active ? '3px solid #ffffff' : 'none',
        outlineOffset: active ? '2px' : '0',
        transition: 'transform 0.2s ease, outline 0.2s ease',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          borderRadius: size === 'sm' ? '4px' : '8px',
          overflow: 'hidden',
          display: 'block',
        }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor={gradStart} />
            <stop offset="100%" stopColor={gradEnd} />
          </linearGradient>
        </defs>

        {/* Background rounded block */}
        <rect width="100" height="100" rx="14" fill={`url(#${gradId})`} />

        {/* Subtle top gloss highlight */}
        <rect
          width="100"
          height="45"
          rx="14"
          fill="#ffffff"
          fillOpacity="0.08"
        />

        {/* Left Eye */}
        <rect x="25" y="34" width="13" height="13" rx="4" fill={faceColor} />

        {/* Right Eye */}
        <rect x="62" y="34" width="13" height="13" rx="4" fill={faceColor} />

        {/* Authentic Netflix smiling mouth curve with tongue/depth */}
        <path
          d="M 28 60 Q 50 82 72 60"
          stroke={mouthColor}
          strokeWidth="6.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};
