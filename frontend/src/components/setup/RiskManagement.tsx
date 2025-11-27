import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { createRisk, deleteRisk } from '../../store/projectSlice'; // Import the thunks

const RiskManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { risks, tasks, currentProject } = useAppSelector((state) => state.projects);

  const [description, setDescription] = useState('');
  const [likelihood, setLikelihood] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [impact, setImpact] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [affectedTasks, setAffectedTasks] = useState<number[]>([]);

  const resetForm = () => {
    setDescription('');
    setLikelihood('Medium');
    setImpact('Medium');
    setAffectedTasks([]);
  };

  const handleAddRisk = () => {
    if (!currentProject) return;
    
    dispatch(createRisk({
      projectId: currentProject.id,
      riskData: {
        description,
        likelihood,
        impact,
        affected_task_ids: affectedTasks,
      }
    }));
    resetForm();
  };

  const handleDeleteRisk = (riskId: number) => {
    dispatch(deleteRisk(riskId));
  };

  if (!currentProject) {
    return (
      <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
        Select a project to manage risks.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Risk Management
      </Typography>
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Add New Risk</Typography>
        <Stack spacing={2}>
          <TextField
            label="Risk Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Likelihood</InputLabel>
            <Select
              value={likelihood}
              label="Likelihood"
              onChange={(e) => setLikelihood(e.target.value as 'Low' | 'Medium' | 'High')}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Impact</InputLabel>
            <Select
              value={impact}
              label="Impact"
              onChange={(e) => setImpact(e.target.value as 'Low' | 'Medium' | 'High')}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
           <FormControl fullWidth>
            <InputLabel>Affected Tasks</InputLabel>
            <Select
              multiple
              value={affectedTasks}
              onChange={(e) => setAffectedTasks(e.target.value as number[])}
              renderValue={(selected) =>
                selected.map(id => tasks.find(t => t.id === id)?.text || id).join(', ')
              }
            >
              {tasks.map((task) => (
                <MenuItem key={task.id} value={task.id}>
                  {task.text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleAddRisk}>Add Risk</Button>
        </Stack>
      </Paper>

      <Typography variant="subtitle1" gutterBottom>Existing Risks</Typography>
      <List>
        {risks.map((risk) => (
          <ListItem
            key={risk.id}
            secondaryAction={
              <>
                <IconButton edge="end" aria-label="edit" disabled> {/* TODO: Implement edit */}
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteRisk(risk.id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={risk.description}
              secondary={`Likelihood: ${risk.likelihood}, Impact: ${risk.impact}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default RiskManagement;
