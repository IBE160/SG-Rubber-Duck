import React, { useState } from 'react';
import {
  Typography,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Button,
  Alert,
  IconButton,
  Divider,
  Snackbar,
} from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import GroupIcon from '@mui/icons-material/Group';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Resource } from '../../types/domain';
import RiskManagement from './RiskManagement'; // Import the new component
import { useUpdateProject, useCreateResource, useUpdateResource, useDeleteResource } from '../../services/queries';
import { fetchProjectDetails } from '../../store/projectSlice';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
// ... (TabPanel function remains the same)
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`details-tabpanel-${index}`}
      aria-labelledby={`details-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const TaskDetailsTabs: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentProject, resources } = useAppSelector((state) => state.projects);
  const [value, setValue] = useState(0);
  const totalTaskCost = useAppSelector(state => state.projects.tasks.reduce((sum, task) => sum + task.cost, 0));
  const [budgetInput, setBudgetInput] = useState<number | ''>(currentProject?.budget ?? '');
  const [contingencyInput, setContingencyInput] = useState<number | ''>(currentProject?.contingency ?? '');
  const [descriptionInput, setDescriptionInput] = useState<string>(currentProject?.description ?? '');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [resourceEdits, setResourceEdits] = useState<Record<number, { name: string; cost: number }>>({});
  const [newResName, setNewResName] = useState('');
  const [newResCost, setNewResCost] = useState<number | ''>('');
  const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    msg: '',
    severity: 'success',
  });

  const updateProject = useUpdateProject(currentProject?.id || 0);
  const createResource = useCreateResource(currentProject?.id || 0);
  const updateResource = useUpdateResource(currentProject?.id || 0);
  const deleteResource = useDeleteResource(currentProject?.id || 0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    if (currentProject) {
      setBudgetInput(currentProject.budget);
      setContingencyInput(currentProject.contingency);
      setDescriptionInput(currentProject.description);
      const edits: Record<number, { name: string; cost: number }> = {};
      resources.forEach((r) => {
        edits[r.id] = { name: r.name, cost: r.cost_per_day };
      });
      setResourceEdits(edits);
      setNewResName('');
      setNewResCost('');
    }
  }, [currentProject]);

  const handleSaveBudget = async () => {
    if (!currentProject) return;
    const budget = Number(budgetInput);
    const contingency = contingencyInput === '' ? 0 : Number(contingencyInput);
    if (Number.isNaN(budget) || budget < 0) {
      setSaveError('Budget must be a non-negative number.');
      return;
    }
    if (Number.isNaN(contingency) || contingency < 0) {
      setSaveError('Contingency must be a non-negative number.');
      return;
    }
    setSaveError(null);
    const payload = {
      budget,
      contingency,
      description: descriptionInput,
    };
    try {
      await updateProject.mutateAsync(payload);
      dispatch(fetchProjectDetails(currentProject.id));
      setSnack({ open: true, msg: 'Project values updated', severity: 'success' });
    } catch (err) {
      setSnack({ open: true, msg: 'Failed to update project', severity: 'error' });
    }
  };

  if (!currentProject) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Select a project to see details.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="task details tabs" variant="fullWidth">
          <Tab label="Budget" icon={<MonetizationOnIcon />} iconPosition="start" />
          <Tab label="Risks" icon={<WarningAmberIcon />} iconPosition="start" />
          <Tab label="Resources" icon={<GroupIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Typography variant="h6" gutterBottom>Project Budget</Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="Total Planned Cost" secondary={`$${totalTaskCost.toLocaleString()}`} />
          </ListItem>
        </List>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Project Budget"
            type="number"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value === '' ? '' : Number(e.target.value))}
            inputProps={{ min: 0 }}
            fullWidth
          />
          <TextField
            label="Contingency (%)"
            type="number"
            value={contingencyInput}
            onChange={(e) => setContingencyInput(e.target.value === '' ? '' : Number(e.target.value))}
            inputProps={{ min: 0 }}
            fullWidth
          />
          <TextField
            label="Project Description"
            multiline
            minRows={2}
            value={descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
            fullWidth
          />
          <Stack direction="row" spacing={1} alignItems="center">
            <Button variant="contained" onClick={handleSaveBudget} disabled={updateProject.isPending}>
              Save
            </Button>
            <Typography variant="body2" color="text.secondary">
              Tune budget & contingency to reflect your simulation assumptions.
            </Typography>
          </Stack>
          {saveError && <Alert severity="error">{saveError}</Alert>}
          {updateProject.isSuccess && !saveError && (
            <Alert severity="success">Project values updated.</Alert>
          )}
          {updateProject.isError && (
            <Alert severity="error">Failed to update project. Check connection or permissions.</Alert>
          )}
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <RiskManagement />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Typography variant="h6" gutterBottom>Resources</Typography>
        <Stack spacing={1.5} direction="row" alignItems="center" sx={{ mb: 2 }}>
          <TextField
            label="New resource name"
            size="small"
            value={newResName}
            onChange={(e) => setNewResName(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Cost per day"
            size="small"
            type="number"
            value={newResCost}
            onChange={(e) => setNewResCost(e.target.value === '' ? '' : Number(e.target.value))}
            inputProps={{ min: 0 }}
            sx={{ width: 140 }}
          />
          <Button
            variant="contained"
            size="small"
            disabled={!newResName.trim() || newResCost === '' || createResource.isPending}
            onClick={async () => {
              await createResource.mutateAsync({ name: newResName.trim(), cost_per_day: Number(newResCost) });
              setNewResName('');
              setNewResCost('');
              setSnack({ open: true, msg: 'Resource added', severity: 'success' });
            }}
          >
            Add
          </Button>
        </Stack>
        <List dense>
            {resources.map((resource: Resource) => (
                <ListItem key={resource.id} sx={{ alignItems: 'flex-start' }}>
                    <ListItemText 
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TextField
                            label="Name"
                            fullWidth
                            size="small"
                            value={resourceEdits[resource.id]?.name ?? resource.name}
                            onChange={(e) => setResourceEdits((prev) => ({
                              ...prev,
                              [resource.id]: { ...(prev[resource.id] || { name: resource.name, cost: resource.cost_per_day }), name: e.target.value }
                            }))}
                          />
                          <IconButton
                            size="small"
                            onClick={async () => {
                              await deleteResource.mutateAsync(resource.id);
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" color="error" />
                          </IconButton>
                        </Stack>
                      }
                      secondary={
                        <Stack spacing={1} direction="row" alignItems="center" sx={{ mt: 1 }}>
                          <TextField
                            label="Cost per day"
                            type="number"
                            fullWidth
                            size="small"
                            sx={{ maxWidth: 200 }}
                            value={resourceEdits[resource.id]?.cost ?? resource.cost_per_day}
                            onChange={(e) => setResourceEdits((prev) => ({
                              ...prev,
                              [resource.id]: { ...(prev[resource.id] || { name: resource.name, cost: resource.cost_per_day }), cost: Number(e.target.value) }
                            }))}
                          />
                          <Button
                            size="small"
                            variant="outlined"
                            disabled={updateResource.isPending}
                            onClick={async () => {
                              const edit = resourceEdits[resource.id];
                              if (!edit) return;
                              await updateResource.mutateAsync({
                                resourceId: resource.id,
                                data: { name: edit.name, cost_per_day: edit.cost },
                              });
                              setSnack({ open: true, msg: 'Resource saved', severity: 'success' });
                            }}
                          >
                            Save
                          </Button>
                        </Stack>
                      } 
                    />
                </ListItem>
            ))}
        </List>
        <Divider sx={{ mt: 2, mb: 1 }} />
        <Alert severity="info">
          Resources are now persisted. Add, edit, or delete to tune simulation inputs.
        </Alert>
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
      </TabPanel>
    </Box>
  );
};

export default TaskDetailsTabs;
