import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface AppHeaderProps {
  handleDrawerToggle: () => void;
  collapsed: boolean;
  sidebarWidthExpanded: number;
  sidebarWidthCollapsed: number;
}

const AppHeader: React.FC<AppHeaderProps> = ({ handleDrawerToggle, collapsed, sidebarWidthExpanded, sidebarWidthCollapsed }) => {
  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        width: { xs: '100vw', md: `calc(100vw - ${collapsed ? sidebarWidthCollapsed : sidebarWidthExpanded}px)` },
        ml: { xs: 0, md: `${collapsed ? sidebarWidthCollapsed : sidebarWidthExpanded}px` },
        left: { xs: 0, md: 'auto' },
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: 'all 0.3s ease',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1, position: 'relative' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(120deg, #60a5fa, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Rubber Duck Management
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, ml: 1 }}>
            Project Simulation
          </Typography>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
