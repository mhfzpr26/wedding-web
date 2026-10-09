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
    bg: 'rgba(124, 58, 237, 0.12)',
    icon: '#7c3aed',
    border: 'rgba(124, 58, 237, 0.22)',
    cardBg: 'linear-gradient(135deg, rgba(124, 58, 237, 0.04) 0%, #ffffff 100%)',
    shadow: '0 4px 15px rgba(124, 58, 237, 0.08)',
  },
  success: {
    bg: 'rgba(5, 150, 105, 0.12)',
    icon: '#059669',
    border: 'rgba(5, 150, 105, 0.22)',
    cardBg: 'linear-gradient(135deg, rgba(5, 150, 105, 0.04) 0%, #ffffff 100%)',
    shadow: '0 4px 15px rgba(5, 150, 105, 0.08)',
  },
  warning: {
    bg: 'rgba(217, 119, 6, 0.12)',
    icon: '#d97706',
    border: 'rgba(217, 119, 6, 0.22)',
    cardBg: 'linear-gradient(135deg, rgba(217, 119, 6, 0.04) 0%, #ffffff 100%)',
    shadow: '0 4px 15px rgba(217, 119, 6, 0.08)',
  },
  info: {
    bg: 'rgba(6, 182, 212, 0.12)',
    icon: '#0891b2',
    border: 'rgba(6, 182, 212, 0.22)',
    cardBg: 'linear-gradient(135deg, rgba(6, 182, 212, 0.04) 0%, #ffffff 100%)',
    shadow: '0 4px 15px rgba(6, 182, 212, 0.08)',
  },
  error: {
    bg: 'rgba(225, 29, 72, 0.12)',
    icon: '#e11d48',
    border: 'rgba(225, 29, 72, 0.22)',
    cardBg: 'linear-gradient(135deg, rgba(225, 29, 72, 0.04) 0%, #ffffff 100%)',
    shadow: '0 4px 15px rgba(225, 29, 72, 0.08)',
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
        background: c.cardBg,
        border: `1px solid ${c.border}`,
        boxShadow: c.shadow,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: c.icon,
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 20px ${c.border}`,
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
