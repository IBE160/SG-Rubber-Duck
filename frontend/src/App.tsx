import React, { Suspense, lazy, useState, useRef, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import AppHeader from './components/AppHeader';
import Sidebar, { collapsedWidth, expandedWidth } from './components/Sidebar';
import GanttChart from './components/GanttChart/GanttChart';

const SetupPage = lazy(() => import('./pages/SetupPage'));
const SimulationPage = lazy(() => import('./pages/SimulationPage'));
const AnalysisPage = lazy(() => import('./pages/AnalysisPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));

const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Reset scroll position on route change to avoid auto-scroll artifacts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100%' }}>
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AppHeader
          handleDrawerToggle={handleDrawerToggle}
          collapsed={collapsed}
          sidebarWidthExpanded={expandedWidth}
          sidebarWidthCollapsed={collapsedWidth}
        />
        <Box
          component="main"
          ref={mainRef}
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            bgcolor: 'background.default',
            transition: 'padding 0.3s ease',
            pt: { xs: 8, md: 9 }, // offset for fixed AppBar
            px: { xs: 0, md: 0 },
          }}
        >
          <Suspense fallback={<Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}>
            <Routes>
              <Route path="/" element={<Navigate to="/setup" replace />} />
              <Route path="/setup" element={<SetupPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/gantt" element={<GanttChart />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/simulation/:projectId" element={<SimulationPage />} />
              <Route path="/analysis/:projectId" element={<AnalysisPage />} />
              <Route path="*" element={<Navigate to="/setup" replace />} />
            </Routes>
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
