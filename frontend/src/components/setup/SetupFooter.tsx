import React from 'react';
import { AppBar, Toolbar, Button, Tooltip, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { Task } from '../../types/domain';

const hasCycle = (tasks: Task[]) => {
  const adj = new Map<number, number[]>();
  tasks.forEach((t) => adj.set(t.id, t.dependencies));
  const visiting = new Set<number>();
  const visited = new Set<number>();
  const dfs = (id: number): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    for (const nei of adj.get(id) || []) {
      if (!adj.has(nei)) continue;
      if (dfs(nei)) return true;
    }
    visiting.delete(id);
    visited.add(id);
    return false;
  };
  for (const id of adj.keys()) {
    if (dfs(id)) return true;
  }
  return false;
};

const SetupFooter: React.FC = () => {
  const navigate = useNavigate();
  const { currentProject, tasks } = useAppSelector((state) => state.projects);
  const normalizedTasks = tasks.map(t => ({
    ...t,
    dependencies: t.dependencies || [],
    duration: t.duration ?? 0,
    text: t.text || '',
  }));

  const hasTasks = normalizedTasks.length > 0;
  const hasValidDurations = normalizedTasks.every(t => t.duration >= 0);
  const hasNames = normalizedTasks.every(t => t.text.trim().length > 0);
  const hasValidPreds = normalizedTasks.every(t => (t.dependencies || []).every(pid => normalizedTasks.some(x => x.id === pid)));
  const noCycles = !hasCycle(normalizedTasks as Task[]);
  const isDataValid = currentProject !== null && hasTasks && hasValidDurations && hasNames && hasValidPreds && noCycles;

  const handleStartSimulation = () => {
    if (isDataValid) {
      navigate(`/simulation/${currentProject.id}`);
    }
  };

  let tooltipText = "Start the simulation";
  if (!currentProject) {
    tooltipText = "Please select a project first.";
  } else if (tasks.length === 0) {
    tooltipText = "The selected project has no tasks.";
  } else if (!hasValidDurations) {
    tooltipText = "One or more tasks have invalid duration.";
  } else if (!hasNames) {
    tooltipText = "One or more tasks are missing a name.";
  } else if (!hasValidPreds) {
    tooltipText = "One or more predecessors reference missing tasks.";
  } else if (!noCycles) {
    tooltipText = "Dependency cycle detected. Please fix predecessors.";
  }
  // This can be expanded with more checks, e.g., for cyclic dependencies.

  return (
    <AppBar position="static" color="default" sx={{ top: 'auto', bottom: 0, borderTop: '1px solid', borderColor: 'divider' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title={tooltipText}>
          <span>
            <Button 
              variant="contained" 
              color="secondary" 
              disabled={!isDataValid}
              onClick={handleStartSimulation}
            >
              Start Simulation
            </Button>
          </span>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default SetupFooter;
