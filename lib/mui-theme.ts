import { createTheme } from '@mui/material/styles';

/**
 * INVATERA Admin MUI Soft Slate Cloud Theme (Light Mode)
 * Stripe & Linear Light aesthetic: Calm #F8FAFC canvas with crisp white cards
 * Electric Violet & Cyber Cyan high-tech brand signature
 */
const invateraAdminTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7c3aed',
      light: '#8b5cf6',
      dark: '#6d28d9',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06b6d4',
      light: '#38bdf8',
      dark: '#0891b2',
      contrastText: '#ffffff',
    },
    error: {
      main: '#e11d48',
      light: '#f43f5e',
      dark: '#be123c',
    },
    warning: {
      main: '#d97706',
      light: '#f59e0b',
      dark: '#b45309',
    },
    success: {
      main: '#059669',
      light: '#10b981',
      dark: '#047857',
    },
    info: {
      main: '#06b6d4',
      light: '#38bdf8',
      dark: '#0891b2',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
      disabled: '#94a3b8',
    },
    divider: '#e2e8f0',
    action: {
      hover: 'rgba(124, 58, 237, 0.05)',
      selected: 'rgba(124, 58, 237, 0.10)',
      disabled: '#cbd5e1',
      disabledBackground: '#f1f5f9',
    },
  },

  shape: {
    borderRadius: 8,
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, color: '#0f172a' },
    h2: { fontWeight: 700, color: '#0f172a' },
    h3: { fontWeight: 700, color: '#0f172a' },
    h4: { fontWeight: 600, color: '#0f172a' },
    h5: { fontWeight: 600, color: '#0f172a' },
    h6: { fontWeight: 600, color: '#0f172a' },
    subtitle1: { fontWeight: 500, color: '#334155' },
    subtitle2: { fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.05em' },
    body1: { fontSize: '0.9375rem', color: '#0f172a' },
    body2: { fontSize: '0.875rem', color: '#475569' },
    caption: { color: '#64748b' },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f8fafc',
          color: '#0f172a',
          scrollbarColor: '#cbd5e1 #f8fafc',
          '&::-webkit-scrollbar': {
            width: 6,
            height: 6,
          },
          '&::-webkit-scrollbar-track': {
            background: '#f8fafc',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#cbd5e1',
            borderRadius: 3,
            '&:hover': {
              background: '#94a3b8',
            },
          },
        },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#0f172a',
          borderBottom: '1px solid #e2e8f0',
          backgroundImage: 'none',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          color: '#0f172a',
          borderRight: '1px solid #e2e8f0',
          backgroundImage: 'none',
        },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          backgroundImage: 'none',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
        },
      },
    },

    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#ffffff',
          color: '#0f172a',
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 7,
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: '7px 18px',
        },
        contained: {
          '&:hover': {
            backgroundColor: '#6d28d9',
          },
        },
        outlined: {
          borderColor: '#cbd5e1',
          '&:hover': {
            borderColor: '#7c3aed',
            backgroundColor: 'rgba(124, 58, 237, 0.05)',
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 7,
          color: '#64748b',
          '&:hover': {
            backgroundColor: 'rgba(124, 58, 237, 0.06)',
            color: '#7c3aed',
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            '& fieldset': {
              borderColor: '#cbd5e1',
            },
            '&:hover fieldset': {
              borderColor: '#94a3b8',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#7c3aed',
              borderWidth: '1.5px',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#64748b',
            '&.Mui-focused': {
              color: '#7c3aed',
            },
          },
          '& .MuiInputBase-input': {
            color: '#0f172a',
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#0f172a',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#cbd5e1',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#94a3b8',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#7c3aed',
          },
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          color: '#0f172a',
          '&:hover': {
            backgroundColor: 'rgba(124, 58, 237, 0.05)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(124, 58, 237, 0.10)',
            '&:hover': {
              backgroundColor: 'rgba(124, 58, 237, 0.15)',
            },
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff !important',
          border: '1px solid #e2e8f0',
          backgroundImage: 'none !important',
          borderRadius: 10,
          boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05) !important',
        },
        backdrop: {
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '20px 24px 12px',
          fontSize: '1.0625rem',
          fontWeight: 700,
          color: '#0f172a',
          borderBottom: '1px solid #e2e8f0',
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '20px 24px',
        },
      },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '12px 24px 20px',
          borderTop: '1px solid #e2e8f0',
          gap: 8,
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#f1f5f9',
            color: '#475569',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            borderBottom: '1px solid #e2e8f0',
          },
        },
      },
    },

    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            '&:hover': {
              backgroundColor: '#f8fafc',
            },
            '& .MuiTableCell-body': {
              borderBottom: '1px solid #f1f5f9',
              color: '#0f172a',
              fontSize: '0.875rem',
            },
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.72rem',
          height: 22,
          borderRadius: 5,
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 7,
          marginBottom: 2,
          padding: '8px 12px',
          '&:hover': {
            backgroundColor: 'rgba(124, 58, 237, 0.05)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(124, 58, 237, 0.10)',
            '& .MuiListItemText-primary': {
              color: '#7c3aed',
              fontWeight: 700,
            },
            '& .MuiListItemIcon-root': {
              color: '#7c3aed',
            },
            '&:hover': {
              backgroundColor: 'rgba(124, 58, 237, 0.15)',
            },
          },
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 36,
          color: '#64748b',
        },
      },
    },

    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#334155',
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #e2e8f0',
        },
        indicator: {
          backgroundColor: '#7c3aed',
          height: 2.5,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.8125rem',
          color: '#64748b',
          minHeight: 44,
          padding: '8px 16px',
          '&.Mui-selected': {
            color: '#7c3aed',
          },
          '&:hover': {
            color: '#0f172a',
          },
        },
      },
    },

    MuiAccordion: {
      defaultProps: { elevation: 0, disableGutters: true },
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px !important',
          marginBottom: 8,
          '&:before': { display: 'none' },
        },
      },
    },

    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: '0 16px',
          minHeight: 48,
          '& .MuiAccordionSummary-expandIconWrapper': {
            color: '#64748b',
          },
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#e2e8f0',
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          fontSize: '0.75rem',
          border: '1px solid #334155',
          borderRadius: 6,
        },
        arrow: {
          color: '#0f172a',
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: '#e2e8f0',
          borderRadius: 4,
          height: 6,
        },
        bar: {
          borderRadius: 4,
        },
      },
    },

    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: '#f1f5f9',
        },
      },
    },
  },
});

export default invateraAdminTheme;
export { invateraAdminTheme as wedflowAdminTheme };
