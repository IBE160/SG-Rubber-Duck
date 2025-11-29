import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Tabs, Tab } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProjectDetails } from '../store/projectSlice';
import * as api from '../services/api';
import { startSimulation as startSimAction, pushEvent, applyTaskEvent, simulationError } from '../store/simulationSlice';
import SimulationControls from '../components/simulation/SimulationControls';
import GanttPanel from '../components/simulation/GanttPanel';
import KpiDashboard from '../components/simulation/KpiDashboard';
import EventLog from '../components/simulation/EventLog';
import { useWebSocket } from '../services/websocket';
import { fetchSimulationResult } from '../store/projectSlice';

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
  const { currentProject, tasks, status: projectStatus } = useAppSelector((state) => state.projects);
  const simStatus = useAppSelector(state => state.simulation.status);
  const simTasks = useAppSelector(state => state.simulation.tasks);
  const [tabValue, setTabValue] = useState(0);
  const simulationId = useAppSelector(state => state.simulation.simulationId);
  const [, setPolling] = useState<ReturnType<typeof setInterval> | null>(null);

  // Effect to fetch initial data
  useEffect(() => {
    if (!projectId) {
      navigate('/');
      return;
    }
    const numericId = Number(projectId);
    if (!currentProject || currentProject.id !== numericId) {
      dispatch(fetchProjectDetails(numericId));
    }
  }, [projectId, dispatch, navigate, currentProject]);

  // Effect to auto-start simulation once project is loaded
  useEffect(() => {
     const numericId = projectId ? Number(projectId) : null;
     if (projectStatus === 'succeeded' && numericId !== null && currentProject?.id === numericId && simStatus === 'idle') {
      api.runSimulation(numericId).then(res => {
        dispatch(startSimAction({ simulationId: res.simulation_run_id, initialTasks: tasks }));
      }).catch(err => {
        dispatch(simulationError(String(err)));
      });
    }
  }, [projectStatus, currentProject, projectId, simStatus, dispatch, tasks]);

  // Poll simulation status until completed, then fetch results
  useEffect(() => {
    if (!simulationId) return;
    const interval = setInterval(async () => {
      try {
        const status = await api.getSimulationStatus(simulationId);
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(interval);
          setPolling(null);
          dispatch(fetchSimulationResult(simulationId));
        }
      } catch (err) {
        console.error('Failed to poll simulation status', err);
        dispatch(simulationError('Simulation status polling failed'));
      }
    }, 1000);
    setPolling(interval);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [simulationId, dispatch]);

  // WebSocket subscription to backend events
  const { events: wsEvents } = useWebSocket(simulationId ? String(simulationId) : null);
  useEffect(() => {
    wsEvents.forEach(ev => {
      dispatch(pushEvent({
        type: (ev.event_type as any) || 'SIM_START',
        event_type: ev.event_type,
        timestamp: ev.timestamp,
        task_id: ev.task_id,
        risk_id: ev.risk_id,
        details: ev.details,
        message: ev.event_type,
      }));
      dispatch(applyTaskEvent({
        type: ev.event_type as any,
        event_type: ev.event_type,
        timestamp: ev.timestamp,
        task_id: ev.task_id,
        risk_id: ev.risk_id,
        details: ev.details,
      }));
    });
  }, [wsEvents, dispatch]);

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
