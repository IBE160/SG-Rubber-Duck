import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  CircularProgress,
} from '@mui/material';
import { useCreateProject } from '../../services/queries';

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ open, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const createProjectMutation = useCreateProject();

  const handleSubmit = async () => {
    try {
      await createProjectMutation.mutateAsync({
        name,
        description,
        budget: parseFloat(budget),
        start_date: startDate,
        end_date: endDate,
      });
      // Reset form and close
      setName('');
      setDescription('');
      setBudget('');
      setStartDate('');
      setEndDate('');
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Project</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
          <TextField
            label="Project Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={createProjectMutation.isPending}
          />
          <TextField
            label="Scope / Description"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={createProjectMutation.isPending}
          />
          <TextField
            label="Budget"
            type="number"
            fullWidth
            margin="normal"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            disabled={createProjectMutation.isPending}
          />
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={createProjectMutation.isPending}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={createProjectMutation.isPending}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={createProjectMutation.isPending}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={createProjectMutation.isPending || !name.trim()}
        >
          {createProjectMutation.isPending ? <CircularProgress size={24} /> : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectForm;

