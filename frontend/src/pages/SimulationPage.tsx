import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, Tabs, Tab } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProjectDetails } from '../store/projectSlice';
import * as api from '../services/api';
import { startSimulation as startSimAction } from '../store/simulationSlice';
import SimulationControls from '../components/simulation/SimulationControls';
import GanttPanel from '../components/simulation/GanttPanel';
import KpiDashboard from '../components/simulation/KpiDashboard';
import EventLog from '../components/simulation/EventLog';
import { SimulationRunner } from '../services/simulationRunner';
import { store } from '../store/store';

// (TabPanel component remains the same)
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>{children}</Box>}
    </div>
  );
}

const SimulationPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentProject, tasks, resources, risks, status: projectStatus } = useAppSelector((state) => state.projects);
  const simStatus = useAppSelector(state => state.simulation.status);
  const simTasks = useAppSelector(state => state.simulation.tasks);
  const [tabValue, setTabValue] = useState(0);
  const runnerRef = useRef<SimulationRunner | null>(null);

  // Effect to fetch initial data
  useEffect(() => {
    if (!projectId) {
      navigate('/');
      return;
    }
    if (!currentProject || currentProject.id !== projectId) {
      dispatch(fetchProjectDetails(projectId));
    }
  }, [projectId, dispatch, navigate, currentProject]);

  // Effect to manage the simulation runner lifecycle
  useEffect(() => {
    if (simStatus === 'running' && !runnerRef.current && tasks.length > 0) {
      // Create and start the runner
      runnerRef.current = new SimulationRunner(tasks, risks, resources, dispatch, store.getState);
      runnerRef.current.start();
    } else if (simStatus !== 'running' && runnerRef.current) {
      // Stop the runner
      runnerRef.current.stop();
      runnerRef.current = null;
    }

    // Cleanup on unmount
    return () => {
      runnerRef.current?.stop();
    };
  }, [simStatus, tasks, risks, resources, dispatch]);
  
  // Effect to auto-start simulation once project is loaded
  useEffect(() => {
     if (projectStatus === 'succeeded' && projectId && currentProject?.id === projectId && simStatus === 'idle') {
      api.startSimulation(projectId).then(res => {
        dispatch(startSimAction({ simulationId: res.simulationId, initialTasks: tasks }));
      })
    }
  }, [projectStatus, currentProject, projectId, simStatus, dispatch, tasks]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (projectStatus === 'loading' || !currentProject) {
    return <Typography sx={{ p: 4 }}>Loading Project for Simulation...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      <SimulationControls />
      
      <Box sx={{ height: '65%', p: 1, pt: 0 }}>
        <Paper elevation={2} sx={{ height: '100%', width: '100%' }}>
            <GanttPanel tasksOverride={simTasks.length ? simTasks : tasks} />
        </Paper>
      </Box>

      <Box sx={{ height: '35%' }}>
        <Paper elevation={2} sx={{ m: 1, mt: 0, height: 'calc(100% - 8px)' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="Simulation tabs">
                    <Tab label="KPI Dashboard" id="sim-tab-0" aria-controls="sim-panel-0" />
                    <Tab label="Event Log" id="sim-tab-1" aria-controls="sim-panel-1" />
                </Tabs>
            </Box>
            <Box sx={{ height: 'calc(100% - 49px)' }}>
              <TabPanel value={tabValue} index={0}>
                  <KpiDashboard />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                  <EventLog />
              </TabPanel>
            </Box>
        </Paper>
      </Box>
    </Box>
  );
};
export default SimulationPage;
