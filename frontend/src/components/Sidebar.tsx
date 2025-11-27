import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Box, List, ListItemButton, ListItemText, Divider, ListSubheader, Drawer, Toolbar } from '@mui/material';

const drawerWidth = 220;

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Setup', path: '/setup' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Insights', path: '/insights' },
    { label: 'Gantt Chart', path: '/gantt' },
  ];

  const drawerContent = (
    <div>
      <Toolbar />
      <Divider />
      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Navigation
          </ListSubheader>
        }
      >
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            selected={location.pathname.startsWith(item.path)}
            onClick={mobileOpen ? handleDrawerToggle : undefined} // Close drawer on mobile after click
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
