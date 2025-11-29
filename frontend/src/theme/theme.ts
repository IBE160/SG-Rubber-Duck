import { createTheme } from '@mui/material/styles';

const palette = {
  mode: 'dark' as const,
  primary: {
    main: '#3b82f6',
    light: '#60a5fa',
    dark: '#1d4ed8',
  },
  secondary: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
  },
  error: { main: '#ef4444' },
  warning: { main: '#f97316' },
  info: { main: '#38bdf8' },
  success: { main: '#22c55e' },
  background: {
    default: '#0b1222',
    paper: 'rgba(255,255,255,0.04)',
  },
  text: {
    primary: '#e2e8f0',
    secondary: '#94a3b8',
  },
  divider: 'rgba(255,255,255,0.08)',
};

export const theme = createTheme({
  palette,
  shape: {
    borderRadius: 14,
  },
  shadows: [
    'none',
    '0 10px 30px rgba(0,0,0,0.25)',
    '0 12px 40px rgba(0,0,0,0.3)',
    ...Array(22).fill('0 12px 40px rgba(0,0,0,0.3)'),
  ] as any,
  typography: {
    fontFamily: '"Space Grotesk","Inter","SF Pro Display",system-ui,-apple-system,sans-serif',
    h1: { fontSize: '2.8rem', fontWeight: 700, letterSpacing: '-0.04em' },
    h2: { fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.03em' },
    h3: { fontSize: '1.8rem', fontWeight: 700 },
    h4: { fontSize: '1.4rem', fontWeight: 600 },
    h5: { fontSize: '1.2rem', fontWeight: 600 },
    h6: { fontSize: '1.05rem', fontWeight: 600 },
    body1: { fontSize: '1rem', fontWeight: 400 },
    body2: { fontSize: '0.92rem', color: '#94a3b8' },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: '.01em' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0b1222',
          color: '#e2e8f0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(12,18,34,0.9)',
          backdropFilter: 'blur(16px)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, rgba(14,23,43,0.95), rgba(24,47,97,0.95))',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          borderBottom: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: '18px',
          paddingBlock: '10px',
          boxShadow: '0 10px 30px rgba(59,130,246,0.35)',
        },
        containedPrimary: {
          background: 'linear-gradient(120deg, #2563eb, #38bdf8)',
        },
        containedSecondary: {
          background: 'linear-gradient(120deg, #f59e0b, #f97316)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          marginInline: 8,
          '&.Mui-selected': {
            background: 'linear-gradient(120deg, rgba(59,130,246,0.2), rgba(56,189,248,0.15))',
            color: '#e2e8f0',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: palette.text.primary,
          color: palette.background.default,
        },
      },
    },
  },
});
