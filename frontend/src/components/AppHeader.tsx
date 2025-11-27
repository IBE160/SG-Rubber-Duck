import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface AppHeaderProps {
  handleDrawerToggle: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ handleDrawerToggle }) => {
  return (
    <AppBar position="static">
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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AI-Driven Construction Project Management Simulator
        </Typography>
        <Box sx={{ flexGrow: 0 }}>
            <Avatar alt="User" src="/static/images/avatar/1.jpg" />
            {/* Add user menu dropdown here later */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
