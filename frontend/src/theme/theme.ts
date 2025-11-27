import { createTheme } from '@mui/material/styles';

// Define the design tokens
const palette = {
  primary: {
    main: '#1976D2',
    light: '#42A5F5',
    dark: '#1565C0',
  },
  secondary: {
    main: '#FFC107',
    light: '#FFD54F',
    dark: '#FFB300',
  },
  error: {
    main: '#D32F2F',
  },
  warning: {
    main: '#FFA000',
  },
  info: {
    main: '#0288D1',
  },
  success: {
    main: '#388E3C',
  },
  background: {
    default: '#FFFFFF',
    paper: '#F5F5F5',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
  },
  divider: '#E0E0E0',
};

// Create the MUI theme instance
export const theme = createTheme({
  palette: palette,
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    // The prompt specifies a scale from 12-32px.
    // MUI's default typography scale is a good starting point and can be customized.
    h1: { fontSize: '2rem' }, // ~32px
    h2: { fontSize: '1.75rem' }, // ~28px
    h3: { fontSize: '1.5rem' }, // ~24px
    h4: { fontSize: '1.25rem' }, // ~20px
    h5: { fontSize: '1.125rem' }, // ~18px
    h6: { fontSize: '1rem' }, // ~16px
    body1: { fontSize: '1rem' }, // 16px
    body2: { fontSize: '0.875rem' }, // 14px
    caption: { fontSize: '0.75rem' }, // 12px
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          // Ensure AppBar text is white
          color: '#FFFFFF',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: palette.text.primary,
          color: palette.background.default,
        }
      }
    }
  }
});

// To use Roboto font, we need to import it. This is typically done in the main index.html file.
// I will add the necessary link to `index.html`.
