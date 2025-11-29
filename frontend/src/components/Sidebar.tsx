import React, { useCallback, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Box, List, ListItemButton, ListItemText, Divider, Drawer, ListItemIcon, Typography, Stack, IconButton, Tooltip } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import duckSidebar from '../assets/duck-custom.png';
import duckQuack from '../assets/quack.mp3';

export const expandedWidth = 260;
export const collapsedWidth = 96;

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, handleDrawerToggle, collapsed, setCollapsed }) => {
  const location = useLocation();
  const navItems = [
    { label: 'Setup', path: '/setup', icon: <SettingsSuggestOutlinedIcon /> },
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardOutlinedIcon /> },
    { label: 'Insights', path: '/insights', icon: <InsightsOutlinedIcon /> },
    { label: 'Gantt Chart', path: '/gantt', icon: <TimelineOutlinedIcon /> },
    { label: 'Backlog', path: '/backlog', icon: <ListAltOutlinedIcon /> },
    { label: 'Risks', path: '/risks', icon: <WarningAmberOutlinedIcon /> },
    { label: 'Releases', path: '/releases', icon: <RocketLaunchOutlinedIcon /> },
    { label: 'Docs', path: '/docs', icon: <DescriptionOutlinedIcon /> },
  ];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playQuack = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(duckQuack);
        audioRef.current.volume = 0.6;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } catch {
      /* ignore */
    }
  }, []);

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        px: 1,
        py: 2,
        display: 'flex',
        flexDirection: 'column',
        background: 'radial-gradient(circle at 20% 20%, rgba(255,184,79,0.12), transparent 35%), radial-gradient(circle at 80% 0%, rgba(56,189,248,0.12), transparent 30%)',
      }}
    >
      <Box
        sx={{
          px: collapsed ? 1.5 : 2,
          py: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 0.5,
        }}
      >
        <Tooltip
          title="Quack!"
          placement="bottom"
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                borderRadius: '10px',
                backgroundColor: 'rgba(15,23,42,0.92)',
                color: '#f59e0b',
                fontWeight: 700,
                fontSize: '0.95rem',
                px: 1.5,
                py: 1,
              },
            },
            arrow: {
              sx: { color: 'rgba(15,23,42,0.92)' },
            },
          }}
        >
          <Box
            component="img"
            src={duckSidebar}
            alt="Rubber Duck logo"
            sx={{
              width: collapsed ? 54 : 78,
              height: collapsed ? 54 : 78,
              objectFit: 'contain',
              filter: 'none',
              animation: 'duck-float 6s ease-in-out infinite',
              cursor: 'pointer',
            }}
            onMouseEnter={playQuack}
          />
        </Tooltip>
      </Box>
      {!collapsed && (
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: '.12em', textAlign: 'center' }}>
            Navigation
          </Typography>
        </Box>
      )}
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            selected={location.pathname.startsWith(item.path)}
            onClick={mobileOpen ? handleDrawerToggle : undefined} // Close drawer on mobile after click
            sx={{
              my: 0.3,
              px: 1.5,
              color: 'text.secondary',
              '&.Mui-selected': { color: '#e2e8f0', fontWeight: 600 },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
              {item.icon || <AutoGraphOutlinedIcon />}
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            )}
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: collapsed ? 1 : 2, mt: 'auto', color: 'text.secondary' }}>
        {!collapsed && (
          <Stack spacing={0.5}>
            <Typography variant="caption">Live simulation-ready</Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
              Build → Run → Analyze
            </Typography>
          </Stack>
        )}
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: collapsed ? 'center' : 'flex-end', px: 1, pb: 1 }}>
        <IconButton
          size="small"
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            color: 'text.secondary',
              border: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.03)',
            }}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: collapsed ? collapsedWidth : expandedWidth }, flexShrink: { md: 0 } }}
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: expandedWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: collapsed ? collapsedWidth : expandedWidth,
            position: 'relative',
            height: '100vh',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
