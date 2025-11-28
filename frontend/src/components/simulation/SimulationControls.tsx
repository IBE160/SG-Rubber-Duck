import React from 'react';
import { Button, Stack } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { runSimulation, fetchSimulationResult } from '../../store/projectSlice';

const SimulationControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((state) => state.projects.currentProject);
  const status = useAppSelector((state) => state.projects.status);

  const handleRunSimulation = () => {
    if (currentProject) {
      dispatch(runSimulation(currentProject.id));
      
      // Simple polling mechanism: wait 5 seconds then fetch results.
      // A more robust solution would use WebSockets or repeated polling.
      setTimeout(() => {
        dispatch(fetchSimulationResult(currentProject.id));
      }, 5000); 
    }
  };

  const handleFetchResults = () => {
    if (currentProject) {
      dispatch(fetchSimulationResult(currentProject.id));
    }
  };

  return (
    <Stack direction="row" spacing={2}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleRunSimulation}
        disabled={!currentProject || status === 'loading'}
      >
        {status === 'loading' ? 'Running Simulation...' : 'Run Simulation'}
      </Button>
      <Button
        variant="outlined"
        onClick={handleFetchResults}
        disabled={!currentProject || status === 'loading'}
      >
        Refresh Results
      </Button>
    </Stack>
  );
};

export default SimulationControls;
