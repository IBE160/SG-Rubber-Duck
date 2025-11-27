import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import AppHeader from './components/AppHeader';
import Sidebar from './components/Sidebar';
import GanttChart from './components/GanttChart/GanttChart';

const SetupPage = lazy(() => import('./pages/SetupPage'));
const SimulationPage = lazy(() => import('./pages/SimulationPage'));
const AnalysisPage = lazy(() => import('./pages/AnalysisPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));

const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppHeader handleDrawerToggle={handleDrawerToggle} />
        <Box sx={{ display: 'flex', flexGrow: 1, minHeight: 0 }}>
          <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
          <Box component="main" sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: 'background.default' }}>
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
    </BrowserRouter>
  );
};

export default App;
