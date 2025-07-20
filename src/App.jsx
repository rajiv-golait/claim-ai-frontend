// src/App.jsx

import React, { useState, useMemo } from 'react';
import { Box, CssBaseline, Typography, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import QueryInterface from './components/QueryInterface';
import HealthStatus from './components/HealthStatus';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Gemini-inspired theme definition
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'dark'
      ? {
          primary: { main: '#89b3f7' },
          background: {
            default: '#131314',
            paper: '#1e1f20',
          },
          text: {
            primary: '#e3e3e3',
            secondary: '#9e9e9e', // Slightly lighter grey for better contrast
          },
        }
      : {
          primary: { main: '#1a73e8' },
          background: {
            default: '#f4f7fc', // Softer light background
            paper: '#ffffff',
          },
          text: {
            primary: '#1f1f1f',
            secondary: '#5f6368',
          },
        }),
  },
  typography: {
    fontFamily: '"Google Sans", "Inter", -apple-system, sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    overline: {
        fontWeight: 600,
        letterSpacing: '0.5px'
    }
  },
  shape: {
    borderRadius: 16, // REDUCED for a sharper look
  },
  components: {
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundImage: 'none'
            }
        }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8
        },
      },
    },
    MuiAlert: {
        styleOverrides: {
            root: {
                borderRadius: 12
            }
        }
    }
  },
});

// A child component for the actual app content
function AppContent({ toggleColorMode }) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const theme = useTheme(); 

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: isMobile ? '8px 16px' : '12px 24px', // Adjusted padding for mobile
          flexShrink: 0,
        }}
      >
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon sx={{ color: 'primary.main' }} />
          Claim AI
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: {xs: 0.5, sm: 1} }}>
          <HealthStatus />
          <IconButton onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <QueryInterface />
      </Box>
    </Box>
  );
}

// The main App component is a clean provider
function App() {
  const [mode, setMode] = useState('dark');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContent toggleColorMode={colorMode.toggleColorMode} />
    </ThemeProvider>
  );
}

export default App;