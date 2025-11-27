import React, { useMemo, useState } from 'react';
import { 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip,
  TextField,
  Button,
  Alert,
  Stack,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete Icon
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { Task } from '../../types/domain';
import { createTask, updateTask, deleteTask } from '../../store/projectSlice'; // Import async thunks

const hasCycle = (tasks: Task[]): boolean => {
  const adj = new Map<number, number[]>();
  tasks.forEach((t) => adj.set(t.id, t.predecessors)); // Use number IDs
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

const WbsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, currentProject, resources } = useAppSelector((state) => state.projects);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null); // Use number for ID

  const taskMap = useMemo(() => new Map(tasks.map((t) => [t.id, t])), [tasks]); // Use number IDs
  const missingPreds = useMemo(() => {
    const missing = new Set<number>(); // Use number IDs
    tasks.forEach((t) => t.predecessors.forEach((pid) => { if (!taskMap.has(pid)) missing.add(t.id); }));
    return missing;
  }, [tasks, taskMap]);

  if (!currentProject) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Select a project to view its Work Breakdown Structure.
        </Typography>
      </Box>
    );
  }

  // Helper to ensure currentProject.id is valid
  const projectId = currentProject.id;
  if (projectId === undefined || projectId === null) {
      return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="error">
                Error: Current project ID is missing. Cannot manage tasks.
            </Typography>
        </Box>
      );
  }

  const handleFieldChange = (taskId: number, field: keyof Task, value: string | number | number[]) => { // Use number for ID
    dispatch(updateTask({ taskId, taskData: { [field]: value } }));
  };

  const handlePredecessorsChange = (taskId: number, value: string) => { // Use number for ID
    const ids = value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
      .map(Number) // Convert to number
      .filter(id => !isNaN(id)); // Filter out invalid numbers
    dispatch(updateTask({ taskId, taskData: { predecessors: ids } }));
  };

  const handleAddTask = () => {
    if (projectId) {
      const newTaskData = {
        text: 'New Task',
        start_date: new Date().toISOString().slice(0, 10),
        duration: 1,
        progress: 0,
        parent: null,
        // predecessors: [], // Removed as not directly in TaskCreate
        cost: 0,
      };
      dispatch(createTask({ projectId: projectId, taskData: newTaskData }));
    }
  };

  const handleDeleteTask = (taskId: number) => {
    dispatch(deleteTask(taskId));
  };

  const invalidCycle = hasCycle(tasks);
  const invalidDuration = tasks.some((t) => t.duration < 0);
  const invalidNames = tasks.some((t) => !t.text || !t.text.trim());
  const invalidPredRefs = tasks.some((t) => t.predecessors.some((pid) => !taskMap.has(pid)));

  const validationError =
    invalidCycle
      ? 'Dependency cycle detected. Please fix predecessors.'
      : invalidDuration
        ? 'One or more tasks have invalid (negative) duration.'
        : invalidNames
          ? 'One or more tasks are missing a name.'
          : invalidPredRefs
            ? 'One or more predecessors refer to missing tasks.'
            : null;

  const handleIndent = (taskId: number) => { // Use number for ID
    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx > 0 && tasks[idx-1]) { // Ensure previous task exists
      const newParent = tasks[idx - 1].id;
      dispatch(updateTask({ taskId, taskData: { parent: newParent } }));
    }
  };

  const handleOutdent = (taskId: number) => { // Use number for ID
    dispatch(updateTask({ taskId, taskData: { parent: null } }));
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h6">
          Work Breakdown Structure for "{currentProject.name}"
        </Typography>
        <Button variant="contained" size="small" onClick={handleAddTask}>
          Add Task
        </Button>
      </Stack>
      {validationError && <Alert severity="warning" sx={{ mb: 1 }}>{validationError}</Alert>}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Task</TableCell>
              <TableCell align="right">Duration (days)</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Predecessors</TableCell>
              <TableCell></TableCell> {/* For Delete Button */}
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task, index) => (
                <TableRow 
                  key={task.id} 
                  sx={{ backgroundColor: index % 2 === 1 ? 'action.hover' : 'transparent' }}
                  selected={selectedTaskId === task.id}
                  onClick={() => setSelectedTaskId(task.id)}
              >
                <TableCell sx={{ minWidth: 200 }}>
                  <TextField
                    fullWidth
                    size="small"
                    aria-label={`Task name ${task.id}`}
                    value={task.text}
                    error={!task.text || !task.text.trim()}
                    helperText={!task.text || !task.text.trim() ? 'Name required' : ''}
                    onChange={(e) => handleFieldChange(task.id, 'text', e.target.value)}
                  />
                </TableCell>
                <TableCell align="right" sx={{ width: 120 }}>
                  <TextField
                    type="number"
                    size="small"
                    inputProps={{ min: 0 }}
                    aria-label={`Duration for ${task.text}`}
                    value={task.duration}
                    error={task.duration < 0}
                    helperText={task.duration < 0 ? 'Must be >= 0' : ''}
                    onChange={(e) => handleFieldChange(task.id, 'duration', Number(e.target.value))}
                  />
                </TableCell>
                <TableCell sx={{ width: 160 }}>
                  <TextField
                    type="date"
                    size="small"
                    aria-label={`Start date for ${task.text}`}
                    value={task.start_date}
                    onChange={(e) => handleFieldChange(task.id, 'start_date', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
                    <Tooltip title="Indent under previous task">
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => handleIndent(task.id)}
                          disabled={index === 0}
                          aria-label="Indent task"
                        >
                          <ArrowForwardIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Outdent to top level">
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => handleOutdent(task.id)}
                          disabled={task.parent === null}
                          aria-label="Outdent task"
                        >
                          <ArrowBackIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                  <TextField
                    fullWidth
                    size="small"
                    aria-label={`Predecessors for ${task.text}`}
                    value={task.predecessors.join(', ')}
                    onChange={(e) => handlePredecessorsChange(task.id, e.target.value)}
                    helperText="Comma-separated task IDs"
                    error={missingPreds.has(task.id)}
                    FormHelperTextProps={{ sx: { color: missingPreds.has(task.id) ? 'error.main' : 'text.secondary' } }}
                  />
                  <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {task.predecessors.map((pId) => (
                      <Chip key={pId} label={taskMap.get(pId)?.text || String(pId)} size="small" />
                    ))}
                  </Box>
                  <Select
                    size="small"
                    fullWidth
                    value={task.resource_id || ''}
                    displayEmpty
                    aria-label={`Resource for ${task.text}`}
                    onChange={(e) => handleFieldChange(task.id, 'resource_id', Number(e.target.value))}
                    sx={{ mt: 1 }}
                  >
                    <MenuItem value="">No resource</MenuItem>
                    {resources.map((r) => (
                      <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleDeleteTask(task.id)} aria-label="delete task">
                    <DeleteIcon fontSize="small" color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WbsTable;
