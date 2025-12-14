import React, { useEffect, useMemo, useState } from 'react';
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
  Snackbar,
  Stack,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppSelector } from '../../store/hooks';
import { Task } from '../../types/domain';
import { 
  useCreateTask, 
  useUpdateTask, 
  useDeleteTask,
  useProjectDetails 
} from '../../services/queries';

const hasCycle = (tasks: Task[]): boolean => {
  const adj = new Map<number, number[]>();
  tasks.forEach((t) => adj.set(t.id, t.dependencies)); // Use dependencies
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
  const { currentProject } = useAppSelector((state) => state.projects);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, Partial<Task>>>({});
  // New local state for predecessor input, managing the raw string value
  const [predecessorInputDraft, setPredecessorInputDraft] = useState<Record<number, string>>({}); 
  const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    msg: '',
    severity: 'success',
  });

  // Fetch project details including tasks and resources
  const { data: projectDetails, isLoading } = useProjectDetails(currentProject?.id || null);
  const rawTasks = useMemo(() => projectDetails?.tasks || [], [projectDetails?.tasks]);
  const tasks = useMemo(
    () => rawTasks.map((t) => ({ ...t, dependencies: t.dependencies || [] })), // Use dependencies
    [rawTasks]
  );
  const resources = useMemo(() => projectDetails?.resources || [], [projectDetails?.resources]);

  // Mutations for task management
  const createTaskMutation = useCreateTask(currentProject?.id || 0);
  const updateTaskMutation = useUpdateTask(currentProject?.id || 0);
  const deleteTaskMutation = useDeleteTask(currentProject?.id || 0);

  const taskMap = useMemo(() => new Map(tasks.map((t) => [t.id, t])), [tasks]); // Use number IDs
  const missingPreds = useMemo(() => {
    const missing = new Set<number>(); // Use number IDs
    tasks.forEach((t) => (t.dependencies || []).forEach((pid) => { if (!taskMap.has(pid)) missing.add(t.id); })); // Use dependencies
    return missing;
  }, [tasks, taskMap]);

  // Effect to initialize predecessorInputDraft when tasks load or change
  useEffect(() => {
    const newDraft: Record<number, string> = {};
    tasks.forEach(task => {
      // Initialize with the current task's dependencies, joined by ', '
      newDraft[task.id] = (task.dependencies || []).join(', ');
    });
    setPredecessorInputDraft(newDraft);
  }, [tasks]);

  if (!currentProject) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Select a project to view its Work Breakdown Structure.
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleFieldChange = async (taskId: number, field: keyof Task, value: string | number | number[]) => {
    await updateTaskMutation.mutateAsync({
      taskId,
      data: { [field]: value },
    });
  };

  const parsePredecessorInput = (input: string): number[] => {
    return input
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
      .map(Number)
      .filter(id => !isNaN(id));
  };

  // This function is called on onBlur of the TextField
  const handlePredecessorsBlur = async (taskId: number, value: string) => {
    const parsedIds = parsePredecessorInput(value);
    try {
      await updateTaskMutation.mutateAsync({
        taskId,
        data: { dependencies: parsedIds }, // Now sends 'dependencies'
      });
      setSnack({ open: true, msg: 'Predecessors saved', severity: 'success' });
    } catch (err) {
      setSnack({ open: true, msg: `Failed to save predecessors: ${err instanceof Error ? err.message : String(err)}`, severity: 'error' });
    }
  };

  const handleAddTask = async () => {
    const newTaskData = {
      text: 'New Task',
      // start_date is now optional. Omit it or set to undefined to let CPM decide.
      // start_date: new Date().toISOString().slice(0, 10), 
      duration: 1,
      progress: 0,
      parent: null,
      cost: 0,
      dependencies: [] as number[], // Use dependencies
    };
    await createTaskMutation.mutateAsync(newTaskData);
  };

  const handleDeleteTask = async (taskId: number) => {
    await deleteTaskMutation.mutateAsync(taskId);
  };

  const invalidCycle = hasCycle(tasks);
  const invalidDuration = tasks.some((t) => t.duration < 0);
  const invalidNames = tasks.some((t) => !t.text || !t.text.trim());
  const invalidPredRefs = tasks.some((t) => (t.dependencies || []).some((pid) => !taskMap.has(pid))); // Use dependencies

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

  const handleIndent = async (taskId: number) => {
    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx > 0 && tasks[idx-1]) {
      const newParent = tasks[idx - 1].id;
      await updateTaskMutation.mutateAsync({
        taskId,
        data: { parent: newParent },
      });
    }
  };

  const handleOutdent = async (taskId: number) => {
    await updateTaskMutation.mutateAsync({
      taskId,
      data: { parent: null },
    });
  };

  const getDraftValue = (task: Task, field: keyof Task) => {
    const draft = drafts[task.id];
    if (draft && draft[field] !== undefined) return draft[field] as any;
    return task[field] as any;
  };

  const setDraftValue = (taskId: number, field: keyof Task, value: any) => {
    setDrafts((prev) => ({
      ...prev,
      [taskId]: { ...(prev[taskId] || {}), [field]: value },
    }));
  };

  const commitDraftValue = async (taskId: number, field: keyof Task) => {
    const draft = drafts[taskId];
    if (!draft || draft[field] === undefined) return;
    const value = draft[field] as any;
    try {
      await handleFieldChange(taskId, field, value);
      setSnack({ open: true, msg: 'Saved', severity: 'success' });
      setDrafts((prev) => {
        const next = { ...(prev[taskId] || {}) };
        delete next[field];
        const rest = { ...prev, [taskId]: next };
        if (!Object.keys(next).length) delete rest[taskId];
        return rest;
      });
    } catch (err) {
      setSnack({ open: true, msg: 'Save failed', severity: 'error' });
    }
  };

  const isLoading_ = createTaskMutation.isPending || updateTaskMutation.isPending || deleteTaskMutation.isPending;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h6">
          Work Breakdown Structure for "{currentProject.name}"
        </Typography>
        <Button 
          variant="contained" 
          size="small" 
          onClick={handleAddTask}
          disabled={isLoading_}
        >
          Add Task
        </Button>
      </Stack>
      {validationError && <Alert severity="warning" sx={{ mb: 1 }}>{validationError}</Alert>}
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', flex: 1, minHeight: 0 }}>
        <Box sx={{ maxHeight: '60vh', overflow: 'auto', minWidth: 0 }}>
          <TableContainer>
            <Table 
              size="small" 
              stickyHeader
              sx={{ 
                borderCollapse: 'separate', 
                borderSpacing: '0 14px',
                '& th': { 
                  borderBottom: 'none', 
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 600,
                  letterSpacing: 0.2,
                } 
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 50 }}>ID</TableCell>
                  <TableCell sx={{ minWidth: 220 }}>Task</TableCell>
                  <TableCell align="center" sx={{ width: 110 }}>Duration (days)</TableCell>
                  <TableCell align="center" sx={{ minWidth: 180 }}>Fixed Cost ($)</TableCell>
                  <TableCell sx={{ width: 170 }}>Start Date</TableCell>
                  <TableCell sx={{ minWidth: 220 }}>Predecessors</TableCell>
                  <TableCell sx={{ width: 120 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task, index) => (
                  <TableRow 
                    key={task.id} 
                    sx={{ 
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
                      boxShadow: '0px 14px 30px rgba(0,0,0,0.28)',
                      borderRadius: 3,
                      overflow: 'hidden',
                      backdropFilter: 'blur(4px)',
                      '& td': { borderBottom: 'none', borderTop: '1px solid rgba(255,255,255,0.04)' },
                      '& td:first-of-type': { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 },
                      '& td:last-of-type': { borderTopRightRadius: 12, borderBottomRightRadius: 12 }
                    }}
                    selected={selectedTaskId === task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                  >
                    <TableCell sx={{ width: 50, color: 'text.secondary' }}>
                      {task.id}
                    </TableCell>
                    <TableCell sx={{ minWidth: 220 }}>
                      <TextField
                        fullWidth
                        size="small"
                        aria-label={`Task name ${task.id}`}
                        value={getDraftValue(task, 'text')}
                        error={!getDraftValue(task, 'text') || !String(getDraftValue(task, 'text')).trim()}
                        helperText={!getDraftValue(task, 'text') || !String(getDraftValue(task, 'text')).trim() ? 'Name required' : ''}
                        placeholder="E.g. Foundation pour"
                        InputProps={{ sx: { fontSize: 14, py: 1 } }}
                        onChange={(e) => setDraftValue(task.id, 'text', e.target.value)}
                        onBlur={() => commitDraftValue(task.id, 'text')}
                        disabled={isLoading_}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ width: 110 }}>
                      <TextField
                        type="number"
                        size="small"
                        inputProps={{ min: 0 }}
                        aria-label={`Duration for ${task.text}`}
                        value={getDraftValue(task, 'duration')}
                        error={Number(getDraftValue(task, 'duration')) < 0}
                        helperText={Number(getDraftValue(task, 'duration')) < 0 ? 'Must be >= 0' : ''}
                        InputProps={{ sx: { fontSize: 14, py: 1 } }}
                        onChange={(e) => setDraftValue(task.id, 'duration', Number(e.target.value))}
                        onBlur={() => commitDraftValue(task.id, 'duration')}
                        disabled={isLoading_}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ minWidth: 180 }}>
                      <TextField
                        fullWidth
                        type="number"
                        size="small"
                        inputProps={{ min: 0 }}
                        aria-label={`Fixed Cost for ${task.text}`}
                        value={getDraftValue(task, 'cost')}
                        InputProps={{ sx: { fontSize: 14, py: 1 } }}
                        onChange={(e) => setDraftValue(task.id, 'cost', Number(e.target.value))}
                        onBlur={() => commitDraftValue(task.id, 'cost')}
                        disabled={isLoading_}
                      />
                    </TableCell>
                    <TableCell sx={{ width: 170 }}>
                      <TextField
                        type="date"
                        size="small"
                        aria-label={`Start date for ${task.text}`}
                        value={getDraftValue(task, 'start_date') || ''}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: { fontSize: 14, py: 1 } }}
                        onChange={(e) => setDraftValue(task.id, 'start_date', e.target.value || null)} // Set to null if empty
                        onBlur={() => commitDraftValue(task.id, 'start_date')}
                        disabled={isLoading_}
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 220 }}>
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
                        <Tooltip title="Indent under previous task">
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => handleIndent(task.id)}
                              disabled={index === 0 || isLoading_}
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
                              disabled={task.parent === null || isLoading_}
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
                        // Use local draft state for the value prop
                        value={predecessorInputDraft[task.id] ?? (task.dependencies || []).join(', ')} // Use task.dependencies
                        // Update local draft state on change
                        onChange={(e) => setPredecessorInputDraft((prev) => ({ ...prev, [task.id]: e.target.value }))}
                        // Parse and commit on blur
                        onBlur={(e) => handlePredecessorsBlur(task.id, e.target.value)}
                        placeholder="Comma-separated IDs (e.g. 1, 3)"
                        helperText="Comma-separated task IDs. Leave empty for no predecessors."
                        error={missingPreds.has(task.id)}
                        InputProps={{ sx: { fontSize: 13, py: 1 } }}
                        FormHelperTextProps={{ sx: { color: missingPreds.has(task.id) ? 'error.main' : 'text.secondary' } }}
                        disabled={isLoading_}
                      />
                      <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {task.dependencies.map((pId) => ( // Use task.dependencies
                          <Chip key={pId} label={taskMap.get(pId)?.text || String(pId)} size="small" />
                        ))}
                      </Box>
                      <Select
                        size="small"
                        fullWidth
                        value={getDraftValue(task, 'resource_id') || ''}
                        displayEmpty
                        aria-label={`Resource for ${task.text}`}
                        onChange={(e) => {
                          const val = e.target.value === '' ? undefined : Number(e.target.value);
                          setDraftValue(task.id, 'resource_id', val);
                          // Only commit if a valid resource is selected
                          if (val !== undefined) commitDraftValue(task.id, 'resource_id');
                        }}
                        sx={{ mt: 1 }}
                        disabled={isLoading_}
                      >
                        <MenuItem value="">No resource</MenuItem>
                        {resources.map((r) => (
                          <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell sx={{ width: 120 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteTask(task.id)} 
                        aria-label="delete task"
                        disabled={isLoading_}
                      >
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
      <Snackbar
        open={snack.open}
        autoHideDuration={1800}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WbsTable;