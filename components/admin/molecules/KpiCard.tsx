'use client';

import type { SvgIconComponent } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type React from 'react';

interface KpiCardProps {
  label: string;
  value: number | string;
  sub?: string;
  Icon: SvgIconComponent;
  color?: 'primary' | 'success' | 'warning' | 'info' | 'error';
}

const colorMap = {
  primary: {
    bg: 'rgba(99,102,241,0.1)',
    icon: '#818cf8',
    border: 'rgba(99,102,241,0.2)',
  },
  success: {
    bg: 'rgba(16,185,129,0.1)',
    icon: '#34d399',
    border: 'rgba(16,185,129,0.2)',
  },
  warning: {
    bg: 'rgba(245,158,11,0.1)',
    icon: '#fbbf24',
    border: 'rgba(245,158,11,0.2)',
  },
  info: {
    bg: 'rgba(14,165,233,0.1)',
    icon: '#38bdf8',
    border: 'rgba(14,165,233,0.2)',
  },
  error: {
    bg: 'rgba(244,63,94,0.1)',
    icon: '#fb7185',
    border: 'rgba(244,63,94,0.2)',
  },
};

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  sub,
  Icon,
  color = 'primary',
}) => {
  const c = colorMap[color];

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 0,
        border: `1px solid ${c.border}`,
        transition: 'border-color 0.2s, transform 0.15s',
        '&:hover': {
          borderColor: c.icon,
          transform: 'translateY(-1px)',
        },
      }}
    >
      <CardContent
        sx={{ flexGrow: 1, py: 2.5, px: 2.5, '&:last-child': { pb: 2.5 } }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            display: 'block',
            mb: 0.5,
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: 'text.primary',
            lineHeight: 1.1,
            mb: 0.25,
          }}
        >
          {value}
        </Typography>
        {sub && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {sub}
          </Typography>
        )}
      </CardContent>
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: 2,
          bgcolor: c.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 2.5,
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 26, color: c.icon }} />
      </Box>
    </Card>
  );
};
